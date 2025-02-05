from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
import jwt, datetime
from .utils import *
import os
from rest_framework import status
from rest_framework.exceptions import ValidationError
import random
from datetime import timedelta
from django.core.mail import send_mail
from django.utils import timezone


class RegesterView(APIView):

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        user_data = serializer.data
        access_token = create_access_token(user_data.get('id'))
        refresh_token = create_refresh_token(user_data.get('id'))

        response = Response()
        response.set_cookie(key="access", value=access_token, httponly=False)
        response.set_cookie(key="refresh", value=refresh_token, httponly=True)
        response.data = {
            "access": access_token,
            "refresh": refresh_token,
            **serializer.data
        }
        return response




class LoginView(APIView):
    
    def post(self, request):
        username = request.data['username']
        password = request.data['password']
    
        user = User.objects.filter(username=username).first()
        
        if user is None:
            raise AuthenticationFailed("user not found")
        if not user.check_password(password):
            raise AuthenticationFailed("incorrect password")

        if user.use_otp == False:
            access_token = create_access_token(user.id)
            refresh_token = create_refresh_token(user.id)
            response = Response({"message": "NOOTP"})
            response.set_cookie(key="access", value=access_token)
            response.set_cookie(key="refresh", value=refresh_token, httponly=True)
            
            return response

        # Generate OTP

        otp_token = create_otp_token(user.id)
        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.otp_expiry_time = timezone.now() + timedelta(minutes=5)  # OTP expires in 5 minutes
        user.save()

        # Store user ID in session
        response = Response()
        # request.session['otp_user_id'] = user.id
        response.set_cookie(key="otp_token", value=otp_token, httponly=True)

        send_mail(
            'Your OTP Code',
            f'Your OTP code is: {otp}',
            'antartalha@gmail.com',  # Replace with your sender email
            [user.email],  # Send to the user's email
            fail_silently=False,
        )
        response.data = {"message": "OTP sent to your email. Please enter the OTP to continue."}
        return response


