import {
    getModelo,
    createModelo,
    updateModelo,
    deleteModelo
} from "./api_modelo_vehiculo.js?v=4";

import { renderToolbar } from "./lib/toolbar.js?v=2";
import { renderPagination } from "./lib/pagination_ui.js?v=2";

const CAMPOS_ORDEN = [
    { value: "id_modelo", label: "ID" },
    { value: "marca", label: "Marca" },
    { value: "nombre_modelo", label: "Modelo" },
    { value: "year", label: "Año" },
    { value: "costo_diario", label: "Costo diario" }
];

let estado = { page: 1, orderBy: "id_modelo", orderDir: "ASC", buscar: "", categoria: "" };

async function post(action, extra = {}) {
    const res = await fetch("../php/modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

async function cargarModelos() {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-400">Cargando registros...</td></tr>`;

    const json = await post("getAll", {
        page: estado.page,
        order_by: estado.orderBy,
        order_dir: estado.orderDir,
        buscar: estado.buscar,
        categoria: estado.categoria
    });

    if (json.status !== "success") {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-red-500 py-4">Error al cargar los modelos.</td></tr>`;
        return;
    }

    renderTabla(json.data);
    renderPagination("paginacionModelos", json.pagination, "modelos", (pagina) => {
        estado.page = pagina;
        cargarModelos();
    });
}

function renderTabla(datos) {
    const tbody = document.getElementById("tbody");

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-gray-500">No hay modelos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = datos.map(d => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-5 py-4 text-center font-medium text-gray-900">#${d.id_modelo}</td>
            <td class="px-5 py-4 text-center text-gray-700 font-medium">${d.nombre_modelo ?? ""}</td>
            <td class="px-5 py-4 text-center text-gray-700">${d.marca ?? ""}</td>
            <td class="px-5 py-4 text-center text-gray-700">${d.year ?? ""}</td>
            <td class="px-5 py-4 text-center text-gray-700">${d.categoria ?? ""}</td>
            <td class="px-5 py-4 text-center text-gray-700">$${d.costo_diario ?? ""}</td>
            <td class="px-5 py-4">
                <div class="flex justify-center gap-2">
                    <button type="button" class="btn btn-sm btn-warning" data-action="edit" data-id="${d.id_modelo}">Editar</button>
                    <button type="button" class="btn btn-sm btn-error" data-action="delete" data-id="${d.id_modelo}">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join("");
}

function manejarAccionesTabla(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;

    if (action === "edit") abrirFormularioEditar(id);
    if (action === "delete") eliminarModelo(id);
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
        Swal.fire({ icon: "error", title: "Error", text: json.message || "No se pudo cargar el registro" });
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
        Swal.fire({ icon: "warning", title: "Falta información", text: "Todos los campos son obligatorios." });
        return;
    }

    const datos = { nombre_modelo, marca, year, categoria, costo_diario };
    const json = id_modelo ? await updateModelo(id_modelo, datos) : await createModelo(datos);

    if (json.status === "success") {
        await Swal.fire({
            icon: "success",
            title: "Guardado",
            text: id_modelo ? "El registro se actualizó correctamente." : "El registro se guardó correctamente."
        });
        cerrarFormulario();
        cargarModelos();
    } else {
        Swal.fire({ icon: "error", title: "Error", text: json.message || "No se pudo guardar el registro" });
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
        await Swal.fire({ icon: "success", title: "Eliminado", text: "El registro fue eliminado." });
        estado.page = 1;
        cargarModelos();
    } else {
        Swal.fire({ icon: "error", title: "Error", text: json.message || "No se pudo eliminar el registro" });
    }
}

function mostrarFormulario() {
    document.getElementById("tableSection").classList.add("hidden");
    document.getElementById("formSection").classList.remove("hidden");
}

function cerrarFormulario() {
    document.getElementById("tableSection").classList.remove("hidden");
    document.getElementById("formSection").classList.add("hidden");
}

function limpiarFormulario() {
    document.getElementById("formModelo").reset();
    document.getElementById("id_modelo").value = "";
}

async function cargarCategorias() {
    const json = await post("getCategorias");
    return json.status === "success" ? json.data : [];
}

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("btnCancelarAgregar").addEventListener("click", cerrarFormulario);
    document.getElementById("formModelo").addEventListener("submit", guardarModelo);
    document.getElementById("tbody").addEventListener("click", manejarAccionesTabla);

    const categorias = await cargarCategorias();

    renderToolbar("toolbar", CAMPOS_ORDEN, {
        placeholderBusqueda: "Buscar por marca o modelo...",
        filtroExtra: { label: "Categoría", opciones: categorias },
        boton: { label: "+ Agregar Modelo", onClick: abrirFormularioAgregar },
        onChange: ({ buscar, orderBy, orderDir, filtroExtra }) => {
            estado = { ...estado, buscar, orderBy, orderDir, categoria: filtroExtra, page: 1 };
            cargarModelos();
        }
    });

    cargarModelos();
});