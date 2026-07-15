import renderUsuarios from './user/renders.js';

const btnGuardar = document.querySelector("#btnGuardar");
const btnActualizar = document.querySelector("#btnActualizar");
const tbody = document.querySelector("#tbody");

async function post(action, extra = {}) {
    const res = await fetch("../php/user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra })
    });
    return res.json();
}

async function cargarRoles(selectEl) {
    const json = await post("getAllRoles");
    if (json.status === "success") {
        selectEl.innerHTML = json.data.map(r => `<option value="${r.id_rol}">${r.nombre}</option>`).join('');
    }
}

// Listado
async function cargarUsuarios() {
    const json = await post("getAll");
    if (json.status === "success") renderUsuarios(json.data);
}

if (tbody) {
    cargarUsuarios();

    tbody.addEventListener("click", function (evento) {
        if (!evento.target.matches(".btn-error")) return;
        evento.preventDefault();
        const id = evento.target.getAttribute("data-id");

        Swal.fire({
            title: "¿Estás seguro de eliminar este registro?",
            text: "No vas a poder revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar"
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const json = await post("delete", { id });
            const response = json.status === "success"
                ? { title: "Borrado", text: "Tu registro ha sido eliminado.", icon: "success" }
                : { title: "Error", text: "No se pudo eliminar el registro.", icon: "error" };

            Swal.fire(response);
            cargarUsuarios();
        });
    });
}

// INsert
if (btnGuardar) {
    const Nombre = document.querySelector("#Nombre");
    const Apellido = document.querySelector("#Apellido");
    const Correo = document.querySelector("#Correo");
    const telefono = document.querySelector("#telefono");
    const Estado = document.querySelector("#Estado");
    const Rol = document.querySelector("#Rol");
    const btnCancelar = document.querySelector("#btnCancelar");

    cargarRoles(Rol);

    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();
        const json = await post("insert", {
            name: Nombre.value,
            lastname: Apellido.value,
            email: Correo.value,
            phone: telefono.value,
            status: Estado.value,
            role: Rol.value
        });

        if (json.status === "success") {
            await Swal.fire("Listo", "Usuario registrado", "success");
            window.location.href = "index.html";
        } else {
            Swal.fire("Error", json.message || "No se pudo guardar el usuario", "error");
        }
    });

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => window.location.href = "index.html");
    }
}

// Edutar
if (btnActualizar) {
    const Nombre = document.querySelector("#Nombre");
    const Apellido = document.querySelector("#Apellido");
    const Correo = document.querySelector("#Correo");
    const telefono = document.querySelector("#telefono");
    const Estado = document.querySelector("#Estado");
    const Rol = document.querySelector("#Rol");
    const btnCancelar = document.querySelector("#btnCancelar");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    (async function init() {
        if (!id) {
            Swal.fire("Error", "No se especificó un usuario", "error").then(() => window.location.href = "index.html");
            return;
        }

        await cargarRoles(Rol);

        const json = await post("getOne", { id });
        if (json.status !== "success") {
            Swal.fire("Error", "No se pudo cargar el usuario", "error").then(() => window.location.href = "index.html");
            return;
        }

        const u = json.data;
        Nombre.value = u.nombre;
        Apellido.value = u.apellido;
        Correo.value = u.correo;
        telefono.value = u.telefono;
        Estado.value = u.estado;
        Rol.value = u.id_rol;
    })();

    btnActualizar.addEventListener("click", async () => {
        const json = await post("update", {
            id,
            name: Nombre.value,
            lastname: Apellido.value,
            email: Correo.value,
            phone: telefono.value,
            status: Estado.value,
            role: Rol.value
        });

        if (json.status === "success") {
            await Swal.fire("Listo", "Usuario actualizado", "success");
            window.location.href = "index.html";
        } else {
            Swal.fire("Error", json.message || "No se pudo actualizar", "error");
        }
    });

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => window.location.href = "index.html");
    }
}