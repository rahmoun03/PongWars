import requests
from .models import *
from django.shortcuts import render
from django.http import HttpResponse
from django.shortcuts import redirect, render
from .models import *
from django.http import HttpResponseRedirect
from config.settings import env
import os
from dotenv import load_dotenv
from .serializers import UserSerializer
from rest_framework.response import Response
from django.core.files.temp import NamedTemporaryFile
from django.core.files import File
from .utils import *
from rest_framework.exceptions import AuthenticationFailed

# AUTH_URI = os.environ.get('AUTH_URI')

load_dotenv()
# AUTH_URI = os.getenv('AUTH_URI')
CLIENT_ID = os.getenv('CLIENT_ID')
CLIENT_SECRET = os.getenv('CLIENT_SECRET')
REDIRECT_URI = os.getenv('REDIRECT_URI')
OUUTH_TOKEN_URI = os.getenv('OUUTH_TOKEN_URI')
FRONTEND_REDIRECT_URL = os.getenv('FRONTEND_REDIRECT_URL')



# AuthUri = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-823fda6b1dac06b665ee52b73f2d6ae470b5e11f2a4b3780496c4c8deb9593ed&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2F&response_type=code"

# def home(request):
#     return redirect(AUTH_URI)


def createUpdateUser(data_json)-> User:

    image_link = data_json.get("image", {}).get("link")
    print(image_link, flush=True)
    response = requests.get(image_link)
    if response.status_code == 200:
        img_temp = NamedTemporaryFile()#IF the temporary file will be deleted once it's closed
        img_temp.write(response.content)
        img_temp.flush()



        # Extract the image filename from the URL
    filename = os.path.basename(data_json.get("image", {}).get("link"))

    user, created = User.objects.update_or_create(
        username=data_json.get("login"),
        email=data_json.get("email"),
        defaults={'first_name':data_json.get("first_name"),
                  'last_name':data_json.get("last_name"),
                  'email':data_json.get("email"),
                  'image':File(img_temp, name=filename),
                  'username':data_json.get("login")},
    )
    
    user.save()
    Stats.objects.get_or_create(user=user)
    return user
    

def getData(access_token) -> User:
    url = "https://api.intra.42.fr/v2/me"#add this to env var
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(url, headers=headers)
    print(f"101 the resposnse josn: {response.json()}")
    return createUpdateUser(response.json())


def auth(request):

    # domain = "10.14.4.4" if "10.14.4.4" in request.get_host() else "localhost"

    queryStr = request.GET.get('code')
    print("CODE : ", queryStr, flush=True)
    payload = {'grant_type':'authorization_code', 
               'client_id':CLIENT_ID,
               'client_secret':CLIENT_SECRET,
               'code':queryStr,
               'redirect_uri':REDIRECT_URI
               }
    
    r = requests.post(OUUTH_TOKEN_URI, data=payload)
    print(f"here: {r.json()}", flush=True)

    intra_access_token = r.json().get('access_token')#['access_token']
    print("acceeessss : ", intra_access_token, flush=True)
    user = getData(intra_access_token)

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response = HttpResponseRedirect(FRONTEND_REDIRECT_URL)  # Redirect to frontend
    response.set_cookie(key="access", value=access_token, httponly=False)
    response.set_cookie(key="refresh", value=refresh_token, httponly=True)

    print("THE RESPONSE : ", response, flush=True)
    print("Response Cookies:", response.cookies, flush=True)

    return response
