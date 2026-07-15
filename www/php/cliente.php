<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db; 

switch ($action) {
    case 'getAll':
        $data = getAllClientes();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'getOne':
        $stmt = $db->prepare("SELECT c.id_cliente, c.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.estado 
                              FROM cliente c 
                              INNER JOIN usuario u ON c.id_usuario = u.id_usuario 
                              WHERE c.id_cliente = :id");
        $stmt->execute([':id' => $_post['id_cliente']]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case "delete_cliente":
        $ok = deleteCliente($_post['id_cliente']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Cliente eliminado" : "No se pudo eliminar"]);
        break;
    
    case 'insert':
        try {
            $db->beginTransaction(); 

            $stmtUser = $db->prepare("INSERT INTO usuario (nombre, apellido, telefono, correo, password, estado, id_rol) 
                                      VALUES (:nombre, :apellido, :telefono, :correo, '', :estado, 2)");
            $stmtUser->execute([
                ':nombre'   => $_post['nombre'],
                ':apellido' => $_post['apellido'],
                ':telefono' => $_post['telefono'],
                ':correo'   => $_post['correo'],
                ':estado'   => $_post['estado']
            ]);
            
            $id_usuario_nuevo = $db->lastInsertId();

            $stmtCliente = $db->prepare("INSERT INTO cliente (id_usuario) VALUES (:id_usuario)");
            $ok = $stmtCliente->execute([':id_usuario' => $id_usuario_nuevo]);

            $db->commit();
            echo json_encode(["status" => $ok ? "success" : "error"]);
        } catch (PDOException $e) {
            $db->rollBack();
            echo json_encode(["status" => "error", "message" => "El correo ya podría estar registrado: " . $e->getMessage()]);
        }
        break;

    case 'update':
        try {
            $stmt = $db->prepare("UPDATE usuario SET nombre = :nombre, apellido = :apellido, correo = :correo, 
                                  telefono = :telefono, estado = :estado WHERE id_usuario = :id_usuario");
            $ok = $stmt->execute([
                ':nombre'     => $_post['nombre'],
                ':apellido'   => $_post['apellido'],
                ':correo'     => $_post['correo'],
                ':telefono'   => $_post['telefono'],
                ':estado'     => $_post['estado'],
                ':id_usuario' => $_post['id_usuario']
            ]);
            echo json_encode(["status" => $ok ? "success" : "error"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Error al actualizar los datos del usuario."]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
?>