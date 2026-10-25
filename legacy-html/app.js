/* =========================================================
   ODD ATELIER VET - APP.JS
   Sistema de gestión para clínica veterinaria
   Autenticación + Roles + CRUD + LocalStorage
   ========================================================= */


/* =========================================================
   1. UTILIDAD SEGURA PARA LOCALSTORAGE
   ========================================================= */

function cargarArrayLocalStorage(clave) {

    try {

        const valor = localStorage.getItem(clave);

        if (!valor) {
            return [];
        }

        const datos = JSON.parse(valor);

        if (Array.isArray(datos)) {
            return datos;
        }

        localStorage.removeItem(clave);
        return [];

    } catch (error) {

        console.warn(
            `Datos dañados en localStorage: ${clave}. Se restablecerán.`,
            error
        );

        localStorage.removeItem(clave);

        return [];
    }
}


/* =========================================================
   2. DATOS
   ========================================================= */

let citas = cargarArrayLocalStorage("vetcare_citas");

let mascotas = cargarArrayLocalStorage("vetcare_mascotas");

let propietarios =
    cargarArrayLocalStorage("vetcare_propietarios");

let veterinarios =
    cargarArrayLocalStorage("vetcare_veterinarios");

let medicamentos =
    cargarArrayLocalStorage("vetcare_medicamentos");

let consultas =
    cargarArrayLocalStorage("vetcare_consultas");

let especialidades =
    cargarArrayLocalStorage("vetcare_especialidades");

let usuarios =
    cargarArrayLocalStorage("vetcare_usuarios");


const SESION_KEY = "vetcare_usuario_actual";


const SECCIONES_CLIENTE = [
    "inicio",
    "citas",
    "mascotas",
    "propietarios"
];


/* =========================================================
   3. INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    inicializarSistema();

});


function inicializarSistema() {

    prepararEstilosAutenticacion();

    cargarUsuariosIniciales();

    cargarVeterinariosIniciales();

    configurarNavegacion();

    configurarFormularios();

    configurarBuscadores();

    configurarAutenticacion();

    renderizarTodo();


    /* =====================================================
       IMPORTANTE:
       CADA VEZ QUE SE RECARGA LA PÁGINA SE CIERRA
       LA SESIÓN ACTUAL Y SE VUELVE AL LOGIN.

       NO SE BORRAN:
       - Usuarios
       - Mascotas
       - Citas
       - Propietarios
       - Veterinarios
       - Medicamentos
       - Consultas
       ===================================================== */

    localStorage.removeItem(SESION_KEY);


    verificarSesion();

}


/* =========================================================
   4. ESTILOS DE AUTENTICACIÓN
   ========================================================= */

function prepararEstilosAutenticacion() {

    if (document.getElementById("auth-fix-styles")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "auth-fix-styles";

    style.textContent = `

        /* =============================================
           OCULTAR LOGIN COMPLETAMENTE CUANDO HAY SESIÓN
        ============================================= */

        #login-container.auth-container.login-oculto {
            display: none !important;
        }


        /* =============================================
           MOSTRAR LOGIN
        ============================================= */

        #login-container.auth-container.login-visible {
            display: flex !important;
        }


        /* =============================================
           EVITAR QUE EL APP APAREZCA SIN LOGIN
        ============================================= */

        #app-container.app-oculto {
            display: none !important;
        }


        #app-container.app-visible {
            display: block !important;
        }


        /* =============================================
           SIDEBAR OCULTO SIN SESIÓN
        ============================================= */

        .sidebar.sidebar-oculta {
            display: none !important;
        }


        .sidebar.sidebar-visible {
            display: block !important;
        }

    `;

    document.head.appendChild(style);
}


/* =========================================================
   5. UTILIDADES
   ========================================================= */

function generarId() {

    return Date.now() +
        Math.floor(Math.random() * 1000);

}


function guardarDatos() {

    try {

        localStorage.setItem(
            "vetcare_citas",
            JSON.stringify(citas)
        );

        localStorage.setItem(
            "vetcare_mascotas",
            JSON.stringify(mascotas)
        );

        localStorage.setItem(
            "vetcare_propietarios",
            JSON.stringify(propietarios)
        );

        localStorage.setItem(
            "vetcare_veterinarios",
            JSON.stringify(veterinarios)
        );

        localStorage.setItem(
            "vetcare_medicamentos",
            JSON.stringify(medicamentos)
        );

        localStorage.setItem(
            "vetcare_consultas",
            JSON.stringify(consultas)
        );

        localStorage.setItem(
            "vetcare_especialidades",
            JSON.stringify(especialidades)
        );

    } catch (error) {

        console.error(
            "No fue posible guardar los datos:",
            error
        );

        alert(
            "No fue posible guardar los datos en el navegador."
        );
    }

}


function guardarUsuarios() {

    try {

        localStorage.setItem(
            "vetcare_usuarios",
            JSON.stringify(usuarios)
        );

    } catch (error) {

        console.error(
            "No fue posible guardar los usuarios:",
            error
        );
    }

}


function obtenerValor(id) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return "";
    }

    return elemento.value.trim();
}


