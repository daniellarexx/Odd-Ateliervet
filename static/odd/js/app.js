/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
   ========================================================= */

/* Arranque de la aplicación — orquesta los módulos */

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

    /* Cada recarga cierra la sesión visual y vuelve al login.
       No se borran los datos de negocio en localStorage. */
    localStorage.removeItem(SESION_KEY);

    verificarSesion();

}
