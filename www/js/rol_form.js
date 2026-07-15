export default function form() {
    return `
    <form id="formRol" action="" class="space-y-3 max-w-xs">
 
      <div>
        <label for="name" class="label">Nombre del Rol</label>
        <input type="text" id="name" class="input input-bordered w-full">
      </div>
 
      <button id="btnGuardar" type="button" class="btn btn-success">Guardar</button>
    </form>
    `;
}