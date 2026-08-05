import form from './cargo_adicional/form.js';
import renderCargo, { renderPagination } from './cargo_adicional/renders.js';
import views, { clearForm } from './cargo_adicional/views.js';

let rentas = [];
let fallas = [];

let currentPage = 1;
const pageSizeSelect = document.querySelectorAll('.pageSize');
const paginationEl = document.querySelectorAll('.pagination');
const buscadorInput = document.querySelector('#buscador');
const ordenarPorSelect = document.querySelector('#ordenarPor');
const direccionSelect = document.querySelector('#direccionOrden');

let pageSize = Number(pageSizeSelect[0]?.value) || 20;
let sortColumn = ordenarPorSelect.value;
let sortDirection = direccionSelect.value;
let textoBusqueda = '';
let debounceTimer = null;

async function cargarCargos() {
    const res = await fetch("../php/cargo_adicional.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "getAll",
            page: currentPage,
            pageSize,
            sortColumn,
            sortDirection,
            search: textoBusqueda
        })
    });
    const json = await res.json();
    if (json.status !== "success") return;
 
    const totalItems = json.total;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
 
    if (currentPage > totalPages) {
        currentPage = totalPages;
        return cargarCargos();
    }
 
    renderCargo(json.data);
    renderPagination(totalItems, currentPage, pageSize);
}

async function cargarDatosRelacionales() {
    const resRentas = await fetch("../php/renta.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll", page: 1, pageSize: 1000 })
    });
    const jsonRentas = await resRentas.json();
    if (jsonRentas.status === "success") rentas = jsonRentas.data;

    const resFallas = await fetch("../php/cargo_adicional.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getFallas" })
    });
    const jsonFallas = await resFallas.json();
    if (jsonFallas.status === "success") fallas = jsonFallas.data;
}

function calcularMontoCliente() {
    const total = parseFloat(document.querySelector("#monto_total").value) || 0;
    const seguro = parseFloat(document.querySelector("#monto_seguro").value) || 0;
    const extraPagado = parseFloat(document.querySelector("#monto_extra_pagado").value) || 0;
    
    const selectRenta = document.querySelector("#id_renta");
    const optionSeleccionada = selectRenta.options[selectRenta.selectedIndex];
    const maxDeposito = optionSeleccionada ? (parseFloat(optionSeleccionada.dataset.deposito) || 0) : Infinity;
    
    const diferenciaBruta = Math.max(0, total - seguro);
    
    const clienteGarantia = Math.min(diferenciaBruta, maxDeposito);
    document.querySelector("#monto_cliente").value = clienteGarantia.toFixed(2);

    const devolucionGarantia = optionSeleccionada ? Math.max(0, maxDeposito - clienteGarantia) : 0;
    document.querySelector("#monto_devuelto").value = devolucionGarantia.toFixed(2);

    const saldoPendienteOriginal = diferenciaBruta - clienteGarantia;
    const saldoFinalReal = Math.max(0, saldoPendienteOriginal - extraPagado);

    const alerta = document.querySelector("#depositoAlerta");
    if (alerta) {
        if (saldoFinalReal > 0) {
            alerta.className = "text-xs text-error mt-2 block font-semibold";
            alerta.innerHTML = `⚠️ El daño excede el depósito. Saldo pendiente neto por pagar en caja: **$${saldoFinalReal.toFixed(2)}**.`;
        } else if (devolucionGarantia > 0) {
            alerta.className = "text-xs text-teal-600 mt-2 block font-semibold";
            alerta.innerHTML = `💸 ¡Garantía con saldo a favor! Se deben devolver **$${devolucionGarantia.toFixed(2)}** del depósito al cliente.`;
        } else if (saldoPendienteOriginal > 0 && saldoFinalReal === 0) {
            alerta.className = "text-xs text-success mt-2 block font-semibold";
            alerta.innerHTML = `✅ ¡Excedente cubierto! El cliente liquidó los $${extraPagado.toFixed(2)} restantes en sucursal.`;
        } else {
            alerta.classList.add("hidden");
        }
    }
}

