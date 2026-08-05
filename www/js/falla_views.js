const table = document.querySelector('#table');
const toolbar = document.querySelector('#toolbar');
const paginacion = document.querySelector('#paginacionFallas');
const formArea = document.querySelector('#formArea');
const listBtn = document.querySelector('#listBtn');

export default function views(mostrarFormulario) {
    table.classList.toggle('hidden', mostrarFormulario);
    toolbar.classList.toggle('hidden', mostrarFormulario);
    paginacion.classList.toggle('hidden', mostrarFormulario);
    formArea.classList.toggle('hidden', !mostrarFormulario);
    listBtn.classList.toggle('hidden', !mostrarFormulario);
}

export function clearForm() {
    const id_renta = document.querySelector('#id_renta');
    const id_usuario = document.querySelector('#id_usuario');
    const descripcion = document.querySelector('#descripcion');
    if (id_renta) id_renta.value = "";
    if (id_usuario) id_usuario.value = "";
    if (descripcion) descripcion.value = "";
}