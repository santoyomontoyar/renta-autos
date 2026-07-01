const btnGuardar = document.querySelector("#btnGuardar")
const btnActualizar = document.querySelector("#btnActualizar")
const btnConfirmarEliminar = document.querySelector("#btnConfirmarEliminar")
const tbody = document.querySelector("#tbody")

if(tbody){
  fetch("../php/user.php", {
    method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "getAll" })
})
  .then(res => res.json())
  .then(json => {
    if (json.status === "success") {
      const tbody = document.querySelector("#tbody");
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
            <a href="editar.html?id=${u.id_usuario}"> editar </a>
            <a href="eliminar.html?id=${u.id_usuario}"> eliminar </a>
            </td>
            </tr>
            `;
          });
        }
      });
    }
      
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
if (btnActualizar) {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")

  const Nombre = document.querySelector("#Nombre")
  const Apellido = document.querySelector("#Apellido")
  const Correo = document.querySelector("#Correo")
  const telefono = document.querySelector("#telefono")
  const Estado = document.querySelector("#Estado")
  const Rol = document.querySelector("#Rol")
  const btnCancelar = document.querySelector("#btnCancelar")

  console.log("editar.html id de la URL:", id)

  if (!id) {
    alert("No se especificó un usuario para editar (falta ?id= en la URL)")
  } else {
    fetch("../php/user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "getOne", id })
    })
      .then(res => res.json())
      .then(json => {
        console.log("Respuesta getOne:", json)
        if (json.status === "success" && json.data) {
          Nombre.value = json.data.nombre
          Apellido.value = json.data.apellido
          Correo.value = json.data.correo
          telefono.value = json.data.telefono
          Estado.value = json.data.estado
          Rol.value = json.data.id_rol
        } else {
          alert("No se encontró el usuario solicitado")
        }
      })
      .catch(err => console.error("Error getOne:", err))

    btnActualizar.addEventListener("click", e => {
      e.preventDefault()
      const payload = {
        action: "update",
        id: id,
        name: Nombre.value,
        lastname: Apellido.value,
        email: Correo.value,
        phone: telefono.value,
        status: Estado.value,
        role: Rol.value
      }
      console.log("Enviando update:", payload)

      fetch("../php/user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(res => res.json())
        .then(json => {
          console.log("Respuesta update:", json)
          if (json.status === "success") {
            window.location.href = "index.html"
          } else {
            alert("No se pudo actualizar el usuario: " + (json.message || ""))
          }
        })
        .catch(err => {
          console.error("Error update:", err)
          alert("Error al actualizar. Revisa la consola.")
        })
    })
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
}

// ---------------- ELIMINAR (users/eliminar.html) ----------------
if (btnConfirmarEliminar) {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")
  const btnCancelar = document.querySelector("#btnCancelar")

  console.log("eliminar.html id de la URL:", id)

  if (!id) {
    alert("No se especificó un usuario para eliminar (falta ?id= en la URL)")
  } else {
    btnConfirmarEliminar.addEventListener("click", () => {
      console.log("Enviando delete para id:", id)
      fetch("../php/user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id })
      }).then(res => res.json())
        .then(json => {
          console.log("Respuesta delete:", json)
          if (json.status === "success") {
            window.location.href = "index.html"
          } else {
            alert("No se pudo eliminar el usuario: " + (json.message || ""))
          }
        })
        .catch(err => {
          console.error("Error delete:", err)
          alert("Error al eliminar. Revisa la consola.")
        })
    })
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  }
}