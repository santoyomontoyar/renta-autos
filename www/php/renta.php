<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

switch ($action) {
  case 'getAll':
    $data = getAllRentas();
    if ($data) {
      echo json_encode(['status' => 'success', 'data' => $data]);
    } else {
      echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data']);
    }
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

  default:
    echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
    exit;
}