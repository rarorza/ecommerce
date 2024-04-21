from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import post_save
from shortuuid.django_fields import ShortUUIDField


class User(AbstractUser):
    username = models.CharField(unique=True, max_length=100)
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self) -> str:
        return str(self.email)

    def save(self, *args, **kwargs) -> None:
        username_email, _ = self.email.split("@")
        if self.full_name == "" or self.full_name is None:
            self.full_name = username_email
        if self.username == "" or self.username is None:
            self.username = username_email
        return super(User, self).save(*args, **kwargs)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.FileField(
        upload_to="image",
        default="default/default-user.jpg",
        null=True,
        blank=True,
    )
    full_name = models.CharField(max_length=100, null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    gender = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    adress = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    pid = ShortUUIDField(
        unique=True,
        length=10,
        max_length=20,
        alphabet="abcdefghijk",
    )

    def __str__(self) -> str:
        if self.full_name:
            return str(self.full_name)
        return str(self.user.full_name)

    def save(self, *args, **kwargs) -> None:
        if self.full_name == "" or self.full_name is None:
            self.full_name = self.user.full_name
        return super(Profile, self).save(*args, **kwargs)


# Signals


def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


post_save.connect(create_user_profile, sender=User)
post_save.connect(save_user_profile, sender=User)

# Explaining: django signal will observe the User model, to create a new profile
# always when save method was called
