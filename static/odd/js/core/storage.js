/* =========================================================
   Odd Atelier Vet — módulo extraído para organización por responsabilidades
   Evidencia GA7-220501096-AA2-EV01
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

