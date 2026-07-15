export default function views() {
    const tableList = document.querySelector("#tableList");
    const formContainer = document.querySelector("#formContainer");

    tableList.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_documento").value = '';
    document.querySelector("#id_cliente").value = '';
    document.querySelector("#tipo_documento").value = 'INE';
    document.querySelector("#numero_documento").value = '';
    document.querySelector("#fecha_vencimiento").value = '';
    
}