const URL_API = "../php/rol.php";
 
async function post(payload) {
    const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}
 
export default async function getRoles(sortColumn = 'id_rol', sortDirection = 'asc') {
    const json = await post({ action: "getAll", sortColumn, sortDirection });
    return json.data;
}
 
export async function insertarRol(nombre) {
    return post({ action: "insert", name: nombre });
}
 
export async function actualizarRol(id_rol, nombre) {
    return post({ action: "update", id_rol, name: nombre });
}
 
export async function eliminarRol(id_rol) {
    return post({ action: "delete_rol", id_rol });
}