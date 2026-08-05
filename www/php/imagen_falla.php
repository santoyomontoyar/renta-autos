<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

switch ($action) {
    case 'getAll':
        $page     = $_post['page'] ?? 1;
        $orderBy  = $_post['order_by'] ?? 'id_imagen';
        $orderDir = $_post['order_dir'] ?? 'ASC';
        $buscar   = $_post['buscar'] ?? '';

        $resultado = getImagenesFallaPaginado($page, $orderBy, $orderDir, $buscar);
        echo json_encode([
            'status' => 'success',
            'data' => $resultado['data'],
            'pagination' => $resultado['pagination']
        ]);
        break;

    case 'getOne':
        $data = getImagenFallaById($_post['id_imagen']);
        echo json_encode(['status' => $data ? 'success' : 'error', 'data' => $data]);
        break;

    case 'getFormNeeds':
        $data = ['fallas' => getAllFallas()];
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'insert':
        $result = insertImagenFalla($_post['datos']);
        echo json_encode($result !== false
            ? ['status' => 'success', 'id' => $result]
            : ['status' => 'error', 'message' => 'No se pudo insertar']);
        break;

    case 'update':
        $result = updateImagenFalla($_post['datos']);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo actualizar']);
        break;

    case 'delete':
        $result = deleteImagenFalla($_post['id_imagen']);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo eliminar']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}