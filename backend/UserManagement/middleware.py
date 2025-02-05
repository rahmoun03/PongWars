# from rest_framework.exceptions import AuthenticationFailed

# def new_middleware(get_response):

#     def middleware(request):
#         access_token = request.COOKIES.get('access')
#         refresh_token = request.COOKIES.get('refresh')
#         print(f"access: {access_token}, refresh: {refresh_token}", flush=True)
#         # if not access_token or not refresh_token:
#         #     raise AuthenticationFailed('Unauthenticated')
#         response = get_response(request)
#         print(f"response: {response}")
#         return response

#     return middleware


# from .views import get_user_by_token

# def new_middleware(get_response):

#     def middleware(request):
#         token = request.COOKIES.get('access')
#         user = get_user_by_token(token)
#         if user == None:
#             raise AuthenticationFailed('11Unauthenticated')
#         response = get_response(request)
#         print(f"response: {response}")
#         return response

#     return middleware