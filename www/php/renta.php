<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

// Un Cliente solo puede consultar/crear sus propias rentas; editar o borrar
// cualquier renta sigue siendo exclusivo de Administrador.
requireAccion($action, ['Administrador', 'Cliente'], ['update', 'delete'], ['Administrador']);

switch ($action) {
  case 'getAll':
    $page          = $_post['page'] ?? 1;
    $pageSize      = $_post['pageSize'] ?? 10;
    $sortColumn    = $_post['sortColumn'] ?? 'id_renta';
    $sortDirection = $_post['sortDirection'] ?? 'ASC';
    $search        = $_post['search'] ?? '';
    $idClienteFiltro = esRol('Cliente') ? getIdClienteSesion() : null;

    $result = getAllRentas($page, $pageSize, $sortColumn, $sortDirection, $search, $idClienteFiltro);
    echo json_encode([
        'status' => 'success',
        'data'   => $result['data'],
        'total'  => $result['total']
    ]);
    exit;

  case 'getFormNeeds':
    $response = [
      'clientes'   => getAllClientes(),
      'vehiculos'  => getAllVehiculos(),
      'seguros'    => getAllSeguros(),
      'sucursales' => getAllsucursal()
    ];
    echo json_encode(['status' => 'success', 'data' => $response]);
    exit;

  case 'insert':
    $datos = $_post['datos'] ?? [];

    if (esRol('Cliente')) {
        // El cliente nunca puede rentar "a nombre" de otro: se ignora
        // cualquier id_cliente mandado desde el front y se usa el de su sesión.
        $idClienteSesion = getIdClienteSesion();
        if ($idClienteSesion === null) {
            echo json_encode(['status' => 'error', 'message' => 'Tu usuario no tiene un perfil de cliente asociado']);
            exit;
        }
        $datos['id_cliente'] = $idClienteSesion;

        // Regla de negocio: un cliente solo puede tener un auto rentado a la vez.
        if (clienteTieneRentaActiva($idClienteSesion)) {
            echo json_encode(['status' => 'error', 'message' => 'Ya tienes una renta activa. Debes finalizarla antes de solicitar otra.']);
            exit;
        }
    }

    $result = insertRenta($datos);
    if ($result) {
      echo json_encode(['status' => 'success', 'message' => 'Renta registrada exitosamente']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'No se pudo registrar la renta']);
    }
    exit;

    case 'getOne':
    $data = getRentaById($_post['id_renta']);
    if ($data) {
        requireClientePropio((int)$data['id_cliente']);
    }
    echo json_encode($data
        ? ['status' => 'success', 'data' => $data]
        : ['status' => 'error', 'message' => 'Renta no encontrada']);
    exit;

  case 'update':
    $result = updateRenta($_post['datos']);
    echo json_encode($result
        ? ['status' => 'success', 'message' => 'Renta actualizada']
        : ['status' => 'error', 'message' => 'No se pudo actualizar']);
    exit;

  case 'delete':
    $result = deleteRenta($_post['id_renta']);
    echo json_encode($result
        ? ['status' => 'success', 'message' => 'Renta eliminada']
        : ['status' => 'error', 'message' => 'No se pudo eliminar']);
    exit;

    case 'getReservas':
    echo json_encode(['status' => 'success', 'data' => getReservasVehiculo()]);
    exit;

  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    exit;
}