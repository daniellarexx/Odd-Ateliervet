/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de mascotas */

/* =========================================================
   23. SELECT PROPIETARIOS DE MASCOTA
   ========================================================= */

function cargarSelectPropietariosMascota() {

    const input =
        document.getElementById(
            "mascota-propietario"
        );


    if (!input) {
        return;
    }


    if (
        input.tagName === "SELECT"
    ) {

        input.innerHTML =
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


                input.appendChild(
                    option
                );

            }
        );

    }

}


/* =========================================================
   27. RENDERIZAR MASCOTAS
   ========================================================= */

function renderizarMascotas() {

    const tabla =
        document.getElementById(
            "tabla-mascotas"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        mascotas.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-solid fa-paw"></i>
                        <strong>No hay mascotas registradas</strong>
                        <span>Agrega el primer paciente con “Nueva mascota”.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    mascotas.forEach(
        mascota => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${mascota.nombre || ""}
                    </strong>
                </td>

                <td>${mascota.especie || ""}</td>

                <td>${mascota.raza || ""}</td>

                <td>${mascota.edad || ""}</td>

                <td>${mascota.propietario || ""}</td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarMascota(${mascota.id})"
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
   34. ELIMINAR MASCOTA
   ========================================================= */

function eliminarMascota(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar esta mascota?"
        );


    if (!confirmar) {
        return;
    }


    mascotas =
        mascotas.filter(
            mascota =>
                String(mascota.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

