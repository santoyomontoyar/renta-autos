export default function renderFallas(fallas) {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = "";
 
    fallas.forEach(d => {
        tbody.innerHTML += `
        <tr>
            <td>${d.id_falla}</td>
            <td>${d.id_renta}</td>
            <td>${d.id_usuario}</td>
            <td>${d.descripcion}</td>
            <td>${d.fecha_reporte}</td>
            <td>
                <a href="#" data-id="${d.id_falla}" class="editBtn btn btn-info">editar</a>
                <a href="#" data-id="${d.id_falla}" class="deleteBtn btn btn-error">eliminar</a>
            </td>
        </tr>`;
    });
}