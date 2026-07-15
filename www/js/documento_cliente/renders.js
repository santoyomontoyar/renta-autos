export default function renderDocumento(documentos) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = documentos.map(d => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_documento}</td>
            <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${d.nombre} ${d.apellido}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${(d.tipo_documento || '').replace('_', ' ')}</td>
            <td class="px-6 py-4 text-sm font-mono text-gray-600">${d.numero_documento}</td>
            <td class="px-6 py-4 text-sm text-gray-500">${d.fecha_vencimiento}</td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${d.id_documento}" class="editBtn btn btn-sm btn-warning text-white mr-2">Editar</button>
                <button data-id="${d.id_documento}" class="deleteBtn btn btn-sm btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}