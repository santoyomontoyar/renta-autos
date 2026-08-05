const URL_API = "../php/reporte_falla.php";
 
async function post(payload) {
    const res = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    return res.json();
}
 
export default async function getFallas({ page = 1, orderBy = "id_falla", orderDir = "ASC", buscar = "" } = {}) {
    return post({
        action: "getAll",
        page,
        order_by: orderBy,
        order_dir: orderDir,
        buscar
    });
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