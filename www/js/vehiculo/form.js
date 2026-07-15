export default function form(modelos = [], sucursales = []) {
    const marcas = [...new Set(modelos.map(m => m.marca))];
    const nombresModelo = [...new Set(modelos.map(m => m.nombre_modelo))];
    const years = [...new Set(modelos.map(m => m.year))];

    const marcaOptions = marcas.map(m => `<option value="${m}">`).join('');
    const modeloOptions = nombresModelo.map(m => `<option value="${m}">`).join('');
    const yearOptions = years.map(y => `<option value="${y}">`).join('');

    const sucursalOptions = sucursales.map(s =>
        `<option value="${s.id_sucursal}">${s.nombre} - ${s.ciudad}</option>`
    ).join('');

    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        <input type="hidden" id="id_vehiculo">
        <input type="hidden" id="id_modelo">

        <div class="mb-3">
    <label for="marca">Marca</label>
    <input type="text" id="marca" list="marcaList" class="input input-bordered w-full" autocomplete="off">
    <datalist id="marcaList">${marcaOptions}</datalist>
</div>
<div class="mb-3">
    <label for="nombre_modelo">Modelo</label>
    <input type="text" id="nombre_modelo" list="modeloList" class="input input-bordered w-full" autocomplete="off" disabled>
    <datalist id="modeloList"></datalist>
</div>
<div class="mb-3">
    <label for="year">Año</label>
    <input type="text" id="year" list="yearList" class="input input-bordered w-full" autocomplete="off" disabled>
    <datalist id="yearList"></datalist>
</div>
        <p id="modeloHint" class="text-xs mb-3"></p>

        <div class="mb-3">
            <label for="id_sucursal_actual">Sucursal</label>
            <select id="id_sucursal_actual" class="select select-bordered w-full">
                <option value="">Selecciona una sucursal</option>
                ${sucursalOptions}
            </select>
        </div>
        <div class="mb-3">
            <label for="placa">Placa</label>
            <input type="text" id="placa" class="input input-bordered w-full">
        </div>
        <div class="mb-3">
            <label for="transmision">Transmisión</label>
            <select id="transmision" class="select select-bordered w-full">
                <option value="Manual">Manual</option>
                <option value="Automatica">Automática</option>
            </select>
        </div>
        <div class="mb-3">
            <label for="estado">Estado</label>
            <select id="estado" class="select select-bordered w-full">
                <option value="Disponible">Disponible</option>
                <option value="Rentado">Rentado</option>
                <option value="Mantenimiento">Mantenimiento</option>
            </select>
        </div>
        <button type="button" id="saveBtn" class="btn btn-primary">Guardar</button>
    `;
}