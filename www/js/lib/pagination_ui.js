// Controles de paginación reutilizables (la página la calcula el servidor con LIMIT/OFFSET,
// aquí solo se dibujan los botones y se avisa al módulo qué página se pidió).

export function renderPagination(containerId, pagination, etiqueta, onCambiarPagina) {
    const cont = document.getElementById(containerId);
    if (!cont) return;

    const p = pagination;
    if (!p || p.totalRows === 0) {
        cont.innerHTML = `<span class="text-sm text-gray-500">No hay ${etiqueta} registrados.</span>`;
        return;
    }

    const inicio = (p.page - 1) * p.limit + 1;
    const fin = Math.min(p.page * p.limit, p.totalRows);

    let botones = `<button class="join-item btn btn-sm ${p.page <= 1 ? "btn-disabled" : ""}" id="btnPagAnterior">« Anterior</button>`;

    for (let i = 1; i <= p.totalPages; i++) {
        if (i === 1 || i === p.totalPages || (i >= p.page - 2 && i <= p.page + 2)) {
            botones += `<button class="join-item btn btn-sm pageBtn ${i === p.page ? "btn-primary" : ""}" data-page="${i}">${i}</button>`;
        } else if (i === p.page - 3 || i === p.page + 3) {
            botones += `<button class="join-item btn btn-sm btn-disabled">...</button>`;
        }
    }

    botones += `<button class="join-item btn btn-sm ${p.page >= p.totalPages ? "btn-disabled" : ""}" id="btnPagSiguiente">Siguiente »</button>`;

    cont.innerHTML = `
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
            <span class="text-sm text-gray-600 font-medium">
                Mostrando ${inicio} a ${fin} de ${p.totalRows} ${etiqueta}
            </span>
            <div class="join">${botones}</div>
        </div>
    `;

    cont.querySelectorAll(".pageBtn").forEach(btn => {
        btn.addEventListener("click", () => onCambiarPagina(parseInt(btn.dataset.page)));
    });

    const btnAnterior = document.getElementById("btnPagAnterior");
    const btnSiguiente = document.getElementById("btnPagSiguiente");

    if (btnAnterior && p.page > 1) {
        btnAnterior.addEventListener("click", () => onCambiarPagina(p.page - 1));
    }
    if (btnSiguiente && p.page < p.totalPages) {
        btnSiguiente.addEventListener("click", () => onCambiarPagina(p.page + 1));
    }
}