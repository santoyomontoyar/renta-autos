export default function renderUsuarios(usuarios) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id_usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>${u.correo}</td>
            <td>${u.telefono}</td>
            <td>${u.estado}</td>
            <td>${u.rol}</td>
            <td>
                <a href="editar.html?id=${u.id_usuario}" class="btn btn-sm btn-warning text-white">editar</a>
                <a href="#" data-id="${u.id_usuario}" class="btn btn-sm btn-error text-white">eliminar</a>
            </td>
        </tr>
    `).join('');
}