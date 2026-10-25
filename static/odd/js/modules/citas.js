/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de citas */

/* =========================================================
   22. SELECTS DE CITAS
   ========================================================= */

function cargarSelectsCita() {

    const mascotaInput =
        document.getElementById(
            "cita-mascota"
        );


    const propietarioInput =
        document.getElementById(
            "cita-propietario"
        );


    const veterinarioSelect =
        document.getElementById(
            "cita-veterinario"
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
        propietarioInput &&
        propietarioInput.tagName === "SELECT"
    ) {

        propietarioInput.innerHTML =
            '<option value="">Seleccionar propietario</option>';


        propietarios.forEach(
            propietario => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    propietario.nombre;


                option.textContent =
                    `${propietario.nombre} - ${propietario.documento}`;


                propietarioInput.appendChild(
                    option
                );

            }
        );

    }


    if (veterinarioSelect) {

        veterinarioSelect.innerHTML =
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


                veterinarioSelect.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   26. RENDERIZAR CITAS
   ========================================================= */

function renderizarCitas() {

    const tabla =
        document.getElementById(
            "tabla-citas"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        citas.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-regular fa-calendar"></i>
                        <strong>No hay citas registradas</strong>
                        <span>Usa “Nueva cita” para agendar la primera consulta.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    citas.forEach(
        cita => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>${cita.mascota || ""}</td>

                <td>${cita.propietario || ""}</td>

                <td>${cita.veterinario || ""}</td>

                <td>${formatearFecha(cita.fecha)}</td>

                <td>${cita.hora || ""}</td>

                <td>${cita.motivo || ""}</td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarCita(${cita.id})"
                            title="Eliminar"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        `

                        :

                        `
                        <span class="badge badge-info">
                            Registrada
                        </span>
                        `
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
   33. ELIMINAR CITAS
   ========================================================= */

function eliminarCita(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar esta cita?"
        );


    if (!confirmar) {
        return;
    }


    citas =
        citas.filter(
            cita =>
                String(cita.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

