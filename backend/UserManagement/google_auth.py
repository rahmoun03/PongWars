import requests
from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import *
from django.http import JsonResponse, HttpResponseRedirect
from django.core import serializers
from config.settings import env
import os
from dotenv import load_dotenv
from .serializers import UserSerializer
from rest_framework.response import Response
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
from .utils import *
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.renderers import JSONRenderer


load_dotenv()

CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')
CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET')
OUUTH_TOKEN_URI = os.getenv('GOOGOLE_TOKEN_URI')
FRONTEND_REDIRECT_URL = os.getenv('FRONTEND_REDIRECT_URL')


google_auth_url = "https://accounts.google.com/o/oauth2/auth"
REDIRECT_URI = "https://localhost:3000/accounts/google/login/callback/"

AUTH_URI = f"{google_auth_url}?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=profile%20email&response_type=code&access_type=offline"




from django.shortcuts import redirect
from django.http import JsonResponse


def get_code(request):
    code = request.GET.get('code')
    plyload = {
        "code": code,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    response = requests.post(OUUTH_TOKEN_URI, data=plyload)

    access_token = response.json().get('access_token')
    print(f"access_token hhhhshshshhs : {access_token}", flush=True)
    userInfoJson = getUserInfo(access_token)

    user = createUpdateUser(userInfoJson.json())


    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)
    print("cookies: ", access, refresh, flush=True)
    response = HttpResponseRedirect('https://localhost:3000/home')  # Redirect to frontend
    response.set_cookie(key="access", value=access, httponly=False)
    response.set_cookie(key="refresh", value=refresh, httponly=True)

    return response


def getUserInfo(access_token):
    url = "https://www.googleapis.com/oauth2/v1/userinfo"
    userInfor = requests.get(url, headers={"Authorization": f"Bearer {access_token}"})
    print(f"the resposnse josn: {userInfor.json()}")
    return userInfor


def createUpdateUser(data)-> User:

    response = requests.get(data.get("picture"))
    if response.status_code == 200:
        img_temp = NamedTemporaryFile(delete=True, suffix='.png')
        img_temp.write(response.content)
        img_temp.flush()

        # Extract the image filename from the URL
        filename = os.path.basename(data.get("picture")) + ".png"

    user, created = User.objects.update_or_create(
        username=data.get("given_name") + data.get("family_name"),
        email=data.get("email"),
        defaults={'first_name':data.get("given_name"),
                  'last_name':data.get("family_name"),
                  'email':data.get("email"),
                  'image':File(img_temp, name=filename),
                  'username':data.get("given_name") + data.get("family_name")},
    )
    user.save()
    return user


def getData(access_token) -> User:
    url = "https://accounts.google.com/gsi/client"#add this to env var

    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    print(f"the resposnse josn: {response.json()}")
    return createUpdateUser(response.json())

