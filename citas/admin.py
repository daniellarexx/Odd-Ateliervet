from django.contrib import admin

from .models import Cita


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "mascota",
        "propietario",
        "fecha",
        "hora",
        "estado",
        "motivo",
    )
    list_filter = ("estado", "fecha")
    search_fields = ("mascota", "propietario", "motivo")
    ordering = ("-fecha", "-hora")
