import json
from datetime import datetime, timedelta
from decimal import Decimal

import requests
import stripe
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.db import models
from django.db.models.functions import ExtractMonth
from django.template.loader import render_to_string
from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from store import serializers
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
    CartOrderItemSerializer,
    CartOrderSerializer,
    CartSerializer,
    CategorySerializer,
    CouponSerializer,
    CouponSummarySerializer,
    EarningSerializer,
    NotificationSerializer,
    NotificationsSummarySerializer,
    ProductSerializer,
    ReviewSerializer,
    SummarySerializer,
    VendorSerializer,
    WishlistSerializer,
)
from userauth.models import Profile, User
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
        return Response(self.get_serializer(queryset, many=True).data[0])


@api_view(("GET",))
def MonthlyOrderChartAPIView(resquest, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    orders = CartOrder.objects.filter(vendor=vendor, payment_status="paid")
    orders_by_month = (
        orders.annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(orders=models.Count("id"))
        .order_by("month")
    )
    return Response(orders_by_month)


@api_view(("GET",))
def MonthlyProductChartAPIView(resquest, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    products = Product.objects.filter(vendor=vendor)
    products_by_month = (
        products.annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(products=models.Count("id"))
        .order_by("month")
    )
    return Response(products_by_month)


class ProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        products = Product.objects.filter(vendor=vendor).order_by("-id")
        return products


class OrdersAPIView(generics.ListAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        orders = CartOrder.objects.filter(
            vendor=vendor,
            payment_status="paid",
        ).order_by("-id")
        return orders


class OrderDetailAPIView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        order_oid = self.kwargs["order_oid"]
        vendor = Vendor.objects.get(id=vendor_id)
        order = CartOrder.objects.get(vendor=vendor, oid=order_oid)
        return order


class RevenueAPIView(generics.ListAPIView):
    serializer_class = CartOrderItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
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
        return revenue


class FilterProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)

        filter = self.request.GET.get("filter")

        if filter == "published":
            products = Product.objects.filter(vendor=vendor, status="published")
        elif filter == "in_review":
            products = Product.objects.filter(vendor=vendor, status="in_review")
        elif filter == "draft":
            products = Product.objects.filter(vendor=vendor, status="draft")
        elif filter == "disabled":
            products = Product.objects.filter(vendor=vendor, status="disabled")
        else:
            products = Product.objects.filter(vendor=vendor)

        return products


class EarningAPIView(generics.ListAPIView):
    serializer_class = EarningSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)

        one_month_ago = datetime.today() - timedelta(days=30)
        monthly_revenue = (
            CartOrderItem.objects.filter(
                vendor=vendor,
                order__payment_status="paid",
                date__gte=one_month_ago,
            ).aggregate(
                total_revenue=models.Sum(
                    models.F("sub_total") + models.F("shipping_amount")
                )
            )[
                "total_revenue"
            ]
            or 0
        )
        total_revenue = (
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
        return [{"monthly_revenue": monthly_revenue, "total_revenue": total_revenue}]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(self.get_serializer(queryset, many=True).data[0])


@api_view(("GET",))
def MonthlyEarningTracker(request, vendor_id):
    vendor = Vendor.objects.get(id=vendor_id)
    monthly_earning_tracker = (
        CartOrderItem.objects.filter(vendor=vendor, order__payment_status="paid")
        .annotate(month=ExtractMonth("date"))
        .values("month")
        .annotate(
            sales_count=models.Sum("qty"),
            total_earning=models.F("sub_total") + models.F("shipping_amount"),
        )
    ).order_by("-month")
    return Response(monthly_earning_tracker)


class ReviewListAPIView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        reviews = Review.objects.filter(product__vendor=vendor)
        return reviews


class ReviewDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        review_id = self.kwargs["review_id"]

        vendor = Vendor.objects.get(id=vendor_id)
        review = Review.objects.get(id=review_id, product__vendor=vendor)
        return review


class CouponsListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        coupons = Coupon.objects.filter(vendor=vendor)
        return coupons

    def create(self, request, *args, **kwargs):
        payload = request.data

        vendor_id = payload["vendor_id"]
        code = payload["code"]
        discount = payload["discount"]
        active = payload["active"]

        vendor = Vendor.objects.get(id=vendor_id)

        Coupon.objects.create(
            vendor=vendor,
            code=code,
            discount=discount,
            active=(active.lower() == "true"),
        )
        return Response(
            {"message": "Coupon created successfully"}, status=status.HTTP_201_CREATED
        )


class CouponDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = CouponSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs["vendor_id"]
        coupon_id = self.kwargs["coupon_id"]

        vendor = Vendor.objects.get(id=vendor_id)
        coupon = Coupon.objects.get(vendor=vendor, id=coupon_id)
        return coupon


class CouponStatsAPIView(generics.ListAPIView):
    serializer_class = CouponSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)

        total_coupons = Coupon.objects.filter(vendor=vendor).count()
        active_coupons = Coupon.objects.filter(vendor=vendor, active=True).count()

        return [
            {
                "total_coupons": total_coupons,
                "active_coupons": active_coupons,
            }
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(self.get_serializer(queryset, many=True).data[0])


class NotificationsUnseenAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        notifications = Notification.objects.filter(vendor=vendor, seen=False).order_by(
            "-id"
        )
        return notifications


class NotificationsSeenAPIView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        notifications = Notification.objects.filter(vendor=vendor, seen=True).order_by(
            "-id"
        )
        return notifications


class NotificationSummaryAPIView(generics.ListAPIView):
    serializer_class = NotificationsSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)
        read = Notification.objects.filter(vendor=vendor, seen=True).count()
        unread = Notification.objects.filter(vendor=vendor, seen=False).count()
        all = Notification.objects.filter(vendor=vendor).count()

        return [
            {
                "read_notifications": read,
                "unread_notifications": unread,
                "all_notifications": all,
            }
        ]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        return Response(self.get_serializer(queryset, many=True).data[0])


class NotificationMarkAsSeen(generics.RetrieveAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_id = self.kwargs["vendor_id"]
        vendor = Vendor.objects.get(id=vendor_id)

        notification_id = self.kwargs["notification_id"]
        notification = Notification.objects.get(vendor=vendor, id=notification_id)
        notification.seen = True
        notification.save()
        return notification


class VendorProfileUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [AllowAny]


class ShopUpdateAPIView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [AllowAny]


class ShopAPIView(generics.RetrieveAPIView):
    serializer_class = VendorSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        vendor_slug = self.kwargs["vendor_slug"]
        return Vendor.objects.get(slug=vendor_slug)


class ShopProductsAPIView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        vendor_slug = self.kwargs["vendor_slug"]
        vendor = Vendor.objects.get(slug=vendor_slug)
        products = Product.objects.filter(vendor=vendor)
        return products
