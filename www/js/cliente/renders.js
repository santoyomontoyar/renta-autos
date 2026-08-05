export default function renderCliente(clientes) {
    const tbody = document.querySelector("#tbody");
    
    if (!clientes || clientes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center py-6 text-gray-500">No se encontraron clientes.</td></tr>`;
        return;
    }

    tbody.innerHTML = clientes.map(c => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <!-- 1. ID -->
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">#${c.id_cliente}</td>
            
            <!-- 2. Cliente -->
            <td class="px-6 py-4 text-sm text-gray-800">
                <div class="font-semibold text-gray-900">${c.nombre} ${c.apellido}</div>
                <div class="text-xs text-gray-400">ID Usuario: #${c.id_usuario}</div>
            </td>
            
            <!-- 3. Correo -->
            <td class="px-6 py-4 text-sm text-gray-600">${c.correo}</td>
            
            <!-- 4. Teléfono -->
            <td class="px-6 py-4 text-sm text-gray-600">${c.telefono}</td>
            
            <!-- 5. Licencia -->
            <td class="px-6 py-4 text-sm font-mono text-gray-700">${c.licencia_conducir || 'N/A'}</td>
            
            <!-- 6. Vencimiento Lic. -->
            <td class="px-6 py-4 text-sm text-gray-600">${c.fecha_vencimiento_licencia || 'N/A'}</td>
            
            <!-- 7. Estado -->
            <td class="px-6 py-4 text-sm">
                <span class="badge ${c.estado === 'Activo' ? 'badge-success' : (c.estado === 'Inactivo' ? 'badge-error' : 'badge-warning')} text-white text-xs font-semibold">
                    ${c.estado}
                </span>
            </td>
            
            <!-- 8. Acciones -->
            <td class="px-6 py-4 text-sm text-center">
                <button data-id="${c.id_cliente}" class="editBtn btn btn-xs btn-warning text-white mr-1">Editar</button>
                <button data-id="${c.id_cliente}" class="deleteBtn btn btn-xs btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}