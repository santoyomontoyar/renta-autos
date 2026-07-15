const URL_API = "../php/reporte_falla.php";
 
async function post(payload) {
    const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}
 
export default async function getFallas() {
    const json = await post({ action: "getAll" });
    return json.data;
}
 
export async function insertarFalla(id_renta, id_usuario, descripcion) {
    return post({ action: "insert", id_renta, id_usuario, descripcion });
}
 
export async function actualizarFalla(id_falla, id_renta, id_usuario, descripcion) {
    return post({ action: "update", id_falla, id_renta, id_usuario, descripcion });
}
 
export async function eliminarFalla(id_falla) {
    return post({ action: "delete_falla", id_falla });
}