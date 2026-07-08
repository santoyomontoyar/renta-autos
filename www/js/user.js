const btnGuardar = document.querySelector("#btnGuardar")
const btnActualizar = document.querySelector("#btnActualizar")
const tbody = document.querySelector("#tbody")

// ---------------- LISTADO (users/index.html) ----------------
function cargarUsuarios() {
  fetch("../php/user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
  })
    .then(res => res.json())
    .then(json => {
      if (json.status === "success") {
        tbody.innerHTML = json.data.map(u => `
          <tr>
            <td>${u.id_usuario}</td>
            <td>${u.nombre}</td>
            <td>${u.apellido}</td>
            <td>${u.correo}</td>
            <td>${u.telefono}</td>
            <td>${u.estado}</td>
            <td>${u.rol}</td>
            <td>
              <a href="editar.html?id=${u.id_usuario}">editar</a>
              <a href="#" data-id="${u.id_usuario}" class="btn btn-sm btn-error">eliminar</a>
            </td>
          </tr>
        `).join('');
      }
    });
}

if (tbody) {

  cargarUsuarios();

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
        confirmButtonText: "Confirmar"
      }).then((result) => {

        if (result.isConfirmed) {

          fetch("../php/user.php", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              action: "delete",
              id: id
            })
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
            cargarUsuarios();

          });

        }

      });

    }

  });

}

// ---------------- INSERTAR (users/insertar.html) ----------------

if (btnGuardar) {
  const Nombre = document.querySelector("#Nombre")
  const Apellido = document.querySelector("#Apellido")
  const Correo = document.querySelector("#Correo")
  const telefono = document.querySelector("#telefono")
  const Estado = document.querySelector("#Estado")
  const Rol = document.querySelector("#Rol")
  const btnCancelar = document.querySelector("#btnCancelar")

  btnGuardar.addEventListener("click", e => {
    e.preventDefault()
    const payload = {
      action: "insert",
      name: Nombre.value,
      lastname: Apellido.value,
      email: Correo.value,
      phone: telefono.value,
      status: Estado.value,
      role: Rol.value
    }
    console.log("Enviando insert:", payload)

    fetch("../php/user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }).then(res => res.json())
      .then(json => {
        
        if (json.status === "success") {
          window.location.href = "index.html"
        } else {
          alert("No se pudo guardar el usuario: " + (json.message || ""))
        }
      })
      .catch(err => {
        console.error("Error insert:", err)
        alert("Error al guardar. Revisa la consola.")
      })
  })

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
}

// ---------------- EDITAR (users/editar.html) ----------------
 if (btnActualizar) {
  const btnCancelar = document.querySelector("#btnCancelar")

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
}
