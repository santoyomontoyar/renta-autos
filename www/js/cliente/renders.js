export default function renderCliente(clientes) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = clientes.map(c => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${c.id_cliente}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <div class="font-semibold">${c.nombre} ${c.apellido}</div>
                <div class="text-xs text-gray-400">ID Usuario: #${c.id_usuario}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${c.correo}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${c.telefono}</td>
            <td class="px-6 py-4 text-sm">
                <span class="badge ${c.estado === 'Activo' ? 'badge-success' : 'badge-error'} text-white text-xs font-semibold">
                    ${c.estado}
                </span>
            </td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${c.id_cliente}" class="editBtn btn btn-sm btn-warning text-white mr-2">Editar</button>
                <button data-id="${c.id_cliente}" class="deleteBtn btn btn-sm btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}