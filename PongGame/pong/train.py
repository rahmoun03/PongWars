import json
import random
import asyncio
import uuid
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore

player_queue = []

# class GameSettings:
WINNING_SCORE = 5
BALL_SPEED_INCREASE = 1.05
FRAME_DELAY = 0.015
PADDLE_HEIGHT_RATIO = 5  # screen height / 5
PADDLE_WIDTH_RATIO = 80  # screen width / 80
TABLE_HIEGHT = 45
TABLE_WIDTH = 28
BALL_SPEED = 0.2

class TrainConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        player_queue.append(self)
        self.is_active = True
        self.width = 800
        self.height = 400
        self.speed = 1
        self.paddle = {
            "height": 0.5,
            "width": 5,
            "deep": 0.5
        }
        self.group_room = None
        self.role = None
        self.ball = {}
        self.player1 = {}
        self.player2 = {}
        self.score = {}
        self.table = {}
        print(self.scope["user"], " are connected")
        await self.accept()

    async def disconnect(self, close_code):
        if self in player_queue:
            player_queue.remove(self)
        if self.group_room:
            await self.channel_layer.group_discard(
                self.group_room,
                self.channel_name
            )
        # Should also notify the other player about disconnection

    async def receive(self, text_data):

        data = json.loads(text_data)
        if data["type"] == "join_room":
            self.width = data["width"]
            self.height = data["height"]
            await self.restart_game()
            if len(player_queue) >= 2 :
                if player_queue[0] == self:
                    opponent = player_queue[1]
                else:
                    opponent = player_queue[0]
                player_queue.remove(self)
                player_queue.remove(opponent)
                self.group_room = f"room_{uuid.uuid4().hex[:6]}"
                opponent.group_room = self.group_room

                opponent.role = "player2"
                self.role = "player1"

                # add the players to the same group
                await self.channel_layer.group_add(
                    self.group_room,
                    self.channel_name
                )
                await opponent.channel_layer.group_add(
                    opponent.group_room,
                    opponent.channel_name
                )

                dx = 1 if random.randint(0,1) > 0.5 else -1
                dz = 1 if random.randint(0,1) > 0.5 else -1

                await self.channel_layer.group_send(
                    self.group_room,
                    {
                        "type": "start",
                        "player1": self.player1,
                        "player2": self.player2,
                        "dx" : dx,
                        "dz" : dz,
                        "ball": self.ball,
                        "score": self.score,
                        "paddle": self.paddle,
                    }
                )
                
        if data["type"] == "update_paddle":
            if self.role == "player1":
                self.player1["direction"] = data["direction"]
            else:
                self.player2["direction"] = (data["direction"] * (-1))
            await self.channel_layer.group_send(
                self.group_room,
                {
                    "type": "update_paddle",
                    "role": self.role,
                    "player1": self.player1,
                    "player2": self.player2
                }
            )
        if data["type"] == "start_game":
            print(self.scope["user"], "start the game play")
            asyncio.create_task(self.start_game())

    async def start(self, event):
        self.ball["dx"] =  BALL_SPEED * event["dx"]
        self.ball["dz"] =  BALL_SPEED * event["dz"]
        

        await self.send(text_data=json.dumps({
            "type": "start",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score,
            "paddle": self.paddle,
            "table" : self.table_config,
            "role": self.role
        }))
        print(self.scope["user"], ": sending game stats")


    async def start_game(self):
        while self.is_active:
            #update_paddle paddle
            self.move_paddel(self.player1)
            self.move_paddel(self.player2)
            self.move_ball()
            await self.check_goals()
            if self.score["player1"] >= WINNING_SCORE or self.score["player2"] >= WINNING_SCORE:
                await self.send_game_over()
                break
            await self.send_update()
            await asyncio.sleep(0.016)

    async def update_paddle(self, event):
        self.player1["direction"] = event["player1"]["direction"]
        self.player2["direction"] = event["player2"]["direction"] 


    async def send_game_over(self):
        await self.channel_layer.group_send(self.group_room, {
            "type" : "game_over"
        })
    
    async def game_over(self, event):
        if(self.is_active):
            print("game over : ", self.score)
            await self.send(text_data=json.dumps(
            {
                "type": "game_over",
                "score": self.score,
                "winner": "WIN" if self.score[self.role] >= WINNING_SCORE else "LOSE"
            }))
        self.is_active = False


    async def send_update(self):
        await self.send(text_data=json.dumps(
            {
                "type": "update",
                "player1": self.player1,
                "player2": self.player2,
                "ball": self.ball,
                "score": self.score,
            }))


    def move_paddel(self, player):
        player["x"] += player["direction"] * self.speed

        if player["x"] < -(TABLE_WIDTH / 2) + (self.paddle["width"] / 2) + 1:
            player["x"] = -(TABLE_WIDTH / 2) + (self.paddle["width"] / 2 ) + 1
        if player["x"] > (TABLE_WIDTH / 2) - (self.paddle["width"] / 2) - 1:
            player["x"] = (TABLE_WIDTH / 2) - (self.paddle["width"]  / 2) - 1

    async def check_goals(self):
        # print(self.role , ": was here")
        if self.ball["z"] + self.ball["radius"] >= (TABLE_HIEGHT / 2):
            if self.role == "player1" :
                await self.reset_ball("player2")
        elif self.ball["z"] - self.ball["radius"] <= -(TABLE_HIEGHT / 2):
            if self.role == "player1" :
                await self.reset_ball("player1")

    async def reset_ball(self, player):
        dx = 1 if random.randint(0,1) > 0.5 else -1
        dz = 1 if random.randint(0,1) > 0.5 else -1

        # print(self.role , ": send to group : ", self.score)
        await self.channel_layer.group_send(self.group_room, {
            "type" : "goal",
            "who" : player,
            "dx" : dx,
            "dz": dz
        })
    
    async def goal(self, event):
        # print(self.role , "recieve .",)
        self.score[event["who"]] += 1
        self.ball["x"] = 0
        self.ball["z"] = 0
        self.ball["dx"] = BALL_SPEED * event["dx"]
        self.ball["dz"] = BALL_SPEED * event["dz"]
        await self.send(text_data=json.dumps({
            "type" : "goal",
            "player1": self.player1,
            "player2": self.player2,
            "ball": self.ball,
            "score": self.score
        }))


    def move_ball(self):
        self.ball["x"] += self.ball["dx"]
        self.ball["z"] += self.ball["dz"]


        WALL_DAMPENING = 0.98
        if self.ball["x"] - self.ball["radius"] <= -(TABLE_WIDTH / 2) + 1 or self.ball["x"] + self.ball["radius"] >= (TABLE_WIDTH / 2) - 1:
            self.ball["dx"] *= -WALL_DAMPENING

                 # check for paddle and ball collision  PLAYER 1
        if (self.ball["z"] + self.ball["radius"] >= self.player1['z'] - (self.paddle["deep"] / 2)
            and self.player1["x"] - (self.paddle["width"] / 2) <= self.ball["x"] <= self.player1["x"] + (self.paddle["width"] / 2)):
            #check for left paddle corner
            if self.ball["x"] < (self.player1["x"] - (self.paddle["width"] / 2)) + (self.paddle["width"] / 10):
                self.ball["dx"] *= -1 if self.ball["dx"] > 0 else 1 #Bounce the ball back
            
            #check for right paddle corner
            elif self.ball["x"] > (self.player1["x"] + (self.paddle["width"] / 2)) - (self.paddle["width"] / 10):
                self.ball["dx"] *= -1 if self.ball["dz"] < 0 else  1 #Bounce the ball back
            
            self.ball["dz"] *= -1
            self.ball["dz"] *= 1.05 # Ball speed increase after hit
            # velocity.x += (keys.ArrowLeft ? -0.5 : 0) * playerSpeed;
            # velocity.x += (keys.ArrowRight ? 0.5 : 0) * playerSpeed;
            self.ball["dx"] += ( 0.5 if self.player1["direction"] == 1 else 0) * self.speed
            self.ball["dx"] += (-0.5 if self.player1["direction"] == -1 else 0) * self.speed

                 # check for paddle and ball collision  PLAYER 2
        if (self.ball["z"] - self.ball["radius"] <= self.player2['z'] +  (self.paddle["deep"] / 2)
            and self.player2["x"] - (self.paddle["width"] / 2) <= self.ball["x"] <= self.player2["x"] + (self.paddle["width"] / 2)):
            #check for left paddle corner
            if self.ball["x"] < (self.player2["x"] - (self.paddle["width"] / 2)) + (self.paddle["width"] / 10):
                self.ball["dx"] *= -1 if self.ball["dx"] > 0 else 1 #Bounce the ball back
            
            #check for right paddle corner
            elif self.ball["x"] > (self.player2["x"] + (self.paddle["width"] / 2)) - (self.paddle["width"] / 10):
                self.ball["dx"] *= -1 if self.ball["dz"] < 0 else  1 #Bounce the ball back
            
            self.ball["dz"] *= -1
            # self.ball["dx"] *= 1.05 # Ball speed increase after hit
            self.ball["dx"] += ( 0.5 if self.player2["direction"] == 1 else 0) * self.speed
            self.ball["dx"] += (-0.5 if self.player2["direction"] == -1 else 0) * self.speed
        



    async def restart_game(self):

        self.paddle["height"] = 0.5  # Dynamic height based on screen size
        self.paddle["width"] = 5  # Dynamic width based on screen size
        self.paddle["deep"] = 0.5
        ball_radius = 0.5  # Dynamic ball radius
        self.speed = 0.5
        self.ball_dx = BALL_SPEED  # Adjust ball speed according to width
        self.ball_dz = BALL_SPEED  # Adjust ball speed according to height

        self.table_config = {
            "tableWidth": TABLE_WIDTH,  # Use actual values
            "tableHeight": TABLE_HIEGHT,
        }

        self.player1 = {
            "x": 0,
            "y": 0.1,
            "z": (TABLE_HIEGHT / 2),
            "direction": 0
        }

        self.player2 = {
            "x": 0,
            "y": 0.1,
            "z": -(TABLE_HIEGHT / 2),
            "direction": 0
        }

        self.ball = {
            "x" : 0,
            "y" : 0.1,
            "z" : 0,
            "dx": self.ball_dx if random.randint(0, 1) > 0.5 else -self.ball_dx,
            "dz": self.ball_dz if random.randint(0, 1) > 0.5 else -self.ball_dz,
            "radius": ball_radius
        }

        self.score = {
            "player1": 0,
            "player2": 0
        }
    