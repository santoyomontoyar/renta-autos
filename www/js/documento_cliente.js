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
                            <button class="btn-edit text-green-600 hover:underline font-semibold cursor-pointer" data-id="${d.id_documento}" type="button">Editar</button>
                            <button class="btn-delete text-red-600 hover:underline font-semibold cursor-pointer" data-id="${d.id_documento}" type="button">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
                }
            })
            .catch(err => console.error("Error al cargar documentos:", err));

        tbody.addEventListener("click", async (e) => {
            const btnEditar = e.target.closest(".btn-edit");
            const btnEliminar = e.target.closest(".btn-delete");

            if (btnEditar) {
                const id_documento = btnEditar.dataset.id;
                window.location.href = `../documento_cliente/edit.html?id_documento=${id_documento}`;
                return;
            }

            if (btnEliminar) {
                const id_documento = btnEliminar.dataset.id;

                const result = await Swal.fire({
                    title: "¿Estás seguro?",
                    text: "Este registro se eliminará permanentemente.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Sí, eliminar"
                });

                if (!result.isConfirmed) return;

                fetch("../php/documento_cliente.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "delete", id_documento })
                })
                    .then(res => res.json())
                    .then(json => {
                        if (json.status === "success") {
                            Swal.fire({
                                icon: "success",
                                title: "Eliminado",
                                text: "El registro ha sido eliminado correctamente.",
                            });
                            location.reload();
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: json.message || "No se pudo eliminar.",
                            });
                        }
                    })
                    .catch(err => {
                        console.error("Error al eliminar:", err);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Ocurrió un error al eliminar el registro.",
                        });
                    });
            }
        });
        return;
    }

    // FORMULARIO
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

    // Obtener el ID desde la URL
    const params = new URLSearchParams(window.location.search);
    const id_documento = params.get("id_documento");

    async function cargarDocumentoPorId(id) {
        const res = await fetch("../php/documento_cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getById",
                id_documento: id
            })
        });

        const json = await res.json();
        console.log(json.data);

        if (json.status === "success") {
            const d = json.data;
            selectCliente.value = String(d.id_cliente);
            TipoDocumento.value = d.tipo_documento;
            NumeroDocumento.value = d.numero_documento;
            FechaVencimiento.value = d.fecha_vencimiento;
            UrlArchivo.value = d.url_archivo;
        } else {
            alert(json.message || "No se pudo cargar el documento");
        }
    }

    if (id_documento) {
        cargarDocumentoPorId(id_documento);
    }

    btnGuardar.addEventListener("click", async (e) => {
        e.preventDefault();

        const payload = {
            action: id_documento ? "update" : "insert",
            id_documento: id_documento,
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

            if (json.status === "success") {
                alert(id_documento ? "Datos actualizados correctamente" : "Datos guardados correctamente");
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