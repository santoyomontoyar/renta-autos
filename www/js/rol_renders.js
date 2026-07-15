export default function renderRoles(roles) {
    const tbody = document.querySelector('#tbody');
    tbody.innerHTML = "";
 
    roles.forEach(d => {
        tbody.innerHTML += `
        <tr>
            <td>${d.id_rol}</td>
            <td>${d.nombre}</td>
            <td>
                <a href="#" data-id="${d.id_rol}" class="editBtn btn btn-info">editar</a>
                <a href="#" data-id="${d.id_rol}" class="deleteBtn btn btn-error">eliminar</a>
            </td>
        </tr>`;
    });
}