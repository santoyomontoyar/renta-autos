export default function views() {
    const tableList = document.querySelector("#tableList");
    const formContainer = document.querySelector("#formContainer");

    tableList.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_cliente").value = '';
    document.querySelector("#id_usuario").value = '';
    document.querySelector("#nombre").value = '';
    document.querySelector("#apellido").value = '';
    document.querySelector("#correo").value = '';
    document.querySelector("#telefono").value = '';
    document.querySelector("#estado").value = 'Activo';
}