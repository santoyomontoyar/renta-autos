const tbody = document.querySelector("#tbody");
const formNuevoCliente = document.querySelector("#formNuevoCliente");

function cargarSelectIDs(selectElement) {
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsuariosIds" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            selectElement.innerHTML = '<option value="">Selecciona un usuario...</option>';
            json.data.forEach(u => {
                selectElement.innerHTML += `<option value="${u.id_usuario}">${u.nombre} ${u.apellido} (ID: ${u.id_usuario})</option>`;
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
                        <a href="editar.html" class="text-blue-600 mr-2 hover:underline">editar</a> | 
                        <a href="eliminar.html" class="text-red-600 ml-2 hover:underline">eliminar</a>
                    </td>
                </tr>
            `).join('');
        }
    });
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