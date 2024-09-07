import json
from decimal import Decimal

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from store.models import Cart, CartOrder, CartOrderItem, Category, Coupon, Product, Tax
from store.serializers import (
    CartOrderItemSerializer,
    CartOrderSerializer,
    CartSerializer,
    CategorySerializer,
    CouponSerializer,
    ProductSerializer,
)
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
        # With the change to TypeScript, the FormData typing on the front-end started to require that the data be sent in a jsonstring.
        # In order to receive the following format {'data': jsonstring}, it was necessary to implement this piece of code
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
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

        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate = tax.rate / 100
        else:
            tax_rate = 0

        cart = Cart.objects.filter(cart_id=cart_id, product=product).first()
        if cart:
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = int(qty) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 20 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = (
                cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            )
            cart.save()
            return Response(
                {"message": "Cart Updated Successfully"}, status=status.HTTP_200_OK
            )
        else:
            # when user does not exist
            cart = Cart()
            cart.product = product
            cart.user = user
            cart.qty = qty
            cart.price = price
            cart.sub_total = Decimal(price) * int(qty)
            cart.shipping_amount = Decimal(shipping_amount) * int(qty)
            cart.tax_fee = int(qty) * Decimal(tax_rate)
            cart.color = color
            cart.size = size
            cart.country = country
            cart.cart_id = cart_id

            service_fee_percentage = 20 / 100
            cart.service_fee = Decimal(service_fee_percentage) * cart.sub_total

            cart.total = (
                cart.sub_total + cart.shipping_amount + cart.service_fee + cart.tax_fee
            )
            cart.save()
            return Response(
                {"message": "Cart Created Successfully"}, status=status.HTTP_200_OK
            )


class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id is not None:
            user = User.objects.filter(id=user_id).first()
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        return queryset


class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id = self.kwargs["cart_id"]
        user_id = self.kwargs.get("user_id")

        if user_id is not None:
            user = User.objects.filter(id=user_id).first()
            queryset = Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset = Cart.objects.filter(cart_id=cart_id)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        total_shipping = 0.0
        total_tax = 0.0
        total_service_fee = 0.0
        total_sub_total = 0.0
        total = 0.0
        for cart_item in queryset:
            total_shipping += float(cart_item.shipping_amount)
            total_tax += float(cart_item.tax_fee)
            total_service_fee += float(cart_item.service_fee)
            total_sub_total += float(cart_item.sub_total)
            total += float(cart_item.total)

        data = {
            "shipping_amount": total_shipping,
            "tax_fee": total_tax,
            "service_fee": total_service_fee,
            "sub_total": total_sub_total,
            "total": total,
        }

        return Response(data)


class CartItemDeleteAPIView(generics.DestroyAPIView):
    serializer_class = CartSerializer
    lookup_field = "cart_id"

    def get_object(self):
        cart_id = self.kwargs["cart_id"]
        item_id = self.kwargs["item_id"]
        user_id = self.kwargs["user_id"]

        if user_id:
            user = User.objects.get(id=user_id)
            cart = Cart.objects.get(id=item_id, user=user, cart_id=cart_id)
        else:
            cart = Cart.objects.get(id=item_id, cart_id=cart_id)

        return cart


class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    queryset = CartOrder.objects.all()
    permission_classes = [AllowAny]

    def create(self, request):
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
            payload = request.data

        full_name = payload["full_name"]
        email = payload["email"]
        mobile = payload["mobile"]
        address = payload["address"]
        city = payload["city"]
        state = payload["state"]
        country = payload["country"]
        cart_id = payload["cart_id"]
        user_id = payload["user_id"]

        if user_id:
            user = User.objects.get(id=user_id)
        else:
            user = None

        cart_items = Cart.objects.filter(cart_id=cart_id)

        total_shipping = Decimal(0.00)
        total_tax = Decimal(0.00)
        total_service_fee = Decimal(0.00)
        total_sub_total = Decimal(0.00)
        total_initial_total = Decimal(0.00)
        total = Decimal(0.00)

        order = CartOrder.objects.create(
            buyer=user,
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country,
        )

        for item in cart_items:
            CartOrderItem.objects.create(
                order=order,
                product=item.product,
                vendor=item.product.vendor,
                qty=item.qty,
                color=item.color,
                size=item.size,
                price=item.price,
                sub_total=item.sub_total,
                shipping_amount=item.shipping_amount,
                service_fee=item.service_fee,
                tax_fee=item.tax_fee,
                initial_total=item.total,
                total=item.total,
            )
            total_shipping += Decimal(item.shipping_amount)
            total_tax += Decimal(item.tax_fee)
            total_service_fee += Decimal(item.service_fee)
            total_sub_total += Decimal(item.sub_total)
            total_initial_total += Decimal(item.total)
            total += Decimal(item.total)

            order.vendor.add(item.product.vendor)

        order.sub_total = total_sub_total
        order.shipping_amount = total_shipping
        order.tax_fee = total_tax
        order.service_fee = total_service_fee
        order.initial_total = total_initial_total
        order.total = total
        order.save()
        return Response(
            {"message": "Order Created Successfully", "order_oid": order.oid},
            status=status.HTTP_201_CREATED,
        )


class CheckoutView(generics.RetrieveAPIView):
    serializer_class = CartOrderSerializer
    lookup_field = "order_oid"
    permission_classes = [AllowAny]

    def get_object(self):
        order_oid = self.kwargs["order_oid"]
        order = CartOrder.objects.get(oid=order_oid)
        return order


class CouponAPIView(generics.CreateAPIView):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
            payload = request.data

        order_oid = payload["order_oid"]
        coupon_code = payload["coupon_code"]

        order = CartOrder.objects.get(oid=order_oid)
        coupon = Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items = CartOrderItem.objects.filter(
                order=order, vendor=coupon.vendor
            )
            if order_items.exists():
                total_discount = 0
                for item in order_items:
                    if coupon not in item.coupon.all():
                        discount = item.total * coupon.discount / 100

                        item.total -= discount
                        item.sub_total -= discount
                        item.coupon.add(coupon)
                        item.saved += discount

                        total_discount += discount

                        item.save()

                order.total -= total_discount
                order.sub_total -= total_discount
                order.saved += total_discount

                order.save()

                return Response(
                    {"message": "Coupon Activated", "icon": "success"},
                    status=status.HTTP_200_OK,
                )
            else:
                return Response(
                    {"message": "Order Items Do Not Exist", "icon": "error"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"message": "Coupon Does Not Exist", "icon": "error"},
                status=status.HTTP_404_NOT_FOUND,
            )
