/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de propietarios */

/* =========================================================
   28. RENDERIZAR PROPIETARIOS
   ========================================================= */

function renderizarPropietarios() {

    const tabla =
        document.getElementById(
            "tabla-propietarios"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        propietarios.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-solid fa-users"></i>
                        <strong>No hay propietarios registrados</strong>
                        <span>Registra un propietario para vincularlo a sus mascotas.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    propietarios.forEach(
        propietario => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${propietario.nombre || ""}
                    </strong>
                </td>

                <td>
                    ${propietario.documento || ""}
                </td>

                <td>
                    ${propietario.telefono || ""}
                </td>

                <td>
                    ${propietario.correo || ""}
                </td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarPropietario(${propietario.id})"
                            title="Eliminar"
                        >
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        `

                        :

                        `
                        <span class="badge badge-info">
                            Registrado
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
   35. ELIMINAR PROPIETARIO
   ========================================================= */

function eliminarPropietario(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar este propietario?"
        );


    if (!confirmar) {
        return;
    }


    propietarios =
        propietarios.filter(
            propietario =>
                String(propietario.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

