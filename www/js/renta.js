fetch("../php/renta.php", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "getAll" })
})
  .then(res => res.json())
  .then(json => {
    if (json.status === "success") {
      const tbody = document.querySelector("#tbody");
      json.data.forEach(r => {
        tbody.innerHTML += `
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
          </tr>
        `;
      });
    }
  });