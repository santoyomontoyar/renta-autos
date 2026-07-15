export default function form(rentas = [], fallas = []) {
    const rentasFinalizadas = rentas.filter(r => r.estado === 'Finalizada');

    const rentaOptions = rentasFinalizadas.map(r =>
        `<option value="${r.id_renta}" data-deposito="${r.monto_deposito}">Renta #${r.id_renta} - ${r.cliente} (Depósito: $${r.monto_deposito})</option>`
    ).join('');

    const fallaOptions = fallas.map(f =>
        `<option value="${f.id_falla}">Falla #${f.id_falla} (Renta #${f.id_renta}) - ${f.descripcion.substring(0, 30)}...</option>`
    ).join('');

    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        <h2 class="text-xl font-bold text-gray-700 mb-4 font-sans">Administrar Cargo Adicional</h2>
        
        <input type="hidden" id="id_cargo">

        <div class="mb-3">
            <label for="id_renta" class="block text-sm font-semibold mb-1 text-gray-600">Asociar a Renta (Solo Finalizadas)</label>
            <select id="id_renta" class="select select-bordered w-full">
                <option value="">Selecciona una renta</option>
                ${rentaOptions}
            </select>
        </div>

        <div class="mb-3">
            <label for="id_falla" class="block text-sm font-semibold mb-1 text-gray-600">Reporte de Falla Relacionado</label>
            <select id="id_falla" class="select select-bordered w-full">
                <option value="">Selecciona un reporte de falla</option>
                ${fallaOptions}
            </select>
        </div>

        <div class="mb-3">
            <label for="descripcion" class="block text-sm font-semibold mb-1 text-gray-600">Descripción del Cargo</label>
            <input type="text" id="descripcion" class="input input-bordered w-full" placeholder="Ej. Reparación golpe fascias">
        </div>

        <div class="mb-3">
            <label for="monto_total" class="block text-sm font-semibold mb-1 text-gray-600">Monto Total Daño ($)</label>
            <input type="number" step="0.01" id="monto_total" class="input input-bordered w-full" placeholder="0.00">
        </div>

        <div class="mb-3">
            <label for="monto_seguro" class="block text-sm font-semibold mb-1 text-gray-600">Cubierto por Seguro ($)</label>
            <input type="number" step="0.01" id="monto_seguro" class="input input-bordered w-full" placeholder="0.00">
        </div>

        <div class="mb-3">
            <label for="monto_cliente" class="block text-sm font-semibold mb-1 text-gray-600">Monto Tomado de Garantía (Automático) ($)</label>
            <input type="number" step="0.01" id="monto_cliente" class="input input-bordered w-full bg-gray-100 cursor-not-allowed" placeholder="0.00" readonly>
        </div>

        <div class="mb-3">
            <label for="monto_devuelto" class="block text-sm font-semibold mb-1 text-gray-600">Monto Devuelto de Depósito (Automático) ($)</label>
            <input type="number" step="0.01" id="monto_devuelto" class="input input-bordered w-full bg-gray-100 cursor-not-allowed" placeholder="0.00" readonly>
        </div>

        <div class="mb-3">
            <label for="monto_extra_pagado" class="block text-sm font-semibold mb-1 text-gray-600">Monto Extra Pagado por Cliente ($)</label>
            <input type="number" step="0.01" id="monto_extra_pagado" class="input input-bordered w-full" placeholder="0.00">
            <span id="depositoAlerta" class="text-xs mt-2 block font-semibold"></span>
        </div>
        
        <button type="button" id="saveBtn" class="btn btn-primary w-full mt-4 text-white">Guardar Cargo</button>
    `;
}