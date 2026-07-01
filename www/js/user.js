document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

function fetchUsers() {
    const tableBody = document.getElementById("tbody");

    fetch("../php/user.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            action: "getAll" // Cambiado para coincidir con tu caso en el PHP
        }),
    })
    .then(res => res.json())
    .then((json) => {
        tableBody.innerHTML = "";

        if (json.status === "error" || !json.data) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-error font-semibold">${json.message || "Error al cargar"}</td></tr>`;
            return;
        }

        const data = json.data;

        if (data.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-gray-500">No hay usuarios registrados.</td></tr>`;
            return;
        }

        data.forEach((user) => {
            const tr = document.createElement("tr");
            tr.className = "hover";

            const statusBadgeColor = user.status === "Active" ? "badge-success" : "badge-error";

            tr.innerHTML = `
                <td class="font-bold">${user.id_user}</td>
                <td class="font-medium text-base-content">${user.username}</td>
                <td>
                    <span class="badge ${statusBadgeColor} badge-sm font-semibold text-white">
                        ${user.status}
                    </span>
                </td>
                <td>
                    <span class="badge badge-neutral badge-outline font-medium">
                        ${user.role_name || "Rol ID: " + user.id_role}
                    </span>
                </td>
                <td class="text-center space-x-2">
                    <button class="btn btn-warning btn-xs font-semibold" onclick="editarUsuario(${user.id_user})">Editar</button>
                    <button class="btn btn-error btn-xs font-semibold text-white" onclick="eliminarUsuario(${user.id_user})">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    })
    .catch((error) => {
        console.error("Error:", error);
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-error font-semibold">Error de conexión.</td></tr>`;
    });
}

window.editarUsuario = function(id) {
    window.location.href = `insertar.html?id_user=${id}`;
};

window.eliminarUsuario = function(id) {
    if (confirm(`¿Seguro que deseas eliminar al usuario #${id}?`)) {
        fetch("../php/user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "delete", id_user: id })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                alert("Usuario eliminado correctamente.");
                fetchUsers();
            } else {
                alert("Error: " + json.message);
            }
        });
    }
};