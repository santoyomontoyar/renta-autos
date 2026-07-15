export default function views() {
    document.querySelector("#tableList").classList.toggle("hidden");
    document.querySelector("#formContainer").classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_imagen").value = '';
    document.querySelector("#id_falla").value = '';
    document.querySelector("#url_archivo").value = '';
}