# serializers.py
from rest_framework import serializers
from .models import Branch, Category, Product, User, Order
from django.contrib.auth.password_validation import validate_password
from rest_framework.authtoken.models import Token
from django.utils import timezone


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key',)

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'branch', 'avatar', 'first_name', 'last_name', 'is_superuser', 'password', 'code']
        extra_kwargs = {
            'password': {'write_only': True},
            'is_superuser': {'read_only': True},
            'code': {'read_only': True},
            # Make is_superuser read-only
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError("New passwords must match")

        # Validate new password using Django's built-in validators
        validate_password(data['new_password'], self.context['request'].user)

        return data


class OrderSerializer(serializers.ModelSerializer):
    order_details = serializers.JSONField()
    order_number = serializers.IntegerField(read_only=True)  # Mark order_number as read-only

    class Meta:
        model = Order
        fields = ['order_details', 'total_price', 'created_at', 'order_number', 'status', 'updated_at']

    def create(self, validated_data):
        # Extract order details from the incoming data
        order_details = validated_data.get('order_details')
        user = self.context['request'].user  # Get the authenticated user
        total_price = 0

        # Iterate over the order details to calculate the total price
        for item in order_details:
            product_id = item['productId']
            quantity = item['quantity']

            # Get the product from the database
            product = Product.objects.get(id=product_id)

            # Calculate the total price for this product and add it to total
            total_price += product.price * quantity

        # Get the next order number for today (assuming you have a method for this)
        order_number = self.get_next_order_number()

        # Create the Order instance
        order_instance = Order.objects.create(
            user=user,
            order_number=order_number,
            total_price=total_price,
            order_details=order_details
        )

        return order_instance

    def to_representation(self, instance):
        # Call the default representation from the parent class
        representation = super().to_representation(instance)

        # Get the original order details from the instance
        order_details = instance.order_details

        # Replace productId with actual product name and price in the response
        for item in order_details:
            product_id = item.get('productId')
            if product_id:
                try:
                    # Fetch product details
                    product = Product.objects.get(id=product_id)
                    item['product_name'] = product.name
                    item['product_price'] = product.price
                except Product.DoesNotExist:
                    item['product_name'] = 'Unknown product'
                    item['product_price'] = 0

        # Set the updated order_details in the representation
        representation['order_details'] = order_details

        # Add order_number, user.first_name, and user.last_name to the response
        representation['order_number'] = instance.order_number
        representation['status'] = instance.status
        representation['id'] = instance.id
        representation['updated_at'] = instance.updated_at
        representation['user_first_name'] = instance.user.first_name
        representation['user_last_name'] = instance.user.last_name

        return representation

    def get_next_order_number(self):
        # Logic to get the next order number, reset daily
        today = timezone.now().date()
        last_order = Order.objects.filter(created_at__date=today).order_by('-order_number').first()
        return 1 if not last_order else last_order.order_number + 1



class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

    def validate_status(self, value):
        if value not in dict(Order.STATUS_CHOICES):
            raise serializers.ValidationError("Invalid status")

        # Custom logic for status transitions
        current_status = self.instance.status
        allowed_transitions = {
            'preparing': ['ready'],
            'ready': ['done'],
            'done': [],
        }
        if value not in allowed_transitions.get(current_status, []):
            raise serializers.ValidationError(f"Cannot change status from {current_status} to {value}")

        return value


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()