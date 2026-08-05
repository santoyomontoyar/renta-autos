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

        if (currentPage > totalPages) {
            currentPage = totalPages;
            return cargarRentas();
        }

        const puedeEditar = window.esAdmin();
        renderRenta(json.data, puedeEditar);
        renderPagination(totalItems, currentPage, pageSize);
    }

    // Se espera a que session.js confirme el rol antes de pedir datos, para
    // poder mostrar u ocultar las acciones de edición desde el primer render.
    // Si el evento ya se disparó antes de llegar aquí, lo cachamos revisando
    // window.currentUser en vez de quedarnos esperando un evento que ya pasó.
    if (window.currentUser) {
        cargarRentas();
    } else {
        document.addEventListener("sesionLista", cargarRentas);
    }

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

const formNuevaRenta = document.querySelector("#formnuevarenta");
if (formNuevaRenta) {
    let clientes = [];
    let vehiculos = [];
    let seguros = [];
    let reservas = [];

    async function iniciarFormulario() {
        const necesita = await post("getFormNeeds");
        if (necesita.status === "success") {
            clientes = necesita.data.clientes;
            vehiculos = necesita.data.vehiculos;
            seguros = necesita.data.seguros;
            poblarSelects(necesita.data);
        }

        const reservasResp = await post("getReservas");
        if (reservasResp.status === "success") {
            reservas = reservasResp.data;
        }

        // Un Cliente siempre renta a su propio nombre: no tiene sentido
        // dejarle elegir cliente (y el servidor lo ignoraría de todas formas,
        // ver renta.php case 'insert').
        if (!window.esAdmin()) {
            document.querySelector("#cliente_texto")?.closest("div")?.classList.add("hidden");
        }
    }

    document.querySelector("#cliente_texto")?.addEventListener("input", () => resolverCliente(clientes));

    document.querySelector("#vehiculo_texto")?.addEventListener("input", () => {
        actualizarPlacaCascada(vehiculos);
        calcularPrecioTotal(vehiculos, seguros);
    });

    document.querySelector("#placa_texto")?.addEventListener("input", () => {
        resolverVehiculoPorPlaca(vehiculos);
        calcularPrecioTotal(vehiculos, seguros);
    });

    ["#id_seguro", "#fecha_inicio", "#fecha_fin"].forEach(sel => {
        document.querySelector(sel)?.addEventListener("change", () => calcularPrecioTotal(vehiculos, seguros));
    });

    document.querySelector("#btnGuardar")?.addEventListener("click", async () => {
        const id_vehiculo = document.querySelector("#id_vehiculo").value;
        const id_seguro = document.querySelector("#id_seguro").value;
        const id_sucursal_origen = document.querySelector("#id_sucursal_origen").value;
        const id_sucursal_destino = document.querySelector("#id_sucursal_destino").value;
        const fecha_inicio = document.querySelector("#fecha_inicio").value;
        const fecha_fin = document.querySelector("#fecha_fin").value;
        const monto_deposito = document.querySelector("#monto_deposito").value;
        const precio_cobrado = document.querySelector("#precio_cobrado").value;

        if (!id_vehiculo || !id_seguro || !id_sucursal_origen || !id_sucursal_destino || !fecha_inicio || !fecha_fin || !monto_deposito) {
            Swal.fire("Faltan datos", "Completa todos los campos del formulario.", "warning");
            return;
        }

        if (window.esAdmin()) {
            const id_cliente = document.querySelector("#id_cliente").value;
            if (!id_cliente) {
                Swal.fire("Falta el cliente", "Escribe un nombre de cliente que exista.", "warning");
                return;
            }
            if (clienteTieneRentaActiva(reservas, id_cliente)) {
                Swal.fire("Cliente con renta activa", "Ese cliente ya tiene una renta sin finalizar.", "warning");
                return;
            }
        }

        if (hayConflictoReserva(reservas, id_vehiculo, fecha_inicio, fecha_fin)) {
            Swal.fire("Vehículo no disponible", "Ese vehículo ya está reservado en esas fechas.", "warning");
            return;
        }

        const datos = {
            id_vehiculo, id_seguro, id_sucursal_origen, id_sucursal_destino,
            fecha_inicio, fecha_fin, monto_deposito,
            precio_cobrado,
            estado_deposito: "Retenido",
            estado: "Activa"
        };
        if (window.esAdmin()) {
            datos.id_cliente = document.querySelector("#id_cliente").value;
        }

        const json = await post("insert", { datos });
        if (json.status === "success") {
            await Swal.fire("Listo", json.message, "success");
            window.location.href = "index.html";
        } else {
            Swal.fire("Error", json.message, "error");
        }
    });

    if (window.currentUser) {
        iniciarFormulario();
    } else {
        document.addEventListener("sesionLista", iniciarFormulario);
    }
}