import form from './documento_cliente/form.js';
import renderDocumento from './documento_cliente/renders.js';
import views, { clearForm } from './documento_cliente/views.js';

let clientes = [];
let currentPage = 1;
let currentOrderBy = 'd.id_documento';
let currentOrderDir = 'ASC';
let currentTipoPriority = 'INE_PRIMERO';

async function cargarDocumentos() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-gray-400">Cargando registros...</td></tr>`;

    try {
        const res = await fetch("../php/documento_cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "getAll", 
                page: currentPage,
                order_by: currentOrderBy,
                order_dir: currentOrderDir,
                tipo_prioridad: currentTipoPriority
            })
        });
        const json = await res.json();

        if (json.status === "success") {
            renderDocumento(json.data);
            renderPagination(json.pagination);
        } else {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-4">Error al cargar documentos.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-4">Error de conexión.</td></tr>`;
    }
}

function renderPagination(p) {
    const container = document.querySelector("#paginationControls");
    const info = document.querySelector("#pageInfo");

    if (!container || !info) return;

    if (!p || p.totalRows === 0) {
        info.textContent = "No hay documentos registrados";
        container.innerHTML = "";
        return;
    }

    const start = (p.page - 1) * p.limit + 1;
    const end = Math.min(p.page * p.limit, p.totalRows);
    info.textContent = `Mostrando ${start} a ${end} de ${p.totalRows} documentos`;

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

async function cargarClientesForSelect() {
    try {
        const res = await fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll", page: 1 })
        });
        const json = await res.json();
        if (json.status === "success") {
            clientes = json.data;
            const formContainer = document.querySelector("#formContainer");
            if (formContainer) {
                formContainer.innerHTML = form(clientes);
            }
        }
    } catch (e) {
        console.warn("No se pudieron cargar clientes para el select:", e);
    }
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tablaDocumentos").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarDocumento(id);
        if (e.target.classList.contains("deleteBtn")) eliminarDocumento(id);
    });

    const formContainer = document.querySelector("#formContainer");
    if (formContainer) {
        formContainer.addEventListener("click", (e) => {
            if (e.target.id === "listBtn") views();
            if (e.target.id === "saveBtn") guardarDocumento();
        });
    }

    // Escuchadores de Filtro y Ordenamiento
    document.querySelector("#orderBySelect").addEventListener("change", (e) => {
        currentOrderBy = e.target.value;
        currentPage = 1;

        const dirContainer = document.querySelector("#dirContainer");
        const tipoContainer = document.querySelector("#tipoGroupContainer");

        if (currentOrderBy === 'tipo_prioridad') {
            dirContainer.classList.add("hidden");
            tipoContainer.classList.remove("hidden");
        } else {
            dirContainer.classList.remove("hidden");
            tipoContainer.classList.add("hidden");
        }

        cargarDocumentos();
    });

    document.querySelector("#orderDirSelect").addEventListener("change", (e) => {
        currentOrderDir = e.target.value;
        currentPage = 1;
        cargarDocumentos();
    });

    document.querySelector("#tipoPrioritySelect").addEventListener("change", (e) => {
        currentTipoPriority = e.target.value;
        currentPage = 1;
        cargarDocumentos();
    });

    // Evento de Paginación
    const paginationControls = document.querySelector("#paginationControls");
    if (paginationControls) {
        paginationControls.addEventListener("click", (e) => {
            const pageBtn = e.target.closest(".pageBtn");
            const prevBtn = e.target.closest("#prevPageBtn");
            const nextBtn = e.target.closest("#nextPageBtn");

            if (pageBtn) {
                currentPage = parseInt(pageBtn.dataset.page);
                cargarDocumentos();
            } else if (prevBtn && currentPage > 1) {
                currentPage--;
                cargarDocumentos();
            } else if (nextBtn) {
                currentPage++;
                cargarDocumentos();
            }
        });
    }
}

async function editarDocumento(id) {
    const res = await fetch("../php/documento_cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getById", id_documento: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const d = json.data;
        
        clearForm();
        views();

        document.querySelector("#id_documento").value = d.id_documento;
        document.querySelector("#id_cliente").value = d.id_cliente;
        document.querySelector("#tipo_documento").value = d.tipo_documento;
        document.querySelector("#numero_documento").value = d.numero_documento;
        document.querySelector("#fecha_vencimiento").value = d.fecha_vencimiento;
    }
}

async function guardarDocumento() {
    const id_documento = document.querySelector("#id_documento").value;
    
    const datos = {
        id_cliente: document.querySelector("#id_cliente").value,
        tipo_documento: document.querySelector("#tipo_documento").value,
        numero_documento: document.querySelector("#numero_documento").value.trim(),
        fecha_vencimiento: document.querySelector("#fecha_vencimiento").value,
        url_archivo: "" 
    };

    if (!datos.id_cliente || !datos.numero_documento || !datos.fecha_vencimiento) {
        Swal.fire("Faltan datos", "Por favor completa todos los campos del formulario.", "warning");
        return;
    }

    const action = id_documento ? "update" : "insert";
    if (id_documento) datos.id_documento = id_documento;

    const res = await fetch("../php/documento_cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Guardado", id_documento ? "Documento actualizado" : "Documento registrado con éxito", "success");
        clearForm();
        views();
        cargarDocumentos();
    } else {
        Swal.fire("Error", json.message || "No se pudo guardar la información", "error");
    }
}

async function eliminarDocumento(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar documento?",
        text: "Esta acción borrará permanentemente el registro.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/documento_cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_documento: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Eliminado", "El documento fue removido.", "success");
        cargarDocumentos();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

(function init() {
    cargarDocumentos();
    cargarClientesForSelect();
    wireEvents();
})();