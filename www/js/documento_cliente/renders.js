export default function renderDocumento(documentos) {
    const tbody = document.querySelector("#tbody");
    
    if (!documentos || documentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-gray-500">No hay documentos registrados.</td></tr>`;
        return;
    }

    tbody.innerHTML = documentos.map(d => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">#${d.id_documento}</td>
            <td class="px-6 py-4 text-sm text-gray-800 font-medium">${d.nombre} ${d.apellido ?? ''}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${(d.tipo_documento || '').replace('_', ' ')}</td>
            <td class="px-6 py-4 text-sm font-mono text-gray-600">${d.numero_documento}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${d.fecha_vencimiento}</td>
            <td class="px-6 py-4 text-sm text-center">
                <button data-id="${d.id_documento}" class="editBtn btn btn-xs btn-warning text-white mr-1">Editar</button>
                <button data-id="${d.id_documento}" class="deleteBtn btn btn-xs btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}