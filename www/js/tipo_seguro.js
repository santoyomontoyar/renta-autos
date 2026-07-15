document.addEventListener("DOMContentLoaded", () => {
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
        const tbody = document.getElementById("tbody");

        if (json.status === "success" && Array.isArray(json.data) && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-5 py-4 text-center font-medium text-gray-900">#${d.id_tipo_seguro}</td>
                    <td class="px-5 py-4 text-center text-gray-700 font-medium">${d.nombre ?? ""}</td>
                    <td class="px-5 py-4 text-gray-700">${d.descripcion ?? ""}</td>
                    <td class="px-5 py-4">
                        <div class="flex justify-center gap-2">
                            <button class="btn btn-sm btn-warning" onclick="editarTipoSeguro(${d.id_tipo_seguro})">Editar</button>
                            <button class="btn btn-sm btn-error" onclick="eliminarTipoSeguro(${d.id_tipo_seguro})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `).join("");
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-6 text-gray-500">
                        No hay tipos de seguro registrados.
                    </td>
                </tr>
            `;
        }
    })
    .catch(err => {
        console.error("Error:", err);
    });
}

function editarTipoSeguro(id) {
    window.location.href = `editar.html?id=${id}`;
}

function eliminarTipoSeguro(id_tipo_seguro) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch("../php/tipo_seguro.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "delete",
                    id_tipo_seguro: id_tipo_seguro
                })
            })
            .then(res => res.json())
            .then(json => {
                if (json.status === "success") {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: json.message || "El registro fue eliminado correctamente.",
                        icon: "success"
                    }).then(() => location.reload());
                } else {
                    Swal.fire({
                        title: "Error",
                        text: json.message || "No se pudo eliminar.",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al eliminar.",
                    icon: "error"
                });
            });
        }
    });
}