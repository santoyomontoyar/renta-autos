<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$data = "";
switch ($action) {
    case 'getAll':
        $data = getAllImagenesFalla();
        break;
    case 'getOne':
        $data = getImagenFallaById($_post['id_imagen']);
        break;
    case 'getFormNeeds':
        $data = ['fallas' => getAllFallas()];
        break;
    case 'insert':
        $result = insertImagenFalla($_post['datos']);
        echo json_encode($result !== false
            ? ['status' => 'success', 'id' => $result]
            : ['status' => 'error', 'message' => 'No se pudo insertar']);
        exit;
    case 'update':
        $result = updateImagenFalla($_post['datos']);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo actualizar']);
        exit;
    case 'delete':
        $result = deleteImagenFalla($_post['id_imagen']);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo eliminar']);
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