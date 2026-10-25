/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Gestión de medicamentos */

/* =========================================================
   30. RENDERIZAR MEDICAMENTOS
   ========================================================= */

function renderizarMedicamentos() {

    const tabla =
        document.getElementById(
            "tabla-medicamentos"
        );


    if (!tabla) {
        return;
    }


    tabla.innerHTML = "";


    if (
        medicamentos.length === 0
    ) {

        tabla.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-solid fa-pills"></i>
                        <strong>No hay medicamentos registrados</strong>
                        <span>Carga el inventario con “Nuevo medicamento”.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    medicamentos.forEach(
        medicamento => {

            const fila =
                document.createElement(
                    "tr"
                );


            const stock =
                Number(
                    medicamento.stock
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${medicamento.nombre || ""}
                    </strong>
                </td>

                <td>
                    ${medicamento.principio || ""}
                </td>

                <td>
                    ${medicamento.presentacion || ""}
                </td>

                <td>

                    <span
                        class="badge ${
                            stock <= 5
                                ? "badge-warning"
                                : "badge-success"
                        }"
                    >

                        ${medicamento.stock || 0}

                    </span>

                </td>

                <td>
                    ${formatearFecha(
                        medicamento.vencimiento
                    )}
                </td>

                <td class="acciones">

                    ${
                        esAdministrador()

                        ?

                        `
                        <button
                            class="btn-action btn-danger"
                            onclick="eliminarMedicamento(${medicamento.id})"
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
   37. ELIMINAR MEDICAMENTO
   ========================================================= */

function eliminarMedicamento(id) {

    if (
        !verificarPermisoAdministrador()
    ) {
        return;
    }


    const confirmar =
        confirm(
            "¿Deseas eliminar este medicamento?"
        );


    if (!confirmar) {
        return;
    }


    medicamentos =
        medicamentos.filter(
            medicamento =>
                String(medicamento.id) !==
                String(id)
        );


    guardarDatos();

    renderizarTodo();

}

