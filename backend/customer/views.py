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
)
from store.serializers import (
    CartOrderSerializer,
    CartSerializer,
    CategorySerializer,
    CouponSerializer,
    ProductSerializer,
    ReviewSerializer,
)
from userauth.models import User


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
