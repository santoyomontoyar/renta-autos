export function poblarSelects(catalogs) {
    document.getElementById("clienteList").innerHTML = catalogs.clientes
        .map(c => `<option value="${c.nombre} ${c.apellido}">`).join('');

    document.getElementById("vehiculoList").innerHTML = [...new Set(catalogs.vehiculos.map(v => `${v.marca} ${v.nombre_modelo}`))]
    .map(texto => `<option value="${texto}">`).join('');

    document.getElementById("id_seguro").innerHTML += catalogs.seguros
        .map(s => `<option value="${s.id_seguro}">${s.tipo_seguro} ($${s.costo_diario}/día)</option>`).join('');

    const opcionesSucursal = catalogs.sucursales
        .map(s => `<option value="${s.id_sucursal}">${s.nombre} (${s.ciudad})</option>`).join('');
    document.getElementById("id_sucursal_origen").innerHTML += opcionesSucursal;
    document.getElementById("id_sucursal_destino").innerHTML += opcionesSucursal;
}

export function resolverCliente(clientes) {
    const texto = document.getElementById("cliente_texto").value.trim();
    const hint = document.getElementById("clienteHint");
    const encontrado = clientes.find(c => `${c.nombre} ${c.apellido}`.toLowerCase() === texto.toLowerCase());

    if (encontrado) {
        document.getElementById("id_cliente").value = encontrado.id_cliente;
        hint.textContent = `✓ ${encontrado.correo}`;
        hint.className = "text-xs mt-1 text-green-600";
    } else {
        document.getElementById("id_cliente").value = '';
        hint.textContent = texto ? "Ese cliente no existe, verifica el nombre" : '';
        hint.className = "text-xs mt-1 text-red-500";
    }
}

export function actualizarPlacaCascada(vehiculos) {
    const texto = document.getElementById("vehiculo_texto").value.trim();
    const placaInput = document.getElementById("placa_texto");
    const placaListEl = document.getElementById("placaList");
    const hint = document.getElementById("vehiculoHint");

    document.getElementById("id_vehiculo").value = '';
    placaInput.value = '';

    if (!texto) {
        placaInput.disabled = true;
        placaListEl.innerHTML = '';
        hint.textContent = '';
        return;
    }

    const candidatos = vehiculos.filter(v => `${v.marca} ${v.nombre_modelo}`.toLowerCase() === texto.toLowerCase());

    if (candidatos.length === 0) {
        placaInput.disabled = true;
        placaListEl.innerHTML = '';
        hint.textContent = "Ese modelo no existe";
        hint.className = "text-xs mt-1 text-red-500";
        return;
    }

    placaInput.disabled = false;
    placaListEl.innerHTML = candidatos.map(v => `<option value="${v.placa}">`).join('');
    hint.textContent = `${candidatos.length} disponible(s), elige la placa`;
    hint.className = "text-xs mt-1 text-gray-500";
}

export function resolverVehiculoPorPlaca(vehiculos) {
    const texto = document.getElementById("vehiculo_texto").value.trim();
    const placa = document.getElementById("placa_texto").value.trim();
    const hint = document.getElementById("vehiculoHint");

    const encontrado = vehiculos.find(v =>
        `${v.marca} ${v.nombre_modelo}`.toLowerCase() === texto.toLowerCase() &&
        v.placa.toLowerCase() === placa.toLowerCase()
    );

    if (encontrado) {
        document.getElementById("id_vehiculo").value = encontrado.id_vehiculo;
        hint.textContent = `✓ $${encontrado.costo_diario}/día`;
        hint.className = "text-xs mt-1 text-green-600";
    } else {
        document.getElementById("id_vehiculo").value = '';
        hint.textContent = placa ? "Esa placa no corresponde a ese modelo" : '';
        hint.className = "text-xs mt-1 text-red-500";
    }
}

export function calcularPrecioTotal(listaVehiculos, listaSeguros) {
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
    let dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24));
    if (dias <= 0) dias = 1;

    const vehiculoSeleccionado = listaVehiculos.find(v => v.id_vehiculo == idVehiculo);
    const seguroSeleccionado = listaSeguros.find(s => s.id_seguro == idSeguro);

    if (vehiculoSeleccionado && seguroSeleccionado) {
        const total = (parseFloat(vehiculoSeleccionado.costo_diario) + parseFloat(seguroSeleccionado.costo_diario)) * dias;
        inputPrecioCobrado.value = total.toFixed(2);
    }
}
export function hayConflictoReserva(reservas, id_vehiculo, fechaInicio, fechaFin, excluirIdRenta) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    return reservas.some(r => {
        if (r.id_vehiculo != id_vehiculo) return false;
        if (excluirIdRenta && r.id_renta == excluirIdRenta) return false;
        if (r.estado === "Finalizada" || r.estado === "Cancelada") return false;

        const rInicio = new Date(r.fecha_inicio);
        const rFin = new Date(r.fecha_fin);
        return inicio < rFin && rInicio < fin; // se traslapan
    });
}
export function clienteTieneRentaActiva(reservas, id_cliente, excluirIdRenta) {
    return reservas.some(r => {
        if (r.id_cliente != id_cliente) return false;
        if (excluirIdRenta && r.id_renta == excluirIdRenta) return false;
        return r.estado !== "Finalizada" && r.estado !== "Cancelada";
    });
}