from datetime import date, time, timedelta

from django.core.management.base import BaseCommand

from citas.models import Cita


class Command(BaseCommand):
    help = "Crea citas de demostración (más de 10) para probar paginación."

    def handle(self, *args, **options):
        estados = [
            Cita.Estado.PENDIENTE,
            Cita.Estado.CONFIRMADA,
            Cita.Estado.ATENDIDA,
            Cita.Estado.CANCELADA,
        ]
        creadas = 0
        for i in range(1, 13):
            _, was_created = Cita.objects.get_or_create(
                propietario=f"Propietario demo {i}",
                mascota=f"Mascota demo {i}",
                fecha=date.today() + timedelta(days=i),
                hora=time(8 + (i % 8), 0),
                defaults={
                    "motivo": f"Servicio demo {i}",
                    "estado": estados[i % len(estados)],
                },
            )
            if was_created:
                creadas += 1
        self.stdout.write(
            self.style.SUCCESS(
                f"Listo. Citas nuevas: {creadas}. Total: {Cita.objects.count()}."
            )
        )
