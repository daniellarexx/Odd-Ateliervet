from django.urls import path

from . import views

app_name = "atelier"

urlpatterns = [
    path("", views.InicioView.as_view(), name="inicio"),
    path(
        "modulo/<str:seccion>/",
        views.LegadoView.as_view(),
        name="legado",
    ),
]
