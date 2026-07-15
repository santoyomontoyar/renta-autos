import form from './imagen_falla/form.js';
import renderImagenes from './imagen_falla/renders.js';
import views, { clearForm } from './imagen_falla/views.js';

let fallas = [];

async function post(action, extra = {}) {
    const res = await fetch("../php/imagen_falla.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

async function cargarImagenes() {
    const json = await post("getAll");
    if (json.status === "success") renderImagenes(json.data);
}

async function cargarFallas() {
    const json = await post("getFormNeeds");
    if (json.status === "success") fallas = json.data.fallas;
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tbody").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarImagen(id);
        if (e.target.classList.contains("deleteBtn")) eliminarImagen(id);
    });

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarImagen();
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
        cargarImagenes();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

(async function init() {
    await Promise.all([cargarFallas(), cargarImagenes()]);
    document.querySelector("#formContainer").innerHTML = form(fallas);
    wireEvents();
})();