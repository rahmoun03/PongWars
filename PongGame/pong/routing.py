from django.urls import path
from . import local_1vs
from . import online
from . import ai_mode
from . import tournamentConsumer as t 

websocket_urlpatterns = [
    path('ws/ai/', ai_mode.AIConsumer.as_asgi()),
    path('ws/online_1vs1/', online.Remote1vs1Consumer.as_asgi()),
    path('ws/local_1vs1/', local_1vs.Local1vs1Consumer.as_asgi()),
    path('ws/tournament/local/', t.LocalMatchmaking.as_asgi()),
]
