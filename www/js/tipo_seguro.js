import {
    getAllTipoSeguro,
    getTipoSeguro,
    createTipoSeguro,
    updateTipoSeguro,
    deleteTipoSeguro
} from "./api_tipo_seguro.js?v=2";

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
    const form = document.getElementById("formTipoSeguro");
    const tbody = document.getElementById("tbody");

    btnAgregar.addEventListener("click", abrirFormularioAgregar);
    btnCancelarAgregar.addEventListener("click", cerrarFormulario);
    form.addEventListener("submit", guardarTipoSeguro);
    tbody.addEventListener("click", manejarAccionesTabla);

    cargarTiposSeguro();
    mostrarVistaTabla();
});

async function cargarTiposSeguro() {
    const tbody = document.getElementById("tbody");

    try {
        const json = await getAllTipoSeguro();

        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-4 text-center font-medium text-gray-900">#${d.id_tipo_seguro}</td>
                    <td class="px-5 py-4 text-center text-gray-700 font-medium">${d.nombre ?? ""}</td>
                    <td class="px-5 py-4 text-gray-700">${d.descripcion ?? ""}</td>
                    <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button
                                type="button"
                                class="btn btn-sm btn-warning"
                                data-action="edit"
                                data-id="${d.id_tipo_seguro}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-error"
                                data-action="delete"
                                data-id="${d.id_tipo_seguro}">
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `).join("");
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-6 text-gray-500">
                        No hay tipos de seguro registrados.
                    </td>
                </tr>
            `;
        }
    } catch (err) {
        console.error("Error al cargar tipos de seguro:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-6 text-red-500">
                    Ocurrió un error al cargar los datos.
                </td>
            </tr>
        `;
    }
}

function manejarAccionesTabla(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "edit") {
        abrirFormularioEditar(id);
    }

    if (action === "delete") {
        eliminarTipoSeguro(id);
    }
}

function abrirFormularioAgregar() {
    limpiarFormulario();
    document.getElementById("formTitle").textContent = "Agregar Tipo de Seguro";
    document.getElementById("btnGuardar").textContent = "Guardar";
    mostrarFormulario();
}

async function abrirFormularioEditar(id) {
    limpiarFormulario();
    document.getElementById("formTitle").textContent = "Editar Tipo de Seguro";
    document.getElementById("btnGuardar").textContent = "Actualizar";
    mostrarFormulario();

    const json = await getTipoSeguro(id);

    if (json.status === "success" && json.data) {
        document.getElementById("id_tipo_seguro").value = json.data.id_tipo_seguro ?? "";
        document.getElementById("nombre").value = json.data.nombre ?? "";
        document.getElementById("descripcion").value = json.data.descripcion ?? "";
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo cargar el registro"
        });
        cerrarFormulario();
    }
}

async function guardarTipoSeguro(e) {
    e.preventDefault();

    const id_tipo_seguro = document.getElementById("id_tipo_seguro").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();

    if (!nombre) {
        Swal.fire({
            icon: "warning",
            title: "Falta información",
            text: "El nombre es obligatorio."
        });
        return;
    }

    let json;

    if (id_tipo_seguro) {
        json = await updateTipoSeguro(id_tipo_seguro, nombre, descripcion);
    } else {
        json = await createTipoSeguro(nombre, descripcion);
    }

    if (json.status === "success") {
        await Swal.fire({
            icon: "success",
            title: "Guardado",
            text: id_tipo_seguro
                ? "El registro se actualizó correctamente."
                : "El registro se guardó correctamente."
        });

        cerrarFormulario();
        cargarTiposSeguro();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo guardar el registro"
        });
    }
}

async function eliminarTipoSeguro(id_tipo_seguro) {
    const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });

    if (!result.isConfirmed) return;

    const json = await deleteTipoSeguro(id_tipo_seguro);

    if (json.status === "success") {
        await Swal.fire({
            title: "¡Eliminado!",
            text: json.message || "El registro fue eliminado correctamente.",
            icon: "success"
        });

        cargarTiposSeguro();
    } else {
        Swal.fire({
            title: "Error",
            text: json.message || "No se pudo eliminar.",
            icon: "error"
        });
    }
}

function mostrarFormulario() {
    const navbar = document.getElementById("navbar-container");
    const tableSection = document.getElementById("tableSection");
    const btnAgregarContainer = document.getElementById("btnAgregarContainer");
    const formSection = document.getElementById("formSection");

    if (navbar) navbar.classList.add("hidden");
    if (tableSection) tableSection.classList.add("hidden");
    if (btnAgregarContainer) btnAgregarContainer.classList.add("hidden");
    if (formSection) formSection.classList.remove("hidden");
}

function mostrarVistaTabla() {
    const navbar = document.getElementById("navbar-container");
    const tableSection = document.getElementById("tableSection");
    const btnAgregarContainer = document.getElementById("btnAgregarContainer");
    const formSection = document.getElementById("formSection");

    if (navbar) navbar.classList.remove("hidden");
    if (tableSection) tableSection.classList.remove("hidden");
    if (btnAgregarContainer) btnAgregarContainer.classList.remove("hidden");
    if (formSection) formSection.classList.add("hidden");
}

function cerrarFormulario() {
    limpiarFormulario();
    mostrarVistaTabla();
}

function limpiarFormulario() {
    document.getElementById("formTipoSeguro").reset();
    document.getElementById("id_tipo_seguro").value = "";
    document.getElementById("formTitle").textContent = "Tipo de Seguro";
    document.getElementById("btnGuardar").textContent = "Guardar";
}