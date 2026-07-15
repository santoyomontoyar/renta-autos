<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

switch ($action) {
    case 'getAll':
        $data = getAllClientes();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case "delete_cliente":
        $ok = deleteCliente($_post['id_cliente']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Cliente eliminado" : "No se pudo eliminar"]);
        break;

    case 'getUsuariosIds':
        $data = getUsuariosIds();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;
    
    case 'insert':
        $ok = insertCliente($_post['id_usuario']);
        echo json_encode(["status" => $ok ? "success" : "error"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
?>