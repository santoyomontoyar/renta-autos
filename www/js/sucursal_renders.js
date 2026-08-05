export default function renderSucursal(sucursales) {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = "";

     if (!Array.isArray(sucursales) || sucursales.length === 0) {
        tbody.innerHTML = `
        <tr>
            <td colspan="4" class="text-center py-6 text-gray-500">
                Sin coincidencias.
            </td>
        </tr>`;
        return;
    }


 
    sucursales.forEach(d => {
        tbody.innerHTML += `
        <tr>
            <td>${d.id_sucursal}</td>
            <td>${d.nombre}</td>
            <td>${d.ciudad}</td>
            <td>
                <a href="#" data-id="${d.id_sucursal}" class="editBtn btn btn-info">editar</a>
                <a href="#" data-id="${d.id_sucursal}" class="deleteBtn btn btn-error">eliminar</a>
            </td>
        </tr>`;
    });
}
 