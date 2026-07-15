import form from './cliente/form.js';
import renderCliente from './cliente/renders.js';
import views, { clearForm } from './cliente/views.js';

async function cargarClientes() {
    const res = await fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    });
    const json = await res.json();
    if (json.status === "success") renderCliente(json.data);
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