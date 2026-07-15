export default function renderImagen(imagenes) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = imagenes.map(img => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${img.id_imagen}</td>
            <td class="px-6 py-4 text-sm">
                <div class="avatar">
                    <div class="w-16 h-12 rounded-lg border border-gray-200 bg-gray-100 overflow-hidden">
                        <img src="${img.url_archivo}" alt="Vista previa" class="object-cover w-full h-full" onerror="this.src='https://placehold.co/100x80?text=Sin+Foto'"/>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700 font-semibold">
                ${img.marca} ${img.nombre_modelo} <span class="text-xs text-gray-400 font-normal">(${img.year})</span>
            </td>
            <td class="px-6 py-4 text-sm font-mono text-gray-500 max-w-xs truncate">${img.url_archivo}</td>
            <td class="px-6 py-4 text-sm">
                <span class="badge ${parseInt(img.es_principal) === 1 ? 'badge-primary' : 'badge-neutral'} text-white text-xs font-semibold">
                    ${parseInt(img.es_principal) === 1 ? 'Principal / Portada' : 'Galería'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${img.id_imagen}" class="editBtn btn btn-sm btn-warning text-white mr-2">Editar</button>
                <button data-id="${img.id_imagen}" class="deleteBtn btn btn-sm btn-error text-white">Eliminar</button>
            </td>
        </tr>
    `).join('');
}