function normalizarCorreo(correo) {

    return String(correo || "")
        .trim()
        .toLowerCase();

}


/* =========================================================
   6. USUARIOS INICIALES
   ========================================================= */

function cargarUsuariosIniciales() {

    const usuariosBase = [

        {
            id: 1,
            nombre: "Administrador",
            correo: "admin.1@gmail.com",
            password: "Admin123*",
            rol: "Administrador"
        },

        {
            id: 2,
            nombre: "Cliente VetCare",
            correo: "cliente.1@gmail.com",
            password: "Cliente123*",
            rol: "Cliente"
        }

    ];


    let cambios = false;


    usuariosBase.forEach(usuarioBase => {

        const indice =
            usuarios.findIndex(usuario =>
                normalizarCorreo(usuario.correo) ===
                normalizarCorreo(usuarioBase.correo)
            );


        if (indice === -1) {

            usuarios.push({
                ...usuarioBase
            });

            cambios = true;

            return;
        }


        const usuarioActual =
            usuarios[indice];


        const actualizado = {

            ...usuarioActual,

            id: usuarioBase.id,

            nombre: usuarioBase.nombre,

            correo: usuarioBase.correo,

            password: usuarioBase.password,

            rol: usuarioBase.rol

        };


        if (
            JSON.stringify(usuarioActual) !==
            JSON.stringify(actualizado)
        ) {

            usuarios[indice] =
                actualizado;

            cambios = true;
        }

    });


    if (cambios) {

        guardarUsuarios();

    }

}


/* =========================================================
   7. AUTENTICACIÓN
   ========================================================= */

function obtenerUsuarioActual() {

    const sesion =
        localStorage.getItem(SESION_KEY);


    if (!sesion) {
        return null;
    }


    try {

        const usuario =
            JSON.parse(sesion);


        if (
            !usuario ||
            typeof usuario !== "object"
        ) {

            localStorage.removeItem(
                SESION_KEY
            );

            return null;
        }


        return usuario;

    } catch (error) {

        console.warn(
            "Sesión dañada. Se eliminará.",
            error
        );

        localStorage.removeItem(
            SESION_KEY
        );

        return null;
    }

}


function esAdministrador() {

    const usuario =
        obtenerUsuarioActual();


    if (!usuario) {
        return false;
    }


    return (
        String(usuario.rol || "")
            .toLowerCase() ===
        "administrador"
    );

}


function esCliente() {

    const usuario =
        obtenerUsuarioActual();


    if (!usuario) {
        return false;
    }


    return (
        String(usuario.rol || "")
            .toLowerCase() ===
        "cliente"
    );

}


function verificarPermisoAdministrador() {

    if (!esAdministrador()) {

        alert(
            "Esta función solo está disponible para el administrador."
        );

        return false;
    }

    return true;
}


/* =========================================================
   8. VERIFICAR SESIÓN
   ========================================================= */

