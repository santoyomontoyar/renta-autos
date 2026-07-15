<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';
$email = $_post['email'] ?? '';
$password = $_post['password'] ?? '';

$data = "";
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
     case 'getOne':
    $data = getUsuarioById($_post['id'] ?? 0);
    break;
    case 'update':
    $data = updateUsuario($_post);
    break;
    case 'delete':
    $data = deleteUsuario($_post['id'] ?? 0);
    break;
    case 'getAllRoles':
    $data = getAllRoles();
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
