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
    const name = document.querySelector('#name');
    const ciudad = document.querySelector('#ciudad');
    if (name) name.value = "";
    if (ciudad) ciudad.value = "";
}