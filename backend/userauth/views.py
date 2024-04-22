from rest_framework_simplejwt.views import TokenObtainPairView
from userauth.models import Profile, User
from userauth.serializers import MyTokenObtainPairSerializer, RegisterSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
