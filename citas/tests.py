from datetime import date, time, timedelta

from django.test import Client, TestCase
from django.urls import reverse

from .models import Cita


class CitaCRUDTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.cita = Cita.objects.create(
            propietario="Ana Pérez",
            mascota="Luna",
            fecha=date.today() + timedelta(days=1),
            hora=time(10, 30),
            motivo="Consulta general",
            estado=Cita.Estado.PENDIENTE,
        )

    def test_listar_citas(self):
        response = self.client.get(reverse("citas:lista"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Luna")

    def test_crear_cita_valida(self):
        payload = {
            "propietario": "Carlos Ruiz",
            "mascota": "Max",
            "fecha": (date.today() + timedelta(days=2)).isoformat(),
            "hora": "11:00",
            "motivo": "Vacunación",
            "estado": Cita.Estado.CONFIRMADA,
        }
        response = self.client.post(reverse("citas:crear"), payload)
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Cita.objects.filter(mascota="Max").exists())

    def test_crear_cita_invalida_no_guarda(self):
        before = Cita.objects.count()
        response = self.client.post(reverse("citas:crear"), {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Cita.objects.count(), before)
        self.assertContains(response, "obligatorio", status_code=400)

    def test_editar_cita(self):
        payload = {
            "propietario": "Ana Pérez",
            "mascota": "Luna",
            "fecha": self.cita.fecha.isoformat(),
            "hora": "12:15",
            "motivo": "Control",
            "estado": Cita.Estado.CONFIRMADA,
        }
        response = self.client.post(
            reverse("citas:editar", args=[self.cita.pk]),
            payload,
        )
        self.assertEqual(response.status_code, 302)
        self.cita.refresh_from_db()
        self.assertEqual(self.cita.motivo, "Control")
        self.assertEqual(self.cita.estado, Cita.Estado.CONFIRMADA)

    def test_eliminar_requiere_post(self):
        response = self.client.get(reverse("citas:eliminar", args=[self.cita.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Cita.objects.filter(pk=self.cita.pk).exists())

        response = self.client.post(reverse("citas:eliminar", args=[self.cita.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Cita.objects.filter(pk=self.cita.pk).exists())

    def test_paginacion_10_por_pagina(self):
        Cita.objects.all().delete()
        for i in range(12):
            Cita.objects.create(
                propietario=f"Propietario {i}",
                mascota=f"Mascota {i}",
                fecha=date.today() + timedelta(days=i),
                hora=time(9, 0),
                motivo=f"Motivo {i}",
                estado=Cita.Estado.PENDIENTE,
            )
        page1 = self.client.get(reverse("citas:lista"))
        self.assertEqual(len(page1.context["citas"]), 10)
        page2 = self.client.get(reverse("citas:lista") + "?page=2")
        self.assertEqual(len(page2.context["citas"]), 2)
