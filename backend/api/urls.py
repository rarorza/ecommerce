from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from store import views as store_views
from userauth import views as userauth_views

urlpatterns = [
    path("user/token/", userauth_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", userauth_views.RegisterView.as_view()),
    path(
        "user/password-reset/<email>/",
        userauth_views.PasswordResetAndEmailVerify.as_view(),
    ),
    path("user/password-change/", userauth_views.PasswordChangeView.as_view()),
    path("categories/", store_views.CategoryListAPIView.as_view()),
    path("products/", store_views.ProductListAPIView.as_view()),
    path("product/<slug>", store_views.ProductAPIView.as_view()),
    path("cart/", store_views.CartAPIView.as_view()),
    path(
        "cart-list/<str:cart_id>/<int:user_id>/",
        store_views.CartListView.as_view(),
    ),
    path("cart-list/<str:cart_id>/", store_views.CartListView.as_view()),
]
