import form from './cliente/form.js';
import renderCliente from './cliente/renders.js';
import views, { clearForm } from './cliente/views.js';

let currentPage = 1;
let currentOrderBy = 'c.id_cliente';
let currentOrderDir = 'ASC';
let currentEstadoPriority = 'ACTIVO_PRIMERO';

async function cargarClientes() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Cargando registros...</td></tr>`;

    try {
        const res = await fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "getAll", 
                page: currentPage,
                order_by: currentOrderBy,
                order_dir: currentOrderDir,
                estado_prioridad: currentEstadoPriority
            })
        });
        const json = await res.json();

        if (json.status === "success") {
            renderCliente(json.data);
            renderPagination(json.pagination);
        } else {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-4">Error: ${json.message}</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-4">Error de conexión.</td></tr>`;
    }
}

function renderPagination(p) {
    const container = document.querySelector("#paginationControls");
    const info = document.querySelector("#pageInfo");

    if (!p || p.totalRows === 0) {
        info.textContent = "No hay registros";
        container.innerHTML = "";
        return;
    }

    const start = (p.page - 1) * p.limit + 1;
    const end = Math.min(p.page * p.limit, p.totalRows);
    info.textContent = `Mostrando ${start} a ${end} de ${p.totalRows} clientes`;

    let html = `<button class="join-item btn btn-sm ${p.page <= 1 ? 'btn-disabled' : ''}" id="prevPageBtn">« Anterior</button>`;

    for (let i = 1; i <= p.totalPages; i++) {
        if (i === 1 || i === p.totalPages || (i >= p.page - 2 && i <= p.page + 2)) {
            html += `<button class="join-item btn btn-sm pageBtn ${i === p.page ? 'btn-primary' : ''}" data-page="${i}">${i}</button>`;
        } else if (i === p.page - 3 || i === p.page + 3) {
            html += `<button class="join-item btn btn-sm btn-disabled">...</button>`;
        }
    }

    html += `<button class="join-item btn btn-sm ${p.page >= p.totalPages ? 'btn-disabled' : ''}" id="nextPageBtn">Siguiente »</button>`;

    container.innerHTML = html;
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tablaClientes").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarCliente(id);
        if (e.target.classList.contains("deleteBtn")) eliminarCliente(id);
    });

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarCliente();
    });

    document.querySelector("#orderBySelect").addEventListener("change", (e) => {
        currentOrderBy = e.target.value;
        currentPage = 1;

        const dirContainer = document.querySelector("#dirContainer");
        const estadoContainer = document.querySelector("#estadoGroupContainer");

        if (currentOrderBy === 'estado_prioridad') {
            dirContainer.classList.add("hidden");
            estadoContainer.classList.remove("hidden");
        } else {
            dirContainer.classList.remove("hidden");
            estadoContainer.classList.add("hidden");
        }

        cargarClientes();
    });

    document.querySelector("#orderDirSelect").addEventListener("change", (e) => {
        currentOrderDir = e.target.value;
        currentPage = 1;
        cargarClientes();
    });

    document.querySelector("#estadoPrioritySelect").addEventListener("change", (e) => {
        currentEstadoPriority = e.target.value;
        currentPage = 1;
        cargarClientes();
    });

    document.querySelector("#paginationControls").addEventListener("click", (e) => {
        const pageBtn = e.target.closest(".pageBtn");
        const prevBtn = e.target.closest("#prevPageBtn");
        const nextBtn = e.target.closest("#nextPageBtn");

        if (pageBtn) {
            currentPage = parseInt(pageBtn.dataset.page);
            cargarClientes();
        } else if (prevBtn && currentPage > 1) {
            currentPage--;
            cargarClientes();
        } else if (nextBtn) {
            currentPage++;
            cargarClientes();
        }
    });
}

async function editarCliente(id) {
    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getOne", id_cliente: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const c = json.data;
        clearForm();
        views();

        document.querySelector("#id_cliente").value = c.id_cliente;
        document.querySelector("#id_usuario").value = c.id_usuario;
        document.querySelector("#nombre").value = c.nombre;
        document.querySelector("#apellido").value = c.apellido;
        document.querySelector("#correo").value = c.correo;
        document.querySelector("#telefono").value = c.telefono;
        document.querySelector("#estado").value = c.estado;
    }
}

async function guardarCliente() {
    const id_cliente = document.querySelector("#id_cliente").value;
    const id_usuario = document.querySelector("#id_usuario").value;

    const datos = {
        nombre: document.querySelector("#nombre").value.trim(),
        apellido: document.querySelector("#apellido").value.trim(),
        correo: document.querySelector("#correo").value.trim(),
        telefono: document.querySelector("#telefono").value.trim(),
        estado: document.querySelector("#estado").value
    };

    if (!datos.nombre || !datos.apellido || !datos.correo || !datos.telefono) {
        Swal.fire("Faltan datos", "Por favor rellena todos los campos obligatorios.", "warning");
        return;
    }

    const action = id_cliente ? "update" : "insert";
    
    if (id_cliente) {
        datos.id_cliente = id_cliente;
        datos.id_usuario = id_usuario;
    }

    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Listo", id_cliente ? "Cliente actualizado" : "Cliente y Usuario creados con éxito", "success");
        clearForm();
        views();
        cargarClientes();
    } else {
        Swal.fire("Error", json.message || "No se pudo guardar", "error");
    }
}

async function eliminarCliente(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar cliente?",
        text: "¡No vas a poder revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_cliente", id_cliente: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Borrado", "El registro ha sido eliminado.", "success");
        cargarClientes();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

(function init() {
    cargarClientes();
    document.querySelector("#formContainer").innerHTML = form();
    wireEvents();
})();