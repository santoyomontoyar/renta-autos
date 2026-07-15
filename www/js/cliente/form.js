export default function form() {
    return `
        <button id="listBtn" class="btn btn-ghost mb-4">← Volver a la lista</button>
        
        <!-- Input oculto para saber si editamos (guarda el id_usuario asociado) -->
        <input type="hidden" id="id_cliente">
        <input type="hidden" id="id_usuario">

        <div class="mb-3">
            <label for="nombre" class="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" id="nombre" class="input input-bordered w-full" placeholder="Ej. Juan">
        </div>

        <div class="mb-3">
            <label for="apellido" class="block text-sm font-medium mb-1">Apellido</label>
            <input type="text" id="apellido" class="input input-bordered w-full" placeholder="Ej. Pérez">
        </div>

        <div class="mb-3">
            <label for="correo" class="block text-sm font-medium mb-1">Correo Electrónico</label>
            <input type="email" id="correo" class="input input-bordered w-full" placeholder="juan.perez@example.com">
        </div>

        <div class="mb-3">
            <label for="telefono" class="block text-sm font-medium mb-1">Teléfono</label>
            <input type="text" id="telefono" class="input input-bordered w-full" placeholder="9991234567">
        </div>

        <div class="mb-3">
            <label for="estado" class="block text-sm font-medium mb-1">Estado</label>
            <select id="estado" class="select select-bordered w-full">
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
                <option value="Suspendido">Suspendido</option>
            </select>
        </div>
        
        <button type="button" id="saveBtn" class="btn btn-primary w-full mt-2">Guardar Cliente</button>
    `;
}