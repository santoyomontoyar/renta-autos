export default function renderRenta(rentas) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = rentas.map(r => `
        <tr>
          <td>${r.id_renta}</td>
          <td>${r.cliente}</td>
          <td>${r.vehiculo}</td>
          <td>${r.seguro}</td>
          <td>${r.sucursal_origen}</td>
          <td>${r.sucursal_destino}</td>
          <td>${r.fecha_inicio}</td>
          <td>${r.fecha_fin}</td>
          <td>${r.monto_deposito}</td>
          <td>${r.estado_deposito}</td>
          <td>$${r.precio_cobrado}</td>
          <td>${r.estado}</td>
          <td>
            <div class="flex gap-2">
              <a href="editar.html?id=${r.id_renta}" class="btn btn-sm mr-2 btn-warning text-white font-semibold">Editar</a>
              <button data-id="${r.id_renta}" class="deleteBtn btn btn-sm mr-2 btn-error text-white font-semibold">Eliminar</button>
            </div>
          </td>
        </tr>
    `).join('');
}