from django.contrib import admin
from django.urls import path, include
from .views import *


urlpatterns = [
    path('', FriendShipView.as_view()),
    path('userFreinds/', UserFriends.as_view()),
    path('notFreinds/', NotUserFriends.as_view()),
    
    
]


