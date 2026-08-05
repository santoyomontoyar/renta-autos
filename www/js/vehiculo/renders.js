import { soloLectura } from '../lib/ui.js';

// puedeEditar: solo un Administrador da de alta, edita o elimina vehículos.
// Cliente y Mecánico solo consultan el catálogo.
export default function renderVehiculo(vehiculos, puedeEditar = false) {
    const tbody = document.querySelector("#tbody");

    if (!vehiculos || vehiculos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-gray-500">No hay vehículos registrados.</td></tr>`;
        return;
    }

    const acciones = puedeEditar
        ? v => `<button data-id="${v.id_vehiculo}" class="editBtn btn btn-xs btn-warning text-white mr-1">Editar</button>
                <button data-id="${v.id_vehiculo}" class="deleteBtn btn btn-xs btn-error text-white">Eliminar</button>`
        : soloLectura;

    tbody.innerHTML = vehiculos.map(v => `
        <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">#${v.id_vehiculo}</td>
            <td class="px-6 py-4 text-sm text-gray-800">
                <div class="font-semibold text-gray-900">${v.marca} ${v.nombre_modelo}</div>
                <div class="text-xs text-gray-400">Año: ${v.year}</div>
            </td>
            <td class="px-6 py-4 text-sm font-mono uppercase text-gray-600">${v.placa}</td>
            <td class="px-6 py-4 text-sm text-gray-500 uppercase text-xs font-semibold">${v.categoria}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${v.transmision}</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">$${v.costo_diario}/día</td>
            <td class="px-6 py-4 text-sm">
                <span class="badge ${v.estado === 'Disponible' ? 'badge-success' : (v.estado === 'Rentado' ? 'badge-info' : 'badge-warning')} text-white text-xs font-semibold">
                    ${v.estado}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-700">${v.sucursal}</td>
            <td class="px-6 py-4 text-sm text-center">${acciones(v)}</td>
        </tr>
    `).join('');
}