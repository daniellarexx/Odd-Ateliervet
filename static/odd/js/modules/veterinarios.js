/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de veterinarios y especialidades */

/* =========================================================
   17. ESPECIALIDADES
   ========================================================= */

function cargarEspecialidades() {

    if (
        !Array.isArray(
            especialidades
        )
    ) {

        especialidades = [];

    }


    if (
        especialidades.length === 0
    ) {

        especialidades = [

            "Medicina general",

            "Cirugía",

            "Dermatología",

            "Odontología",

            "Cardiología",

            "Traumatología"

        ];


        try {

            localStorage.setItem(
                "vetcare_especialidades",
                JSON.stringify(
                    especialidades
                )
            );

        } catch (error) {

            console.warn(
                "No se pudieron guardar las especialidades.",
                error
            );

        }

    }


    const select =
        document.getElementById(
            "veterinario-especialidad"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Seleccionar especialidad</option>';


    especialidades.forEach(
        especialidad => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                especialidad;


            option.textContent =
                especialidad;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   18. VETERINARIOS INICIALES
   ========================================================= */

function cargarVeterinariosIniciales() {

    cargarEspecialidades();


    if (
        veterinarios.length === 0
    ) {

        veterinarios = [

            {
                id: 1,

                nombre:
                    "Laura Martínez",

                especialidad:
                    "Medicina general",

                telefono:
                    "3001234567",

                correo:
                    "laura@oddatelier.com"
            },

            {
                id: 2,

                nombre:
                    "Carlos Rodríguez",

                especialidad:
                    "Cirugía",

                telefono:
                    "3019876543",

                correo:
                    "carlos@oddatelier.com"
            },

            {
                id: 3,

                nombre:
                    "Valentina Gómez",

                especialidad:
                    "Dermatología",

                telefono:
                    "3154567890",

                correo:
                    "valentina@oddatelier.com"
            }

        ];


        try {

            localStorage.setItem(
                "vetcare_veterinarios",
                JSON.stringify(
                    veterinarios
                )
            );

        } catch (error) {

            console.warn(
                "No se pudieron guardar los veterinarios.",
                error
            );

        }

    }

}


/* =========================================================
   25. BUSCAR ESPECIALIDAD
   ========================================================= */

function buscarIdEspecialidad(
    nombre
) {

    return especialidades.find(
        especialidad =>
            especialidad === nombre
    );

}


/* =========================================================
   29. RENDERIZAR VETERINARIOS
   ========================================================= */

function renderizarVeterinarios() {

    const tabla =
        document.getElementById(
            "tabla-veterinarios"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        veterinarios.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-solid fa-user-doctor"></i>
                        <strong>No hay veterinarios registrados</strong>
                        <span>Añade el equipo clínico desde “Nuevo veterinario”.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    veterinarios.forEach(
        veterinario => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${veterinario.nombre || ""}
                    </strong>
                </td>

                <td>

                    <span class="badge badge-primary">

                        ${veterinario.especialidad || ""}

                    </span>

                </td>

                <td>
                    ${veterinario.telefono || ""}
                </td>

                <td>
                    ${veterinario.correo || ""}
                </td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarVeterinario(${veterinario.id})"
                            title="Eliminar"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        `

                        :

                        ""
                    }

                </td>

            `;


            tabla.appendChild(
                fila
            );

        }
    );

}


/* =========================================================
   36. ELIMINAR VETERINARIO
   ========================================================= */

function eliminarVeterinario(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar este veterinario?"
        );


    if (!confirmar) {
        return;
    }


    veterinarios =
        veterinarios.filter(
            veterinario =>
                String(veterinario.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

