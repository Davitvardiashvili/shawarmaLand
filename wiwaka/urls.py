from django.urls import re_path, path
from rest_framework.permissions import AllowAny
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import *

schema_view = get_schema_view(
    openapi.Info(
        title="Shawarma Land REST API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@yourapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(AllowAny,),
)




urlpatterns = [
    path('branches', BranchListCreateView.as_view(), name='branch-list-create'),
    path('branches/<int:pk>', BranchRetrieveUpdateDestroyView.as_view(), name='branch-update-delete'),
    path('categories', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>', CategoryRetrieveUpdateDestroyView.as_view(), name='category-update-delete'),
    path('products', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<int:pk>', ProductRetrieveUpdateDestroyAPIViewView.as_view(), name='product-update-delete'),
    path('orders', OrderListCreateView.as_view(), name='order-list-create'),
    path('orders/<int:pk>', OrderRetrieveUpdateDestroyAPIViewView.as_view(), name='order-update-delete'),
    path('orders/<int:pk>/status', OrderStatusUpdateView.as_view(), name='order-status-update'),
    path('user/create', UserCreateView.as_view(), name='user-create'),
    path('user/login', ObtainAuthTokenView.as_view(), name='login'),
    path('user/logout', LogoutView.as_view(), name='logout'),
    path('user/change-password', ChangePasswordView.as_view(), name='change-password'),

    # Swagger URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]
