export default function renderCliente(clientes) {
    const tbody = document.querySelector("#tbody");
    
    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">No hay registros de clientes.</td></tr>`;
        return;
    }

    tbody.innerHTML = clientes.map(c => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">#${c.id_cliente}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
                <div class="font-medium text-gray-900">${c.nombre} ${c.apellido ?? ''}</div>
                <div class="text-xs text-gray-400">ID Usuario: #${c.id_usuario}</div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">${c.correo}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${c.telefono}</td>
            <td class="px-6 py-4 text-sm">
                <span class="badge ${c.estado === 'Activo' ? 'badge-success' : (c.estado === 'Suspendido' ? 'badge-warning' : 'badge-error')} text-white text-xs font-semibold">
                    ${c.estado}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-center">
                <button data-id="${c.id_cliente}" class="editBtn btn btn-xs btn-warning text-white mr-1">Editar</button>
                <button data-id="${c.id_cliente}" class="deleteBtn btn btn-xs btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}