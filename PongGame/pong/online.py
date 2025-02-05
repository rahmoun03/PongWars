import json
import random
import asyncio
import uuid
import requests
import httpx
from channels.generic.websocket import AsyncWebsocketConsumer

# Constants in UPPERCASE following Python conventions
BACKEND_URL_MATCH = "http://backend:8000/match_history/"
BACKEND_URL_USER = "http://backend:8000/user/"

player_queue = []

class GameSettings:
    WINNING_SCORE = 5
    BALL_SPEED_INCREASE = 1.05
    FRAME_RATE = 60  # Standard frame rate
    FRAME_DELAY = 1 / FRAME_RATE
    PADDLE_HEIGHT = 0.5
    PADDLE_WIDTH = 5
    PADDLE_DEPTH = 0.5
    TABLE_HEIGHT = 45
    TABLE_WIDTH = 28
    INITIAL_BALL_SPEED = 0.2
    WALL_DAMPENING = 0.98
    PADDLE_CORNER_RATIO = 0.1  # 10% of paddle width for corner detection
    MAX_BALL_SPEED = 0.8  # Prevent ball from becoming too fast
    PADDLE_SPEED = 0.5
    BALL_RADIUS = 0.5

class Remote1vs1Consumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.settings = GameSettings()
        self.is_active = True
        self.group_room = None
        self.role = None
        self.opponent = None
        self.username = None
        self.userdata = None
        self.last_update_time = None

    async def connect(self):
        self.last_update_time = asyncio.get_event_loop().time()
        await self.initialize_user()
        await self.accept()
        await self.restart_game()
        await self.handle_matchmaking()

    async def disconnect(self, close_code):
        self.is_active = False
        if self in player_queue:
            player_queue.remove(self)
        if self.group_room:
            await self.channel_layer.group_discard(
                self.group_room,
                self.channel_name
            )
            if self.opponent and self.opponent.is_active:
                await self.channel_layer.group_send(
                    self.group_room,
                    {
                        'type': 'broadcast_game_state',
                        'message': {
                            'type': 'opponent_disconnected',
                            'message': 'Opponent disconnected',
                            'winner': 'WIN' if self.role == 'player2' else 'LOSE'
                        }
                    }
                )
        await self.close()

    async def receive(self, text_data):
        """Handle incoming messages with improved synchronization"""
        data = json.loads(text_data)

        if data["type"] == "update_paddle":
            # Update local paddle state
            if self.role == "player1":
                self.player1["direction"] = data["direction"]
            else:
                self.player2["direction"] = (data["direction"] * (-1))
            
            # Broadcast paddle updates to all players
            await self.channel_layer.group_send(
                self.group_room,
                {
                    "type": "update_paddle_state",
                    "player": self.role,
                    "direction": data["direction"]
                }
            )
        elif data["type"] == "start_game":
            print(f"{self.username} started the game")
            asyncio.create_task(self.start_game())


    async def start_game(self):
        """Main game loop with improved synchronization"""
        while self.is_active:
            current_time = asyncio.get_event_loop().time()
            delta_time = current_time - self.last_update_time
            
            if delta_time >= self.settings.FRAME_DELAY:
                # Only player1 calculates game state to ensure consistency
                if self.role == "player1":
                    self.move_paddle(self.player1)
                    self.move_paddle(self.player2)
                    self.move_ball()
                    await self.check_goals()
                    
                    # Broadcast the authoritative game state to all players
                    await self.channel_layer.group_send(
                        self.group_room,
                        {
                            "type": "sync_game_state",
                            "player1": self.player1,
                            "player2": self.player2,
                            "ball": self.ball,
                            "score": self.score
                        }
                    )
                
                if max(self.score.values()) >= self.settings.WINNING_SCORE:
                    await self.send_game_over()
                    break
                
                self.last_update_time = current_time
            
            await asyncio.sleep(0.001)

    async def sync_game_state(self, event):
        """Handle game state synchronization"""
        # Update local game state with authoritative state from player1
        if self.role == "player2":
            self.player1 = event["player1"]
            self.player2 = event["player2"]
            self.ball = event["ball"]
            self.score = event["score"]
        
        # Send updated state to clients
        await self.send(text_data=json.dumps({
            "type": "update",
            "player1": event["player1"],
            "player2": event["player2"],
            "ball": event["ball"],
            "score": event["score"]
        }))

    async def update_paddle_state(self, event):
        """Handle paddle state updates"""
        # Update the correct paddle based on which player sent the update
        if event["player"] == "player1":
            self.player1["direction"] = event["direction"]
        else:
            self.player2["direction"] = event["direction"] * (-1)


    async def initialize_user(self):
        self.cookies = self.scope.get("cookies", {})
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    BACKEND_URL_USER, 
                    cookies=self.cookies, 
                    timeout=5
                )
                if response.status_code == 200:
                    self.userdata = response.json()
                    self.username = self.userdata.get("username")
                    print(f"User {self.username} connected")
                else:
                    print(f"Failed to get user data: {response.status_code}")
            except httpx.RequestError as e:
                print(f"Error getting user data: {e}")

    async def handle_matchmaking(self):
        if self not in player_queue:
            player_queue.append(self)

        if len(player_queue) >= 2:
            player1 = player_queue.pop(0)
            player2 = player_queue.pop(0)

            if player1.username == player2.username:
                await player2.send(json.dumps({
                    'type': 'error', 
                    'message': 'Cannot play against yourself'
                }))
                player_queue.insert(0, player1)
                return

            await self.setup_game_room(player1, player2)

    async def setup_game_room(self, player1, player2):
        group_room = f"pong_room_{uuid.uuid4().hex[:6]}"
        player1.group_room = player2.group_room = group_room
        player1.opponent = player2
        player2.opponent = player1
        player1.role = "player1"
        player2.role = "player2"

        for player in (player1, player2):
            await self.channel_layer.group_add(group_room, player.channel_name)

        dx = random.choice([-1, 1])
        dz = random.choice([-1, 1])

        await self.channel_layer.group_send(
            self.group_room,
            {
                "type": "start",
                "dx": dx,
                "dz": dz,
            }
        )

    def move_paddle(self, player):
        new_x = player["x"] + (player["direction"] * self.settings.PADDLE_SPEED)
        half_paddle = self.settings.PADDLE_WIDTH / 2
        half_table = self.settings.TABLE_WIDTH / 2

        # Clamp paddle position within table bounds
        player["x"] = max(
            -(half_table) + half_paddle + 1,
            min(half_table - half_paddle - 1, new_x)
        )

    def move_ball(self):
        """Handle ball movement and collisions"""
        # Update ball position
        next_x = self.ball["x"] + self.ball["dx"]
        next_z = self.ball["z"] + self.ball["dz"]
        
        # Wall collision detection (X-axis)
        half_table_width = (self.settings.TABLE_WIDTH / 2) - 1
        if abs(next_x) + self.ball["radius"] >= half_table_width:
            # Reverse x direction and apply dampening
            self.ball["dx"] *= -self.settings.WALL_DAMPENING
            
            # Correct ball position to prevent sticking to wall
            if next_x > 0:
                self.ball["x"] = half_table_width - self.ball["radius"]
            else:
                self.ball["x"] = -half_table_width + self.ball["radius"]
        else:
            # No collision, update x position
            self.ball["x"] = next_x

        # Update z position
        self.ball["z"] = next_z

        # Handle paddle collisions
        self.check_paddle_collision(self.player1)
        self.check_paddle_collision(self.player2)

        # Ensure ball speed doesn't exceed maximum
        current_speed = (self.ball["dx"]**2 + self.ball["dz"]**2)**0.5
        if current_speed > self.settings.MAX_BALL_SPEED:
            speed_factor = self.settings.MAX_BALL_SPEED / current_speed
            self.ball["dx"] *= speed_factor
            self.ball["dz"] *= speed_factor

    def check_paddle_collision(self, paddle):
        """Handle ball collision with paddles"""
        ball = self.ball
        settings = self.settings

        # Determine if ball is at paddle's z-position
        is_at_paddle = (
            (paddle == self.player1 and 
             ball["z"] + ball["radius"] + ball["dz"] >= paddle["z"] - settings.PADDLE_DEPTH / 2) or
            (paddle == self.player2 and 
             ball["z"] - ball["radius"] + ball["dz"] <= paddle["z"] + settings.PADDLE_DEPTH / 2)
        )

        if not is_at_paddle:
            return

        # Check if ball is within paddle's x-range
        paddle_left = paddle["x"] - settings.PADDLE_WIDTH / 2
        paddle_right = paddle["x"] + settings.PADDLE_WIDTH / 2
        
        if paddle_left <= ball["x"] <= paddle_right:
            # Determine which part of the paddle was hit
            relative_hit_position = (ball["x"] - paddle["x"]) / (settings.PADDLE_WIDTH / 2)
            
            # Adjust ball direction based on where it hit the paddle
            # This creates more interesting bounces
            angle_factor = relative_hit_position * 0.75  # Max 45-degree deflection
            speed = (ball["dx"]**2 + ball["dz"]**2)**0.5
            
            # Reverse z-direction and apply speed increase
            ball["dz"] *= -1
            
            # Apply angle based on hit position
            ball["dx"] = speed * angle_factor
            
            # Normalize to maintain consistent speed
            current_speed = (ball["dx"]**2 + ball["dz"]**2)**0.5
            speed_factor = speed * settings.BALL_SPEED_INCREASE / current_speed
            ball["dx"] *= speed_factor
            ball["dz"] *= speed_factor
            
            # Add paddle momentum
            ball["dx"] += paddle["direction"] * settings.PADDLE_SPEED * 0.5

    async def restart_game(self):
        """Initialize or reset all game state variables"""
        self.paddle = {
            "height": self.settings.PADDLE_HEIGHT,
            "width": self.settings.PADDLE_WIDTH,
            "deep": self.settings.PADDLE_DEPTH
        }

        self.table_config = {
            "tableWidth": self.settings.TABLE_WIDTH,
            "tableHeight": self.settings.TABLE_HEIGHT,
        }

        # Initialize player positions
        self.player1 = {
            "x": 0,
            "y": 0.1,
            "z": (self.settings.TABLE_HEIGHT / 2),
            "direction": 0
        }

        self.player2 = {
            "x": 0,
            "y": 0.1,
            "z": -(self.settings.TABLE_HEIGHT / 2),
            "direction": 0
        }

        # Initialize ball with random direction
        dx = random.choice([-1, 1]) * self.settings.INITIAL_BALL_SPEED
        dz = random.choice([-1, 1]) * self.settings.INITIAL_BALL_SPEED
        
        self.ball = {
            "x": 0,
            "y": 0.1,
            "z": 0,
            "dx": dx,
            "dz": dz,
            "radius": self.settings.BALL_RADIUS
        }

        # Reset scores
        self.score = {
            "player1": 0,
            "player2": 0
        }

    async def start(self, event):
        """Handle game start event"""
        self.ball["dx"] = self.settings.INITIAL_BALL_SPEED * event["dx"]
        self.ball["dz"] = self.settings.INITIAL_BALL_SPEED * event["dz"]
        
        opp_data = self.opponent.userdata if self.opponent else None

        await self.send(text_data=json.dumps({
            "type": "start",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score,
            "paddle": self.paddle,
            "table": self.table_config,
            "role": self.role,
            "opp_data": opp_data
        }))
        print(f"{self.username}: sending game stats")

    async def game_over(self, event):
        """Handle game over event"""
        if self.is_active:
            print(f"Game over: {self.score}")

            # Only send match history from player1's perspective to avoid duplication
            if self.role == "player1":
                match_data = {
                    "opponent_username": self.opponent.username,
                    "opponent_score": self.score["player2"],
                    "user_score": self.score["player1"],
                    "game_type": "pong",
                    "game_id": self.group_room,
                    "draw": False
                }
                access = self.cookies["access"]
                refresh = self.cookies["refresh"]
                cookies = {
                    "access": access,
                    "refresh": refresh
                }

                # Send match history to backend
                try:
                    response = requests.post(
                        BACKEND_URL_MATCH,
                        json=match_data,
                        cookies=cookies,
                        timeout=5
                    )
                    if response.status_code == 200:
                        print("Match history successfully recorded")
                    else:
                        print(f"Failed to record match history: {response.status_code}")
                except requests.exceptions.RequestException as e:
                    print(f"Error recording match history: {e}")

            # Send game over message to client
            await self.send(text_data=json.dumps({
                "type": "game_over",
                "score": self.score,
                "winner": "WIN" if self.score[self.role] >= self.settings.WINNING_SCORE else "LOSE"
            }))
        
        self.is_active = False

    async def check_goals(self):
        """Check if a goal has been scored"""
        if self.ball["z"] + self.ball["radius"] >= (self.settings.TABLE_HEIGHT / 2):
            if self.role == "player1":
                await self.reset_ball("player2")
        elif self.ball["z"] - self.ball["radius"] <= -(self.settings.TABLE_HEIGHT / 2):
            if self.role == "player1":
                await self.reset_ball("player1")

    async def reset_ball(self, scoring_player):
        """Reset ball with synchronized state"""
        if self.role == "player1":
            dx = random.choice([-1, 1])
            dz = random.choice([-1, 1])

            await self.channel_layer.group_send(
                self.group_room,
                {
                    "type": "sync_ball_reset",
                    "who": scoring_player,
                    "dx": dx,
                    "dz": dz
                }
            )

    async def sync_ball_reset(self, event):
        """Handle synchronized ball reset"""
        self.score[event["who"]] += 1
        self.ball["x"] = 0
        self.ball["z"] = 0
        self.ball["dx"] = self.settings.INITIAL_BALL_SPEED * event["dx"]
        self.ball["dz"] = self.settings.INITIAL_BALL_SPEED * event["dz"]
        
        await self.send(text_data=json.dumps({
            "type": "goal",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score
        }))

    async def goal(self, event):
        """Handle goal event"""
        self.score[event["who"]] += 1
        self.ball["x"] = 0
        self.ball["z"] = 0
        self.ball["dx"] = self.settings.INITIAL_BALL_SPEED * event["dx"]
        self.ball["dz"] = self.settings.INITIAL_BALL_SPEED * event["dz"]
        
        await self.send(text_data=json.dumps({
            "type": "goal",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score
        }))

    async def send_update(self):
        """Send game state update to clients"""
        await self.send(text_data=json.dumps({
            "type": "update",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score,
        }))

    async def broadcast_game_state(self, event):
        """Broadcast game state to all players"""
        await self.send(text_data=json.dumps(event['message']))

    async def send_game_over(self):
        """Send game over event to all players"""
        await self.channel_layer.group_send(
            self.group_room,
            {
                "type": "game_over"
            }
        )