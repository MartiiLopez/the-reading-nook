from rest_framework import serializers
from .models import Book, User, Review
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'published_date', 'isbn', 'summary']

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    book = BookSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'book', 'user', 'rating', 'comment', 'created_at']

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ReviewCreateSerializer(serializers.ModelSerializer):
    # Definimos los campos del libro como campos que solo se escriben
    isbn = serializers.CharField(max_length=13, required=True, write_only=True)
    title = serializers.CharField(max_length=200, required=True, write_only=True)
    author = serializers.CharField(max_length=100, write_only=True)
    published_date = serializers.DateField(write_only=True)
    summary = serializers.CharField(allow_blank=True, required=False, write_only=True)

    class Meta:
        model = Review
        # Solo incluimos los campos del modelo Review en el Meta
        fields = ['isbn', 'title', 'author', 'published_date', 'summary', 'rating', 'comment']

    def create(self, validated_data):
        # Extrae los datos del libro y la reseña
        book_data = {
            'isbn': validated_data.pop('isbn'),
            'title': validated_data.pop('title'),
            'author': validated_data.pop('author'),
            'published_date': validated_data.pop('published_date'),
            'summary': validated_data.pop('summary'),
        }
        review_data = validated_data

        # Verifica si el libro ya existe o lo crea
        book, created = Book.objects.get_or_create(
            isbn=book_data['isbn'],
            defaults=book_data
        )

        # Crea la reseña y la asocia al libro y al usuario
        user = self.context['request'].user
        review = Review.objects.create(book=book, user=user, **review_data)
        return review