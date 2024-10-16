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

stripe.api_key = settings.STRIPE_SECRET_KEY


def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item,
    )


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
        user_id = payload.get("user_id")
        qty = payload["qty"]
        price = payload["price"]
        shipping_amount = payload["shipping_amount"]
        size = payload["size"]
        color = payload["color"]
        country = payload["country"]
        cart_id = payload["cart_id"]

        product = Product.objects.get(id=product_id)
        if user_id != "undefined" or not user_id:
            user = User.objects.filter(id=user_id).first()
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


class CheckoutStripeView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    lookup_url_kwarg = "order_oid"
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        order_oid = self.kwargs["order_oid"]
        order = CartOrder.objects.get(oid=order_oid)

        if not order:
            return Response(
                {"message": "Order Not Found"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            checkout_session = stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {"name": order.full_name},
                            "unit_amount": int(order.total * 100),
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=f"http://localhost:5173/payment-success/{order.oid}?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"http://localhost:5173/payment-failed/?session_id={{CHECKOUT_SESSION_ID}}",
            )
            order.stripe_session_id = checkout_session.id
            order.save()

            return Response(
                {"redirect_url": checkout_session.url}, status=status.HTTP_200_OK
            )
        except stripe.error.StripeError as e:
            return Response(
                {
                    "error": f"Something went wrong while creating the checkout session: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def get_access_token_paypal(client_id, secret_id):
    token_url = "https://api.sandbox.paypal.com/v1/oauth2/token"
    data = {"grant_type": "client_credentials"}
    auth = (client_id, secret_id)
    response = requests.post(token_url, data=data, auth=auth)
    if response.status_code == "200":
        return response.json()["access_token"]
    raise Exception(f"Failed to get access token: {response.status_code}")


class PaymentSuccessView(generics.CreateAPIView):
    serializer_class = CartOrderSerializer
    permission_classes = [AllowAny]
    queryset = CartOrder.objects.all()

    def create(self, request, *args, **kwargs):
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
            payload = request.data

        order_oid = payload.get("order_oid")
        session_id = payload.get("session_id")
        paypal_order_id = payload.get("paypal_order_id", "")

        order = CartOrder.objects.filter(oid=order_oid).first()
        order_items = CartOrderItem.objects.filter(order=order)

        # Paypal
        if paypal_order_id:
            access_token = get_access_token_paypal(
                settings.PAYPAL_CLIENT_ID,
                settings.PAYPAL_SECRET_ID,
            )
            paypal_api_url = (
                f"https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}"
            )
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {access_token}",
            }
            response = requests.get(paypal_api_url, headers=headers)
            if response.status_code == 200:
                paypal_order_data = response.json()
                paypal_payment_status = paypal_order_data["status"]
                if paypal_payment_status == "COMPLETED":
                    if order.payment_status == "pending":
                        order.payment_status = "paid"
                        order.save()

                        # Send notification and email to buyer and vendor
                        if order.buyer:
                            send_notification(user=order.buyer, order=order)

                        context = {"order": order, "order_items": order_items}
                        subject = "Order Placed Succesfully"
                        text_body = render_to_string(
                            "email/customer_order_confirmation.txt", context
                        )
                        html_body = render_to_string(
                            "email/customer_order_confirmation.html", context
                        )
                        msg = EmailMultiAlternatives(
                            subject=subject,
                            from_email=settings.FROM_EMAIL,
                            to=[order.email],
                            body=text_body,
                        )
                        msg.attach_alternative(html_body, "text/html")
                        msg.send()

                        # Send notification and email to vendor
                        for item in order_items:
                            send_notification(
                                vendor=item.vendor, order=order, order_item=item
                            )

                            items_from_vendor = order_items.filter(vendor=item.vendor)

                            context = {
                                "order": order,
                                "order_items": items_from_vendor,
                                "vendor": item.vendor,
                            }
                            subject = "New Sale!"
                            text_body = render_to_string(
                                "email/vendor_sale.txt", context
                            )
                            html_body = render_to_string(
                                "email/vendor_sale.html", context
                            )
                            msg = EmailMultiAlternatives(
                                subject=subject,
                                from_email=settings.FROM_EMAIL,
                                to=[item.vendor.user.email],
                                body=text_body,
                            )
                            msg.attach_alternative(html_body, "text/html")
                            msg.send()

                        return Response(
                            {"message": "Payment successfully"},
                            status=status.HTTP_200_OK,
                        )
                    return Response(
                        {"message": "Already paid"}, status=status.HTTP_200_OK
                    )
            return Response(
                {"message": "An error occured, try again..."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Stripe
        if session_id != "null":
            session = stripe.checkout.Session.retrieve(session_id)

            if session.payment_status == "paid":
                if order.payment_status == "pending":
                    order.payment_status = "paid"
                    order.save()

                    # Send notification and email to buyer and vendor
                    if order.buyer:
                        send_notification(user=order.buyer, order=order)

                    context = {"order": order, "order_items": order_items}
                    subject = "Order Placed Succesfully"
                    text_body = render_to_string(
                        "email/customer_order_confirmation.txt", context
                    )
                    html_body = render_to_string(
                        "email/customer_order_confirmation.html", context
                    )
                    msg = EmailMultiAlternatives(
                        subject=subject,
                        from_email=settings.FROM_EMAIL,
                        to=[order.email],
                        body=text_body,
                    )
                    msg.attach_alternative(html_body, "text/html")
                    msg.send()

                    # Send notification and email to vendor
                    for item in order_items:
                        send_notification(
                            vendor=item.vendor, order=order, order_item=item
                        )

                        items_from_vendor = order_items.filter(vendor=item.vendor)

                        context = {
                            "order": order,
                            "order_items": items_from_vendor,
                            "vendor": item.vendor,
                        }
                        subject = "New Sale!"
                        text_body = render_to_string("email/vendor_sale.txt", context)
                        html_body = render_to_string("email/vendor_sale.html", context)
                        msg = EmailMultiAlternatives(
                            subject=subject,
                            from_email=settings.FROM_EMAIL,
                            to=[item.vendor.user.email],
                            body=text_body,
                        )
                        msg.attach_alternative(html_body, "text/html")
                        msg.send()

                    return Response(
                        {"message": "Payment successfully"}, status=status.HTTP_200_OK
                    )
                return Response({"message": "Already paid"}, status=status.HTTP_200_OK)
            elif session.payment_status == "unpaid":
                return Response(
                    {"message": "Your invoice is unpaid"},
                    status=status.HTTP_404_NOT_FOUND,
                )
            elif session.payment_status == "cancelled":
                return Response(
                    {"message": "Your invoice was cancelled"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(
            {"message": "An error occured, try again..."},
            status=status.HTTP_404_NOT_FOUND,
        )


class ReviewListAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        product_id = self.kwargs["product_id"]
        product = Product.objects.filter(id=product_id).first()
        reviews = Review.objects.filter(product=product).order_by("-pk")
        return reviews

    def create(self, request, *args, **kwargs):
        key = list(request.data.keys())
        if len(key) == 1:
            payload = json.loads(request.data[key[0]])
        else:
            payload = request.data

        user_id = payload.get("user_id")
        product_id = payload.get("product_id")
        rating = payload.get("rating")
        review = payload.get("review")

        user = User.objects.filter(id=user_id).first()
        if user:
            product = Product.objects.filter(id=product_id).first()

            Review.objects.create(
                user=user,
                product=product,
                rating=rating,
                review=review,
            )
            return Response(
                {"message": "Review created successfully"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Unauthorized"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class SearchProductAPIView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        query = self.request.GET.get("query")
        products = Product.objects.filter(status="published", title__icontains=query)
        return products
