export default function form() {
    return `
    <form id="formRol" action="" class="space-y-3 max-w-xs">
 
      <div>
        <label for="id_renta" class="label">ID Renta</label>
        <input type="number" id="id_renta" class="input input-bordered w-full">
      </div>
 
      <div>
        <label for="id_usuario" class="label">ID Usuario</label>
        <input type="number" id="id_usuario" class="input input-bordered w-full">
      </div>
 
      <div>
        <label for="descripcion" class="label">Descripción</label>
        <textarea id="descripcion" class="textarea textarea-bordered w-full"></textarea>
      </div>
 
      <button id="btnGuardar" type="button" class="btn btn-error">Guardar</button>
    </form>
    `;
}