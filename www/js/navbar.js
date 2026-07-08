const nav = document.createElement('nav');
nav.className = 'navbar bg-neutral text-neutral-content px-6 shadow-md';
nav.innerHTML = `
  <div class="flex-1 flex items-center gap-3">
    <span class="text-xl font-bold">${document.title}</span>

    <a href="./insertar.html"
       class="w-8 h-8 bg-green-500 hover:bg-green-600
              text-white font-bold text-lg
              flex items-center justify-center
              rounded transition"
       title="Agregar">
        +
    </a>
</div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1 gap-1">
      <li><a href="/users">Usuarios</a></li>
      <li><a href="/cliente">Clientes</a></li>
      <li><a href="/documento_cliente">Documentos</a></li>
      <li><a href="/vehiculo">Vehículos</a></li>
      <li><a href="/renta">Rentas</a></li>
      <li><a href="/seguro">Seguros</a></li>
      <li><a href="/tipo_seguro">Tipos de Seguro</a></li>
      <li><a href="/rol">Roles</a></li>
      <li><a href="/reporte_falla">Fallas</a></li>
      <li><a href="/modelo_vehiculo">Modelos</a></li>
      <li><a href="/sucursal">Sucursales</a></li>
    </ul>
  </div>
`;
document.body.prepend(nav);
