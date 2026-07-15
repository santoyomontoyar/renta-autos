export default function views() {
    const tableList = document.querySelector("#tableList");
    const formContainer = document.querySelector("#formContainer");

    tableList.classList.toggle("hidden");
    formContainer.classList.toggle("hidden");
}

export function clearForm() {
    document.querySelector("#id_cargo").value = '';
    document.querySelector("#id_renta").value = '';
    document.querySelector("#id_falla").value = '';
    document.querySelector("#descripcion").value = '';
    document.querySelector("#monto_total").value = '';
    document.querySelector("#monto_seguro").value = '';
    document.querySelector("#monto_cliente").value = '';
    document.querySelector("#monto_devuelto").value = '';
    document.querySelector("#monto_extra_pagado").value = '';
}