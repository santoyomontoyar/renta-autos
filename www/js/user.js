const btnGuardar = document.querySelector("#btnGuardar")
const btnActualizar = document.querySelector("#btnActualizar")
const btnConfirmarEliminar = document.querySelector("#btnConfirmarEliminar")
const tbody = document.querySelector("#tbody")

// ---------------- LISTADO (users/index.html) ----------------
if (tbody) {
  fetch("../php/user.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
  })
    .then(res => res.json())
    .then(json => {
      if (json.status === "success") {
        json.data.forEach(u => {
          tbody.innerHTML += `
          <tr>
          <td>${u.id_usuario}</td>
          <td>${u.nombre}</td>
              <td>${u.apellido}</td>
              <td>${u.correo}</td>
              <td>${u.telefono}</td>
              <td>${u.estado}</td>
              <td>${u.rol}</td>
              <td>
              <span style="font-weight:bold; cursor:default;"> editar </span>
              <span style="font-weight:bold; cursor:default;"> eliminar </span>
              </td>
              </tr>
              `;
        });
      }
    })
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
        console.log("Respuesta insert:", json)
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
  const btnCancelar = document.querySelector("#btnCancelar")

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }


// ---------------- ELIMINAR (users/eliminar.html) ----------------
if (btnConfirmarEliminar) {
  const btnCancelar = document.querySelector("#btnCancelar")

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
}