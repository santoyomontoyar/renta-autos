const btnGuardar = document.querySelector("#btnGuardar");
const tbody = document.querySelector("#tbody");

if (tbody) {    
fetch("../php/rol.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
        const tbody = document.querySelector("#tbody");
        json.data.forEach(d => {
            tbody.innerHTML += `
            <tr>
            <td>${d.id_rol}</td>
            <td>${d.nombre}</td>
            <td>
            <a href="editar.html"> editar </a>
            <a href="#" data-id="${d.id_rol}" class="btn-error"> eliminar </a>
            </td>
            </tr>
            `;
        });
       }
      });
     }    

        if (tbody) {
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
                    const datos = { action: "delete_rol", id_rol: id };

        fetch("../php/rol.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
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

if (!tbody) {
            const Nombre = document.querySelector("#Nombre");

        btnGuardar.addEventListener("click", e => {
            e.preventDefault();
            const payload = {
                action: "insert",
                name: Nombre.value
            }

        fetch("../php/rol.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
           console.log(json);
        })
    })
 }
