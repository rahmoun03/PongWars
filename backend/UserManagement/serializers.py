from rest_framework import serializers
from .models import User, MatchHistory, Stats

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'password', 'image', 'bio', 'score']
        extra_kwargs = {'password': {'write_only': True}}
        #it will only be used for creating or updating data and will not be included in the serialized output
        

    # def create(self, validated_data):
    #     user = User.objects.create_user(**validated_data)
    #     return user
    
    def create(self, validated_data):
        # user = User.objects.create(**validated_data)
        # return user
        user = User(
            # id=validated_data['id'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            username=validated_data['username'],
            # image = validated_data['image'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])

        user.save()
        Stats.objects.create(user=user)
        return user

class UsersRankingSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ['username', 'image', 'score']



class ImageBioSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'bio', 'image', 'username']


class ImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'image']


class BioSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'bio', 'username']


class PLayerMaatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'image', 'username']

class MatchHistorySerializer(serializers.ModelSerializer):
    user1 = PLayerMaatchSerializer()
    user2 = PLayerMaatchSerializer()
    winner = PLayerMaatchSerializer()

    class Meta:
        model = MatchHistory

        fields = ['user1', 'user2', 'user1_score', 'user2_score', 'winner', 'game_type','created', 'is_draw']


class StatsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Stats
        fields = ['wins', 'losses', 'total']



# class   FriendshipSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = Friendship
#         fields = ['from_user', 'to_user', 'status', 'action']

# {
# "from_user":"iantar",
# "to_user":"kali",
# "status":"",
# "action":"sent"
# }

# {
# "from_user":"iantar",
# "to_user":"kali",
# "status":"",
# "action":"accepted"
# }

# {
# "from_user":"kali",
# "to_user":"iantar",
# "status":"",
# "action":"rejected"
# }




    # def create(self, validated_data):
    #     histoy = MatchHistory.objects.create(validated_data)
    #     return super().create(validated_data)
     
# {
#     "first_name": "a",
#     "last_name": "a",
#     "username": "a",
#     "email": "a@a.com",
#     "password": "a"
# }

# {
#     "username": "a",
#     "password": "a"
# }

# {
#     "first_name": "ossama",
#     "last_name": "ossama",
#     "username": "ossama",
#     "email": "",
#     "password": "ossama"
# }

# {
#     "first_name": "o",
#     "last_name": "o",
#     "username": "oka",
#     "email": "harej90946@ploncy.com",
#     "password": "oka"
# }
# {
#     "username": "a1",
#     "password": "a"
# }