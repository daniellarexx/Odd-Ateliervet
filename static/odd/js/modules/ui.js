/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Interfaz compartida (modales, formularios, buscadores) */

/* =========================================================
   20. MODALES
   ========================================================= */

function abrirModal(
    idModal
) {

    if (!obtenerUsuarioActual()) {

        alert(
            "Debes iniciar sesión."
        );

        return;
    }


    const modalesSoloAdmin = [

        "modal-veterinario",

        "modal-medicamento",

        "modal-consulta"

    ];


    if (
        modalesSoloAdmin.includes(
            idModal
        ) &&
        !esAdministrador()
    ) {

        alert(
            "Esta función solo está disponible para el administrador."
        );

        return;
    }


    const modal =
        document.getElementById(
            idModal
        );


    if (!modal) {
        return;
    }


    modal.style.display =
        "flex";


    if (
        idModal ===
        "modal-veterinario"
    ) {

        cargarEspecialidades();

    }


    if (
        idModal ===
        "modal-cita"
    ) {

        cargarSelectsCita();

    }


    if (
        idModal ===
        "modal-mascota"
    ) {

        cargarSelectPropietariosMascota();

    }


    if (
        idModal ===
        "modal-consulta"
    ) {

        cargarSelectsConsulta();

    }

}


function cerrarModal(
    idModal
) {

    const modal =
        document.getElementById(
            idModal
        );


    if (!modal) {
        return;
    }


    modal.style.display =
        "none";


    const formulario =
        modal.querySelector(
            "form"
        );


    if (formulario) {

        formulario.reset();

    }

}


/* =========================================================
   21. FORMULARIOS
   ========================================================= */

