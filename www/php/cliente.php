<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db; 

requireAuth(['Administrador']);


switch ($action) {
    case 'getAll':
        try {
            $page = isset($_post['page']) ? (int)$_post['page'] : 1;
            $limit = 50; 
            if ($page < 1) $page = 1;
            $offset = ($page - 1) * $limit;

           
            $search = trim($_post['search'] ?? '');
            $whereClause = "";
            $params = array();

            if ($search !== '') {
                $whereClause = "WHERE u.nombre LIKE :search 
                                OR u.apellido LIKE :search 
                                OR u.correo LIKE :search 
                                OR u.telefono LIKE :search";
                $params[':search'] = "%$search%";
            }

            
            $countSql = "SELECT COUNT(*) FROM cliente c INNER JOIN usuario u ON c.id_usuario = u.id_usuario $whereClause";
            $stmtCount = $db->prepare($countSql);
            $stmtCount->execute($params);
            $totalRows = (int)$stmtCount->fetchColumn();
            

            $totalPages = (int)ceil($totalRows / $limit);

            $orderByParam = $_post['order_by'] ?? 'c.id_cliente';
            $orderDirParam = (strtoupper($_post['order_dir'] ?? '') === 'DESC') ? 'DESC' : 'ASC';
            $estadoPrioridad = $_post['estado_prioridad'] ?? 'ACTIVO_PRIMERO';

            if ($orderByParam === 'estado_prioridad') {
                if ($estadoPrioridad === 'INACTIVO_PRIMERO') {
                    $orderClause = "ORDER BY CASE u.estado WHEN 'Inactivo' THEN 1 ELSE 3 END ASC, c.id_cliente ASC";
                } elseif ($estadoPrioridad === 'SUSPENDIDO_PRIMERO') {
                    $orderClause = "ORDER BY CASE u.estado WHEN 'Suspendido' THEN 1 ELSE 3 END ASC, c.id_cliente ASC";
                } else { 
                    $orderClause = "ORDER BY CASE u.estado WHEN 'Activo' THEN 1 ELSE 3 END ASC, c.id_cliente ASC";
                }
            } elseif ($orderByParam === 'u.nombre') {
                $orderClause = "ORDER BY u.nombre $orderDirParam, c.id_cliente ASC";
            } else {
                $orderClause = "ORDER BY c.id_cliente $orderDirParam";
            }

            $sql = "SELECT 
                        c.id_cliente, 
                        c.id_usuario, 
                        u.nombre, 
                        u.apellido, 
                        u.correo, 
                        u.telefono, 
                        u.estado 
                    FROM cliente c 
                    INNER JOIN usuario u ON c.id_usuario = u.id_usuario 
                    $whereClause 
                    $orderClause 
                    LIMIT $limit OFFSET $offset";

            
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array(
                'status' => 'success',
                'data' => $data,
                'pagination' => array(
                    'page' => $page,
                    'limit' => $limit,
                    'totalRows' => $totalRows,
                    'totalPages' => $totalPages
                )
            ));
        } catch (Exception $e) {
            echo json_encode(array('status' => 'error', 'message' => 'Error SQL: ' . $e->getMessage()));
        }
        break;

    case 'getOne':
        try {
            $stmt = $db->prepare("SELECT c.id_cliente, c.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.estado 
                                  FROM cliente c 
                                  INNER JOIN usuario u ON c.id_usuario = u.id_usuario 
                                  WHERE c.id_cliente = :id");
            $stmt->execute(array(':id' => $_post['id_cliente']));
            $data = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(array('status' => 'success', 'data' => $data));
        } catch (Exception $e) {
            echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
        }
        break;

    case 'delete_cliente':
        $ok = deleteCliente($_post['id_cliente']);
        echo json_encode(array("status" => $ok ? "success" : "error", "message" => $ok ? "Cliente eliminado" : "No se pudo eliminar"));
        break;
    
    case 'insert':
        try {
            $db->beginTransaction(); 

            $stmtUser = $db->prepare("INSERT INTO usuario (nombre, apellido, telefono, correo, password, estado, id_rol) 
                                      VALUES (:nombre, :apellido, :telefono, :correo, '', :estado, 2)");
            $stmtUser->execute(array(
                ':nombre'   => $_post['nombre'],
                ':apellido' => $_post['apellido'],
                ':telefono' => $_post['telefono'],
                ':correo'   => $_post['correo'],
                ':estado'   => $_post['estado']
            ));
            
            $id_usuario_nuevo = $db->lastInsertId();

            $stmtCliente = $db->prepare("INSERT INTO cliente (id_usuario) VALUES (:id_usuario)");
            $ok = $stmtCliente->execute(array(':id_usuario' => $id_usuario_nuevo));

            $db->commit();
            echo json_encode(array("status" => "success"));
        } catch (PDOException $e) {
            $db->rollBack();
            echo json_encode(array("status" => "error", "message" => "El correo ya podría estar registrado."));
        }
        break;

    case 'update':
        try {
            $stmt = $db->prepare("UPDATE usuario SET nombre = :nombre, apellido = :apellido, correo = :correo, 
                                  telefono = :telefono, estado = :estado WHERE id_usuario = :id_usuario");
            $ok = $stmt->execute(array(
                ':nombre'     => $_post['nombre'],
                ':apellido'   => $_post['apellido'],
                ':correo'     => $_post['correo'],
                ':telefono'   => $_post['telefono'],
                ':estado'     => $_post['estado'],
                ':id_usuario' => $_post['id_usuario']
            ));
            echo json_encode(array("status" => $ok ? "success" : "error"));
        } catch (PDOException $e) {
            echo json_encode(array("status" => "error", "message" => "Error al actualizar los datos."));
        }
        break;

    default:
        echo json_encode(array("status" => "error", "message" => "Acción inválida"));
}
?>