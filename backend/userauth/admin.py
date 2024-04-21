from django.contrib import admin
from userauth.models import Profile, User

admin.site.register(User)
admin.site.register(Profile)
