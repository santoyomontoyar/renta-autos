const URL_API = "../php/sucursal.php";
 
async function post(payload) {
    const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}
 
export default async function getSucursal() {
    const json = await post({ action: "getAll" });
    return json.data;
}
 
export async function insertarSucursal(nombre, ciudad) {
    return post({ action: "insert", nombre, ciudad });
}
 
export async function actualizarSucursal(id_sucursal, nombre, ciudad) {
    return post({ action: "update", id_sucursal, nombre, ciudad });
}
 
export async function eliminarSucursal(id_sucursal) {
    return post({ action: "delete_sucursal", id_sucursal });
}