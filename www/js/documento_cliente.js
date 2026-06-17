fetch("../php/documento_cliente.php", {
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
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_documento}</td>
                <td class="px-6 py-4 text-sm text-gray-700 font-medium">${d.nombre} ${d.apellido}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-700">${d.tipo_documento.replace('_', ' ')}</td>
                <td class="px-6 py-4 text-sm font-mono text-gray-600">${d.numero_documento}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${d.fecha_vencimiento}</td>
                <td class="px-6 py-4 text-sm">
                    <a href="${d.url_archivo}" target="_blank" class="text-blue-600 hover:underline font-semibold">👁️ Ver</a>
                </td>
            </tr>
        `).join('');
    }
})
.catch(err => console.error("Error:", err));