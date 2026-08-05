// Arma la barra de navegación mostrando solo los módulos que el rol actual
// tiene permitidos (tabla definida en lib/roles_config.js).
const TODOS_LOS_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/users", label: "Usuarios" },
    { href: "/cliente", label: "Clientes" },
    { href: "/documento_cliente", label: "Documentos" },
    { href: "/vehiculo", label: "Vehículos" },
    { href: "/renta", label: "Rentas" },
    { href: "/cargo_adicional", label: "Cargos Adicionales" },
    { href: "/imagen_modelo_vehiculo", label: "Imágenes de Modelos" }
];

const LINKS_DROPDOWN = [
    { href: "/seguro", label: "Seguros" },
    { href: "/tipo_seguro", label: "Tipos de Seguro" },
    { href: "/rol", label: "Roles" },
    { href: "/reporte_falla", label: "Fallas" },
    { href: "/imagen_falla", label: "Imágenes de Fallas" },
    { href: "/modelo_vehiculo", label: "Modelos" },
    { href: "/sucursal", label: "Sucursales" }
];

function esVisible(href, permitidos) {
    return permitidos.includes(href.replace("/", ""));
}

function construirNavbar(rol) {
    const permitidos = window.MODULOS_POR_ROL[rol] ?? [];

    const linksPrincipales = TODOS_LOS_LINKS
        .filter(l => esVisible(l.href, permitidos))
        .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
        .join("");

    const linksDropdown = LINKS_DROPDOWN
        .filter(l => esVisible(l.href, permitidos))
        .map(l => `<li><a href="${l.href}">${l.label}</a></li>`)
        .join("");

    const nav = document.createElement('nav');
    nav.className = 'navbar bg-neutral text-neutral-content px-6 shadow-md flex justify-between items-center';
    nav.innerHTML = `
    <div class="flex-1 flex items-center gap-3">
        <span class="text-xl font-bold">${document.title}</span>
    </div>
    <div class="flex-none flex items-center gap-3">
        <ul class="menu menu-horizontal px-1 gap-1 items-center">
            ${linksPrincipales}
            ${linksDropdown ? `
            <li class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="m-1 font-semibold flex items-center gap-1">
                    Más Módulos
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-neutral text-neutral-content rounded-box z-50 w-52 p-2 shadow-xl border border-gray-700 mt-2">
                    ${linksDropdown}
                </ul>
            </li>` : ''}
        </ul>
        <button id="logoutBtn" class="btn btn-sm btn-outline btn-error">Cerrar sesión</button>
    </div>
`;
    document.body.prepend(nav);
    document.querySelector("#logoutBtn").addEventListener("click", cerrarSesion);
}

async function cerrarSesion() {
    try {
        await fetch("../php/user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" })
        });
    } finally {
        window.location.href = "/";
    }
}

document.addEventListener("sesionLista", () => {
    construirNavbar(window.currentUser.rol);
});