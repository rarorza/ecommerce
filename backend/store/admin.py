from django.contrib import admin
from store.models import (Cart, CartOrder, CartOrderItem, Category, Color,
                          Coupon, Gallery, Notification, Product, ProductFaq,
                          Review, Size, Specification, Tax)


class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 0


class ColorInline(admin.TabularInline):
    model = Color
    extra = 0


class SizeInline(admin.TabularInline):
    model = Size
    extra = 0


class SpecificationInline(admin.TabularInline):
    model = Specification
    extra = 0


class ProductFaqInline(admin.TabularInline):
    model = ProductFaq
    extra = 0


class ReviewAdmin(admin.ModelAdmin):
    list_display = ["user", "product"]


class CouponAdmin(admin.ModelAdmin):
    list_display = ["vendor", "code", "active"]
    list_editable = ["active"]


class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "price",
        "category",
        "shipping_amount",
        "stock_qty",
        "in_stock",
        "vendor",
        "featured",
    ]
    list_editable = ["featured"]
    list_filter = ["date"]
    search_fields = ["title"]
    inlines = [
        GalleryInline,
        ColorInline,
        SizeInline,
        SpecificationInline,
        ProductFaqInline,
    ]


admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Cart)
admin.site.register(CartOrder)
admin.site.register(CartOrderItem)
admin.site.register(Review, ReviewAdmin)
admin.site.register(Coupon, CouponAdmin)
admin.site.register(Tax)
admin.site.register(Notification)
