import renderUsuarios from './user/renders.js';

const btnGuardar = document.querySelector("#btnGuardar");
const btnActualizar = document.querySelector("#btnActualizar");
const tbody = document.querySelector("#tbody");

let currentPage = 1;
let searchTimeout = null;

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


async function cargarUsuarios() {
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" class="text-center py-8 text-gray-400">Cargando registros...</td></tr>`;

    try {
        const json = await post("getAll", { 
            page: currentPage,
            search: document.querySelector("#searchInput")?.value.trim() || '',
            order_by: document.querySelector("#orderBySelect")?.value || 'u.id_usuario',
            order_dir: document.querySelector("#orderDirSelect")?.value || 'ASC',
            rol_prioridad: document.querySelector("#rolPrioritySelect")?.value || 'CLIENTE_PRIMERO'
        });

        if (json.status === "success") {
            renderUsuarios(json.data);
            renderPagination(json.pagination);
        } else {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-4">Error al cargar usuarios.</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-red-500 py-4">Error de conexión.</td></tr>`;
    }
}

function renderPagination(p) {
    const container = document.querySelector("#paginationControls");
    const info = document.querySelector("#pageInfo");

    if (!container || !info) return;

    if (!p || p.totalRows === 0) {
        info.textContent = "No se encontraron usuarios";
        container.innerHTML = "";
        return;
    }

    const start = (p.page - 1) * p.limit + 1;
    const end = Math.min(p.page * p.limit, p.totalRows);
    info.textContent = `Mostrando ${start} a ${end} de ${p.totalRows} usuarios`;

    let html = `<button class="join-item btn btn-sm ${p.page <= 1 ? 'btn-disabled' : ''}" id="prevPageBtn">« Anterior</button>`;

    for (let i = 1; i <= p.totalPages; i++) {
        if (i === 1 || i === p.totalPages || (i >= p.page - 2 && i <= p.page + 2)) {
            html += `<button class="join-item btn btn-sm pageBtn ${i === p.page ? 'btn-primary' : ''}" data-page="${i}">${i}</button>`;
        }
    }

    html += `<button class="join-item btn btn-sm ${p.page >= p.totalPages ? 'btn-disabled' : ''}" id="nextPageBtn">Siguiente »</button>`;

    container.innerHTML = html;
}

if (tbody) {
    cargarUsuarios();

    
    document.querySelector("#searchInput")?.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            cargarUsuarios();
        }, 300);
    });

    
    ['#orderBySelect', '#orderDirSelect', '#rolPrioritySelect'].forEach(sel => {
        document.querySelector(sel)?.addEventListener("change", (e) => {
            if (sel === '#orderBySelect') {
                const isPriority = e.target.value === 'rol_prioridad';
                document.querySelector("#dirContainer")?.classList.toggle("hidden", isPriority);
                document.querySelector("#rolGroupContainer")?.classList.toggle("hidden", !isPriority);
            }
            currentPage = 1;
            cargarUsuarios();
        });
    });

    
    tbody.addEventListener("click", function (evento) {
        if (!evento.target.matches(".btn-error")) return;
        evento.preventDefault();
        const id = evento.target.getAttribute("data-id");

        Swal.fire({
            title: "¿Estás seguro de eliminar este registro?",
            text: "¡No vas a poder revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
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

   
    const paginationControls = document.querySelector("#paginationControls");
    if (paginationControls) {
        paginationControls.addEventListener("click", (e) => {
            const pageBtn = e.target.closest(".pageBtn");
            const prevBtn = e.target.closest("#prevPageBtn");
            const nextBtn = e.target.closest("#nextPageBtn");

            if (pageBtn) {
                currentPage = parseInt(pageBtn.dataset.page);
                cargarUsuarios();
            } else if (prevBtn && currentPage > 1) {
                currentPage--;
                cargarUsuarios();
            } else if (nextBtn) {
                currentPage++;
                cargarUsuarios();
            }
        });
    }
}


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