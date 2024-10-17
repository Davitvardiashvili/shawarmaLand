from django.db import models
from django.contrib.auth.models import AbstractUser
import random
from django.utils import timezone


class Branch(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='branch/%Y/%m/%d', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=50)
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='categories')
    image = models.ImageField(upload_to='categories/%Y/%m/%d', null=True, blank=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='products')
    available = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/%Y/%m/%d', null=True, blank=True)


    def __str__(self):
        return f'{self.name} {self.price} GEL'


class User(AbstractUser):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, null=True)
    code = models.IntegerField(unique=True, null=True, blank=True)
    avatar = models.ImageField(upload_to='avatars/%Y/%m/%d', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.code:
            # Generate a unique 4-digit code
            self.code = random.randint(1000, 9999)
            # Ensure the generated code is unique
            while User.objects.filter(code=self.code).exists():
                self.code = random.randint(1000, 9999)
        super(User, self).save(*args, **kwargs)


class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('done', 'Done'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_number = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    order_details = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Preparing')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.order_number} details: {self.order_details}"