function verificarSesion() {

    const usuario =
        obtenerUsuarioActual();


    const loginContainer =
        document.getElementById(
            "login-container"
        );


    const appContainer =
        document.getElementById(
            "app-container"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    /* =============================================
       NO HAY SESIÓN
    ============================================= */

    if (!usuario) {

        if (loginContainer) {

            loginContainer.classList.remove(
                "login-oculto"
            );

            loginContainer.classList.add(
                "login-visible"
            );

        }


        if (appContainer) {

            appContainer.classList.remove(
                "app-visible"
            );

            appContainer.classList.add(
                "app-oculto"
            );

        }


        if (sidebar) {

            sidebar.classList.remove(
                "sidebar-visible"
            );

            sidebar.classList.add(
                "sidebar-oculta"
            );

        }


        document.body.classList.remove(
            "sidebar-mobile-open"
        );


        mostrarLogin();

        return;
    }


    /* =============================================
       COMPROBAR QUE EL USUARIO EXISTA
    ============================================= */

    const usuarioExiste =
        usuarios.find(
            usuarioRegistrado =>
                String(usuarioRegistrado.id) ===
                String(usuario.id)
        );


    if (!usuarioExiste) {

        localStorage.removeItem(
            SESION_KEY
        );


        if (loginContainer) {

            loginContainer.classList.remove(
                "login-oculto"
            );

            loginContainer.classList.add(
                "login-visible"
            );

        }


        if (appContainer) {

            appContainer.classList.remove(
                "app-visible"
            );

            appContainer.classList.add(
                "app-oculto"
            );

        }


        if (sidebar) {

            sidebar.classList.remove(
                "sidebar-visible"
            );

            sidebar.classList.add(
                "sidebar-oculta"
            );

        }


        mostrarLogin();

        return;
    }


    /* =============================================
       HAY SESIÓN CORRECTA
    ============================================= */

    if (loginContainer) {

        loginContainer.classList.remove(
            "login-visible"
        );

        loginContainer.classList.add(
            "login-oculto"
        );

    }


    if (appContainer) {

        appContainer.classList.remove(
            "app-oculto"
        );

        appContainer.classList.add(
            "app-visible"
        );

    }


    if (sidebar) {

        sidebar.classList.remove(
            "sidebar-oculta"
        );

        sidebar.classList.add(
            "sidebar-visible"
        );

    }


    mostrarDatosUsuario();

    actualizarInterfazSegunRol();

    renderizarTodo();

    mostrarSeccion("inicio");

}


/* =========================================================
   9. CONFIGURAR AUTENTICACIÓN
   ========================================================= */

function configurarAutenticacion() {

    const formLogin =
        document.getElementById(
            "form-login"
        );


    const formRegistro =
        document.getElementById(
            "form-registro"
        );


    if (formLogin) {

        formLogin.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();

                iniciarSesion();

            }
        );

    }


    if (formRegistro) {

        formRegistro.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();

                registrarUsuario();

            }
        );

    }

}


/* =========================================================
   10. INICIAR SESIÓN
   ========================================================= */

function iniciarSesion() {

    cargarUsuariosIniciales();


    const correo =
        normalizarCorreo(
            obtenerValor("login-correo")
        );


    const password =
        obtenerValor("login-password");


    if (!correo || !password) {

        alert(
            "Por favor completa todos los campos."
        );

        return;
    }


    const usuario =
        usuarios.find(
            usuarioRegistrado =>

                normalizarCorreo(
                    usuarioRegistrado.correo
                ) === correo &&

                String(
                    usuarioRegistrado.password
                ) === password
        );


    if (!usuario) {

        alert(
            "Correo o contraseña incorrectos."
        );

        return;
    }


    try {

        localStorage.setItem(
            SESION_KEY,
            JSON.stringify(usuario)
        );

    } catch (error) {

        console.error(
            "No fue posible iniciar sesión:",
            error
        );

        alert(
            "No fue posible iniciar la sesión."
        );

        return;
    }


    const formLogin =
        document.getElementById(
            "form-login"
        );


    if (formLogin) {
        formLogin.reset();
    }


    verificarSesion();

}


/* =========================================================
   11. REGISTRO DE CLIENTES
   ========================================================= */

