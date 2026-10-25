from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("atelier.urls")),
    path("citas/", include("citas.urls")),
]
