from django.contrib import admin
from .models import Book, User, Review

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'published_date')

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating', 'created_at')