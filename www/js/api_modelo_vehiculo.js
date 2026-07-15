export async function getAllModelos() {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getAllModelos:", error);
        return {
            status: "error",
            message: "Error al obtener los registros"
        };
    }
}

export async function getModelo(id_modelo) {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "getOne",
                id_modelo
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en getModelo:", error);
        return {
            status: "error",
            message: "Error al obtener el registro"
        };
    }
}

export async function createModelo(datos) {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "insert",
                ...datos
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en createModelo:", error);
        return {
            status: "error",
            message: "Error al crear el registro"
        };
    }
}

export async function updateModelo(id_modelo, datos) {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update",
                id_modelo,
                ...datos
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en updateModelo:", error);
        return {
            status: "error",
            message: "Error al actualizar el registro"
        };
    }
}

export async function deleteModelo(id_modelo) {
    try {
        const res = await fetch("../php/modelo_vehiculo.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "delete",
                id_modelo
            })
        });

        return await res.json();
    } catch (error) {
        console.error("Error en deleteModelo:", error);
        return {
            status: "error",
            message: "Error al eliminar el registro"
        };
    }
}