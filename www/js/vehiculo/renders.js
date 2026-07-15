export default function renderVehiculo(vehiculos) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = vehiculos.map(v => `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${v.id_vehiculo}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <div class="font-semibold">${v.marca} ${v.nombre_modelo}</div>
                <div class="text-xs text-gray-400">Año: ${v.year}</div>
            </td>
            <td class="px-6 py-4 text-sm font-mono uppercase text-gray-600">${v.placa}</td>
            <td class="px-6 py-4 text-sm text-gray-500 uppercase text-xs font-semibold">${v.categoria}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${v.transmision}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">$${v.costo_diario}/día</td>
            <td class="px-6 py-4 text-sm text-gray-700">${v.estado}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${v.sucursal}</td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${v.id_vehiculo}" class="editBtn btn btn-sm btn-info mr-2">Editar</button>
                <button data-id="${v.id_vehiculo}" class="deleteBtn btn btn-sm btn-error mr-2">Eliminar</button>
            </td>
        </tr>
    `).join('');
}