from django.contrib import admin
from django.urls import path, include
from .views import *
from . import intra_auth
from . import views
from . import google_auth


urlpatterns = [
    path('register/', RegesterView.as_view()),
    path('login/', LoginView.as_view()),
    path('user/', UserView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('update/', UpdateView.as_view()),
    path('delete_acount/', UserView.as_view()),
    path('verify_otp/', VerifyOTPView.as_view()),
    path('change_password/', ChangePasswordView.as_view()),
    path('bio_image/', ChangeBioImage.as_view()),
    path('bio/', ChangeBio.as_view()),
    # path('redintra/', intra_auth.home),
    path('match_history/', MatchHistoryView.as_view()),
    path('stats/', StatsView.as_view()),
    path('intra/', intra_auth.auth),#change the rediract uri
    path('accounts/google/login/callback/', google_auth.get_code),
    path('users_ranking/', UsersRanking.as_view()),
    path('change_image/', ChangeImage.as_view()),
    path('otp_activate/', OtpActivate.as_view()),



    # path('google/', google_auth.home),



    # path('list_frinds/', ),
    # path('add_frind/', ),
    # path('delete_frind/', ),
    
    # path('add_win/', ),
    # path('add_lose/', ),
    # path('add_history/', ),
    
    # path('set-two-factor-auth/', views.Set2FAView.as_view()),``
    # path('intra/')
    # path('', google_auth.sign_in, name='sign_in'),
    # path('', google_auth.auth),
    # path('auth-receiver/', google_auth.auth_receiver, name='auth_receiver'),
    

]

# level 
# ranking