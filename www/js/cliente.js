import form from './cliente/form.js';
import renderCliente from './cliente/renders.js';
import views, { clearForm } from './cliente/views.js';

let usuarios = [];
let currentPage = 1;
let searchTimeout = null;

async function cargarClientes() {
    const tbody = document.querySelector("#tbody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-gray-400">Cargando registros...</td></tr>`;

    try {
        const res = await fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "getAll", 
                page: currentPage,
                search: document.querySelector("#searchInput")?.value.trim() || '',
                order_by: document.querySelector("#orderBySelect")?.value || 'c.id_cliente',
                order_dir: document.querySelector("#orderDirSelect")?.value || 'ASC',
                estado_prioridad: document.querySelector("#estadoPrioritySelect")?.value || 'ACTIVO_PRIMERO'
            })
        });
        const json = await res.json();

        if (json.status === "success") {
            renderCliente(json.data);
            renderPagination(json.pagination);
        } else {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-4">Error al cargar clientes.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-4">Error de conexión.</td></tr>`;
    }
}

function renderPagination(p) {
    const container = document.querySelector("#paginationControls");
    const info = document.querySelector("#pageInfo");

    if (!container || !info) return;

    if (!p || p.totalRows === 0) {
        info.textContent = "No se encontraron clientes";
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
        }
    }

    html += `<button class="join-item btn btn-sm ${p.page >= p.totalPages ? 'btn-disabled' : ''}" id="nextPageBtn">Siguiente »</button>`;

    container.innerHTML = html;
}

async function cargarUsuariosForSelect() {
    try {
        const res = await fetch("../php/user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll", page: 1 })
        });
        const json = await res.json();
        if (json.status === "success") {
            usuarios = json.data;
            const formContainer = document.querySelector("#formContainer");
            if (formContainer) {
                formContainer.innerHTML = form(usuarios);
            }
        }
    } catch (e) {
        console.warn("No se pudieron cargar usuarios para el select:", e);
    }
}

function wireEvents() {
    document.querySelector("#addBtn")?.addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tablaClientes")?.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarCliente(id);
        if (e.target.classList.contains("deleteBtn")) eliminarCliente(id);
    });

    const formContainer = document.querySelector("#formContainer");
    if (formContainer) {
        formContainer.addEventListener("click", (e) => {
            if (e.target.id === "listBtn") views();
            if (e.target.id === "saveBtn") guardarCliente();
        });
    }

    
    document.querySelector("#searchInput")?.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            cargarClientes();
        }, 300);
    });

    
    ['#orderBySelect', '#orderDirSelect', '#estadoPrioritySelect'].forEach(sel => {
        document.querySelector(sel)?.addEventListener("change", (e) => {
            if (sel === '#orderBySelect') {
                const isPriority = e.target.value === 'estado_prioridad';
                document.querySelector("#dirContainer")?.classList.toggle("hidden", isPriority);
                document.querySelector("#estadoGroupContainer")?.classList.toggle("hidden", !isPriority);
            }
            currentPage = 1;
            cargarClientes();
        });
    });

    
    const paginationControls = document.querySelector("#paginationControls");
    if (paginationControls) {
        paginationControls.addEventListener("click", (e) => {
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
}

async function editarCliente(id) {
    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getById", id_cliente: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const c = json.data;
        
        clearForm();
        views();

        document.querySelector("#id_cliente").value = c.id_cliente;
        document.querySelector("#id_usuario").value = c.id_usuario;
        document.querySelector("#licencia_conducir").value = c.licencia_conducir;
        document.querySelector("#fecha_vencimiento_licencia").value = c.fecha_vencimiento_licencia;
    }
}

async function guardarCliente() {
    const id_cliente = document.querySelector("#id_cliente").value;
    
    const datos = {
        id_usuario: document.querySelector("#id_usuario").value,
        licencia_conducir: document.querySelector("#licencia_conducir").value.trim(),
        fecha_vencimiento_licencia: document.querySelector("#fecha_vencimiento_licencia").value
    };

    if (!datos.id_usuario || !datos.licencia_conducir || !datos.fecha_vencimiento_licencia) {
        Swal.fire("Faltan datos", "Por favor completa todos los campos del formulario.", "warning");
        return;
    }

    const action = id_cliente ? "update" : "insert";
    if (id_cliente) datos.id_cliente = id_cliente;

    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Guardado", id_cliente ? "Cliente actualizado" : "Cliente registrado con éxito", "success");
        clearForm();
        views();
        cargarClientes();
    } else {
        Swal.fire("Error", json.message || "No se pudo guardar la información", "error");
    }
}

async function eliminarCliente(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar cliente?",
        text: "Esta acción borrará permanentemente el registro.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_cliente: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Eliminado", "El cliente fue removido.", "success");
        cargarClientes();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

(function init() {
    cargarClientes();
    cargarUsuariosForSelect();
    wireEvents();
})();