fetch("../php/cliente.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");
        tbody.innerHTML = json.data.map(c => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#${c.id_cliente}</td>
                <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${c.nombre} ${c.apellido}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${c.correo}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${c.telefono}</td>
                <td>${c.estado}</td>
            </tr>
        `).join('');
    }
})
.catch(err => console.error("Error:", err));