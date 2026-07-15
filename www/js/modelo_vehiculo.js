import {
    getAllModelos,
    getModelo,
    createModelo,
    updateModelo,
    deleteModelo
} from "./api_modelo_vehiculo.js?v=2";

document.addEventListener("DOMContentLoaded", () => {
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
    const form = document.getElementById("formModelo");
    const tbody = document.getElementById("tbody");

    btnAgregar.addEventListener("click", abrirFormularioAgregar);
    btnCancelarAgregar.addEventListener("click", cerrarFormulario);
    form.addEventListener("submit", guardarModelo);
    tbody.addEventListener("click", manejarAccionesTabla);

    cargarModelos();
    mostrarVistaTabla();
});

async function cargarModelos() {
    const tbody = document.getElementById("tbody");

    try {
        const json = await getAllModelos();

        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                 <td class="px-5 py-4 text-center font-medium text-gray-900">#${d.id_modelo}</td>
                    <td class="px-5 py-4 text-center text-gray-700 font-medium">${d.nombre_modelo ?? ""}</td>
                    <td class="px-5 py-4 text-center text-gray-700">${d.marca ?? ""}</td>
                    <td class="px-5 py-4 text-center text-gray-700">${d.year ?? ""}</td>
                    <td class="px-5 py-4 text-center text-gray-700">${d.categoria ?? ""}</td>
                    <td class="px-5 py-4 text-center text-gray-700">$${d.costo_diario ?? ""}</td>
                    <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button
                                type="button"
                                class="btn btn-sm btn-warning"
                                data-action="edit"
                                data-id="${d.id_modelo}">
                                Editar
                            </button>
                            <button
                                type="button"
                                class="btn btn-sm btn-error"
                                data-action="delete"
                                data-id="${d.id_modelo}">
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `).join("");
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-6 text-gray-500">
                        No hay modelos registrados.
                    </td>
                </tr>
            `;
        }
    } catch (err) {
        console.error("Error al cargar modelos:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-6 text-red-500">
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
        eliminarModelo(id);
    }
}

function abrirFormularioAgregar() {
    limpiarFormulario();
    document.getElementById("formTitle").textContent = "Agregar Modelo";
    document.getElementById("btnGuardar").textContent = "Guardar";
    mostrarFormulario();
}

async function abrirFormularioEditar(id) {
    limpiarFormulario();
    document.getElementById("formTitle").textContent = "Editar Modelo";
    document.getElementById("btnGuardar").textContent = "Actualizar";
    mostrarFormulario();

    const json = await getModelo(id);

    if (json.status === "success" && json.data) {
        document.getElementById("id_modelo").value = json.data.id_modelo ?? "";
        document.getElementById("nombre_modelo").value = json.data.nombre_modelo ?? "";
        document.getElementById("marca").value = json.data.marca ?? "";
        document.getElementById("year").value = json.data.year ?? "";
        document.getElementById("categoria").value = json.data.categoria ?? "";
        document.getElementById("costo_diario").value = json.data.costo_diario ?? "";
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo cargar el registro"
        });
        cerrarFormulario();
    }
}

async function guardarModelo(e) {
    e.preventDefault();

    const id_modelo = document.getElementById("id_modelo").value.trim();
    const nombre_modelo = document.getElementById("nombre_modelo").value.trim();
    const marca = document.getElementById("marca").value.trim();
    const year = document.getElementById("year").value.trim();
    const categoria = document.getElementById("categoria").value;
    const costo_diario = document.getElementById("costo_diario").value.trim();

    if (!nombre_modelo || !marca || !year || !categoria || !costo_diario) {
        Swal.fire({
            icon: "warning",
            title: "Falta información",
            text: "Todos los campos son obligatorios."
        });
        return;
    }

    const datos = { nombre_modelo, marca, year, categoria, costo_diario };

    let json;

    if (id_modelo) {
        json = await updateModelo(id_modelo, datos);
    } else {
        json = await createModelo(datos);
    }

    if (json.status === "success") {
        await Swal.fire({
            icon: "success",
            title: "Guardado",
            text: id_modelo
                ? "El registro se actualizó correctamente."
                : "El registro se guardó correctamente."
        });

        cerrarFormulario();
        cargarModelos();
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: json.message || "No se pudo guardar el registro"
        });
    }
}

async function eliminarModelo(id) {
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

    const json = await deleteModelo(id);

    if (json.status === "success") {
        await Swal.fire({
            title: "¡Eliminado!",
            text: "El registro fue eliminado correctamente.",
            icon: "success"
        });

        cargarModelos();
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
    document.getElementById("formModelo").reset();
    document.getElementById("id_modelo").value = "";
    document.getElementById("formTitle").textContent = "Modelo de Vehículo";
    document.getElementById("btnGuardar").textContent = "Guardar";
    }