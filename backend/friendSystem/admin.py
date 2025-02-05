from django.contrib import admin
from .models import Friendship, FriendsProfile


# Register your models here.
admin.site.register(Friendship)
admin.site.register(FriendsProfile)

