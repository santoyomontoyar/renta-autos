const tbody = document.querySelector("#tbody");
const formNuevoCliente = document.querySelector("#formNuevoCliente");

if (tbody) cargarClientes();
if (formNuevoCliente) iniciarFormulario();

function cargarClientes() {
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            tbody.innerHTML = "";
            json.data.forEach(c => {
                tbody.innerHTML += `
                <tr class="border-b">
                    <td class="px-4 py-2 font-bold">#${c.id_cliente}</td>
                    <td class="px-4 py-2">${c.id_usuario}</td>
                    <td class="px-4 py-2">${c.nombre} ${c.apellido}</td>
                    <td class="px-4 py-2">${c.correo}</td>
                    <td class="px-4 py-2">${c.telefono}</td>
                    <td class="px-4 py-2">${c.estado}</td>
                    <td class="px-4 py-2">
                        <a href="editar.html" class="text-blue-600 mr-2 hover:underline">editar</a> | 
                        <a href="#" data-id="${c.id_cliente}" class="elim text-red-600 ml-2 hover:underline">eliminar</a>
                    </td>
                </tr>`;
            });
        }
    });
}
function iniciarFormulario() {
    const btnGuardar = document.querySelector("#btnGuardar");
    const selectUsuario = document.querySelector("#id_usuario");
    
    fetch("../php/cliente.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsuariosIds" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            selectUsuario.innerHTML = '<option value="">Selecciona un usuario...</option>';
            json.data.forEach(u => {
                selectUsuario.innerHTML += `<option value="${u.id_usuario}">${u.nombre} ${u.apellido} (ID: ${u.id_usuario})</option>`;
            });
        }
    });

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

if (tbody) {
    tbody.addEventListener('click', function(evento) {
        if (evento.target && evento.target.matches('.elim')) {
            evento.preventDefault();
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Estás seguro de eliminar este registro?",
                text: "¡No vas a poder revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("../php/cliente.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "delete_cliente", id_cliente: id })
                    })
                    .then(res => res.json())
                    .then(json => {
                        if (json.status === "success") {
                            Swal.fire("Borrado", "Tu registro ha sido eliminado.", "success");
                            cargarClientes();
                        } else {
                            Swal.fire("Error", json.message, "error");
                        }
                    });
                } 
            });
        }
    });
}