import datetime

from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


# Create your models here.
class AppUserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, username, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            username=username,
            password=password,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    telephone = models.CharField(max_length=15,blank=True, null=True)
    address = models.CharField(max_length=200,blank=True, null=True)
    name = models.CharField(max_length=200,blank=True, null=True)
    surname = models.CharField(max_length=200,blank=True, null=True)
    profile_picture = models.ImageField(blank=True, null=True, upload_to="images")
    is_verified = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True, symmetrical=False)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    objects = AppUserManager()

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    def __str__(self):
        return self.username


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=300)
    address = models.CharField(max_length=500, null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    description = models.TextField(max_length=1000, null=True, blank=True)
    added_by = models.ForeignKey(AppUser, on_delete=models.CASCADE, null=True, blank=True)
    grade = models.FloatField(null=True, blank=True, default=0, max_length=5, validators=[MinValueValidator(0), MaxValueValidator(5)])

    def __str__(self):
        return f"Lokacja ID-{self.id}: {self.name}"


class Notification(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=300)
    isRead = models.BooleanField(default=False)
    message = models.CharField(max_length=1000)
    time_triggered = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Powiadomienie ID-{self.id}: {self.title}"


class Review(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    stars = models.IntegerField(default=0)
    opinion = models.TextField(blank=True, null=True)
    video = models.URLField(blank=True, null=True)
    image = models.ImageField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Opinia ID-{self.id}"


class Route(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    path = models.ManyToManyField(Location)
    time = models.CharField(max_length=100, blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)

    def __str__(self):
        return f"Trasa ID-{self.id}"