function registrarUsuario() {

    const nombre =
        obtenerValor(
            "registro-nombre"
        );


    const correo =
        normalizarCorreo(
            obtenerValor(
                "registro-correo"
            )
        );


    const password =
        obtenerValor(
            "registro-password"
        );


    const confirmarPassword =
        obtenerValor(
            "registro-confirmar-password"
        );


    if (
        !nombre ||
        !correo ||
        !password ||
        !confirmarPassword
    ) {

        alert(
            "Por favor completa todos los campos."
        );

        return;
    }


    if (nombre.length < 3) {

        alert(
            "El nombre debe tener al menos 3 caracteres."
        );

        return;
    }


    if (password.length < 6) {

        alert(
            "La contraseña debe tener mínimo 6 caracteres."
        );

        return;
    }


    if (password !== confirmarPassword) {

        alert(
            "Las contraseñas no coinciden."
        );

        return;
    }


    const correoValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(correo);


    if (!correoValido) {

        alert(
            "Ingresa un correo electrónico válido."
        );

        return;
    }


    const existe =
        usuarios.some(
            usuario =>
                normalizarCorreo(
                    usuario.correo
                ) === correo
        );


    if (existe) {

        alert(
            "Ya existe una cuenta registrada con ese correo."
        );

        return;
    }


    const nuevoUsuario = {

        id: generarId(),

        nombre: nombre,

        correo: correo,

        password: password,

        rol: "Cliente"

    };


    usuarios.push(
        nuevoUsuario
    );


    guardarUsuarios();


    alert(
        "Cuenta creada correctamente.\n\n" +
        "Tu cuenta ha sido registrada como Cliente."
    );


    const formRegistro =
        document.getElementById(
            "form-registro"
        );


    if (formRegistro) {
        formRegistro.reset();
    }


    mostrarLogin();

}


/* =========================================================
   12. CAMBIAR LOGIN / REGISTRO
   ========================================================= */

function mostrarRegistro() {

    const login =
        document.getElementById(
            "login-form-container"
        );


    const registro =
        document.getElementById(
            "registro-form-container"
        );


    if (login) {
        login.style.display = "none";
    }


    if (registro) {
        registro.style.display = "block";
    }

}


function mostrarLogin() {

    const login =
        document.getElementById(
            "login-form-container"
        );


    const registro =
        document.getElementById(
            "registro-form-container"
        );


    if (login) {
        login.style.display = "block";
    }


    if (registro) {
        registro.style.display = "none";
    }

}


function alternarPassword(
    idCampo,
    boton
) {

    const campo =
        document.getElementById(
            idCampo
        );


    if (!campo) {
        return;
    }


    if (campo.type === "password") {

        campo.type = "text";


        if (boton) {

            boton.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        }

    } else {

        campo.type = "password";


        if (boton) {

            boton.innerHTML =
                '<i class="fa-solid fa-eye"></i>';

        }

    }

}


/* =========================================================
   13. CERRAR SESIÓN
   ========================================================= */

function cerrarSesion() {

    const confirmar =
        confirm(
            "¿Deseas cerrar la sesión actual?"
        );


    if (!confirmar) {
        return;
    }


    localStorage.removeItem(
        SESION_KEY
    );


    document.querySelectorAll(
        ".modal"
    ).forEach(modal => {

        modal.style.display =
            "none";

    });


    const appContainer =
        document.getElementById(
            "app-container"
        );


    const loginContainer =
        document.getElementById(
            "login-container"
        );


    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    if (appContainer) {

        appContainer.classList.remove(
            "app-visible"
        );

        appContainer.classList.add(
            "app-oculto"
        );

    }


    if (loginContainer) {

        loginContainer.classList.remove(
            "login-oculto"
        );

        loginContainer.classList.add(
            "login-visible"
        );

    }


    if (sidebar) {

        sidebar.classList.remove(
            "sidebar-visible"
        );

        sidebar.classList.add(
            "sidebar-oculta"
        );

    }


    document.body.classList.remove(
        "sidebar-mobile-open"
    );


    mostrarLogin();

}


/* =========================================================
   14. DATOS DEL USUARIO
   ========================================================= */

function mostrarDatosUsuario() {

    const usuario =
        obtenerUsuarioActual();


    if (!usuario) {
        return;
    }


    const nombre =
        document.getElementById(
            "usuario-nombre"
        );


    const rol =
        document.getElementById(
            "usuario-rol"
        );


    if (nombre) {

        nombre.textContent =
            usuario.nombre;

    }


    if (rol) {

        rol.textContent =
            esAdministrador()
                ? "Administrador"
                : "Cliente";

    }

}


