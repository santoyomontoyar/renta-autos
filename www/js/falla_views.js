const table = document.querySelector('#table');
const formArea = document.querySelector('#formArea');
const addForm = document.querySelector('#addForm');
const listBtn = document.querySelector('#listBtn');
 
export default function views() {
    table.classList.toggle('hidden');
    formArea.classList.toggle('hidden');
    addForm.classList.toggle('hidden');
    listBtn.classList.toggle('hidden');
}
 
export function clearForm() {
    const id_renta = document.querySelector('#id_renta');
    const id_usuario = document.querySelector('#id_usuario');
    const descripcion = document.querySelector('#descripcion');
    if (id_renta) id_renta.value = "";
    if (id_usuario) id_usuario.value = "";
    if (descripcion) descripcion.value = "";
}