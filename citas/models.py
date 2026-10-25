from django.db import models


class Cita(models.Model):
    """Cita veterinaria persistida en MySQL (módulo de evidencia)."""

    class Estado(models.TextChoices):
        PENDIENTE = "Pendiente", "Pendiente"
        CONFIRMADA = "Confirmada", "Confirmada"
        ATENDIDA = "Atendida", "Atendida"
        CANCELADA = "Cancelada", "Cancelada"

    propietario = models.CharField("Propietario", max_length=120)
    mascota = models.CharField("Mascota", max_length=120)
    fecha = models.DateField("Fecha")
    hora = models.TimeField("Hora")
    motivo = models.CharField("Motivo / servicio", max_length=255)
    estado = models.CharField(
        "Estado",
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )
    creada_en = models.DateTimeField("Creada en", auto_now_add=True)
    actualizada_en = models.DateTimeField("Actualizada en", auto_now=True)

    class Meta:
        ordering = ["-fecha", "-hora", "-id"]
        verbose_name = "cita"
        verbose_name_plural = "citas"

    def __str__(self) -> str:
        return f"{self.mascota} — {self.fecha} {self.hora}"
