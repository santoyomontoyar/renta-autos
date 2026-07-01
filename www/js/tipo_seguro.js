document.addEventListener("DOMContentLoaded", () => {
    cargarTiposSeguro();

    document.getElementById("formTipoSeguro").addEventListener("submit", guardarTipoSeguro);
});

function cargarTiposSeguro() {
    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.text())
    .then(text => JSON.parse(text))
    .then(json => {
        if (json.status === "success") {
            const tbody = document.getElementById("tbody");

            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-4 text-center font-medium text-gray-900">
                        #${d.id_tipo_seguro}
                    </td>
                    <td class="px-5 py-4 text-center text-gray-700 font-medium">
                        ${d.nombre}
                    </td>
                    <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button
                                    class="btn btn-sm btn-warning"
                                    onclick="window.location.href='editar.html?id=${d.id_tipo_seguro}'">
                                    Editar
                                </button>
                            <button
                                class="btn btn-sm btn-error"
                                onclick="eliminarTipoSeguro(${d.id_tipo_seguro})">
                                Eliminar
                            </button>
                        </div>
                    </td>
                </tr>
            `).join("");
        } else {
            alert(json.message || "Error al cargar datos");
        }
    })
    .catch(err => console.error("Error:", err));
}

function guardarTipoSeguro(e) {
    e.preventDefault();

    const id = document.getElementById("id_tipo_seguro").value;
    const nombre = document.getElementById("nombre").value.trim();

    if (!nombre) {
        alert("Escribe un nombre");
        return;
    }

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
    .then(res => res.text())
    .then(text => JSON.parse(text))
    .then(json => {
        if (json.status === "success") {
            document.getElementById("formTipoSeguro").reset();
            document.getElementById("id_tipo_seguro").value = "";
            document.getElementById("btnGuardar").textContent = "Guardar";
            cargarTiposSeguro();
        } else {
            alert(json.message || "No se pudo guardar");
        }
    })
    .catch(err => console.error("Error:", err));
}

function editarTipoSeguro(id, nombre) {
    document.getElementById("id_tipo_seguro").value = id;
    document.getElementById("nombre").value = nombre;
    document.getElementById("btnGuardar").textContent = "Actualizar";
}

function eliminarTipoSeguro(id) {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete",
            id_tipo_seguro: id
        })
    })
    .then(res => res.text())
    .then(text => JSON.parse(text))
    .then(json => {
        if (json.status === "success") {
            cargarTiposSeguro();
        } else {
            alert(json.message || "No se pudo eliminar");
        }
    })
    .catch(err => console.error("Error:", err));
}

function eliminarTipoSeguro(id) {

    if (!confirm("¿Deseas eliminar este tipo de seguro?")) {
        return;
    }

    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            action: "delete",
            id_tipo_seguro: id
        })
    })
    .then(res => res.json())
    .then(json => {

        if(json.status === "success"){
            location.reload();
        }else{
            alert(json.message);
        }

    })
    .catch(err => console.error(err));
}