const btnGuardar = document.querySelector("#btnGuardar")
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
            <a href="editar.html"> editar </a>
            <a href="eliminar.html"> eliminar </a>
            </td>
            </tr>
            `;
          });
        }
      });
    }
      
if(!tbody){
  const Nombre = document.querySelector("#Nombre")
  const Apellido = document.querySelector("#Apellido")
  const Correo = document.querySelector("#Correo")
  const telefono = document.querySelector("#telefono")
  const Estado = document.querySelector("#Estado")
  const Rol = document.querySelector("#Rol")

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

  fetch("../php/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then(res => res.json())
  .then(json => {
    console.log(json)
  })
})
}