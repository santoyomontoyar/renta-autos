document.addEventListener("DOMContentLoaded", () => {
    console.log("tipo_seguro.js cargado");
    cargarTiposSeguro();
});

function cargarTiposSeguro() {
    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        console.log("respuesta:", json);

        if (json.status === "success") {
            const tbody = document.getElementById("tbody");

            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-4 text-center font-medium text-gray-900">#${d.id_tipo_seguro}</td>
                    <td class="px-5 py-4 text-center text-gray-700 font-medium">${d.nombre ?? ""}</td>
                    <td class="px-5 py-4 text-gray-700">
                        ${d.descripcion ?? ""}
                    </td>
                    <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button class="btn btn-sm btn-warning" onclick="editarTipoSeguro(${d.id_tipo_seguro})">Editar</button>
                            <button class="btn btn-sm btn-error" onclick="eliminarTipoSeguro(${d.id_tipo_seguro})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `).join("");
        } else {
            console.error(json.message || "Error al cargar datos");
        }
    })
    .catch(err => console.error("Error:", err));
}

function editarTipoSeguro(id) {
    window.location.href = `editar.html?id=${id}`;
}

function eliminarTipoSeguro(id) {
    if (!confirm("¿Deseas eliminar este tipo de seguro?")) {
        return;
    }

    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete",
            id_tipo_seguro: id
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            cargarTiposSeguro();
        } else {
            console.error(json.message || "No se pudo eliminar");
        }
    })
    .catch(err => console.error("Error:", err));
}