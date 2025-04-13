from . import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .models import Notification
from .views import LlamaGenerateView, NotificationsData

urlpatterns = [
    path('register/', views.UserRegister.as_view(), name='register'),
    path('login/', views.UserLogin.as_view(), name='login'),
    path('logout/', views.UserLogout.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    path('user/', views.OneUserData.as_view(), name='user'),
    path('generate/', LlamaGenerateView.as_view(), name='llama-generate'),
    path('notifications/', NotificationsData.as_view(), name='notifications'),
    path('notifications/<int:pk>/', NotificationsData.as_view(), name='notification-detail'),

]