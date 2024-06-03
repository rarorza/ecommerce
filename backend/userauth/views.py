import random

import shortuuid
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from userauth.models import Profile, User
from userauth.serializers import (
    MyTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


class PasswordResetAndEmailVerify(generics.RetrieveAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def generate_otp(self):
        uuid_key = shortuuid.uuid()
        unique_otp = uuid_key[:6]
        return unique_otp

    def get_object(self):
        email = self.kwargs["email"]
        user = User.objects.get(email=email)

        if user:
            user.otp = self.generate_otp()
            user.save()

            user_id = user.pk
            user_otp = user.otp
            link = f"http://localhost:5173/create-new-password?otp={user_otp}&uid64={user_id}"  # noqa 501
        return user
