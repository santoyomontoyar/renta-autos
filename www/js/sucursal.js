document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#tbody");
    const btnGuardar = document.querySelector("#btnGuardar");

        if (tbody) {
           cargarSucursales();        

        tbody.addEventListener("click", function (evento) {
        if (evento.target && evento.target.matches(".btn-error")) {
            const id = evento.target.getAttribute("data-id");

            Swal.fire({
                title: "¿Estás seguro de eliminar este registro?",
                text: "No vas a poder revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
            }).then((result) => {
                if (result.isConfirmed) {
                    const datos = { action: "delete_sucursal", id_sucursal: id };

                    fetch("../php/sucursal.php", {
                        method: "POST",
                        headers: {"Content-Type": "application/json" },
                        body: JSON.stringify(datos)
                    })

                    .then(res => res.json())
                    .then(json => {
                        let response = {
                            title: "Borrado",
                            text: "El registro ha sido borrado",
                            icon: "success",
                        };
                        if (json.status === "error") {
                            response = {
                                title: "Error",
                                text: json.message,
                                icon: "error",
                            };
                        }
                        Swal.fire(response).then(() => {
                            location.reload();
                        });
                    });
                }
           });
        }
    });

}

if(btnGuardar) {
        const Nombre = document.querySelector("#Nombre");
        const Ciudad = document.querySelector("#ciudad");
        const btnCancelar = document.querySelector("#btnCancelar");

btnGuardar.addEventListener("click", e => {
            e.preventDefault();
            const payload = {
                action: "insert",
                nombre: Nombre.value,
                ciudad: Ciudad.value
            };

        fetch("../php/sucursal.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
           console.log(json);
           if(json.status === "success"){
              window.location.href = "index.html";
                } else {
                    alert("No se pudo guardar la sucursal: " + (json.message || ""));
                }
            })
            .catch(err => {
                console.error("Error insert:", err);
                alert("Error al guardar. Revisa la consola.");
            });
        });

        if (btnCancelar) {
            btnCancelar.addEventListener("click", () => {
                window.location.href = "index.html";
            });
        }
    }
});
function cargarSucursales() {
    fetch("../php/sucursal.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        console.log("Respuesta:", json);
        const tbody = document.querySelector("#tbody");

        if (json.status === "success" && json.data.length > 0) {
            tbody.innerHTML = json.data.map(d => `
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_sucursal}</td>
                    <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${d.nombre}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">${d.ciudad}</td>
                    <td class="px-6 py-4 text-sm">
                        <a href="javascript:void(0)" class="btn btn-sm btn-warning">editar</a>
                        <a href="#" data-id="${d.id_sucursal}" class="btn btn-sm btn-error">eliminar</a>
                    </td>
                </tr>
            `).join('');
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-gray-500">
                        No hay datos disponibles
                    </td>
                </tr>
            `;
        }
    })
    .catch(err => {
        console.error("Error en fetch:", err);
    });
}

