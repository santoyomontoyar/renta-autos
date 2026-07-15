const nav = document.createElement('nav');
nav.className = 'navbar bg-neutral text-neutral-content px-6 shadow-md flex justify-between items-center';
nav.innerHTML = `
    <div class="flex-1 flex items-center gap-3">
        <span class="text-xl font-bold">${document.title}</span>
    </div>
    <div class="flex-none">
        <ul class="menu menu-horizontal px-1 gap-1 items-center">
            <!-- Módulos Principales -->
            <li><a href="/users">Usuarios</a></li>
            <li><a href="/cliente">Clientes</a></li>
            <li><a href="/documento_cliente">Documentos</a></li>
            <li><a href="/vehiculo">Vehículos</a></li>
            <li><a href="/renta">Rentas</a></li>
            <li><a href="/cargo_adicional">Cargos Adicionales</a></li>
            <li><a href="/imagen_modelo_vehiculo">Imágenes de Modelos</a></li>

            <!-- Menú Desplegable (Dropdown) para los módulos restantes -->
            <li class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="m-1 font-semibold flex items-center gap-1">
                    Más Módulos 
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-neutral text-neutral-content rounded-box z-50 w-52 p-2 shadow-xl border border-gray-700 mt-2">
                    <li><a href="/seguro">Seguros</a></li>
                    <li><a href="/tipo_seguro">Tipos de Seguro</a></li>
                    <li><a href="/rol">Roles</a></li>
                    <li><a href="/reporte_falla">Fallas</a></li>
                    <li><a href="/modelo_vehiculo">Modelos</a></li>
                    <li><a href="/sucursal">Sucursales</a></li>
                </ul>
            </li>
        </ul>
    </div>
`;
document.body.prepend(nav);