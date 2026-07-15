import form from './documento_cliente/form.js';
import renderDocumento from './documento_cliente/renders.js';
import views, { clearForm } from './documento_cliente/views.js';

let clientes = [];

async function cargarDocumentos() {
    const res = await fetch("../php/documento_cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") renderDocumento(json.data);
}

async function cargarClientes() {
    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") clientes = json.data;
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

    document.querySelector("#formContainer").addEventListener("click", (e) => {
        if (e.target.id === "listBtn") views();
        if (e.target.id === "saveBtn") guardarDocumento();
    });
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

(async function init() {
    await Promise.all([cargarClientes(), cargarDocumentos()]);
    document.querySelector("#formContainer").innerHTML = form(clientes);
    wireEvents();
})();