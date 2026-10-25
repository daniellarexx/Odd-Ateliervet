/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Autenticación y sesión */

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

