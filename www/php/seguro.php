<?php
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

requireAuth(['Administrador']);

$data = "";

switch ($action) {
        case 'getAll':
        $ordenarPor = $_post['ordenarPor'] ?? 'id_seguro';
        $direccion  = $_post['direccion'] ?? 'ASC';
        $busqueda   = trim($_post['busqueda'] ?? '');
        $data = getAllSeguros($ordenarPor, $direccion, $busqueda);
        break;
        case 'getOne':
        $data = getSeguroById($_post['id']);
        break;
        case 'insert':
        $data = insertSeguro($_post);
        break;
        case 'update':
        $data = updateSeguro($_post);
        break;
        case 'delete':
        $data = deleteSeguro($_post['id']);
        break;
        default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
}

if ($data !== "" && $data !== false && $data !== null) {
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data']);
}