function wireEvents() {
    document.querySelector("#addBtn").addEventListener("click", () => {
        clearForm();
        const alerta = document.querySelector("#depositoAlerta");
        if (alerta) alerta.classList.add("hidden");
        views();
    });

    document.querySelector("#tablaCargos").addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (e.target.classList.contains("editBtn")) editarCargo(id);
        if (e.target.classList.contains("deleteBtn")) eliminarCargo(id);
    });

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarCargo();
    });

    document.querySelector("#formContainer").addEventListener("input", (e) => {
        if (["monto_total", "monto_seguro", "monto_extra_pagado"].includes(e.target.id)) {
            calcularMontoCliente();
        }
    });

    document.querySelector("#formContainer").addEventListener("change", (e) => {
        if (e.target.id === "id_renta") {
            calcularMontoCliente();
        }
    });
}

    ordenarPorSelect.addEventListener('change', (e) => {
    sortColumn = e.target.value;
    currentPage = 1;
    cargarCargos();
});

direccionSelect.addEventListener('change', (e) => {
    sortDirection = e.target.value;
    currentPage = 1;
    cargarCargos();
});

    pageSizeSelect.forEach(select => {
        select.addEventListener('change', (e) => {
            pageSize = Number(e.target.value);
            currentPage = 1;
            pageSizeSelect.forEach(s => s.value = pageSize);
            cargarCargos();
        });
    });

    paginationEl.forEach(el => {
        el.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-page]');
            if (!btn || btn.disabled) return;
            currentPage = Number(btn.dataset.page);
            cargarCargos();
        });
    });

    buscadorInput.addEventListener('input', (e) => {
        textoBusqueda = e.target.value.trim();
        currentPage = 1;
        cargarCargos();
    });


async function editarCargo(id) {
    const res = await fetch("../php/cargo_adicional.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getOne", id_cargo: id })
    });
    const json = await res.json();
    if (json.status === "success") {
        const c = json.data;
        
        clearForm();
        views();

        document.querySelector("#id_cargo").value = c.id_cargo;
        document.querySelector("#id_renta").value = c.id_renta;
        document.querySelector("#id_falla").value = c.id_falla;
        document.querySelector("#descripcion").value = c.descripcion;
        document.querySelector("#monto_total").value = c.monto_total;
        document.querySelector("#monto_seguro").value = c.monto_seguro;
        document.querySelector("#monto_cliente").value = c.monto_cliente;
        document.querySelector("#monto_devuelto").value = c.monto_devuelto;
        document.querySelector("#monto_extra_pagado").value = c.monto_extra_pagado;
        
        calcularMontoCliente();
    }
}

async function guardarCargo() {
    const id_cargo = document.querySelector("#id_cargo").value;
    
    const datos = {
        id_renta: document.querySelector("#id_renta").value,
        id_falla: document.querySelector("#id_falla").value,
        descripcion: document.querySelector("#descripcion").value.trim(),
        monto_total: document.querySelector("#monto_total").value,
        monto_seguro: document.querySelector("#monto_seguro").value || 0,
        monto_cliente: document.querySelector("#monto_cliente").value || 0,
        monto_devuelto: document.querySelector("#monto_devuelto").value || 0,
        monto_extra_pagado: document.querySelector("#monto_extra_pagado").value || 0
    };

    if (!datos.id_renta || !datos.id_falla || !datos.descripcion || !datos.monto_total) {
        Swal.fire("Faltan datos", "Por favor completa los campos obligatorios.", "warning");
        return;
    }

    const action = id_cargo ? "update" : "insert";
    if (id_cargo) datos.id_cargo = id_cargo;

    const res = await fetch("../php/cargo_adicional.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...datos })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Guardado", id_cargo ? "Cargo actualizado" : "Cargo registrado con éxito", "success");
        clearForm();
        views();
        cargarCargos();
    } else {
        Swal.fire("Error", json.message || "No se pudo guardar", "error");
    }
}

async function eliminarCargo(id) {
    const confirmacion = await Swal.fire({
        title: "¿Eliminar este cargo?",
        text: "¡Esta acción no se puede deshacer!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar"
    });
    if (!confirmacion.isConfirmed) return;

    const res = await fetch("../php/cargo_adicional.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id_cargo: id })
    });
    const json = await res.json();

    if (json.status === "success") {
        Swal.fire("Eliminado", "El cargo fue removido con éxito.", "success");
        cargarCargos();
    } else {
        Swal.fire("Error", "No se pudo eliminar el registro.", "error");
    }
}

(async function init() {
    await cargarDatosRelacionales();
    await cargarCargos();
    document.querySelector("#formContainer").innerHTML = form(rentas, fallas);
    wireEvents();
})();