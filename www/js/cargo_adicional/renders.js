export default function renderCargo(cargos) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = cargos.map(c => {
        const total = parseFloat(c.monto_total) || 0;
        const seguro = parseFloat(c.monto_seguro) || 0;
        const cliente = parseFloat(c.monto_cliente) || 0;
        const devuelto = parseFloat(c.monto_devuelto) || 0;
        const extra = parseFloat(c.monto_extra_pagado) || 0;
        
        const saldoRestante = total - (seguro + cliente + extra);
        
        const estatusBadge = saldoRestante <= 0 
            ? `<span class="badge badge-success text-white text-[10px] mt-1">Liquidado</span>`
            : `<span class="badge badge-error text-white text-[10px] mt-1">Pendiente: $${saldoRestante.toFixed(2)}</span>`;

        return `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">#${c.id_cargo}</td>
                <td class="px-6 py-4 text-sm text-gray-700">
                    <div class="font-semibold">Renta: #${c.id_renta}</div>
                    <div class="text-xs text-gray-400">Falla vinculada: #${c.id_falla}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                    <div>${c.descripcion}</div>
                    ${estatusBadge}
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-gray-900">$${total.toFixed(2)}</td>
                <td class="px-6 py-4 text-sm text-green-600">$${seguro.toFixed(2)}</td>
                <td class="px-6 py-4 text-sm text-red-600 font-semibold">$${cliente.toFixed(2)}</td>
                <td class="px-6 py-4 text-sm text-teal-600 font-semibold">$${devuelto.toFixed(2)}</td>
                <td class="px-6 py-4 text-sm text-indigo-600 font-semibold">$${extra.toFixed(2)}</td>
                <td class="px-6 py-4 text-sm text-gray-500">${c.fecha_cargo}</td>
                <td class="px-6 py-4 text-sm">
                    <button data-id="${c.id_cargo}" class="editBtn btn btn-sm btn-warning text-white mr-2">Editar</button>
                    <button data-id="${c.id_cargo}" class="deleteBtn btn btn-sm btn-error text-white">Eliminar</button>
                </td>
            </tr>
        `;
    }).join('');
}

export function renderPagination(totalItems, currentPage, pageSize) {
    const paginationEls = document.querySelectorAll('.pagination');
    if (paginationEls.length === 0) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

       if (totalPages <= 1) {
        paginationEls.forEach(el => el.innerHTML = "");
        return;
    }
 
    const paginas = [1];
    if (currentPage - 1 > 2) paginas.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) paginas.push(i);
    if (currentPage + 1 < totalPages - 1) paginas.push('...');
    if (totalPages > 1) paginas.push(totalPages);
 
    const botones = paginas.map(p => p === '...'
        ? `<span class="px-2 text-gray-400">...</span>`
        : `<button class="btn btn-sm ${p === currentPage ? 'btn-primary' : 'btn-ghost'}" data-page="${p}" ${p === currentPage ? 'disabled' : ''}>${p}</button>`
    ).join('');
 
    paginationEls.forEach(el => el.innerHTML = `
        <button class="btn btn-sm" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>« Anterior</button>
        ${botones}
        <button class="btn btn-sm" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Siguiente »</button>
    `);
}
    