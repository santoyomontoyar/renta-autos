// Helper compartido por los módulos de solo-lectura (vehículo, documentos, rentas):
// muestra este texto en vez de los botones de editar/borrar cuando el usuario
// en sesión no tiene permiso para modificar el registro.
export const soloLectura = () => `<span class="text-xs text-gray-400">Solo lectura</span>`;