/* =========================================================
   15. PERMISOS VISUALES SEGÚN ROL
   ========================================================= */

function actualizarInterfazSegunRol() {

    const usuario =
        obtenerUsuarioActual();


    if (!usuario) {
        return;
    }


    const administrador =
        esAdministrador();


    const cliente =
        esCliente();


    document.querySelectorAll(
        "[data-roles]"
    ).forEach(elemento => {

        const roles =
            elemento.dataset.roles
                .split(",")
                .map(
                    rol =>
                        rol.trim()
                            .toLowerCase()
                );


        const puedeVer =

            (
                administrador &&
                roles.includes(
                    "administrador"
                )
            )

            ||

            (
                cliente &&
                roles.includes(
                    "cliente"
                )
            );


        elemento.style.display =
            puedeVer ? "" : "none";

    });


    document.querySelectorAll(
        ".solo-admin"
    ).forEach(elemento => {

        elemento.style.display =
            administrador
                ? ""
                : "none";

    });


    document.querySelectorAll(
        ".solo-cliente"
    ).forEach(elemento => {

        elemento.style.display =
            cliente
                ? ""
                : "none";

    });


    const seccionActiva =
        document.querySelector(
            ".section.active-section"
        );


    if (
        cliente &&
        seccionActiva
    ) {

        const nombreSeccion =
            seccionActiva.id;


        if (
            !SECCIONES_CLIENTE.includes(
                nombreSeccion
            )
        ) {

            mostrarSeccion(
                "inicio"
            );

        }

    }

}


/* =========================================================
   16. PERMISOS DE SECCIONES
   ========================================================= */

function tienePermisoSeccion(
    nombreSeccion
) {

    if (esAdministrador()) {
        return true;
    }


    if (esCliente()) {

        return SECCIONES_CLIENTE.includes(
            nombreSeccion
        );

    }


    return false;
}


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
   19. NAVEGACIÓN
   ========================================================= */

function configurarNavegacion() {

    const botones =
        document.querySelectorAll(
            ".menu-item"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                function() {

                    const seccion =
                        this.dataset.section;


                    mostrarSeccion(
                        seccion
                    );

                }
            );

        }
    );

}


function mostrarSeccion(
    nombreSeccion
) {

    if (!obtenerUsuarioActual()) {
        return;
    }


    if (
        !tienePermisoSeccion(
            nombreSeccion
        )
    ) {

        alert(
            "No tienes permisos para acceder a esta sección."
        );


        mostrarSeccion(
            "inicio"
        );


        return;
    }


    document.querySelectorAll(
        ".section"
    ).forEach(seccion => {

        seccion.classList.remove(
            "active-section"
        );

    });


    const seccionSeleccionada =
        document.getElementById(
            nombreSeccion
        );


    if (!seccionSeleccionada) {
        return;
    }


    seccionSeleccionada.classList.add(
        "active-section"
    );


    document.querySelectorAll(
        ".menu-item"
    ).forEach(item => {

        item.classList.remove(
            "active"
        );


        if (
            item.dataset.section ===
            nombreSeccion
        ) {

            item.classList.add(
                "active"
            );

        }

    });


    const titulos = {

        inicio: {

            titulo:
                "Dashboard",

            descripcion:
                "Resumen general de Odd Atelier Vet"

        },

        citas: {

            titulo:
                "Citas",

            descripcion:
                "Gestión de citas veterinarias"

        },

        mascotas: {

            titulo:
                "Mascotas",

            descripcion:
                "Registro de pacientes"

        },

        propietarios: {

            titulo:
                "Propietarios",

            descripcion:
                "Información de los propietarios"

        },

        veterinarios: {

            titulo:
                "Veterinarios",

            descripcion:
                "Equipo médico veterinario"

        },

        medicamentos: {

            titulo:
                "Medicamentos",

            descripcion:
                "Inventario de medicamentos"

        },

        consultas: {

            titulo:
                "Consultas",

            descripcion:
                "Historial de consultas veterinarias"

        }

    };


    const informacion =
        titulos[nombreSeccion];


    const pageTitle =
        document.getElementById(
            "page-title"
        );


    const pageDescription =
        document.getElementById(
            "page-description"
        );


    if (informacion) {

        if (pageTitle) {

            pageTitle.textContent =
                informacion.titulo;

        }


        if (pageDescription) {

            pageDescription.textContent =
                informacion.descripcion;

        }

    }

}


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
                    No hay citas registradas.
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
                    No hay mascotas registradas.
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
                    No hay propietarios registrados.
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
                    No hay veterinarios registrados.
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
                    No hay medicamentos registrados.
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
                    No hay consultas registradas.
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
                    No hay citas registradas.
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


