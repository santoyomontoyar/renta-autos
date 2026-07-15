import form from './vehiculo/form.js';
import renderVehiculo from './vehiculo/renders.js';
import views, { clearForm } from './vehiculo/views.js';

let modelos = [];
let sucursales = [];

async function cargarVehiculos() {
    const res = await fetch("../php/vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") renderVehiculo(json.data);
}

async function cargarModelos() {
    const res = await fetch("../php/modelo_vehiculo.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") modelos = json.data;
}

async function cargarSucursales() {
    const res = await fetch("../php/sucursal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") sucursales = json.data;
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

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarVehiculo();
    });

    document.querySelector("#formContainer").addEventListener("input", (e) => {
    if (["marca", "nombre_modelo"].includes(e.target.id)) actualizarCascada();
    if (["marca", "nombre_modelo", "year"].includes(e.target.id)) resolverModelo();
    });
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

(async function init() {
    await Promise.all([cargarModelos(), cargarSucursales(), cargarVehiculos()]);
    document.querySelector("#formContainer").innerHTML = form(modelos, sucursales);
    wireEvents();
})();

function resolverModelo() {
    const marca = document.querySelector("#marca").value.trim();
    const nombre_modelo = document.querySelector("#nombre_modelo").value.trim();
    const year = document.querySelector("#year").value.trim();
    const hint = document.querySelector("#modeloHint");

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

    if (!marca) {
        nombreModeloInput.disabled = true;
        yearInput.disabled = true;
        modeloListEl.innerHTML = '';
        yearListEl.innerHTML = '';
        return;
    }

    nombreModeloInput.disabled = false;
    const modelosDeMarca = modelos.filter(m => m.marca.toLowerCase() === marca.toLowerCase());
    modeloListEl.innerHTML = [...new Set(modelosDeMarca.map(m => m.nombre_modelo))]
        .map(n => `<option value="${n}">`).join('');

    const nombreModelo = nombreModeloInput.value.trim();
    if (!nombreModelo) {
        yearInput.disabled = true;
        yearListEl.innerHTML = '';
        return;
    }

    yearInput.disabled = false;
    const modelosDeMarcaYModelo = modelosDeMarca.filter(m => m.nombre_modelo.toLowerCase() === nombreModelo.toLowerCase());
    yearListEl.innerHTML = [...new Set(modelosDeMarcaYModelo.map(m => m.year))]
        .map(y => `<option value="${y}">`).join('');
}