fetch("../php/vehiculo.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");
        tbody.innerHTML = json.data.map(v => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#${v.id_vehiculo}</td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="font-semibold">${v.marca} ${v.nombre_modelo}</div>
                    <div class="text-xs text-gray-400">Año: ${v.year}</div>
                </td>
                <td class="px-6 py-4 text-sm font-mono uppercase text-gray-600">${v.placa}</td>
                <td class="px-6 py-4 text-sm text-gray-500 uppercase text-xs font-semibold">${v.categoria}</td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">$${v.costo_diario}/día</td>
                <td class="px-6 py-4 text-sm">
                    <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${v.estado === 'Disponible' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">
                        ${v.estado}
                    </span>
                </td>
            </tr>
        `).join('');
    }
})
.catch(err => console.error("Error:", err));