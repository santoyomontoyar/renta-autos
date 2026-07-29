<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';
$email = $_post['email'] ?? '';
$password = $_post['password'] ?? '';

global $db;

switch ($action) {
    case 'login':
        $data = login($email, $password);
        if ($data !== false) {
            echo json_encode(['status' => 'success', 'data' => $data]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Credenciales incorrectas']);
        }
        break;

    case 'getAll':
        try {
            $page = isset($_post['page']) ? (int)$_post['page'] : 1;
            $limit = 50; 
            if ($page < 1) $page = 1;
            $offset = ($page - 1) * $limit;

            // Total de usuarios
            $totalRows = (int)$db->query("SELECT COUNT(*) FROM usuario")->fetchColumn();
            $totalPages = (int)ceil($totalRows / $limit);

            // Criterios de ordenación
            $orderByParam = $_post['order_by'] ?? 'u.id_usuario';
            $orderDirParam = (strtoupper($_post['order_dir'] ?? '') === 'DESC') ? 'DESC' : 'ASC';
            $rolPrioridad = $_post['rol_prioridad'] ?? 'CLIENTE_PRIMERO';

            if ($orderByParam === 'rol_prioridad') {
                if ($rolPrioridad === 'ADMIN_PRIMERO') {
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Administrador' THEN 1 WHEN 'Cliente' THEN 2 ELSE 3 END ASC, u.id_usuario ASC";
                } elseif ($rolPrioridad === 'MECANICO_PRIMERO') {
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Mecánico' THEN 1 WHEN 'Cliente' THEN 2 ELSE 3 END ASC, u.id_usuario ASC";
                } else { // CLIENTE_PRIMERO
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Cliente' THEN 1 WHEN 'Administrador' THEN 2 ELSE 3 END ASC, u.id_usuario ASC";
                }
            } elseif ($orderByParam === 'u.nombre') {
                $orderClause = "ORDER BY u.nombre $orderDirParam, u.id_usuario ASC";
            } else {
                $orderClause = "ORDER BY u.id_usuario $orderDirParam";
            }

            // Consulta paginada con ordenamiento
            $sql = "SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.estado, r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.id_rol = r.id_rol
                    $orderClause
                    LIMIT $limit OFFSET $offset";

            $stmt = $db->query($sql);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'status' => 'success',
                'data' => $data,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'totalRows' => $totalRows,
                    'totalPages' => $totalPages
                ]
            ]);
        } catch (Exception $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'insert':
        $data = insertUsuarios($_post);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'getOne':
        $data = getUsuarioById($_post['id'] ?? 0);
        echo json_encode(['status' => $data ? 'success' : 'error', 'data' => $data]);
        break;

    case 'update':
        $data = updateUsuario($_post);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'delete':
        $data = deleteUsuario($_post['id'] ?? 0);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'getAllRoles':
        $data = getAllRoles();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>