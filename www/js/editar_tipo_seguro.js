document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const inputId = document.getElementById("id_tipo_seguro");
    const inputNombre = document.getElementById("nombre");
    const inputDescripcion = document.getElementById("descripcion");
    const form = document.getElementById("formTipoSeguro");
    const btnGuardar = document.getElementById("btnGuardar");

    if (id) {
        inputId.value = id;

        fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getOne",
                id_tipo_seguro: id
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                inputNombre.value = json.data.nombre ?? "";
                inputDescripcion.value = json.data.descripcion ?? "";
                btnGuardar.textContent = "Guardar cambios";
            }
        });
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: id ? "update" : "create",
                id_tipo_seguro: id,
                nombre: inputNombre.value.trim(),
                descripcion: inputDescripcion.value.trim()
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html";
            } else {
                alert(json.message || "No se pudo guardar");
            }
        });
    });
});