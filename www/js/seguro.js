fetch("../php/seguro.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");

        tbody.innerHTML = json.data.map(d => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    #${d.id_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-700 font-medium">
                    ${d.tipo_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500 font-semibold">
                    $${d.costo_diario}
                </td>

            </tr>
        `).join('');
    }
})
.catch(err => console.error("Error:", err));