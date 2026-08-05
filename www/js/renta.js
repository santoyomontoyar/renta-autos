import renderRenta, { renderPagination } from './renta/renders.js';
import { poblarSelects, calcularPrecioTotal, resolverCliente, actualizarPlacaCascada, resolverVehiculoPorPlaca, hayConflictoReserva, clienteTieneRentaActiva } from './renta/catalogos.js';

async function post(action, extra = {}) {
    const res = await fetch("../php/renta.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

const tbody = document.querySelector("#tbody");
if (tbody) {
    const pageSizeSelect = document.querySelectorAll('.pageSize');
    const paginationEl = document.querySelectorAll('.pagination');
    const buscadorInput = document.querySelector('#buscador');
    const ordenarPorSelect = document.querySelector('#ordenarPor');
    const direccionSelect = document.querySelector('#direccionOrden');

  let currentPage = 1;
    let pageSize = Number(pageSizeSelect[0]?.value) || 10;
    let sortColumn = ordenarPorSelect.value;
    let sortDirection = direccionSelect.value;
    let textoBusqueda = '';
    let debounceTimer = null;

    async function cargarRentas() {
        const json = await post("getAll", {
            page: currentPage,
            pageSize,
            sortColumn,
            sortDirection,
            search: textoBusqueda
        });

    if (json.status !== "success") return; 

    const totalItems = json.total;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize)); 

if ( currentPage > totalPages) {
    currentPage = totalPages; 
    return cargarRentas();
}

renderRenta(json.data);
renderPagination(totalItems, currentPage, pageSize);

}

cargarRentas();

ordenarPorSelect.addEventListener('change', (e) => {
    sortColumn = e.target.value;
    currentPage = 1;
    cargarRentas();
});

direccionSelect.addEventListener('change', (e) => {
    sortDirection = e.target.value;
    currentPage = 1;
    cargarRentas();
});

pageSizeSelect.forEach(select => {
    select.addEventListener('change', (e) => {
        pageSize = Number(e.target.value);
        currentPage = 1;
        pageSizeSelect.forEach(s => s.value = pageSize);
        cargarRentas();
    });
});

paginationEl.forEach(el => {    
    el.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-page]');
        if (!btn || btn.disabled) return;
        currentPage = Number(btn.dataset.page);
        cargarRentas();
    });
});   

buscadorInput.addEventListener('input', (e) => {
    textoBusqueda = e.target.value.trim();
    currentPage = 1;
    cargarRentas();
});

tbody.addEventListener('click', async (e) => {
    if (!e.target.classList.contains("deleteBtn")) return;
        const id = e.target.dataset.id;

        const confirmacion = await Swal.fire({
            title: "¿Eliminar renta?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });
        if (!confirmacion.isConfirmed) return;

        const json = await post("delete", { id_renta: id });
        if (json.status === "success") {
            Swal.fire("Eliminada", json.message, "success");
            cargarRentas();
        } else {
            Swal.fire("Error", json.message, "error");
        }
    });
}

