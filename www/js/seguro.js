import {
    getAllSeguros,
    getSeguro,
    createSeguro,
    updateSeguro,
    deleteSeguro
} from "./api_seguro.js?v=2";

import { getAllTipoSeguro } from "./api_tipo_seguro.js?v=2";

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
    const form = document.getElementById("formSeguro");
    const tbody = document.getElementById("tbody");

    btnAgregar.addEventListener("click", abrirFormularioAgregar);
    btnCancelarAgregar.addEventListener("click", cerrarFormulario);
    form.addEventListener("submit", guardarSeguro);
    tbody.addEventListener("click", manejarAccionesTabla);

    cargarSeguros();
    mostrarVistaTabla();
});

async function cargarSeguros() {
    const tbody = document.getElementById("tbody");

    try {
        const json = await getAllSeguros();

    if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    #${d.id_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-700 font-medium">
                    ${d.tipo_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500 font-semibold">
                    $${d.costo_diario}
                </td>

                <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button
                                type="button"
                                class="btn btn-sm btn-warning"
                                data-action="edit"
                                data-id="${d.id_seguro}">
                                Editar
                            </button>

                             <button
                                type="button"
                                class="btn btn-sm btn-error"
                                data-action="delete"
                                data-id="${d.id_seguro}">
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
                        No hay seguros registrados.
                    </td>
                </tr>
            `;
        }
    } catch (err) {
        console.error("Error al cargar seguros:", err);

        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center py-6 text-red-500">
                    Ocurrió un error al cargar los datos.
                </td>
            </tr>
        `;
    }
}
async function llenarSelectTipoSeguro(idSeleccionado = "") {
    const select = document.getElementById("id_tipo_seguro");
    select.innerHTML = '<option value="">-- Selecciona --</option>';

    const json = await getAllTipoSeguro();

    if (json.status === "success" && Array.isArray(json.data)) {
        json.data.forEach(item => {
            const selected = String(item.id_tipo_seguro) === String(idSeleccionado) ? "selected" : "";
            select.innerHTML += `<option value="${item.id_tipo_seguro}" ${selected}>${item.nombre}</option>`;
        });
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
        eliminarSeguro(id);
    }
}

async function abrirFormularioAgregar() {
    limpiarFormulario();
    document.getElementById("formTitle").textContent = "Agregar Seguro";
    document.getElementById("btnGuardar").textContent = "Guardar";
    mostrarFormulario();
    await llenarSelectTipoSeguro();
}

async function abrirFormularioEditar(id) {
    limpiarFormulario();

    document.getElementById("formTitle").textContent = "Editar Seguro";
    document.getElementById("btnGuardar").textContent = "Actualizar";

    mostrarFormulario();

    const json = await getSeguro(id);

    if (json.status === "success" && json.data) {
        document.getElementById("id_seguro").value = json.data.id_seguro ?? "";
        document.getElementById("costo_diario").value = json.data.costo_diario ?? "";
        await llenarSelectTipoSeguro(json.data.id_tipo_seguro);
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo cargar el registro"
        });

        cerrarFormulario();
    }
}
async function guardarSeguro(e) {
    e.preventDefault();

    const id_seguro = document.getElementById("id_seguro").value.trim();
    const id_tipo_seguro = document.getElementById("id_tipo_seguro").value;
    const costo_diario = document.getElementById("costo_diario").value.trim();

    if (!id_tipo_seguro || !costo_diario) {
        Swal.fire({
            icon: "warning",
            title: "Falta información",
            text: "Selecciona un tipo de seguro y escribe el costo diario."
        });
        return;
    }

    let json;

    if (id_seguro) {
        json = await updateSeguro(id_seguro, id_tipo_seguro, costo_diario);
    } else {
        json = await createSeguro(id_tipo_seguro, costo_diario);
    }

    if (json.status === "success") {
        await Swal.fire({
            icon: "success",
            title: "Guardado",
            text: id_seguro
                ? "El registro se actualizó correctamente."
                : "El registro se guardó correctamente."
        });

        cerrarFormulario();
        cargarSeguros();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo guardar el registro"
        });
    }
}

async function eliminarSeguro(id) {
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

    const json = await deleteSeguro(id);

    if (json.status === "success") {
        await Swal.fire({
            title: "¡Eliminado!",
            text: "El registro fue eliminado correctamente.",
            icon: "success"
        });

        cargarSeguros();
    } else {
        Swal.fire({
            title: "Error",
            text: json.message || "No se pudo eliminar.",
            icon: "error"
        });
    }
}

function mostrarFormulario() {
    const tableSection = document.getElementById("tableSection");
    const btnAgregarContainer = document.getElementById("btnAgregarContainer");
    const formSection = document.getElementById("formSection");

    if (tableSection) tableSection.classList.add("hidden");
    if (btnAgregarContainer) btnAgregarContainer.classList.add("hidden");
    if (formSection) formSection.classList.remove("hidden");
}

function mostrarVistaTabla() {
    const tableSection = document.getElementById("tableSection");
    const btnAgregarContainer = document.getElementById("btnAgregarContainer");
    const formSection = document.getElementById("formSection");

    if (tableSection) tableSection.classList.remove("hidden");
    if (btnAgregarContainer) btnAgregarContainer.classList.remove("hidden");
    if (formSection) formSection.classList.add("hidden");
}

function cerrarFormulario() {
    limpiarFormulario();
    mostrarVistaTabla();
}

function limpiarFormulario() {
    document.getElementById("formSeguro").reset();
    document.getElementById("id_seguro").value = "";
    document.getElementById("formTitle").textContent = "Seguro";
    document.getElementById("btnGuardar").textContent = "Guardar";
}