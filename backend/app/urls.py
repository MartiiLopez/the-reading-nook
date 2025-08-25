# app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, UserViewSet, MyReviewsViewSet, RegistrationView, UserDetailView, BookReviewsView, ReviewCreateView

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'users', UserViewSet)
router.register(r'my-reviews', MyReviewsViewSet, basename='my-reviews') # La ruta para las reseñas del usuario

urlpatterns = [
    path('register/', RegistrationView.as_view(), name='register'),
    path('user/', UserDetailView.as_view(), name='user_details'),
    path('reviews/<str:isbn>/', BookReviewsView.as_view(), name='book_reviews'),
    path('', include(router.urls)),
    path('reviews/', ReviewCreateView.as_view(), name='review_create'),
]