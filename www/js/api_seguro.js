export async function getAllSeguros() {
    try {
        const res = await fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getAllSeguros:", error);
        return {
            status: "error",
            message: "Error al obtener los registros"
        };
    }
}

export async function getSeguro(id) {
    try {
        const res = await fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getOne",
                id
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getSeguro:", error);
        return {
            status: "error",
            message: "Error al obtener el registro"
        };
    }
}

export async function createSeguro(id_tipo_seguro, costo_diario) {
    try {
        const res = await fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "insert",
                id_tipo_seguro,
                costo_diario
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en createSeguro:", error);
        return {
            status: "error",
            message: "Error al crear el registro"
        };
    }
}

export async function updateSeguro(id, id_tipo_seguro, costo_diario) {
    try {
        const res = await fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update",
                id,
                id_tipo_seguro,
                costo_diario
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en updateSeguro:", error);
        return {
            status: "error",
            message: "Error al actualizar el registro"
        };
    }
}

export async function deleteSeguro(id) {
    try {
        const res = await fetch("../php/seguro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "delete",
                id
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en deleteSeguro:", error);
        return {
            status: "error",
            message: "Error al eliminar el registro"
        };
    }
}