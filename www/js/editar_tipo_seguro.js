document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const inputId = document.getElementById("id_tipo_seguro");
    const inputNombre = document.getElementById("nombre");
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
                inputNombre.value = json.data.nombre;
                btnGuardar.textContent = "Guardar cambios";
            }
        });
    } else {
        btnGuardar.textContent = "Guardar";
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim();
        const action = id ? "update" : "create";

        fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action,
                id_tipo_seguro: id,
                nombre
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html";
            } else {
                console.error(json.message);
            }
        })
        .catch(err => console.error(err));
    });
});