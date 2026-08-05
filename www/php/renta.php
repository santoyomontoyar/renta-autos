<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

switch ($action) {
  case 'getAll':
    $page          = $_post['page'] ?? 1;
    $pageSize      = $_post['pageSize'] ?? 10;
    $sortColumn    = $_post['sortColumn'] ?? 'id_renta';
    $sortDirection = $_post['sortDirection'] ?? 'ASC';
    $search        = $_post['search'] ?? '';

    $result = getAllRentas($page, $pageSize, $sortColumn, $sortDirection, $search);
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
    $result = insertRenta($_post['datos']);
    if ($result) {
      echo json_encode(['status' => 'success', 'message' => 'Renta registrada exitosamente']);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'No se pudo registrar la renta']);
    }
    exit;

    case 'getOne':
    $data = getRentaById($_post['id_renta']);
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