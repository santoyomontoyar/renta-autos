export default function form(fallas = []) {
    const fallaOptions = fallas.map(f =>
        `<option value="${f.id_falla}">#${f.id_falla} - ${f.descripcion.slice(0, 40)}</option>`
    ).join('');

    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        <input type="hidden" id="id_imagen">
        <div class="mb-3">
            <label for="id_falla">Falla</label>
            <select id="id_falla" class="select select-bordered w-full">
                <option value="">Selecciona una falla</option>
                ${fallaOptions}
            </select>
        </div>
        <div class="mb-3">
            <label for="url_archivo">URL de la imagen</label>
            <input type="text" id="url_archivo" class="input input-bordered w-full" placeholder="https://...">
            <p class="text-xs text-gray-500 mt-1">Por ahora se pega el link directo de la imagen</p>
        </div>
        <button type="button" id="saveBtn" class="btn btn-primary">Guardar</button>
    `;
}