class VerifyOTPView(APIView):

    def post(self, request):
        otp = request.data['otp']

        otp_token = request.COOKIES.get('otp_token')
    
        if not otp_token:
            raise AuthenticationFailed('22Unauthenticated')
        try:
            playload = jwt.decode(otp_token, 'otp_secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('33Unauthenticated')
        
        user = User.objects.filter(id=playload['id']).first()
    
        if user is None:
            raise AuthenticationFailed("user not found")
        if user.otp != otp or timezone.now() > user.otp_expiry_time:
            raise AuthenticationFailed("Invalid or expired OTP")

        # Generate tokens
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        response = Response()
        response.delete_cookie('otp_token')
        response.set_cookie(key="access", value=access_token)
        response.set_cookie(key="refresh", value=refresh_token, httponly=True)

        return response

def checkAuthenticationAnsReturnTokens(request):
    access_token = request.COOKIES.get('access')
    refresh_token = request.COOKIES.get('refresh')
    
    if not access_token or not refresh_token:
        raise AuthenticationFailed('Unauthenticated')
    return {access_token, refresh_token}

def generateNewTokens(response, playload):
    user = User.objects.filter(id=playload['id']).first()
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    response.set_cookie(key="access", value=access_token, httponly=False)
    response.set_cookie(key="refresh", value=refresh_token, httponly=True)


class UserView(APIView):
    
    def get(self, request):
        # access_token = request.COOKIES.get('access')
        # refresh_token = request.COOKIES.get('refresh')
        # print(f"tokens: {access_token}, refresh: {refresh_token}", flush=True)
        # if not access_token or not refresh_token:
        #     raise AuthenticationFailed('Unauthenticated')

        response = Response()
        user = getUserByToken(request.COOKIES, response)
        # try:
        #     playload = jwt.decode(access_token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     try:
        #         playload = jwt.decode(refresh_token, 'refresh_secret', algorithms=['HS256'])
        #         generateNewTokens(response, playload)
        #     except jwt.ExpiredSignatureError:
        #         raise AuthenticationFailed('Unauthenticated')
        
        # user = User.objects.filter(id=playload['id']).first()
        serailiser = UserSerializer(user)
        response.data = serailiser.data
        return response
    
    def delete(self, request):
        token = request.COOKIES.get('access')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = User.objects.filter(id=payload['id']).first()

    # should the user enter its password before deleting his account 
        if user:
            user.delete()
            return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
        raise AuthenticationFailed('User not found')
    
    
    
class LogoutView(APIView):
    
    def post(self, request):
        token = request.COOKIES.get('access')
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        response = Response()
        response.delete_cookie('access')
        response.delete_cookie('refresh')
        response.data = {
            'message':'the user is successfuly logout'
        }
        return response


class UpdateView(APIView):
    
    def post(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')
        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')
        
        
        # user = User.objects.filter(id=playload['id']).first()
        response = Response()
        user = getUserByToken(request.COOKIES, response)
        serializer = UserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response.data = serializer.data
        response.status = 200
        return response

class ChangePasswordView(APIView):
    
    def post(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # user = User.objects.filter(id=playload['id']).first()

        response = Response()
        user = getUserByToken(request.COOKIES, response)

        crrent_password = request.data['crrent_password']
        new_password1 = request.data['new_password1']
        new_password2 = request.data['new_password2']
        if not user.check_password(crrent_password):
            raise AuthenticationFailed("incorrect password")
        if new_password1 != new_password2:
            response.data = {"error":"Password1 is different from Password2"}
            response.status = 400
            return response

        
        user.set_password(new_password1)
        user.save()
        response.data = {"seccess":"the password changed successfuly"}
        response.status = 200
        return response
        # return Response({"seccess":"the password changed successfuly"}, status=200)


class ChangeBioImage(APIView):

    def post(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # user = User.objects.filter(id=playload['id']).first()
        response = Response()
        user = getUserByToken(request.COOKIES, response)
        serializer = ImageBioSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response.data  = serializer.data
        response.status = 200
        return response
        # return Response(serializer.data)


class ChangeImage(APIView):

    def post(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # user = User.objects.filter(id=playload['id']).first()

        response = Response()
        user = getUserByToken(request.COOKIES, response)
        serializer = ImageSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response.data = serializer.data
        response.status = 200
        return response
    
        # return Response(serializer.data)

    def delete(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')
        
        # user = User.objects.filter(id=playload['id']).first()

        response = Response()
        user = getUserByToken(request.COOKIES, response)
        user.delete_image()
        response.data = {{"message":"the image has been deleted successfully"}}
        response.status = 200
        return response
    

        # return Response({"message":"the image has been deleted successfully"})


class ChangeBio(APIView):

    def post(self, request):
        # token = request.COOKIES.get('access')
    
        # if not token:
        #     raise AuthenticationFailed('Unauthenticated')

        # try:
        #     playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
        # except jwt.ExpiredSignatureError:
        #     raise AuthenticationFailed('Unauthenticated')

        # user = User.objects.filter(id=playload['id']).first()
    
        response = Response()
        user = getUserByToken(request.COOKIES, response)

        serializer = BioSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response.data = serializer.data
        response.status = 200
        return response
    
        # return Response(serializer.data)


def getUserByToken(cookies, response):
    access = cookies.get('access')
    refresh = cookies.get('refresh')
    if not access or not refresh:
        raise AuthenticationFailed('Unauthenticated')

    try:
        playload = jwt.decode(access, 'access_secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        try:
            playload = jwt.decode(refresh, 'refresh_secret', algorithms=['HS256'])
            generateNewTokens(response, playload)
        except:
            raise AuthenticationFailed('Unauthenticated')
    return User.objects.filter(id=playload['id']).first()


def get_user_by_token(token):
    if not token:
        raise AuthenticationFailed('x1Unauthenticated')
    try:
        playload = jwt.decode(token, 'access_secret', algorithms=['HS256'])
    except jwt.ExpiredSignatureError:

        raise AuthenticationFailed('xxUnauthenticated')
    
    return User.objects.filter(id=playload['id']).first()
    
# {
# "crrent_password":"test",
# "new_password1":"test1",
# "new_password2":"test1"
# }
    
# {
# "bio":"hello",
# "username":"ahbajaou"
# }


class MatchHistoryView(APIView):
    def get(self, request):
        # print(f"TOKEN : not found")
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('11Unauthenticated')

        response = Response()
        user = getUserByToken(request.COOKIES, response)
        match_history = MatchHistory.objects.filter(user1=user.id) | MatchHistory.objects.filter(user2=user.id)
        match_history_list = MatchHistorySerializer(match_history, many=True).data
        response.data = {"matchHistory": match_history_list}
        response.status = 200
        return response

    def post(self, request):
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('Unauthenticated')
        #opponenet username
        print("-----------", flush=True)
        response = Response()
        user = getUserByToken(request.COOKIES, response)

        print("++++++++++++++", flush=True)
        print( request.data, flush=True)
        try:
            game_id = request.data['game_id']
            opponent_username = request.data['opponent_username']
            opponent_score = request.data['opponent_score']
            user_score = request.data['user_score']
            game_type = request.data['game_type']
            draw = request.data["draw"]


        except:
            raise ValidationError({'field error': 'you missed some fields'})
        print("doneeeeeeeeeeeeeee")
        user2 = User.objects.filter(username=opponent_username).first()
        winner = user
        if user2 is None:
            raise ValidationError({'username error': 'This username does not exist'})
        if not draw:    
            if user_score > opponent_score:
                winner = user
                user.stats.wins += 1
                user2.stats.losses += 1
                
            else:
                winner = user2
                user.stats.losses += 1
                user2.stats.wins += 1
            user.stats.save()
            user2.stats.save()


        print(f"{user.username} : has been save stats", flush=True)
        if not MatchHistory.objects.filter(game_id=game_id).exists():
            history = MatchHistory(
                user1=user,
                user2=user2,
                user1_score=user_score,
                user2_score=opponent_score,
                winner=winner,
                game_type=game_type,
                game_id=game_id,
                is_draw=draw
            )
            history.save()

        user.score += user_score
        user2.score += opponent_score
        user.save()
        user2.save()
        response.data = {"message":"The match history stored successfully"}
        response.status = 200
        return response
        # return Response("The match history stored successfully", status=200)


class StatsView(APIView):
     
    def get(self, request):
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('Unauthenticated')
        
        response = Response()
        user = getUserByToken(request.COOKIES, response)
        try:
            stats = Stats.objects.get(user=user)
        except:
            stats = Stats.objects.create(user=user)
        if stats == None:
            response.data = {"error":"stats not found"}
            response.status = 404
            return response
        
        serialer = StatsSerializer(stats)
        response.data = serialer.data
        response.status = 200
        return response



class   UsersRanking(APIView):
    def get(self, request):
        response = Response()
        user = getUserByToken(request.COOKIES, response)
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('Unauthenticated')
        users = User.objects.all().order_by('-score')
        serializer = UsersRankingSerializer(users, many=True)
        response.data = serializer.data
        response.status = 200
        return response
        # return Response(serializer.data, status=200)

class   OtpActivate(APIView):
    def post(self, request):
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('Unauthenticated')
        
        response = Response()
        user = getUserByToken(request.COOKIES, response)


        data = request.data['isactivate']
        if data == False:
            message = "OTP has been desactivated"
            user.use_otp = False
        else:
            message = "OTP has been activated"
            user.use_otp = True
        user.save()
        response.status = 200
        response.data = {"message":message}
        return response
        # return Response({"message":message}, status=200)

    def get(self, request):
        # token = request.COOKIES.get('access')
        # user = get_user_by_token(token)
        # if user == None:
        #     raise AuthenticationFailed('Unauthenticated')
        
        response = Response()
        user = getUserByToken(request.COOKIES, response)
        response.data = user.use_otp
        response.status = 200
        return response