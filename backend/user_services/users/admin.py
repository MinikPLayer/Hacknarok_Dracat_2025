from django.contrib import admin
from .models import AppUser,Notification, Location, Route, Review

# Register your models here.
admin.site.register(AppUser)
admin.site.register(Location)
admin.site.register(Review)
admin.site.register(Route)
admin.site.register(Notification)