/* =========================================================
   44. MENÚ LATERAL DESPLEGABLE
   ========================================================= */

function configurarMenuLateral() {

    const sidebar =
        document.querySelector(
            ".sidebar"
        );


    const mainContent =
        document.getElementById(
            "app-container"
        );


    if (
        !sidebar ||
        !mainContent
    ) {

        return;
    }


    if (
        document.getElementById(
            "toggle-sidebar"
        )
    ) {

        return;
    }


    const toggleButton =
        document.createElement(
            "button"
        );


    toggleButton.type =
        "button";


    toggleButton.id =
        "toggle-sidebar";


    toggleButton.className =
        "toggle-sidebar";


    toggleButton.title =
        "Contraer menú";


    toggleButton.innerHTML = `
        <i class="fa-solid fa-bars"></i>
    `;


    const topbar =
        document.querySelector(
            ".topbar"
        );


    if (topbar) {

        topbar.insertBefore(
            toggleButton,
            topbar.firstElementChild
        );

    } else {

        document.body.appendChild(
            toggleButton
        );

    }


    /* =====================================================
       ESTILOS DEL MENÚ
       ===================================================== */

    if (
        !document.getElementById(
            "sidebar-dynamic-styles"
        )
    ) {

        const style =
            document.createElement(
                "style"
            );


        style.id =
            "sidebar-dynamic-styles";


        style.textContent = `

            .sidebar {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                height: 100vh !important;
                width: 260px !important;
                z-index: 1000 !important;
                transition:
                    width 0.3s ease,
                    transform 0.3s ease !important;
                overflow-x: hidden !important;
                overflow-y: auto !important;
            }


            .main-content {
                margin-left: 260px !important;
                width: calc(100% - 260px) !important;
                transition:
                    margin-left 0.3s ease,
                    width 0.3s ease !important;
                min-height: 100vh;
            }


            .toggle-sidebar {
                width: 44px !important;
                height: 44px !important;
                min-width: 44px !important;

                display: flex !important;
                align-items: center !important;
                justify-content: center !important;

                border: none !important;
                border-radius: 10px !important;

                background: #111111 !important;
                color: #ffffff !important;

                cursor: pointer !important;

                font-size: 18px !important;

                transition:
                    background 0.2s ease,
                    transform 0.2s ease !important;

                margin-right: 15px !important;
            }


            .toggle-sidebar:hover {
                background: #333333 !important;
                transform: scale(1.04);
            }


            .toggle-sidebar:active {
                transform: scale(0.96);
            }


            body.sidebar-collapsed .sidebar {
                width: 82px !important;
            }


            body.sidebar-collapsed .main-content {
                margin-left: 82px !important;
                width: calc(100% - 82px) !important;
            }


            body.sidebar-collapsed .sidebar .logo-text {
                display: none !important;
            }


            body.sidebar-collapsed .sidebar .menu-item span {
                display: none !important;
            }


            body.sidebar-collapsed .sidebar .logo {
                justify-content: center !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }


            body.sidebar-collapsed .sidebar .logo-mark {
                margin: 0 auto !important;
            }


            body.sidebar-collapsed .sidebar .menu-item {
                justify-content: center !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
            }


            body.sidebar-collapsed .sidebar .menu-item i {
                margin: 0 !important;
                font-size: 19px !important;
            }


            .logout-button {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 8px !important;

                border: none !important;
                border-radius: 9px !important;

                padding: 10px 14px !important;

                background: #111111 !important;
                color: #ffffff !important;

                cursor: pointer !important;

                font-size: 13px !important;
                font-weight: 600 !important;

                white-space: nowrap !important;

                transition:
                    background 0.2s ease,
                    transform 0.2s ease !important;
            }


            .logout-button:hover {
                background: #333333 !important;
                transform: translateY(-1px);
            }


            .logout-button i {
                font-size: 15px !important;
            }


            .topbar {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                gap: 15px !important;
            }


            .topbar > div:first-child {
                min-width: 0;
            }


            .user-profile {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                flex-shrink: 0 !important;
            }


            @media (max-width: 900px) {

                .sidebar {
                    width: 230px !important;
                }


                .main-content {
                    margin-left: 230px !important;
                    width: calc(100% - 230px) !important;
                }


                body.sidebar-collapsed .sidebar {
                    width: 75px !important;
                }


                body.sidebar-collapsed .main-content {
                    margin-left: 75px !important;
                    width: calc(100% - 75px) !important;
                }


                .logout-button span {
                    display: none !important;
                }


                .logout-button {
                    width: 40px !important;
                    height: 40px !important;
                    padding: 0 !important;
                }

            }


            @media (max-width: 650px) {

                .sidebar {
                    width: 230px !important;
                    transform: translateX(-100%) !important;
                }


                .main-content {
                    margin-left: 0 !important;
                    width: 100% !important;
                }


                body.sidebar-mobile-open .sidebar {
                    transform: translateX(0) !important;
                }


                body.sidebar-mobile-open .main-content {
                    margin-left: 0 !important;
                    width: 100% !important;
                }


                body.sidebar-collapsed .sidebar {
                    width: 230px !important;
                    transform: translateX(-100%) !important;
                }


                body.sidebar-collapsed .main-content {
                    margin-left: 0 !important;
                    width: 100% !important;
                }


                .toggle-sidebar {
                    margin-right: 8px !important;
                }


                .topbar {
                    gap: 8px !important;
                }


                .user-info {
                    display: none !important;
                }

            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =====================================================
       ESTADO INICIAL
       ===================================================== */

    let menuColapsado =
        localStorage.getItem(
            "vetcare_sidebar_collapsed"
        ) === "true";


    function actualizarBoton() {

        const icono =
            toggleButton.querySelector(
                "i"
            );


        if (!icono) {
            return;
        }


        if (
            window.innerWidth <= 650
        ) {

            if (
                document.body.classList.contains(
                    "sidebar-mobile-open"
                )
            ) {

                icono.className =
                    "fa-solid fa-xmark";


                toggleButton.title =
                    "Cerrar menú";

            } else {

                icono.className =
                    "fa-solid fa-bars";


                toggleButton.title =
                    "Abrir menú";

            }


            return;
        }


        icono.className =
            "fa-solid fa-bars";


        toggleButton.title =
            menuColapsado
                ? "Expandir menú"
                : "Contraer menú";

    }


    function aplicarEstadoMenu() {

        if (
            window.innerWidth <= 650
        ) {

            document.body.classList.remove(
                "sidebar-collapsed"
            );

            return;
        }


        document.body.classList.toggle(
            "sidebar-collapsed",
            menuColapsado
        );

    }


    /* =====================================================
       CLICK DEL BOTÓN
       ===================================================== */

    toggleButton.addEventListener(
        "click",
        function() {

            if (
                window.innerWidth <= 650
            ) {

                document.body.classList.toggle(
                    "sidebar-mobile-open"
                );


                actualizarBoton();


                return;
            }


            menuColapsado =
                !menuColapsado;


            localStorage.setItem(
                "vetcare_sidebar_collapsed",
                menuColapsado
            );


            aplicarEstadoMenu();

            actualizarBoton();

        }
    );


    /* =====================================================
       CERRAR MENÚ MÓVIL
       ===================================================== */

    document.querySelectorAll(
        ".menu-item"
    ).forEach(
        boton => {

            boton.addEventListener(
                "click",
                function() {

                    if (
                        window.innerWidth <= 650
                    ) {

                        document.body.classList.remove(
                            "sidebar-mobile-open"
                        );


                        actualizarBoton();

                    }

                }
            );

        }
    );


    /* =====================================================
       RESPONSIVE
       ===================================================== */

    window.addEventListener(
        "resize",
        function() {

            aplicarEstadoMenu();

            actualizarBoton();

        }
    );


    aplicarEstadoMenu();

    actualizarBoton();

}


/* =========================================================
   45. INICIALIZAR MENÚ LATERAL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    configurarMenuLateral
);