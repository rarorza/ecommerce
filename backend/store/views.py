from decimal import Decimal

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from store.models import Cart, CartOrder, CartOrderItem, Category, Product
from store.serializers import (CartOrderItemSerializer, CartOrderSerializer,
                               CartSerializer, CategorySerializer,
                               ProductSerializer)
from userauth.models import User


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class ProductAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs["slug"]
        return Product.objects.get(slug=slug)


class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data

        product_id = payload["product_id"]
        user_id = payload["user_id"]
        qty = payload["qty"]
        price = payload["price"]
        shipping_amount = payload["shipping_amount"]
        size = payload["size"]
        color = payload["color"]
        country = payload["country"]
        cart_id = payload["cart_id"]

        product = Product.objects.get(id=product_id)
        if user_id != "undefined":
            user = User.objects.get(id=user_id)
        else:
            user = None

        cart = Cart.objects.filter(cart_id=cart_id, product=product)
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * Decimal(qty)
            cart.shipping_amount = Decimal(shipping_amount) * Decimal(qty)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.id = cart_id

            service_fee_percentage = 20 / 100
            cart.service_fee = service_fee_percentage * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee
            cart.save()
            return Response(
                {"message": "Cart Updated Successfully"}, status=status.HTTP_200_OK
            )
        else:
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * Decimal(qty)
            cart.shipping_amount = Decimal(shipping_amount) * Decimal(qty)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.id = cart_id

            service_fee_percentage = 20 / 100
            cart.service_fee = service_fee_percentage * cart.sub_total

            cart.total = cart.sub_total + cart.shipping_amount + cart.service_fee
            cart.save()
            return Response(
                {"message": "Cart Created Successfully"}, status=status.HTTP_200_OK
            )
