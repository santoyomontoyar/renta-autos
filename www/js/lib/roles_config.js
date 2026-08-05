
window.MODULOS_POR_ROL = {
    Administrador: [
        "dashboard", "users", "cliente", "documento_cliente", "vehiculo", "renta",
        "cargo_adicional", "imagen_modelo_vehiculo", "seguro", "tipo_seguro", "rol",
        "reporte_falla", "imagen_falla", "modelo_vehiculo", "sucursal"
    ],
    "Mecánico": ["dashboard", "reporte_falla", "imagen_falla", "vehiculo"],
    Cliente: ["vehiculo", "documento_cliente", "renta"]
};

window.HOME_POR_ROL = {
    Administrador: "dashboard",
    "Mecánico": "dashboard",
    Cliente: "vehiculo"
};

// Atajo usado por los módulos de solo-lectura (vehiculo.js, documento_cliente.js,
// renta.js) para decidir si el usuario en sesión puede dar de alta/editar/eliminar.
window.esAdmin = () => window.currentUser?.rol === "Administrador";