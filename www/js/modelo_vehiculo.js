fetch("../php/modelo_vehiculo.php", {
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
                    #${d.id_modelo}
                </td>

                <td class="px-6 py-4 text-sm text-gray-700 font-medium">
                    ${d.nombre_modelo}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500">
                    ${d.marca}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500">
                    ${d.year}
                </td>

                <td class="px-6 py-4 text-sm text-gray-500">
                    ${d.categoria}
                </td>

                <td class="px-6 py-4 text-sm text-gray-700 font-semibold">
                    $${d.costo_diario}
                </td>

                <td class="px-6 py-4">
                <div claas="flex gap-2">
                <a href="editar.html?id=${d.id_modelo}"
                class="btn btn-sm btn-info mr-2"> 
                editar
                </a>

               <button onclick="eliminar(${d.id_modelo})"
                class="btn btn-sm btn-error"> 
                eliminar
               </button>
               </div>
               </td>

            </tr>
        `).join('');
    }
})

function eliminar(id){
    fetch("../php/modelo_vehiculo.php",{
        method: "POST",
        headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        action:"delete",
        id_modelo:id

      })
    })

    .then(res=>res.json())
    .then(json=>{
      if(json.status==="success"){
        location.reload();

         }
     })
    
}