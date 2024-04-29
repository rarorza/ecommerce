from django.urls import path
from store import views as store_views
from userauth import views as userauth_views

urlpatterns = [
    path("user/token/", userauth_views.MyTokenObtainPairView.as_view()),
    path("user/register/", userauth_views.RegisterView.as_view()),
]
