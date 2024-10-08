import json
from decimal import Decimal

import requests
import stripe
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import models
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
    SummarySerializer,
    WishlistSerializer,
)
from userauth.models import User
from userauth.serializers import ProfileSerializer
from vendor.models import Vendor


class ResumeStatsAPIView(generics.ListAPIView):
    serializer_class = SummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs.get("vendor_id")
        vendor = Vendor.objects.get(id=vendor_id)

        # Calculate the summary values
        product_count = Product.objects.filter(vendor=vendor).count()
        order_count = CartOrder.objects.filter(
            vendor=vendor, payment_status="paid"
        ).count()
        revenue = (
            CartOrderItem.objects.filter(
                vendor=vendor,
                order__payment_status="paid",
            ).aggregate(
                total_revenue=models.Sum(
                    models.F("sub_total") + models.F("shipping_amount")
                )
            )[
                "total_revenue"
            ]
            or 0
        )
        return [
            {
                "products": product_count,
                "orders": order_count,
                "revenue": revenue,
            }
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(self.get_serializer(queryset, many=True).data)
