document.addEventListener("DOMContentLoaded", () => {

    fetch("../php/sucursal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        console.log("Respuesta:", json);

        const tbody = document.querySelector("#tbody");

        if (!tbody) {
            console.error("No existe #tbody en el HTML");
            return;
        }

        if (json.status === "success" && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_sucursal}</td>

                    <td class="px-6 py-4 text-sm text-gray-700 font-semibold">
                        ${d.nombre}
                    </td>

                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.direccion}
                    </td>

                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.telefono ?? 'N/A'}
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-gray-500">
                        No hay datos disponibles
                    </td>
                </tr>
            `;
        }
    })
    .catch(err => {
        console.error("Error en fetch:", err);
    });

});