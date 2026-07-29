import form from './imagen_modelo_vehiculo/form.js';
import renderImagen from './imagen_modelo_vehiculo/renders.js';
import views, { clearForm } from './imagen_modelo_vehiculo/views.js';

import {
    ordenarDatos,
    paginar,
    renderControlesPaginacion,
    wireSortableHeaders
} from './imagen_modelo_vehiculo_paginacion.js';

let modelos = [];
let imagenesData = [];

const POR_PAGINA = 50;
let paginaActual = 1;
let campoOrden = null;
let direccionOrden = "asc";

async function cargarImagenes() {
    const res = await fetch("../php/imagen_modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });

    const json = await res.json();

    imagenesData =
        (json.status === "success" && Array.isArray(json.data))
            ? json.data
            : [];

    renderTabla();
}

function renderTabla() {

    let datos = [...imagenesData];

    if (campoOrden) {
        datos = ordenarDatos(datos, campoOrden, direccionOrden);
    }

    const totalPag = Math.max(
        1,
        Math.ceil(datos.length / POR_PAGINA)
    );

    if (paginaActual > totalPag) {
        paginaActual = totalPag;
    }

    const datosPagina = paginar(
        datos,
        paginaActual,
        POR_PAGINA
    );

    renderImagen(datosPagina);

    renderControlesPaginacion(
        "paginacionImagenModelo",
        paginaActual,
        datos.length,
        POR_PAGINA,
        (nuevaPagina) => {
            paginaActual = nuevaPagina;
            renderTabla();
        }
    );
}

async function cargarModelos() {
    const res = await fetch("../php/modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") modelos = json.data;
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tablaImagenes").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarImagen(id);
        if (e.target.classList.contains("deleteBtn")) eliminarImagen(id);
    });

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarImagen();
    });

    wireSortableHeaders("#tablaImagenes thead", (campo, direccion) => {
    campoOrden = campo;
    direccionOrden = direccion;
    paginaActual = 1;
    renderTabla();
    });

}

async function editarImagen(id) {
    const res = await fetch("../php/imagen_modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getOne", id_imagen: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const img = json.data;
        
        clearForm();
        views();

        document.querySelector("#id_imagen").value = img.id_imagen;
        document.querySelector("#id_modelo").value = img.id_modelo;
        document.querySelector("#url_archivo").value = img.url_archivo;
        document.querySelector("#es_principal").value = img.es_principal;
    }
}

async function guardarImagen() {
    const id_imagen = document.querySelector("#id_imagen").value;
    
    const datos = {
        id_modelo: document.querySelector("#id_modelo").value,
        url_archivo: document.querySelector("#url_archivo").value.trim(),
        es_principal: document.querySelector("#es_principal").value
    };

    if (!datos.id_modelo || !datos.url_archivo) {
        Swal.fire("Faltan datos", "Por favor completa todos los campos del formulario.", "warning");
        return;
    }

    const action = id_imagen ? "update" : "insert";
    if (id_imagen) datos.id_imagen = id_imagen;

    const res = await fetch("../php/imagen_modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Listo", id_imagen ? "Imagen actualizada" : "Imagen guardada con éxito", "success");
        clearForm();
        views();
        cargarImagenes();
    } else {
        Swal.fire("Error", json.message || "No se pudo procesar la solicitud", "error");
    }
}

async function eliminarImagen(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar esta imagen?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/imagen_modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_imagen: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Eliminada", "La imagen fue borrada de la base de datos.", "success");
        cargarImagenes();
    } else {
        Swal.fire("Error", "No se pudo eliminar la imagen.", "error");
    }
}

(async function init() {
    await cargarModelos();
    await cargarImagenes();
    document.querySelector("#formContainer").innerHTML = form(modelos);
    wireEvents();
})();