import getFallas, { insertarFalla, actualizarFalla, eliminarFalla } from './falla_api.js'
import renderFallas from './falla_renders.js'
import views, { clearForm } from './falla_views.js'
import form from './falla_form.js'
import { renderToolbar } from './lib/toolbar.js?v=2'
import { renderPagination } from './lib/pagination_ui.js?v=2'

const table = document.querySelector('#table');
const formArea = document.querySelector('#formArea');
const listBtn = document.querySelector('#listBtn');

formArea.innerHTML = form();

const id_renta = document.querySelector('#id_renta');
const id_usuario = document.querySelector('#id_usuario');
const descripcion = document.querySelector('#descripcion');
const btnGuardar = document.querySelector('#btnGuardar');

const CAMPOS_ORDEN = [
    { value: "id_falla", label: "ID" },
    { value: "id_renta", label: "# Renta" },
    { value: "mecanico", label: "Mecánico" },
    { value: "fecha_reporte", label: "Fecha" }
];

let estado = { page: 1, orderBy: "id_falla", orderDir: "ASC", buscar: "" };
let idEditar = null;

async function cargarTabla() {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-400">Cargando registros...</td></tr>`;

    const json = await getFallas(estado);

    if (json.status !== 'success') {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-red-500 py-4">Error al cargar las fallas.</td></tr>`;
        return;
    }

    renderFallas(json.data);
    renderPagination('paginacionFallas', json.pagination, 'fallas', (pagina) => {
        estado.page = pagina;
        cargarTabla();
    });
}

renderToolbar('toolbar', CAMPOS_ORDEN, {
    placeholderBusqueda: 'Buscar por mecánico o descripción...',
    boton: { label: '+ Agregar', onClick: () => { views(); clearForm(); idEditar = null; } },
    onChange: ({ buscar, orderBy, orderDir }) => {
        estado = { ...estado, buscar, orderBy, orderDir, page: 1 };
        cargarTabla();
    }
});

cargarTabla();

listBtn.addEventListener('click', function () {
    views();
});

table.addEventListener('click', async function (e) {
    if (e.target.classList.contains('editBtn')) {
        const id = e.target.dataset.id;
        const json = await getFallas(estado);
        const falla = json.data.find(f => f.id_falla == id);
        if (!falla) return;

        idEditar = id;
        id_renta.value = falla.id_renta;
        id_usuario.value = falla.id_usuario;
        descripcion.value = falla.descripcion;
        views();
    }

    if (e.target.classList.contains('deleteBtn')) {
        const id = e.target.dataset.id;

        Swal.fire({
            title: "¿Estás seguro de eliminar este registro?",
            text: "No vas a poder revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const json = await eliminarFalla(id);
                const response = json.status === 'success'
                    ? { title: 'Borrado', text: 'El registro ha sido borrado', icon: 'success' }
                    : { title: 'Error', text: json.message, icon: 'error' };

                Swal.fire(response).then(() => {
                    estado.page = 1;
                    cargarTabla();
                });
            }
        });
    }
});

btnGuardar.addEventListener('click', async function (e) {
    e.preventDefault();

    const renta = id_renta.value.trim();
    const usuario = id_usuario.value.trim();
    const desc = descripcion.value.trim();
    if (!renta || !usuario || !desc) return;

    const json = idEditar
        ? await actualizarFalla(idEditar, renta, usuario, desc)
        : await insertarFalla(renta, usuario, desc);

    if (json.status === 'success') {
        await Swal.fire({
            title: 'Guardado',
            text: 'El registro se guardó correctamente',
            icon: 'success'
        });
        idEditar = null;
        clearForm();
        views();
        cargarTabla();
    } else {
        Swal.fire({ title: 'Error', text: json.message || 'No se pudo guardar', icon: 'error' });
    }
});