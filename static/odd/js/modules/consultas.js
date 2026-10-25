/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de consultas */

/* =========================================================
   24. SELECTS DE CONSULTAS
   ========================================================= */

function cargarSelectsConsulta() {

    const mascotaInput =
        document.getElementById(
            "consulta-mascota"
        );


    const veterinarioInput =
        document.getElementById(
            "consulta-veterinario"
        );


    if (
        mascotaInput &&
        mascotaInput.tagName === "SELECT"
    ) {

        mascotaInput.innerHTML =
            '<option value="">Seleccionar mascota</option>';


        mascotas.forEach(
            mascota => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    mascota.nombre;


                option.textContent =
                    `${mascota.nombre} - ${mascota.especie}`;


                mascotaInput.appendChild(
                    option
                );

            }
        );

    }


    if (
        veterinarioInput &&
        veterinarioInput.tagName === "SELECT"
    ) {

        veterinarioInput.innerHTML =
            '<option value="">Seleccionar veterinario</option>';


        veterinarios.forEach(
            veterinario => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    veterinario.nombre;


                option.textContent =
                    `${veterinario.nombre} - ${veterinario.especialidad}`;


                veterinarioInput.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   31. RENDERIZAR CONSULTAS
   ========================================================= */

function renderizarConsultas() {

    const tabla =
        document.getElementById(
            "tabla-consultas"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        consultas.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-solid fa-file-medical"></i>
                        <strong>No hay consultas registradas</strong>
                        <span>Documenta la primera consulta clínica desde el botón nuevo.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    consultas.forEach(
        consulta => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    ${consulta.mascota || ""}
                </td>

                <td>
                    ${consulta.veterinario || ""}
                </td>

                <td>
                    ${formatearFecha(
                        consulta.fecha
                    )}
                </td>

                <td>
                    ${consulta.diagnostico || ""}
                </td>

                <td>
                    ${consulta.tratamiento || ""}
                </td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarConsulta(${consulta.id})"
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
   38. ELIMINAR CONSULTA
   ========================================================= */

function eliminarConsulta(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar esta consulta?"
        );


    if (!confirmar) {
        return;
    }


    consultas =
        consultas.filter(
            consulta =>
                String(consulta.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

