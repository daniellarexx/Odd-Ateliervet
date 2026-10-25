/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Dashboard / Inicio */

/* =========================================================
   32. DASHBOARD
   ========================================================= */

function renderizarDashboard() {

    const totalCitas =
        document.getElementById(
            "total-citas"
        );


    const totalMascotas =
        document.getElementById(
            "total-mascotas"
        );


    const totalPropietarios =
        document.getElementById(
            "total-propietarios"
        );


    const totalMedicamentos =
        document.getElementById(
            "total-medicamentos"
        );


    if (totalCitas) {

        totalCitas.textContent =
            citas.length;

    }


    if (totalMascotas) {

        totalMascotas.textContent =
            mascotas.length;

    }


    if (totalPropietarios) {

        totalPropietarios.textContent =
            propietarios.length;

    }


    if (totalMedicamentos) {

        totalMedicamentos.textContent =
            esAdministrador()
                ? medicamentos.length
                : "—";

    }


    const tabla =
        document.getElementById(
            "dashboard-citas"
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
                    colspan="5"
                    class="empty-state"
                >
                    <div class="empty-state-inner">
                        <i class="fa-regular fa-calendar"></i>
                        <strong>Sin citas por ahora</strong>
                        <span>Cuando registres citas, aparecerán aquí en el resumen.</span>
                    </div>
                </td>

            </tr>

        `;

        return;
    }


    const ultimasCitas =
        [...citas]
            .sort(
                (a, b) =>
                    new Date(a.fecha) -
                    new Date(b.fecha)
            )
            .slice(0, 5);


    ultimasCitas.forEach(
        cita => {

            const fila =
                document.createElement(
                    "tr"
                );


            fila.innerHTML = `

                <td>
                    <strong>
                        ${cita.mascota || ""}
                    </strong>
                </td>

                <td>
                    ${cita.veterinario || ""}
                </td>

                <td>
                    ${formatearFecha(
                        cita.fecha
                    )}
                </td>

                <td>
                    ${cita.hora || ""}
                </td>

                <td>

                    <span class="badge badge-primary">

                        ${cita.motivo || ""}

                    </span>

                </td>

            `;


            tabla.appendChild(
                fila
            );

        }
    );

}

