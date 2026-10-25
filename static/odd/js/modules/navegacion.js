/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Módulo: Navegación y shell de la aplicación */

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