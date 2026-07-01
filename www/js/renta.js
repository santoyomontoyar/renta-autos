const tbody = document.querySelector("#tbody");
if (tbody) {
  fetch("../php/renta.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
  })
    .then(res => res.json())
    .then(json => {
      if (json.status === "success") {
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
              <td>
                <div class="flex gap-2">
                  <a href="editar_renta.html?id=${r.id_renta}" class="btn btn-xs btn-warning text-white font-semibold">
                     Editar
                  </a>
                  <button onclick="eliminarRenta(${r.id_renta})" class="btn btn-xs btn-error text-white font-semibold">
                     Eliminar
                  </button>
                </div>
              </td>
            </tr>
          `;
        });
      }
    });
}


const btnGuardar = document.getElementById("btnGuardar");
if (btnGuardar) {

  let listaVehiculos = [];
  let listaSeguros = [];

  
  fetch("../php/renta.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getFormNeeds" })
  })
  .then(res => res.json())
  .then(json => {
    if (json.status === "success") {
      const catalogs = json.data;
      listaVehiculos = catalogs.vehiculos;
      listaSeguros = catalogs.seguros;

      
      const selectCliente = document.getElementById("id_cliente");
      catalogs.clientes.forEach(c => {
        selectCliente.innerHTML += `<option value="${c.id_cliente}">${c.nombre} ${c.apellido}</option>`;
      });

      
      const selectVehiculo = document.getElementById("id_vehiculo");
      catalogs.vehiculos.forEach(v => {
        selectVehiculo.innerHTML += `<option value="${v.id_vehiculo}">${v.marca} ${v.nombre_modelo} ($${v.costo_diario}/día)</option>`;
      });

      const selectSeguro = document.getElementById("id_seguro");
      catalogs.seguros.forEach(s => {
        selectSeguro.innerHTML += `<option value="${s.id_seguro}">${s.tipo_seguro} ($${s.costo_diario}/día)</option>`;
      });

      const selectOrigen = document.getElementById("id_sucursal_origen");
      const selectDestino = document.getElementById("id_sucursal_destino");
      catalogs.sucursales.forEach(s => {
        const optionHtml = `<option value="${s.id_sucursal}">${s.nombre} (${s.ciudad})</option>`;
        selectOrigen.innerHTML += optionHtml;
        selectDestino.innerHTML += optionHtml;
      });
    }
  })
  .catch(err => console.error("Error cargando catálogos:", err));

  function calcularPrecioTotal() {
    const idVehiculo = document.getElementById("id_vehiculo").value;
    const idSeguro = document.getElementById("id_seguro").value;
    const fechaInicioVal = document.getElementById("fecha_inicio").value;
    const fechaFinVal = document.getElementById("fecha_fin").value;
    const inputPrecioCobrado = document.getElementById("precio_cobrado");

    if (!idVehiculo || !idSeguro || !fechaInicioVal || !fechaFinVal) {
      inputPrecioCobrado.value = "";
      return;
    }

    const fechaInicio = new Date(fechaInicioVal);
    const fechaFin = new Date(fechaFinVal);
    
    const diferenciaTiempo = fechaFin - fechaInicio;
    let dias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (dias <= 0) {
      dias = 1; 
    }

    const vehiculoSeleccionado = listaVehiculos.find(v => v.id_vehiculo == idVehiculo);
    const seguroSeleccionado = listaSeguros.find(s => s.id_seguro == idSeguro);

    if (vehiculoSeleccionado && seguroSeleccionado) {
      const costoCarroDiario = parseFloat(vehiculoSeleccionado.costo_diario);
      const costoSeguroDiario = parseFloat(seguroSeleccionado.costo_diario);

      const totalCalculado = (costoCarroDiario + costoSeguroDiario) * dias;
      inputPrecioCobrado.value = totalCalculado.toFixed(2);
    }
  }

  
  document.getElementById("id_vehiculo").addEventListener("change", calcularPrecioTotal);
  document.getElementById("id_seguro").addEventListener("change", calcularPrecioTotal);
  document.getElementById("fecha_inicio").addEventListener("change", calcularPrecioTotal);
  document.getElementById("fecha_fin").addEventListener("change", calcularPrecioTotal);

 
  btnGuardar.addEventListener("click", function() {
    let id_cliente = document.getElementById("id_cliente").value;
    let id_vehiculo = document.getElementById("id_vehiculo").value;
    let id_seguro = document.getElementById("id_seguro").value;
    let id_sucursal_origen = document.getElementById("id_sucursal_origen").value;
    let id_sucursal_destino = document.getElementById("id_sucursal_destino").value;
    let fecha_inicio = document.getElementById("fecha_inicio").value;
    let fecha_fin = document.getElementById("fecha_fin").value;
    let monto_deposito = document.getElementById("monto_deposito").value;
    let precio_cobrado = document.getElementById("precio_cobrado").value;

    if(!id_cliente || !id_vehiculo || !id_seguro || !id_sucursal_origen || !id_sucursal_destino || !fecha_inicio || !fecha_fin || !precio_cobrado) {
        alert("Por favor, rellena todos los parámetros requeridos antes de guardar.");
        return;
    }

    fetch("../php/renta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "insert",
        datos: {
          id_cliente: id_cliente,
          id_vehiculo: id_vehiculo,
          id_seguro: id_seguro,
          id_sucursal_origen: id_sucursal_origen,
          id_sucursal_destino: id_sucursal_destino,
          fecha_inicio: fecha_inicio,
          fecha_fin: fecha_fin,
          monto_deposito: monto_deposito,
          precio_cobrado: precio_cobrado,
          estado_deposito: "Retenido",
          estado: "Activa"
        }
      })
    })
    .then(res => res.json())
    .then(json => {
      if (json.status === "success") {
        alert(json.message);
        window.location.href = "index.html";
      } else {
        alert("Error: " + json.message);
      }
    })
    .catch(err => console.error("Error al insertar:", err));
  });
}