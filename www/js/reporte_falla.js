document.addEventListener("DOMContentLoaded", () => {

    fetch("../php/reporte_falla.php", {
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

                    <td class="px-6 py-4 text-sm text-gray-700">
                        ${d.id_falla}
                    </td>

                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.id_renta}
                    </td>

                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.id_usuario}
                    </td>

                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.descripcion}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">
                        ${d.fecha_reporte}
                    </td>

                    
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-4 text-gray-500">
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