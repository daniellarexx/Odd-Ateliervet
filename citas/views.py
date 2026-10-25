from django.contrib import messages
from django.core.paginator import Paginator
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views import View

from .forms import CitaForm
from .models import Cita


class ListaCitasView(View):
    def get(self, request):
        queryset = Cita.objects.all()
        paginator = Paginator(queryset, 10)
        page_obj = paginator.get_page(request.GET.get("page"))
        return render(
            request,
            "citas/lista.html",
            {
                "page_obj": page_obj,
                "citas": page_obj.object_list,
                "total": paginator.count,
                "seccion_activa": "citas",
                "page_title": "Citas",
                "page_description": "Agenda veterinaria persistida en MySQL",
            },
        )


class CrearCitaView(View):
    def get(self, request):
        ctx = {
            "form": CitaForm(),
            "titulo": "Nueva cita",
            "accion": "Registrar cita",
            "seccion_activa": "citas",
            "page_title": "Nueva cita",
            "page_description": "Alta de cita en MySQL",
        }
        return render(request, "citas/formulario.html", ctx)

    def post(self, request):
        form = CitaForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "La cita se registró correctamente.")
            return redirect("citas:lista")
        messages.error(
            request,
            "No se pudo guardar. Revisa los errores del formulario.",
        )
        return render(
            request,
            "citas/formulario.html",
            {
                "form": form,
                "titulo": "Nueva cita",
                "accion": "Registrar cita",
                "seccion_activa": "citas",
                "page_title": "Nueva cita",
                "page_description": "Alta de cita en MySQL",
            },
            status=400,
        )


class EditarCitaView(View):
    def get(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)
        return render(
            request,
            "citas/formulario.html",
            {
                "form": CitaForm(instance=cita),
                "titulo": "Editar cita",
                "accion": "Guardar cambios",
                "cita": cita,
                "seccion_activa": "citas",
                "page_title": "Editar cita",
                "page_description": "Actualización en MySQL",
            },
        )

    def post(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)
        form = CitaForm(request.POST, instance=cita)
        if form.is_valid():
            form.save()
            messages.success(request, "La cita se actualizó correctamente.")
            return redirect("citas:lista")
        messages.error(
            request,
            "No se pudo actualizar. Revisa los errores del formulario.",
        )
        return render(
            request,
            "citas/formulario.html",
            {
                "form": form,
                "titulo": "Editar cita",
                "accion": "Guardar cambios",
                "cita": cita,
                "seccion_activa": "citas",
                "page_title": "Editar cita",
                "page_description": "Actualización en MySQL",
            },
            status=400,
        )


class EliminarCitaView(View):
    def get(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)
        return render(
            request,
            "citas/confirmar_eliminacion.html",
            {
                "cita": cita,
                "seccion_activa": "citas",
                "page_title": "Eliminar cita",
                "page_description": "Confirmación segura (POST)",
            },
        )

    def post(self, request, pk):
        cita = get_object_or_404(Cita, pk=pk)
        cita.delete()
        messages.success(request, "La cita se eliminó correctamente.")
        return redirect(reverse("citas:lista"))
