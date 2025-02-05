from django.urls import path
from . import Remote


websocket_urlpatterns = [
    path('TicTacToe/Remote/', Remote.RemoteConsumer.as_asgi()),
]