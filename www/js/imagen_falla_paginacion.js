export function ordenarDatos(datos, campo, direccion) {
    return [...datos].sort((a, b) => {
        let va = a[campo];
        let vb = b[campo];

        if (va === null || va === undefined) va = "";
        if (vb === null || vb === undefined) vb = "";

        const numA = parseFloat(va);
        const numB = parseFloat(vb);
        const sonNumeros = va !== "" && vb !== "" && !isNaN(numA) && !isNaN(numB);

        if (sonNumeros) {
            va = numA;
            vb = numB;
        } else {
            va = String(va).toLowerCase();
            vb = String(vb).toLowerCase();
        }

        if (va < vb) return direccion === "asc" ? -1 : 1;
        if (va > vb) return direccion === "asc" ? 1 : -1;
        return 0;
    });
}

export function paginar(datos, pagina, porPagina) {
    const inicio = (pagina - 1) * porPagina;
    return datos.slice(inicio, inicio + porPagina);
}

export function renderControlesPaginacion(contenedorId, paginaActual, totalRegistros, porPagina, onCambiarPagina) {
    const cont = document.getElementById(contenedorId);
    if (!cont) return;

    const totalPag = Math.max(1, Math.ceil(totalRegistros / porPagina));

    cont.innerHTML = `
        <div class="flex items-center justify-between mt-4 flex-wrap gap-2">
            <span class="text-sm text-gray-600">
                Mostrando ${totalRegistros === 0 ? 0 : ((paginaActual - 1) * porPagina) + 1}
                - ${Math.min(paginaActual * porPagina, totalRegistros)}
                de ${totalRegistros} registros
            </span>
            <div class="flex gap-2 items-center">
                <button type="button" id="btnPagAnterior" class="btn btn-sm" ${paginaActual <= 1 ? "disabled" : ""}>« Anterior</button>
                <span class="text-sm">Página ${paginaActual} de ${totalPag}</span>
                <button type="button" id="btnPagSiguiente" class="btn btn-sm" ${paginaActual >= totalPag ? "disabled" : ""}>Siguiente »</button>
            </div>
        </div>
    `;

    const btnAnterior = document.getElementById("btnPagAnterior");
    const btnSiguiente = document.getElementById("btnPagSiguiente");

    if (btnAnterior) btnAnterior.addEventListener("click", () => onCambiarPagina(paginaActual - 1));
    if (btnSiguiente) btnSiguiente.addEventListener("click", () => onCambiarPagina(paginaActual + 1));
}

export function wireSortableHeaders(theadSelector, onSortChange) {
    const encabezados = document.querySelectorAll(`${theadSelector} th[data-sort]`);

    encabezados.forEach(th => {
        th.style.cursor = "pointer";
        th.style.userSelect = "none";

        if (!th.querySelector(".sort-arrow")) {
            th.innerHTML += ` <span class="sort-arrow text-xs text-gray-400"></span>`;
        }

        th.addEventListener("click", () => {
            const campo = th.dataset.sort;
            const direccionActual = th.dataset.direccion === "asc" ? "desc" : "asc";

            encabezados.forEach(otro => {
                otro.dataset.direccion = "";
                const flecha = otro.querySelector(".sort-arrow");
                if (flecha) flecha.textContent = "";
            });

            th.dataset.direccion = direccionActual;
            const flecha = th.querySelector(".sort-arrow");
            if (flecha) flecha.textContent = direccionActual === "asc" ? "▲" : "▼";

            onSortChange(campo, direccionActual);
        });
    });
}