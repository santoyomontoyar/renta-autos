export default function form(clientes = []) {
    const clienteOptions = clientes.map(c =>
        `<option value="${c.id_cliente}">${c.nombre} ${c.apellido}</option>`
    ).join('');

    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        <h2 class="text-xl font-bold text-gray-700 mb-4 font-sans">Administrar Documento</h2>
        
        <input type="hidden" id="id_documento">

        <div class="mb-3">
            <label for="id_cliente" class="block text-sm font-semibold mb-1 text-gray-600">Cliente</label>
            <select id="id_cliente" class="select select-bordered w-full">
                <option value="">Selecciona un cliente</option>
                ${clienteOptions}
            </select>
        </div>

        <div class="mb-3">
            <label for="tipo_documento" class="block text-sm font-semibold mb-1 text-gray-600">Tipo de Documento</label>
            <select id="tipo_documento" class="select select-bordered w-full">
                <option value="INE">INE</option>
                <option value="Licencia_Conducir">Licencia de Conducir</option>
            </select>
        </div>

        <div class="mb-3">
            <label for="numero_documento" class="block text-sm font-semibold mb-1 text-gray-600">Número de Documento</label>
            <input type="text" id="numero_documento" class="input input-bordered w-full" placeholder="Ej. GUTL850312MDFTRR01">
        </div>

        <div class="mb-3">
            <label for="fecha_vencimiento" class="block text-sm font-semibold mb-1 text-gray-600">Fecha de Vencimiento</label>
            <input type="date" id="fecha_vencimiento" class="input input-bordered w-full">
        </div>
        
        <button type="button" id="saveBtn" class="btn btn-primary w-full mt-4 text-white">Guardar Registro</button>
    `;
}