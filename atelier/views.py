from django.shortcuts import render
from django.views import View

from citas.models import Cita


class InicioView(View):
    """Panel principal Odd Atelier (shell Django). Totales de citas desde MySQL."""

    def get(self, request):
        total_citas = Cita.objects.count()
        recientes = Cita.objects.all()[:5]
        return render(
            request,
            "atelier/inicio.html",
            {
                "seccion_activa": "inicio",
                "page_title": "Dashboard",
                "page_description": "Resumen general de Odd Atelier Vet",
                "total_citas": total_citas,
                "citas_recientes": recientes,
            },
        )


class LegadoView(View):
    """
    Módulos originales HTML/JS (localStorage): mascotas, propietarios, etc.
    Se sirven dentro del mismo sitio Django con el shell Odd Atelier.
    """

    SECCIONES = {
        "mascotas": ("Mascotas", "Registro de pacientes (localStorage)"),
        "propietarios": ("Propietarios", "Dueños registrados (localStorage)"),
        "veterinarios": ("Veterinarios", "Equipo clínico (localStorage)"),
        "medicamentos": ("Medicamentos", "Inventario (localStorage)"),
        "consultas": ("Consultas", "Historial clínico (localStorage)"),
    }

    def get(self, request, seccion="mascotas"):
        if seccion not in self.SECCIONES:
            seccion = "mascotas"
        titulo, desc = self.SECCIONES[seccion]
        return render(
            request,
            "atelier/legado.html",
            {
                "seccion_activa": seccion,
                "page_title": titulo,
                "page_description": desc,
                "seccion_legado": seccion,
            },
        )
