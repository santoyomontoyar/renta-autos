export default function form(modelos = []) {
    const modeloOptions = modelos.map(m =>
        `<option value="${m.id_modelo}">${m.marca} ${m.nombre_modelo} (${m.year})</option>`
    ).join('');

    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        <h2 class="text-xl font-bold text-gray-700 mb-4 font-sans">Administrar Imagen de Modelo</h2>
        
        <input type="hidden" id="id_imagen">

        <div class="mb-3">
            <label for="id_modelo" class="block text-sm font-semibold mb-1 text-gray-600">Modelo de Vehículo</label>
            <select id="id_modelo" class="select select-bordered w-full">
                <option value="">Selecciona un modelo</option>
                ${modeloOptions}
            </select>
        </div>

        <div class="mb-3">
            <label for="url_archivo" class="block text-sm font-semibold mb-1 text-gray-600">URL de la Imagen</label>
            <input type="url" id="url_archivo" class="input input-bordered w-full" placeholder="https://ejemplo.com/foto.jpg">
        </div>

        <div class="mb-3">
            <label for="es_principal" class="block text-sm font-semibold mb-1 text-gray-600">Tipo de Imagen / Destino</label>
            <select id="es_principal" class="select select-bordered w-full">
                <option value="0">Galería Secundaria</option>
                <option value="1">Portada / Vista Principal</option>
            </select>
        </div>
        
        <button type="button" id="saveBtn" class="btn btn-primary w-full mt-4 text-white">Guardar Imagen</button>
    `;
}