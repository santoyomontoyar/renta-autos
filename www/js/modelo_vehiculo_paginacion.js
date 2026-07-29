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