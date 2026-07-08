const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formSeguro");

if (tbody) cargarSeguros();
if (form) iniciarFormulario();

function cargarSeguros() {
fetch("../php/seguro.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");

        tbody.innerHTML = json.data.map(d => `
            <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                    #${d.id_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-700 font-medium">
                    ${d.tipo_seguro}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500 font-semibold">
                    $${d.costo_diario}
                </td>

                <td class="px-6 py-4 text-sm">
                <a href="editar.html?id=${d.id_seguro}" class="btn btn-sm btn-warning">Editar</a>
                <a href="#" data-id="${d.id_seguro}" class="btn btn-sm btn-error">Eliminar</a>
                </td>

            </tr>
        `).join('');
    }
})
.catch(err => console.error("Error:", err));
}

function iniciarFormulario() {
    fetch("../php/tipo_seguro.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            llenarSelect("id_tipo_seguro", json.data, "id_tipo_seguro", "nombre");
        }
    });

    const btnGuardar = document.querySelector("#btnGuardar");
    const btnCancelar = document.querySelector("#btnCancelar");

    btnGuardar.addEventListener("click", e => {
        e.preventDefault();
        const payload = {
            action: "insert",
            id_tipo_seguro: form.elements["id_tipo_seguro"].value,
            costo_diario: form.elements["costo_diario"].value
        };

        fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html";
            } else {
                alert("No se pudo guardar el seguro: " + (json.message || ""));
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

function llenarSelect(name, items, valueField, textField) {
    const select = form.elements[name];
    select.innerHTML = '<option value="">-- Selecciona --</option>';
    items.forEach(item => {
        select.innerHTML += `<option value="${item[valueField]}">${item[textField]}</option>`;
    });
}

if (tbody) {
    tbody.addEventListener('click', function (evento) {
        if (evento.target && evento.target.matches('.btn-error')) {
            const id = evento.target.getAttribute('data-id');

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
                    const datos = { action: "delete", id: id };
                    fetch("../php/seguro.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(datos)
                    })
                    .then(res => res.json())
                    .then(json => {
                        let response = {
                            title: "Borrado",
                            text: "Tu registro ha sido eliminado.",
                            icon: "success"
                        };
                        if (json.status === "error") {
                            response = {
                                title: "Error",
                                text: "No se pudo eliminar el registro.",
                                icon: "error"
                            };
                        }
                        Swal.fire(response);
                        cargarSeguros();
                    });
                }
            });
        }
    });
}