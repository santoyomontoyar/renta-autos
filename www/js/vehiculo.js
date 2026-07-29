import form from './vehiculo/form.js';
import renderVehiculo from './vehiculo/renders.js';
import views, { clearForm } from './vehiculo/views.js';

let modelos = [];
let sucursales = [];
let currentPage = 1;
let currentOrderBy = 'v.id_vehiculo';
let currentOrderDir = 'ASC';
let currentEstadoPriority = 'DISPONIBLE_PRIMERO';

async function cargarVehiculos() {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-gray-400">Cargando registros...</td></tr>`;

    try {
        const res = await fetch("../php/vehiculo.php", {
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
            renderVehiculo(json.data);
            renderPagination(json.pagination);
        } else {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center text-red-500 py-4">Error al cargar vehículos.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-red-500 py-4">Error de conexión.</td></tr>`;
    }
}

function renderPagination(p) {
    const container = document.querySelector("#paginationControls");
    const info = document.querySelector("#pageInfo");

    if (!container || !info) return;

    if (!p || p.totalRows === 0) {
        info.textContent = "No hay vehículos registrados";
        container.innerHTML = "";
        return;
    }

    const start = (p.page - 1) * p.limit + 1;
    const end = Math.min(p.page * p.limit, p.totalRows);
    info.textContent = `Mostrando ${start} a ${end} de ${p.totalRows} vehículos`;

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

async function cargarModelos() {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        });
        const json = await res.json();
        if (json.status === "success") modelos = json.data;
    } catch (e) {
        console.warn("No se pudieron cargar los modelos:", e);
    }
}

async function cargarSucursales() {
    try {
        const res = await fetch("../php/sucursal.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        });
        const json = await res.json();
        if (json.status === "success") sucursales = json.data;
    } catch (e) {
        console.warn("No se pudieron cargar las sucursales:", e);
    }
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        views();
    });

    document.querySelector("#tablaVehiculos").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarVehiculo(id);
        if (e.target.classList.contains("deleteBtn")) eliminarVehiculo(id);
    });

    const formContainer = document.querySelector("#formContainer");
    if (formContainer) {
        formContainer.addEventListener("click", (e) => {
            if (e.target.id === "listBtn") views();
            if (e.target.id === "saveBtn") guardarVehiculo();
        });

        formContainer.addEventListener("input", (e) => {
            if (["marca", "nombre_modelo"].includes(e.target.id)) actualizarCascada();
            if (["marca", "nombre_modelo", "year"].includes(e.target.id)) resolverModelo();
        });
    }

    // Escuchadores de Filtro y Ordenamiento
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

        cargarVehiculos();
    });

    document.querySelector("#orderDirSelect").addEventListener("change", (e) => {
        currentOrderDir = e.target.value;
        currentPage = 1;
        cargarVehiculos();
    });

    document.querySelector("#estadoPrioritySelect").addEventListener("change", (e) => {
        currentEstadoPriority = e.target.value;
        currentPage = 1;
        cargarVehiculos();
    });

    // Paginación
    const paginationControls = document.querySelector("#paginationControls");
    if (paginationControls) {
        paginationControls.addEventListener("click", (e) => {
            const pageBtn = e.target.closest(".pageBtn");
            const prevBtn = e.target.closest("#prevPageBtn");
            const nextBtn = e.target.closest("#nextPageBtn");

            if (pageBtn) {
                currentPage = parseInt(pageBtn.dataset.page);
                cargarVehiculos();
            } else if (prevBtn && currentPage > 1) {
                currentPage--;
                cargarVehiculos();
            } else if (nextBtn) {
                currentPage++;
                cargarVehiculos();
            }
        });
    }
}

async function editarVehiculo(id) {
    const res = await fetch("../php/vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getOne", id_vehiculo: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const v = json.data;
        document.querySelector("#id_vehiculo").value = v.id_vehiculo;
        document.querySelector("#id_modelo").value = v.id_modelo;
        document.querySelector("#id_sucursal_actual").value = v.id_sucursal_actual;
        document.querySelector("#placa").value = v.placa;
        document.querySelector("#transmision").value = v.transmision;
        document.querySelector("#estado").value = v.estado;
        views();
        document.querySelector("#marca").value = v.marca;
        document.querySelector("#nombre_modelo").value = v.nombre_modelo;
        document.querySelector("#year").value = v.year;

        actualizarCascada();
        document.querySelector("#year").disabled = false;
    }
}

async function guardarVehiculo() {
    const id_vehiculo = document.querySelector("#id_vehiculo").value;
    const id_modelo = document.querySelector("#id_modelo").value;
    const datos = {
        id_modelo,
        id_sucursal_actual: document.querySelector("#id_sucursal_actual").value,
        placa: document.querySelector("#placa").value,
        transmision: document.querySelector("#transmision").value,
        estado: document.querySelector("#estado").value
    };

    if (!id_modelo || !datos.id_sucursal_actual || !datos.placa) {
        Swal.fire("Faltan datos", "Verifica que marca/modelo/año coincidan con un modelo existente, y completa los demás campos", "warning");
        return;
    }

    const action = id_vehiculo ? "update" : "insert";
    if (id_vehiculo) datos.id_vehiculo = id_vehiculo;

    const res = await fetch("../php/vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Listo", id_vehiculo ? "Vehículo actualizado" : "Vehículo insertado", "success");
        clearForm();
        views();
        cargarVehiculos();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

async function eliminarVehiculo(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar vehículo?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_vehiculo: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Eliminado", "El vehículo fue eliminado", "success");
        cargarVehiculos();
    } else {
        Swal.fire("Error", json.message, "error");
    }
}

function resolverModelo() {
    const marca = document.querySelector("#marca").value.trim();
    const nombre_modelo = document.querySelector("#nombre_modelo").value.trim();
    const year = document.querySelector("#year").value.trim();
    const hint = document.querySelector("#modeloHint");

    if (!hint) return;

    const encontrado = modelos.find(m =>
        m.marca.toLowerCase() === marca.toLowerCase() &&
        m.nombre_modelo.toLowerCase() === nombre_modelo.toLowerCase() &&
        String(m.year) === year
    );

    if (encontrado) {
        document.querySelector("#id_modelo").value = encontrado.id_modelo;
        hint.textContent = `✓ ${encontrado.categoria} - $${encontrado.costo_diario}/día`;
        hint.className = "text-xs mb-3 text-green-600";
    } else {
        document.querySelector("#id_modelo").value = '';
        hint.textContent = (marca || nombre_modelo || year) ? "Ese modelo no existe (marca/modelo/año deben coincidir exacto)" : '';
        hint.className = "text-xs mb-3 text-red-500";
    }
}

function actualizarCascada() {
    const marca = document.querySelector("#marca").value.trim();
    const nombreModeloInput = document.querySelector("#nombre_modelo");
    const yearInput = document.querySelector("#year");
    const modeloListEl = document.querySelector("#modeloList");
    const yearListEl = document.querySelector("#yearList");

    if (!nombreModeloInput || !yearInput) return;

    if (!marca) {
        nombreModeloInput.disabled = true;
        yearInput.disabled = true;
        if (modeloListEl) modeloListEl.innerHTML = '';
        if (yearListEl) yearListEl.innerHTML = '';
        return;
    }

    nombreModeloInput.disabled = false;
    const modelosDeMarca = modelos.filter(m => m.marca.toLowerCase() === marca.toLowerCase());
    if (modeloListEl) {
        modeloListEl.innerHTML = [...new Set(modelosDeMarca.map(m => m.nombre_modelo))]
            .map(n => `<option value="${n}">`).join('');
    }

    const nombreModelo = nombreModeloInput.value.trim();
    if (!nombreModelo) {
        yearInput.disabled = true;
        if (yearListEl) yearListEl.innerHTML = '';
        return;
    }

    yearInput.disabled = false;
    const modelosDeMarcaYModelo = modelosDeMarca.filter(m => m.nombre_modelo.toLowerCase() === nombreModelo.toLowerCase());
    if (yearListEl) {
        yearListEl.innerHTML = [...new Set(modelosDeMarcaYModelo.map(m => m.year))]
            .map(y => `<option value="${y}">`).join('');
    }
}

(async function init() {
    cargarVehiculos();
    await Promise.all([cargarModelos(), cargarSucursales()]);
    const formContainer = document.querySelector("#formContainer");
    if (formContainer) {
        formContainer.innerHTML = form(modelos, sucursales);
    }
    wireEvents();
})();