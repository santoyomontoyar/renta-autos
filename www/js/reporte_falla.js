import getFallas, { insertarFalla, actualizarFalla, eliminarFalla } from './falla_api.js'
import renderFallas from './falla_renders.js'
import views, { clearForm } from './falla_views.js'
import form from './falla_form.js'
 
const table = document.querySelector('#table');
const formArea = document.querySelector('#formArea');
const addForm = document.querySelector('#addForm');
const listBtn = document.querySelector('#listBtn');
 
formArea.innerHTML = form();
 
const id_renta = document.querySelector('#id_renta');
const id_usuario = document.querySelector('#id_usuario');
const descripcion = document.querySelector('#descripcion');
const btnGuardar = document.querySelector('#btnGuardar');
 
let fallas = await getFallas();
renderFallas(fallas);
 
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
        const falla = fallas.find(f => f.id_falla == id);
 
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
 
                Swal.fire(response).then(async () => {
                    fallas = await getFallas();
                    renderFallas(fallas);
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
        fallas = await getFallas();
        renderFallas(fallas);
    } else {
        Swal.fire({ title: 'Error', text: json.message || 'No se pudo guardar', icon: 'error' });
    }
});        