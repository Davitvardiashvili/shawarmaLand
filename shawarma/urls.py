from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('wiwaka.urls'))
]

if settings.DEBUG:
    print(f"Serving media at {settings.MEDIA_URL} from {settings.MEDIA_ROOT}")
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)