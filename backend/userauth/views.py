import shortuuid
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
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
            link = f"http://localhost:5173/create-new-password?otp={user_otp}&uidb64={user_id}"  # noqa 501
            print(link)
        return user


class PasswordChangeView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

    def create(self, request):
        payload = request.data
        print(request.data)

        otp = payload["otp"]
        uidb64 = payload["uidb64"]
        password = payload["password"]

        user = User.objects.get(otp=otp, id=uidb64)
        if user:
            user.set_password(password)
            user.otp = ""
            user.save()
            return Response(
                {"message": "Password Changed Successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                {"message": "User Does Not Exists"},
                status=status.HTTP_404_NOT_FOUND,
            )
