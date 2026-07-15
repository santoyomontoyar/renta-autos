<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$data = "";
switch ($action) {
    case 'getAll':
        $data = getAllVehiculos();
        break;
    case 'getOne':
        $data = getVehiculoById($_post['id_vehiculo']);
        break;
    case 'insert':
        $result = insertVehiculo($_post);
        echo json_encode($result !== false
            ? ['status' => 'success', 'id' => $result]
            : ['status' => 'error', 'message' => 'No se pudo insertar']);
        exit;
    case 'update':
        $result = updateVehiculo($_post);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo actualizar']);
        exit;
    case 'delete':
        $result = deleteVehiculo($_post['id_vehiculo']);
        if ($result === "en_uso") {
            echo json_encode(['status' => 'error', 'message' => 'El vehículo tiene rentas asociadas']);
        } else {
            echo json_encode($result
                ? ['status' => 'success']
                : ['status' => 'error', 'message' => 'No se pudo eliminar']);
        }
        exit;
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
}
if ($data !== "") {
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data']);
}