function configurarFormularios() {


    /* =====================================================
       CITAS
       ===================================================== */

    const formCita =
        document.getElementById(
            "form-cita"
        );


    if (formCita) {

        formCita.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !obtenerUsuarioActual()
                ) {

                    alert(
                        "Debes iniciar sesión."
                    );

                    return;
                }


                const nuevaCita = {

                    id:
                        generarId(),

                    mascota:
                        obtenerValor(
                            "cita-mascota"
                        ),

                    propietario:
                        obtenerValor(
                            "cita-propietario"
                        ),

                    veterinario:
                        obtenerValor(
                            "cita-veterinario"
                        ),

                    fecha:
                        obtenerValor(
                            "cita-fecha"
                        ),

                    hora:
                        obtenerValor(
                            "cita-hora"
                        ),

                    motivo:
                        obtenerValor(
                            "cita-motivo"
                        )

                };


                if (

                    !nuevaCita.mascota ||

                    !nuevaCita.propietario ||

                    !nuevaCita.veterinario ||

                    !nuevaCita.fecha ||

                    !nuevaCita.hora ||

                    !nuevaCita.motivo

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                citas.push(
                    nuevaCita
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-cita"
                );


                alert(
                    "Cita registrada correctamente."
                );

            }
        );

    }


    /* =====================================================
       MASCOTAS
       ===================================================== */

    const formMascota =
        document.getElementById(
            "form-mascota"
        );


    if (formMascota) {

        formMascota.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !obtenerUsuarioActual()
                ) {

                    alert(
                        "Debes iniciar sesión."
                    );

                    return;
                }


                const nuevaMascota = {

                    id:
                        generarId(),

                    nombre:
                        obtenerValor(
                            "mascota-nombre"
                        ),

                    especie:
                        obtenerValor(
                            "mascota-especie"
                        ),

                    raza:
                        obtenerValor(
                            "mascota-raza"
                        ),

                    edad:
                        obtenerValor(
                            "mascota-edad"
                        ),

                    propietario:
                        obtenerValor(
                            "mascota-propietario"
                        )

                };


                if (

                    !nuevaMascota.nombre ||

                    !nuevaMascota.especie ||

                    !nuevaMascota.raza ||

                    !nuevaMascota.edad ||

                    !nuevaMascota.propietario

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                mascotas.push(
                    nuevaMascota
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-mascota"
                );


                alert(
                    "Mascota registrada correctamente."
                );

            }
        );

    }


    /* =====================================================
       PROPIETARIOS
       ===================================================== */

    const formPropietario =
        document.getElementById(
            "form-propietario"
        );


    if (formPropietario) {

        formPropietario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !obtenerUsuarioActual()
                ) {

                    alert(
                        "Debes iniciar sesión."
                    );

                    return;
                }


                const nuevoPropietario = {

                    id:
                        generarId(),

                    nombre:
                        obtenerValor(
                            "propietario-nombre"
                        ),

                    documento:
                        obtenerValor(
                            "propietario-documento"
                        ),

                    telefono:
                        obtenerValor(
                            "propietario-telefono"
                        ),

                    correo:
                        obtenerValor(
                            "propietario-correo"
                        )

                };


                if (

                    !nuevoPropietario.nombre ||

                    !nuevoPropietario.documento ||

                    !nuevoPropietario.telefono ||

                    !nuevoPropietario.correo

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                propietarios.push(
                    nuevoPropietario
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-propietario"
                );


                alert(
                    "Propietario registrado correctamente."
                );

            }
        );

    }


    /* =====================================================
       VETERINARIOS
       ===================================================== */

    const formVeterinario =
        document.getElementById(
            "form-veterinario"
        );


    if (formVeterinario) {

        formVeterinario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !verificarPermisoAdministrador()
                ) {
                    return;
                }


                const nuevoVeterinario = {

                    id:
                        generarId(),

                    nombre:
                        obtenerValor(
                            "veterinario-nombre"
                        ),

                    especialidad:
                        obtenerValor(
                            "veterinario-especialidad"
                        ),

                    telefono:
                        obtenerValor(
                            "veterinario-telefono"
                        ),

                    correo:
                        obtenerValor(
                            "veterinario-correo"
                        )

                };


                if (

                    !nuevoVeterinario.nombre ||

                    !nuevoVeterinario.especialidad ||

                    !nuevoVeterinario.telefono ||

                    !nuevoVeterinario.correo

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                veterinarios.push(
                    nuevoVeterinario
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-veterinario"
                );


                alert(
                    "Veterinario registrado correctamente."
                );

            }
        );

    }


    /* =====================================================
       MEDICAMENTOS
       ===================================================== */

    const formMedicamento =
        document.getElementById(
            "form-medicamento"
        );


    if (formMedicamento) {

        formMedicamento.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !verificarPermisoAdministrador()
                ) {
                    return;
                }


                const nuevoMedicamento = {

                    id:
                        generarId(),

                    nombre:
                        obtenerValor(
                            "medicamento-nombre"
                        ),

                    principio:
                        obtenerValor(
                            "medicamento-principio"
                        ),

                    presentacion:
                        obtenerValor(
                            "medicamento-presentacion"
                        ),

                    stock:
                        obtenerValor(
                            "medicamento-stock"
                        ),

                    vencimiento:
                        obtenerValor(
                            "medicamento-vencimiento"
                        )

                };


                if (

                    !nuevoMedicamento.nombre ||

                    !nuevoMedicamento.principio ||

                    !nuevoMedicamento.presentacion ||

                    !nuevoMedicamento.stock ||

                    !nuevoMedicamento.vencimiento

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                medicamentos.push(
                    nuevoMedicamento
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-medicamento"
                );


                alert(
                    "Medicamento registrado correctamente."
                );

            }
        );

    }


    /* =====================================================
       CONSULTAS
       ===================================================== */

    const formConsulta =
        document.getElementById(
            "form-consulta"
        );


    if (formConsulta) {

        formConsulta.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                if (
                    !verificarPermisoAdministrador()
                ) {
                    return;
                }


                const nuevaConsulta = {

                    id:
                        generarId(),

                    mascota:
                        obtenerValor(
                            "consulta-mascota"
                        ),

                    veterinario:
                        obtenerValor(
                            "consulta-veterinario"
                        ),

                    fecha:
                        obtenerValor(
                            "consulta-fecha"
                        ),

                    diagnostico:
                        obtenerValor(
                            "consulta-diagnostico"
                        ),

                    tratamiento:
                        obtenerValor(
                            "consulta-tratamiento"
                        )

                };


                if (

                    !nuevaConsulta.mascota ||

                    !nuevaConsulta.veterinario ||

                    !nuevaConsulta.fecha ||

                    !nuevaConsulta.diagnostico ||

                    !nuevaConsulta.tratamiento

                ) {

                    alert(
                        "Completa todos los campos."
                    );

                    return;
                }


                consultas.push(
                    nuevaConsulta
                );


                guardarDatos();

                renderizarTodo();

                cerrarModal(
                    "modal-consulta"
                );


                alert(
                    "Consulta registrada correctamente."
                );

            }
        );

    }

}


