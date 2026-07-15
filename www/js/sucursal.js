import getSucursal, { insertarSucursal, actualizarSucursal, eliminarSucursal } from './sucursal_api.js'
import renderSucursal from './sucursal_renders.js'
import views, { clearForm } from './sucursal_views.js'
import form from './sucursal_form.js'
 
const table = document.querySelector('#table');
const formArea = document.querySelector('#formArea');
const addForm = document.querySelector('#addForm');
const listBtn = document.querySelector('#listBtn');
 
formArea.innerHTML = form();
 
const name = document.querySelector('#name');
const ciudad = document.querySelector('#ciudad');
const btnGuardar = document.querySelector('#btnGuardar');
 
let sucursales = await getSucursal();
renderSucursal(sucursales);

let idEditar = null;

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
        const sucursal = sucursales.find(s => s.id_sucursal == id);
 
        idEditar = id;
        name.value = sucursal.nombre;
        ciudad.value = sucursal.ciudad;
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
                const json = await eliminarSucursal(id);

                const response = json.status === 'success'
                    ? { title: 'Borrado', text: 'El registro ha sido borrado', icon: 'success'}   
                    : { title: 'Error', text: json.message, icon: 'error' }; 
    
              Swal.fire(response).then(async () => {
                        sucursales = await getSucursal();
                        renderSucursal(sucursales);
                    });
                }
            });
        }
    });       

btnGuardar.addEventListener("click", async function (e) {
            e.preventDefault();

            const nombre = name.value.trim();
            const ciudadValor = ciudad.value.trim();
            if (!nombre) return;

            const json = idEditar
            ? await actualizarSucursal(idEditar, nombre, ciudadValor)
            : await insertarSucursal(nombre, ciudadValor);

            if (json.status === 'success') {
                await Swal.fire ({
                    title: 'Guardado',
                    text: 'El registrado se guardo correctamente',
                    icon: 'success'
                });
                idEditar = null
                clearForm();
                views();
                sucursales = await getSucursal();
                renderSucursal(sucursales);
            } else {
                Swal.fire({ title: 'Error', text: json.message || 'No se pudo guardar', icon: 'error' });
            }
        });
