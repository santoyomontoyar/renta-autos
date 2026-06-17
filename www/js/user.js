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
            <td>${u.id_rol}</td>
          </tr>
        `;
      });
    }
  });