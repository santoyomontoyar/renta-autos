import renderRenta from './renta/renders.js';
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
    cargarRentas();

    tbody.addEventListener("click", async (e) => {
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

async function cargarRentas() {
    const json = await post("getAll");
    if (json.status === "success") renderRenta(json.data);
}

const btnGuardar = document.getElementById("btnGuardar");
if (btnGuardar) {
    const params = new URLSearchParams(window.location.search);
    const id_renta = params.get("id"); // null = insertar, con valor = editar

    let listaVehiculos = [];
    let listaSeguros = [];
    let listaClientes = [];
    let listaReservas = [];
    let rentaOriginal = null;

    (async function init() {
        const catalogsJson = await post("getFormNeeds");
        if (catalogsJson.status !== "success") return;

        const catalogs = catalogsJson.data;
        listaVehiculos = catalogs.vehiculos;
        listaSeguros = catalogs.seguros;
        poblarSelects(catalogs);
        listaClientes = catalogs.clientes;

        const reservasJson = await post("getReservas");
if (reservasJson.status === "success") listaReservas = reservasJson.data;

const ahora = new Date();
ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
document.getElementById("fecha_inicio").min = ahora.toISOString().slice(0, 16);

document.getElementById("fecha_inicio").addEventListener("change", (e) => {
    document.getElementById("fecha_fin").min = e.target.value;
});


        if (id_renta) {
            const rentaJson = await post("getOne", { id_renta });
            if (rentaJson.status !== "success") {
                Swal.fire("Error", "No se pudo cargar la renta", "error").then(() => window.location.href = "index.html");
                return;
            }
            rentaOriginal = rentaJson.data;
            const clienteEncontrado = listaClientes.find(c => c.id_cliente == rentaOriginal.id_cliente);
if (clienteEncontrado) {
    document.getElementById("cliente_texto").value = `${clienteEncontrado.nombre} ${clienteEncontrado.apellido}`;
    document.getElementById("id_cliente").value = rentaOriginal.id_cliente;
}

const vehiculoEncontrado = listaVehiculos.find(v => v.id_vehiculo == rentaOriginal.id_vehiculo);
if (vehiculoEncontrado) {
    document.getElementById("vehiculo_texto").value = `${vehiculoEncontrado.marca} ${vehiculoEncontrado.nombre_modelo}`;
    actualizarPlacaCascada(listaVehiculos);
    document.getElementById("placa_texto").value = vehiculoEncontrado.placa;
    document.getElementById("id_vehiculo").value = rentaOriginal.id_vehiculo;
}
            document.getElementById("id_seguro").value = rentaOriginal.id_seguro;
            document.getElementById("id_sucursal_origen").value = rentaOriginal.id_sucursal_origen;
            document.getElementById("id_sucursal_destino").value = rentaOriginal.id_sucursal_destino;
            document.getElementById("fecha_inicio").value = rentaOriginal.fecha_inicio.replace(' ', 'T').slice(0, 16);
            document.getElementById("fecha_fin").value = rentaOriginal.fecha_fin.replace(' ', 'T').slice(0, 16);
            document.getElementById("monto_deposito").value = rentaOriginal.monto_deposito;
            document.getElementById("precio_cobrado").value = rentaOriginal.precio_cobrado;
        }

        ["id_seguro", "fecha_inicio", "fecha_fin"].forEach(id => {
    document.getElementById(id).addEventListener("change", () => calcularPrecioTotal(listaVehiculos, listaSeguros));
});
})();

    document.getElementById("cliente_texto").addEventListener("input", () => resolverCliente(listaClientes));
document.getElementById("vehiculo_texto").addEventListener("input", () => actualizarPlacaCascada(listaVehiculos));
document.getElementById("placa_texto").addEventListener("input", () => {
    resolverVehiculoPorPlaca(listaVehiculos);
    calcularPrecioTotal(listaVehiculos, listaSeguros);
});

    btnGuardar.addEventListener("click", async () => {
        const datos = {
            id_cliente: document.getElementById("id_cliente").value,
            id_vehiculo: document.getElementById("id_vehiculo").value,
            id_seguro: document.getElementById("id_seguro").value,
            id_sucursal_origen: document.getElementById("id_sucursal_origen").value,
            id_sucursal_destino: document.getElementById("id_sucursal_destino").value,
            fecha_inicio: document.getElementById("fecha_inicio").value,
            fecha_fin: document.getElementById("fecha_fin").value,
            monto_deposito: document.getElementById("monto_deposito").value,
            precio_cobrado: document.getElementById("precio_cobrado").value,
            estado_deposito: rentaOriginal ? rentaOriginal.estado_deposito : "Retenido",
            estado: rentaOriginal ? rentaOriginal.estado : "Activa"
        };

        if (Object.values(datos).some(v => v === "")) {
            Swal.fire("Faltan datos", "Rellena todos los parámetros requeridos antes de guardar", "warning");
            return;
        }

        if (hayConflictoReserva(listaReservas, datos.id_vehiculo, datos.fecha_inicio, datos.fecha_fin, id_renta)) {
    Swal.fire("Conflicto de fechas", "Ese vehículo ya está reservado en ese rango de fechas", "error");
    return;
}

        if (clienteTieneRentaActiva(listaReservas, datos.id_cliente, id_renta)) {
    Swal.fire("Cliente con renta activa", "Este cliente ya tiene una renta activa, no puede tener más de una", "error");
    return;
}

        if (id_renta) datos.id_renta = id_renta;
        const json = id_renta ? await post("update", { datos }) : await post("insert", { datos });

        if (json.status === "success") {
            await Swal.fire("Listo", json.message, "success");
            window.location.href = "index.html";
        } else {
            Swal.fire("Error", json.message, "error");
        }
    });
}