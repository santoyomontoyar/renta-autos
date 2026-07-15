export default function views() {
    const tableList = document.querySelector("#tableList");
    const formContainer = document.querySelector("#formContainer");

    tableList.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_vehiculo").value = '';
    document.querySelector("#id_modelo").value = '';
    document.querySelector("#marca").value = '';
    document.querySelector("#nombre_modelo").value = '';
    document.querySelector("#year").value = '';
    document.querySelector("#id_sucursal_actual").value = '';
    document.querySelector("#placa").value = '';
    document.querySelector("#transmision").value = 'Manual';
    document.querySelector("#estado").value = 'Disponible';
    document.querySelector("#modeloHint").textContent = '';
}