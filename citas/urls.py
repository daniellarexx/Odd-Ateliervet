from django.urls import path

from . import views

app_name = "citas"

urlpatterns = [
    path("", views.ListaCitasView.as_view(), name="lista"),
    path("nueva/", views.CrearCitaView.as_view(), name="crear"),
    path("<int:pk>/editar/", views.EditarCitaView.as_view(), name="editar"),
    path("<int:pk>/eliminar/", views.EliminarCitaView.as_view(), name="eliminar"),
]
