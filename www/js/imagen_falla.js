import form from './imagen_falla/form.js';
import renderImagenes from './imagen_falla/renders.js';
import views, { clearForm } from './imagen_falla/views.js';

import { renderToolbar } from './lib/toolbar.js?v=2';
import { renderPagination } from './lib/pagination_ui.js?v=2';

const CAMPOS_ORDEN = [
    { value: "id_imagen", label: "ID" },
    { value: "falla_descripcion", label: "Falla" },
    { value: "fecha_subida", label: "Fecha de subida" }
];

let fallas = [];
let estado = { page: 1, orderBy: "id_imagen", orderDir: "ASC", buscar: "" };

async function post(action, extra = {}) {
    const res = await fetch("../php/imagen_falla.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

async function cargarImagenes() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-gray-400">Cargando registros...</td></tr>`;

    const json = await post("getAll", {
        page: estado.page,
        order_by: estado.orderBy,
        order_dir: estado.orderDir,
        buscar: estado.buscar
    });

    if (json.status !== "success") {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-red-500 py-4">Error al cargar las imágenes.</td></tr>`;
        return;
    }

    renderImagenes(json.data);
    renderPagination("paginacionImagenFalla", json.pagination, "imágenes", (pagina) => {
        estado.page = pagina;
        cargarImagenes();
    });
}

async function cargarFallas() {
    const json = await post("getFormNeeds");
    if (json.status === "success") fallas = json.data.fallas;
}

function wireEvents() {
    document.querySelector("#tbody").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarImagen(id);
        if (e.target.classList.contains("deleteBtn")) eliminarImagen(id);
    });

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarImagen();
    });

    renderToolbar("toolbar", CAMPOS_ORDEN, {
        placeholderBusqueda: "Buscar por descripción de la falla...",
        boton: { label: "+ Agregar Imagen", onClick: () => { clearForm(); views(); } },
        onChange: ({ buscar, orderBy, orderDir }) => {
            estado = { ...estado, buscar, orderBy, orderDir, page: 1 };
            cargarImagenes();
        }
    });
}

async function editarImagen(id) {
    const json = await post("getOne", { id_imagen: id });
    if (json.status === "success") {
        const i = json.data;
        document.querySelector("#id_imagen").value = i.id_imagen;
        document.querySelector("#id_falla").value = i.id_falla;
        document.querySelector("#url_archivo").value = i.url_archivo;
        views();
    }
}

async function guardarImagen() {
    const id_imagen = document.querySelector("#id_imagen").value;
    const datos = {
        id_falla: document.querySelector("#id_falla").value,
        url_archivo: document.querySelector("#url_archivo").value.trim()
    };

    if (!datos.id_falla || !datos.url_archivo) {
        Swal.fire("Faltan datos", "Completa todos los campos", "warning");
        return;
    }

    if (id_imagen) datos.id_imagen = id_imagen;
    const json = id_imagen ? await post("update", { datos }) : await post("insert", { datos });

    if (json.status === "success") {
        Swal.fire("Listo", id_imagen ? "Imagen actualizada" : "Imagen agregada", "success");
        clearForm();
        views();
        cargarImagenes();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

async function eliminarImagen(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar imagen?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (!confirmacion.isConfirmed) return;

    const json = await post("delete", { id_imagen: id });
    if (json.status === "success") {
        Swal.fire("Eliminada", "La imagen fue eliminada", "success");
        estado.page = 1;
        cargarImagenes();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

(async function init() {
    await cargarFallas();
    document.querySelector("#formContainer").innerHTML = form(fallas);
    wireEvents();
    await cargarImagenes();
})();