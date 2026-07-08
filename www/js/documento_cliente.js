document.addEventListener("DOMContentLoaded", () => {
    const btnGuardar = document.querySelector("#btnGuardar");
    const tbody = document.querySelector("#tbody");

    // LISTAR DOCUMENTOS
    if (tbody) {
        fetch("../php/documento_cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                tbody.innerHTML = json.data.map(d => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_documento}</td>
                        <td class="px-6 py-4 text-sm text-gray-700 font-medium">${d.nombre} ${d.apellido}</td>
                        <td class="px-6 py-4 text-sm font-medium text-gray-700">${(d.tipo_documento || '').replace('_', ' ')}</td>
                        <td class="px-6 py-4 text-sm font-mono text-gray-600">${d.numero_documento}</td>
                        <td class="px-6 py-4 text-sm text-gray-500">${d.fecha_vencimiento}</td>
                        <td class="px-6 py-4 text-sm px-4 py-2 space-x-2">
                            <a href="#" class="text-green-600 hover:underline font-semibold">Editar</a>
                            <a href="#" class="text-red-600 hover:underline font-semibold">Eliminar</a>
                        </td>
                    </tr>
                `).join('');
            }
        })
        .catch(err => console.error("Error al cargar documentos:", err));

        return;
    }

    // FORMULARIO
    const selectCliente = document.querySelector("#id_cliente");
    const TipoDocumento = document.querySelector("#TipoDocumento");
    const NumeroDocumento = document.querySelector("#NumeroDocumento");
    const FechaVencimiento = document.querySelector("#FechaVencimiento");
    const UrlArchivo = document.querySelector("#UrlArchivo");
    const form = document.querySelector("#form_document_client");

    if (!btnGuardar || !selectCliente || !TipoDocumento || !NumeroDocumento || !FechaVencimiento || !UrlArchivo || !form) {
        console.error("Faltan elementos del formulario");
        return;
    }

    // CARGAR CLIENTES EN EL SELECT
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            json.data.forEach(cliente => {
                const option = document.createElement("option");
                option.value = cliente.id_cliente;
                option.textContent = `${cliente.nombre} ${cliente.apellido}`;
                selectCliente.appendChild(option);
            });
        } else {
            console.error("No se pudieron cargar los clientes");
        }
    })
    .catch(err => console.error("Error cargando clientes:", err));

    // GUARDAR DOCUMENTO
    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();

        const payload = {
            action: "insert",
            id_cliente: selectCliente.value,
            tipo_documento: TipoDocumento.value,
            numero_documento: NumeroDocumento.value,
            fecha_vencimiento: FechaVencimiento.value,
            url_archivo: UrlArchivo.value
        };

        try {
            const res = await fetch("../php/documento_cliente.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            console.log(json);

            if (json.status === "success") {
                alert("Datos guardados correctamente");
                form.reset();
                selectCliente.selectedIndex = 0;
            } else {
                alert(json.message || "No se pudo guardar");
            }
        } catch (err) {
            console.error("Error al guardar:", err);
            alert("Error al guardar los datos");
        }
    });
});