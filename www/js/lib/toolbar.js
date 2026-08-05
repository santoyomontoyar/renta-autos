// Barra reutilizable de "+ Agregar" + "Buscar" + "Ordenar por" + "Ascendente/Descendente"
// + un filtro extra opcional (dropdown de catálogo, ej. categoría)
// Mismo estilo visual que el toolbar del módulo de Usuarios
// (caja gris redondeada, selects "select-sm bg-white", label en mayúsculas)
//
// campos: [{ value: 'id_modelo', label: 'ID' }, ...]  -> opciones del <select> de orden
// boton (opcional): { label: '+ Agregar Imagen', onClick: () => {...} } -> se dibuja a la izquierda, dentro de la caja
// filtroExtra (opcional): { label: 'Categoría', opciones: ['Sedán','SUV',...] }
// onChange({ buscar, orderBy, orderDir, filtroExtra }) se llama cada vez que el usuario cambia algo

export function renderToolbar(containerId, campos, opciones = {}) {
    const cont = document.getElementById(containerId);
    if (!cont) return;

    const placeholderBusqueda = opciones.placeholderBusqueda || "Buscar...";
    const filtroExtra = opciones.filtroExtra || null;
    const boton = opciones.boton || null;

    cont.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
            <div class="flex flex-wrap items-center gap-3 flex-1 min-w-[220px]">
                ${boton ? `<button type="button" id="toolbarBtnAgregar" class="btn btn-primary">${boton.label}</button>` : ""}
                <input
                    type="text"
                    id="inputBuscar"
                    class="input input-bordered input-sm w-full max-w-xs bg-white"
                    placeholder="${placeholderBusqueda}">
            </div>

            <div class="flex flex-wrap items-center gap-3">
                ${filtroExtra ? `
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-500">${filtroExtra.label}:</span>
                    <select id="selectFiltroExtra" class="select select-bordered select-sm bg-white">
                        <option value="">Todas</option>
                        ${filtroExtra.opciones.map(op => `<option value="${op}">${op}</option>`).join("")}
                    </select>
                </div>` : ""}

                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-gray-500">Ordenar por:</span>
                    <select id="selectOrderBy" class="select select-bordered select-sm bg-white">
                        ${campos.map(c => `<option value="${c.value}">${c.label}</option>`).join("")}
                    </select>
                </div>

                <div class="flex items-center gap-2">
                    <select id="selectOrderDir" class="select select-bordered select-sm bg-white">
                        <option value="ASC">Ascendente (1-9 / A-Z)</option>
                        <option value="DESC">Descendente (9-1 / Z-A)</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    const inputBuscar = document.getElementById("inputBuscar");
    const selectOrderBy = document.getElementById("selectOrderBy");
    const selectOrderDir = document.getElementById("selectOrderDir");
    const selectFiltroExtra = document.getElementById("selectFiltroExtra");
    const btnAgregar = document.getElementById("toolbarBtnAgregar");

    const emitirCambio = () => opciones.onChange({
        buscar: inputBuscar.value.trim(),
        orderBy: selectOrderBy.value,
        orderDir: selectOrderDir.value,
        filtroExtra: selectFiltroExtra ? selectFiltroExtra.value : ""
    });

    let timeoutBusqueda;
    inputBuscar.addEventListener("input", () => {
        clearTimeout(timeoutBusqueda);
        timeoutBusqueda = setTimeout(emitirCambio, 350); // pequeño debounce para no saturar la base de datos
    });

    selectOrderBy.addEventListener("change", emitirCambio);
    selectOrderDir.addEventListener("change", emitirCambio);
    if (selectFiltroExtra) selectFiltroExtra.addEventListener("change", emitirCambio);
    if (btnAgregar && boton.onClick) btnAgregar.addEventListener("click", boton.onClick);
}