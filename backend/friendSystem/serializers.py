from .models import Friendship, FriendsProfile
from UserManagement.serializers import UserSerializer
from rest_framework import serializers


class   FriendshipSerializer(serializers.ModelSerializer):

    from_user = UserSerializer()
    class Meta:
        model = Friendship
        fields = ['from_user', 'status']


class   FriendsProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    friends = UserSerializer(many=True)
    class Meta:
        model = FriendsProfile
        fields = ['user', 'friends']

