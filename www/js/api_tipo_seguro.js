
export async function getAllTipoSeguro() {
    try {
        const res = await fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getAllTipoSeguro:", error);
        return {
            status: "error",
            message: "Error al obtener los registros"
        };
    }
}

export async function getTipoSeguro(id_tipo_seguro) {
    try {
        const res = await fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getOne",
                id_tipo_seguro
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getTipoSeguro:", error);
        return {
            status: "error",
            message: "Error al obtener el registro"
        };
    }
}

export async function createTipoSeguro(nombre, descripcion) {
    try {
        const res = await fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create",
                nombre,
                descripcion
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en createTipoSeguro:", error);
        return {
            status: "error",
            message: "Error al crear el registro"
        };
    }
}

export async function updateTipoSeguro(id_tipo_seguro, nombre, descripcion) {
    try {
        const res = await fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update",
                id_tipo_seguro,
                nombre,
                descripcion
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en updateTipoSeguro:", error);
        return {
            status: "error",
            message: "Error al actualizar el registro"
        };
    }
}

export async function deleteTipoSeguro(id_tipo_seguro) {
    try {
        const res = await fetch("../php/tipo_seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "delete",
                id_tipo_seguro
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en deleteTipoSeguro:", error);
        return {
            status: "error",
            message: "Error al eliminar el registro"
        };
    }
}

