import json
from decimal import Decimal

import requests
import stripe
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from store.models import (
    Cart,
    CartOrder,
    CartOrderItem,
    Category,
    Coupon,
    Notification,
    Product,
    Review,
    Tax,
    Wishlist,
)
from store.serializers import (
    CartOrderSerializer,
    CartSerializer,
    CategorySerializer,
    CouponSerializer,
    NotificationSerializer,
    ProductSerializer,
    ReviewSerializer,
    WishlistSerializer,
)
from userauth.models import User
from userauth.serializers import ProfileSerializer


class OrdersAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        orders = CartOrder.objects.filter(buyer=user, payment_status="paid")
        return orders


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        order_oid = self.kwargs["order_oid"]

        user = User.objects.get(id=user_id)
        order = CartOrder.objects.get(
            buyer=user,
            oid=order_oid,
            payment_status="paid",
        )
        return order


class WishlistAPIView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]
        user = User.objects.get(id=user_id)
        wishlist = Wishlist.objects.filter(user=user)
        return wishlist

    def create(self, request, *args, **kwargs):
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
            payload = request.data

        product_id = payload["product_id"]
        user_id = payload["user_id"]

        product = Product.objects.get(id=product_id)
        user = User.objects.get(id=user_id)

        wishlisted = Wishlist.objects.filter(product=product, user=user)
        if wishlisted:
            wishlisted.delete()
            return Response(
                {"message": "Wishlist deleted successfully"}, status=status.HTTP_200_OK
            )
        Wishlist.objects.create(product=product, user=user)
        return Response(
            {"message": "Added to wishlist"}, status=status.HTTP_201_CREATED
        )


class CustomerNotification(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs["user_id"]

        user = User.objects.get(id=user_id)
        notification = Notification.objects.filter(user=user).order_by("-pk")
        return notification


class MarkCustomerNotificationAsSeen(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        user_id = self.kwargs["user_id"]
        notification_id = self.kwargs["notification_id"]

        user = User.objects.get(id=user_id)
        notification = Notification.objects.get(id=notification_id, user=user)

        if notification.seen != True:
            notification.seen = True
            notification.save()

        return notification
