<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$status = "error";
$data = "";

switch ($action) {
    case 'getAll':
        $data = getAllClientes();
        $status = "success";
        break;

        case 'getUsuariosIds':
        $data = getUsuariosIds();
        $status = "success";
        break;
    
    case 'insert':
        if (insertCliente($_post['id_usuario'])) {
            $status = "success";
        }
        break;
        
    case 'update':
        if (updateCliente($_post['id_cliente'], $_post['id_usuario'])) {
            $status = "success";
        }
        break;
        
    case 'delete':
        if (deleteCliente($_post['id_cliente'])) {
            $status = "success";
        }
        break;
}

echo json_encode(['status' => $status, 'data' => $data]);
?>