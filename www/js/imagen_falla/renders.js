export default function renderImagenes(imagenes) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = imagenes.map(i => `
        <tr>
            <td>#${i.id_imagen}</td>
            <td>${i.falla_descripcion.slice(0, 40)}</td>
            <td>
            <a href="${i.url_archivo}" target="_blank">
                <img src="${i.url_archivo}" alt="Falla" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; cursor: pointer;">
            </a>
            </td>
            <td>${i.fecha_subida}</td>
            <td>
                <button data-id="${i.id_imagen}" class="editBtn btn btn-sm btn-warning">Editar</button>
                <button data-id="${i.id_imagen}" class="deleteBtn btn btn-sm btn-error">Eliminar</button>
            </td>
        </tr>
    `).join('');
}