import getRoles, { insertarRol, actualizarRol, eliminarRol } from './rol_api.js'
import renderRoles from './rol_renders.js'
import views, { clearForm } from './rol_views.js'
import form from './rol_form.js'

const table = document.querySelector(`#table`);
const formArea = document.querySelector('#formArea');
const addForm = document.querySelector("#addForm");
const listBtn = document.querySelector("#listBtn");

formArea.innerHTML = form();

const name = document.querySelector('#name');
const btnGuardar = document.querySelector('#btnGuardar');

let sortColumn = 'id_rol';
let sortDirection = 'asc';
let roles = [];
let idEditar = null;

async function cargarRoles() {
    roles = await getRoles(sortColumn, sortDirection);
    renderRoles(roles);
}

await cargarRoles();

const ordenarPorSelect = document.querySelector('#ordenarPor');
const direccionSelect = document.querySelector('#direccionOrden');

ordenarPorSelect.addEventListener('change', (e) => {
    sortColumn = e.target.value;
    cargarRoles();
});

direccionSelect.addEventListener('change', (e) => {
    sortDirection = e.target.value;
    cargarRoles();
});

listBtn.addEventListener('click', function () {
    views();
});

addForm.addEventListener('click', function () {
    views();
    clearForm();
    idEditar = null;
});

table.addEventListener('click', function (e) {
    if (e.target.classList.contains('editBtn')) {
        const id = e.target.dataset.id;
        const rol = roles.find(rol => rol.id_rol == id);
 
        idEditar = id;
        name.value = rol.nombre;
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
            }).then(async(result) => {
                if (result.isConfirmed) {
                    const json = await eliminarRol(id);

                const response = json.status === 'success'
                ? { title: 'Borrado', text: 'El registro ha sido borrado', icon: 'success'}   
                : { title: 'Error', text: json.message, icon: 'error' }; 

          Swal.fire(response).then(async () => {
                     await cargarRoles();
                });
            }
        });
    }
});       

        btnGuardar.addEventListener("click", async function (e) {
            e.preventDefault();

            const nombre = name.value.trim();
            if (!nombre) return;

            const json = idEditar
            ? await actualizarRol(idEditar, nombre)
            : await insertarRol(nombre);

            if (json.status === 'success') {
                await Swal.fire ({
                    title: 'Guardado',
                    text: 'El registrado se guardo correctamente',
                    icon: 'success'
                });
                idEditar = null
                clearForm();
                views();
                await cargarRoles();
            } else {
                Swal.fire({ title: 'Error', text: json.message || 'No se pudo guardar', icon: 'error' });
            }
        });
