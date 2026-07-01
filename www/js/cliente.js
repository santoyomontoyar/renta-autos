const tbody = document.querySelector("#tbody");
const formNuevoCliente = document.querySelector("#formNuevoCliente");
const formEditarCliente = document.querySelector("#formEditarCliente");

function cargarSelectIDs(selectElement) {
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsuariosIds" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            selectElement.innerHTML = '<option value="">Selecciona un ID...</option>';
            json.data.forEach(u => {
                selectElement.innerHTML += `<option value="${u.id_usuario}">${u.id_usuario}</option>`;
            });
        }
    });
}

if (tbody) {
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            tbody.innerHTML = json.data.map(c => `
                <tr class="border-b">
                    <td class="px-4 py-2 font-bold">#${c.id_cliente}</td>
                    <td class="px-4 py-2">${c.id_usuario}</td>
                    <td class="px-4 py-2">${c.nombre} ${c.apellido}</td>
                    <td class="px-4 py-2">${c.correo}</td>
                    <td class="px-4 py-2">${c.telefono}</td>
                    <td class="px-4 py-2">${c.estado}</td>
                    <td class="px-4 py-2">
                        <a href="editar.html?id=${c.id_cliente}" class="text-blue-600 mr-2 hover:underline">Editar</a> | 
                        <button onclick="borrarCliente(${c.id_cliente})" class="text-red-600 ml-2 hover:underline cursor-pointer">Eliminar</button>
                    </td>
                </tr>
            `).join('');
        }
    });
}

function borrarCliente(id) {
    if (confirm("¿Estás seguro de eliminar este cliente?")) {
        fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", id_cliente: id })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                location.reload(); 
            } else {
                alert("No se pudo eliminar. Revisa que no tenga rentas o documentos ligados.");
            }
        });
    }
}

if (formNuevoCliente) {
    const btnGuardar = document.querySelector("#btnGuardar");
    const selectUsuario = document.querySelector("#id_usuario");
    
    cargarSelectIDs(selectUsuario);

    btnGuardar.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (!selectUsuario.value) {
            alert("Por favor selecciona un ID de usuario.");
            return;
        }

        fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "insert", id_usuario: selectUsuario.value })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html"; 
            } else {
                alert("Error al insertar. Es posible que este ID ya esté registrado como cliente.");
            }
        });
    });
}

if (formEditarCliente) {
    const btnActualizar = document.querySelector("#btnActualizar");
    const inputIdCliente = document.querySelector("#id_cliente");
    const selectUsuarioEdit = document.querySelector("#id_usuario_edit");

    cargarSelectIDs(selectUsuarioEdit);

    const urlParams = new URLSearchParams(window.location.search);
    const idClienteActual = urlParams.get('id');

    if (idClienteActual) {
        inputIdCliente.value = idClienteActual;
    }

    btnActualizar.addEventListener("click", (e) => {
        e.preventDefault();
        
        if (!selectUsuarioEdit.value) {
            alert("Por favor selecciona el nuevo ID de usuario.");
            return;
        }

        fetch("../php/cliente.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "update", 
                id_cliente: idClienteActual, 
                id_usuario: selectUsuarioEdit.value 
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html"; 
            } else {
                alert("Error al actualizar. Es posible que este ID ya esté registrado como cliente.");
            }
        });
    });
}