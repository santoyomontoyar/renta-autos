export default function form() {
    return `
    <form id="formRol" action="" class="space-y-3 max-w-xs">
 
      <div>
        <label for="name" class="label">Nombre de la Sucursal</label>
        <input type="text" id="name" class="input input-bordered w-full">
      </div>
 
      <div>
        <label for="ciudad" class="label">Ciudad</label>
        <input type="text" id="ciudad" class="input input-bordered w-full">
      </div>
 
      <button id="btnGuardar" type="button" class="btn btn-error">Guardar</button>
    </form>
    `;
}