from django.contrib import admin
from UserManagement.models import *
from django.contrib.sessions.models import Session

# Register your models here.



admin.site.register(User)
admin.site.register(Stats)
admin.site.register(MatchHistory)
admin.site.register(Session)

