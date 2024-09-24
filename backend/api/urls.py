from customer import views as customer_views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from store import views as store_views
from userauth import views as userauth_views

urlpatterns = [
    # Authentification
    path("user/token/", userauth_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", userauth_views.RegisterView.as_view()),
    path(
        "user/password-reset/<email>/",
        userauth_views.PasswordResetAndEmailVerify.as_view(),
    ),
    path("user/password-change/", userauth_views.PasswordChangeView.as_view()),
    path("user/profile/<user_id>", userauth_views.ProfileView.as_view()),
    # Store
    path("categories/", store_views.CategoryListAPIView.as_view()),
    path("products/", store_views.ProductListAPIView.as_view()),
    path("product/<slug>", store_views.ProductAPIView.as_view()),
    path("cart/", store_views.CartAPIView.as_view()),
    path(
        "cart-list/<str:cart_id>/<int:user_id>/",
        store_views.CartListView.as_view(),
    ),
    path("cart-list/<str:cart_id>/", store_views.CartListView.as_view()),
    path("cart-detail/<str:cart_id>/", store_views.CartDetailView.as_view()),
    path(
        "cart-delete/<str:cart_id>/<int:item_id>/<int:user_id>/",
        store_views.CartItemDeleteAPIView.as_view(),
    ),
    path(
        "cart-delete/<str:cart_id>/<int:item_id>/",
        store_views.CartItemDeleteAPIView.as_view(),
    ),
    path("create-order/", store_views.CreateOrderAPIView.as_view()),
    path("create-order/", store_views.CreateOrderAPIView.as_view()),
    path("checkout/<str:order_oid>/", store_views.CheckoutView.as_view()),
    path("coupon/", store_views.CouponAPIView.as_view()),
    path("reviews/<product_id>/", store_views.ReviewListAPIView.as_view()),
    path("search/", store_views.SearchProductAPIView.as_view()),
    # Payment
    path("checkout-stripe/<str:order_oid>/", store_views.CheckoutStripeView.as_view()),
    path("payment-success/<str:order_oid>/", store_views.PaymentSuccessView.as_view()),
    # Customer
    path("customer/orders/<user_id>/", customer_views.OrdersAPIView.as_view()),
    path(
        "customer/order/<user_id>/<order_oid>/", customer_views.OrdersAPIView.as_view()
    ),
    path("customer/wishlist/<user_id>/", customer_views.WishlistAPIView.as_view()),
]
