from django import forms

from .models import Cita


class CitaForm(forms.ModelForm):
    class Meta:
        model = Cita
        fields = [
            "propietario",
            "mascota",
            "fecha",
            "hora",
            "motivo",
            "estado",
        ]
        widgets = {
            "propietario": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Nombre del propietario"}
            ),
            "mascota": forms.TextInput(
                attrs={"class": "form-control", "placeholder": "Nombre de la mascota"}
            ),
            "fecha": forms.DateInput(
                attrs={"class": "form-control", "type": "date"},
                format="%Y-%m-%d",
            ),
            "hora": forms.TimeInput(
                attrs={"class": "form-control", "type": "time"},
                format="%H:%M",
            ),
            "motivo": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Consulta general, vacunación, etc.",
                }
            ),
            "estado": forms.Select(attrs={"class": "form-control"}),
        }
        error_messages = {
            "propietario": {
                "required": "El nombre del propietario es obligatorio.",
                "max_length": "El propietario no puede superar 120 caracteres.",
            },
            "mascota": {
                "required": "El nombre de la mascota es obligatorio.",
                "max_length": "La mascota no puede superar 120 caracteres.",
            },
            "fecha": {"required": "La fecha de la cita es obligatoria."},
            "hora": {"required": "La hora de la cita es obligatoria."},
            "motivo": {
                "required": "El motivo o servicio es obligatorio.",
                "max_length": "El motivo no puede superar 255 caracteres.",
            },
            "estado": {"required": "Selecciona un estado para la cita."},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["fecha"].input_formats = ["%Y-%m-%d"]
        self.fields["hora"].input_formats = ["%H:%M", "%H:%M:%S"]
        for name, field in self.fields.items():
            field.required = True
            if name != "estado":
                field.label = field.label or name
