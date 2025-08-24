from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UserViewSet, ReviewViewSet, RegistrationView, UserDetailView

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'users', UserViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_details'),
]