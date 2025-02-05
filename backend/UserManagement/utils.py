# import pyotp
from datetime import timedelta
import jwt, datetime

# def send_otp(request):
#     totp = pyotp.TOTP(pyotp.random_base32(), interval=60)
#     otp = totp.now()# this what the user input should be
#     request.session['otp_secret_key'] = totp.secret
#     valid_date = datetime.now() + timedelta(minutes=1)
#     request.session['otp_valid_date'] = str(valid_date)
    
    # print(f"one time password: {otp}")
    
    
# def generate_random_digits(n=6):
#     return "".join(map(str, random.sample(range(0, 10), n)))


def create_access_token(id):
    playlod = {
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30),#it will despire after one minute
        'iat': datetime.datetime.utcnow(),#date which the token is created
    }
    token = jwt.encode(playlod, 'access_secret', algorithm='HS256')
    return token

def create_otp_token(id):
    playlod = {
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=100),#it will despire after one minute
        'iat': datetime.datetime.utcnow(),#date which the token is created
    }
    token = jwt.encode(playlod, 'otp_secret', algorithm='HS256')
    return token



def create_refresh_token(id):
    playlod = {
        'id': id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),#it will despire after one minute
        'iat': datetime.datetime.utcnow(),#date which the token is created
    }
    token = jwt.encode(playlod, 'refresh_secret', algorithm='HS256')
    return token




def getUserService(request):
    """
    Get the user with a particular user_id
    """
    try:
        data = request.data
        user_id = data.get('id', None)
        user = User.objects.get(id = user_id)
        return user
    except:
        return None

def getOTPCode(user):
    """
    Generate the QR Code image, save the otp_base32 for the user
    """
    otp_base32 = pyotp.random_base32()
    # otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(
    # name=user.username.lower(), issuer_name="localhost.com")

    user.otp_base32 = otp_base32
    user.save()
    
    # qr_code = requests.post('http://localhost:8000/get-qr-code/', json = {'otp_auth_url': otp_auth_url}).json()

    # return qr_code['qr_code_link']