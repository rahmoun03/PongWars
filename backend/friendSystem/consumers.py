from channels.generic.websocket import WebsocketConsumer
import json
# from UserManagement.views import friendRequestHandling
from UserManagement.models import User
from UserManagement.serializers import UserSerializer
from rest_framework.exceptions import AuthenticationFailed
import jwt
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import requests
from channels.generic.websocket import AsyncWebsocketConsumer


RED = '\033[31m'
GREEN = '\033[32m'
YELLOW = '\033[33m'
BLUE = '\033[34m'
RESET = '\033[0m'

user_channels = {}
def print_all_usernames():
    print(f"{GREEN}", flush=True)
    print(", ".join(str(value) for value in user_channels), flush=True)
    print(f"{RESET}", flush=True)

def get_user_by_token(token):
    if not token:
        return None
    try:
        payload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        return User.objects.filter(id=payload['id']).first()
    except (jwt.ExpiredSignatureError, jwt.DecodeError):
        return None

class Notifications(WebsocketConsumer):
    def connect(self):
        self.accept()

        cookies = self.scope.get("cookies", {})
        access_token = cookies.get("access")
        print(f"cookies: {access_token}")
        self.user = get_user_by_token(access_token)
        if self.user:
            userInfo = UserSerializer(self.user).data
            user_channels[userInfo["username"]] = self.channel_name
            print(f"User connected: {userInfo['username']}", flush=True)
            print(f"{GREEN}num of connected users: {len(user_channels)}: {RESET}", flush=True)
            print_all_usernames()

        else:
            print("Unauthenticated user.", flush=True)
            self.close()

    def disconnect(self, code):
        for username, channel_name in list(user_channels.items()):
            if channel_name == self.channel_name:
                print(f"{RED} {username} Disconnect{RESET}")
                del user_channels[username]
            print(f"Removed channel for user {username}")

    def receive(self, text_data=None, bytes_data=None):
        print(f"Message received: {text_data}", flush=True)
        if not text_data:
            return
        try:
            data = json.loads(text_data)
            to_user = data["to_user"]
            print(f"to_user:", to_user, flush=True)
            # self.saveData()

            #save friendSy state in database 
            self.send_notif(data)
            self.send_to_user(to_user, data)

        except json.JSONDecodeError as e:
            print(f"Invalid JSON: {e}")
    
    def send_notif(self, data):
        self.send(text_data=json.dumps(data))


    def send_message(self, event):
        print(f"send: {event}")
        message = event["text"]
        self.send(text_data=message)

    def send_to_user(self, username, message):
        channel_layer = get_channel_layer()
        if username in user_channels:
            channel_name = user_channels[username]

            async_to_sync(channel_layer.send)(
                channel_name,
                {
                    "type": "send.message",
                    "text": json.dumps(message),
                },
            )


# a user add a friend 
# a user receives a friend request 
# 

# class Notifications(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()
#         print('connect', flush=True)


#     async def disconnect(self, code):
#         print("disconnect")
    
#     async def receive(self, text_data=None, bytes_data=None):
#         print(f"Message received: {text_data}")
#         await self.send()

#     async def send(self, text_data=None, bytes_data=None, close=False):
#         print("send")
#         # text_data = json.dumps("hello from backend")
#         text_data = "hello from backend"
#         text_data = {"":"", "":"", "":""}
#         return super().send(text_data, bytes_data, close)


# Redis is used as a storage layer
# for channel names and group names.
# These are stored within Redis so 

# that they can be accessed from any 
# consumer instance. If for example, I
# create a group called 'users' and then
# add 3 different channel names to it,
# this information is stored in Redis.
# Now, whenever I want to send data to 
# the channels in the group I can simply
# reference the group from my consumer 
# and Django-channels will automatically
# retrieve the channel names stored under
# that group in Redis.