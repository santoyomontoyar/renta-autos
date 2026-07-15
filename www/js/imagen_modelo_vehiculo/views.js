export default function views() {
    const tableList = document.querySelector("#tableList");
    const formContainer = document.querySelector("#formContainer");

    tableList.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_imagen").value = '';
    document.querySelector("#id_modelo").value = '';
    document.querySelector("#url_archivo").value = '';
    document.querySelector("#es_principal").value = '0';
}