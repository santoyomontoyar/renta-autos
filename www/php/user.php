<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';
$email = $_post['email'] ?? '';
$password = $_post['password'] ?? '';

$data = null; // Cambiado a null para validar correctamente en el IF final

switch ($action) {
    case 'login':
        $data = login($email, $password);
        break;
        
    case 'getAll':
        $data = getAllUsuarios();
        break;
        
    case 'insert':
        $data = insertUsuarios($_post);
        break;

    case 'update':
        $data = updateUsuario($_post);
        break;

    case 'delete':
        $id_user = $_post['id_user'] ?? 0;
        $data = deleteUsuario($id_user);
        break;
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
}

if ($data) {
    // Si la función ya regresó un array con un estatus interno (como login o insert) lo mandamos directo,
    // si no, lo envolvemos en la estructura estándar de success.
    if (is_array($data) && isset($data['status'])) {
        echo json_encode($data);
    } else {
        echo json_encode(['status' => 'success', 'data' => $data]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data or action uncompleted']);
}