/* =========================================================
   39. FORMATEAR FECHAS
   ========================================================= */

function formatearFecha(
    fecha
) {

    if (!fecha) {
        return "—";
    }


    const partes =
        String(fecha).split("-");


    if (
        partes.length === 3
    ) {

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    return fecha;

}


/* =========================================================
   40. BUSCADORES
   ========================================================= */

function configurarBuscadores() {

    const buscarCita =
        document.getElementById(
            "buscar-cita"
        );


    const buscarMascota =
        document.getElementById(
            "buscar-mascota"
        );


    if (buscarCita) {

        buscarCita.addEventListener(
            "input",
            function() {

                const termino =
                    this.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        "#tabla-citas tr"
                    )
                    .forEach(
                        fila => {

                            fila.style.display =
                                fila.textContent
                                    .toLowerCase()
                                    .includes(
                                        termino
                                    )
                                    ? ""
                                    : "none";

                        }
                    );

            }
        );

    }


    if (buscarMascota) {

        buscarMascota.addEventListener(
            "input",
            function() {

                const termino =
                    this.value
                        .toLowerCase()
                        .trim();


                document
                    .querySelectorAll(
                        "#tabla-mascotas tr"
                    )
                    .forEach(
                        fila => {

                            fila.style.display =
                                fila.textContent
                                    .toLowerCase()
                                    .includes(
                                        termino
                                    )
                                    ? ""
                                    : "none";

                        }
                    );

            }
        );

    }

}


/* =========================================================
   41. CERRAR MODALES HACIENDO CLICK AFUERA
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "modal"
            )
        ) {

            return;
        }


        event.target.style.display =
            "none";

    }
);


/* =========================================================
   42. RENDERIZAR TODO
   ========================================================= */

function renderizarTodo() {

    renderizarDashboard();

    renderizarCitas();

    renderizarMascotas();

    renderizarPropietarios();

    renderizarVeterinarios();

    renderizarMedicamentos();

    renderizarConsultas();

    cargarEspecialidades();

}

/* =========================================================
   43. FUNCIONES GLOBALES
   ========================================================= */

window.mostrarSeccion =
    mostrarSeccion;

window.abrirModal =
    abrirModal;

window.cerrarModal =
    cerrarModal;

window.mostrarRegistro =
    mostrarRegistro;

window.mostrarLogin =
    mostrarLogin;

window.alternarPassword =
    alternarPassword;

window.cerrarSesion =
    cerrarSesion;

window.iniciarSesion =
    iniciarSesion;

window.registrarUsuario =
    registrarUsuario;

window.eliminarCita =
    eliminarCita;

window.eliminarMascota =
    eliminarMascota;

window.eliminarPropietario =
    eliminarPropietario;

window.eliminarVeterinario =
    eliminarVeterinario;

window.eliminarMedicamento =
    eliminarMedicamento;

window.eliminarConsulta =
    eliminarConsulta;


