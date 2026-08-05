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
        echo json_encode($data !== false ? ['status' => 'success', 'data' => $data] : ['status' => 'error', 'message' => 'Credenciales incorrectas']);
        break;

    case 'getAll':
        try {
            $page = isset($_post['page']) ? (int)$_post['page'] : 1;
            $search = trim($_post['search'] ?? '');
            $limit = 50; 
            if ($page < 1) $page = 1;
            $offset = ($page - 1) * $limit;

            
            $whereClause = "";
            $params = [];
            if ($search !== "") {
                $whereClause = "WHERE u.nombre LIKE :s OR u.apellido LIKE :s OR u.correo LIKE :s OR u.telefono LIKE :s";
                $params[':s'] = "%$search%";
            }

            
            $countSql = "SELECT COUNT(*) FROM usuario u $whereClause";
            $stmtCount = $db->prepare($countSql);
            $stmtCount->execute($params);
            $totalRows = (int)$stmtCount->fetchColumn();
            $totalPages = (int)ceil($totalRows / $limit);

            
            $orderByParam = $_post['order_by'] ?? 'u.id_usuario';
            $orderDirParam = (strtoupper($_post['order_dir'] ?? '') === 'DESC') ? 'DESC' : 'ASC';
            $rolPrioridad = $_post['rol_prioridad'] ?? 'CLIENTE_PRIMERO';

            if ($orderByParam === 'rol_prioridad') {
                if ($rolPrioridad === 'ADMIN_PRIMERO') {
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Administrador' THEN 1 ELSE 3 END ASC, u.id_rol ASC";
                } elseif ($rolPrioridad === 'MECANICO_PRIMERO') {
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Mecánico' THEN 1 ELSE 3 END ASC, u.id_rol ASC";
                } else { 
                    $orderClause = "ORDER BY CASE r.nombre WHEN 'Cliente' THEN 1 ELSE 3 END ASC, u.id_rol ASC";
                }
            } elseif ($orderByParam === 'u.nombre') {
                $orderClause = "ORDER BY u.nombre $orderDirParam, u.id_usuario ASC";
            } else {
                $orderClause = "ORDER BY u.id_usuario $orderDirParam";
            }

            
            $sql = "SELECT u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.estado, r.nombre AS rol
                    FROM usuario u
                    INNER JOIN rol r ON u.id_rol = r.id_rol
                    $whereClause
                    $orderClause
                    LIMIT $limit OFFSET $offset";

            $stmt = $db->prepare($sql);
            $stmt->execute($params);
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

    case 'insert': echo json_encode(['status' => insertUsuarios($_post) ? 'success' : 'error']); break;
    case 'getOne': echo json_encode(['status' => ($d = getUsuarioById($_post['id'] ?? 0)) ? 'success' : 'error', 'data' => $d]); break;
    case 'update': echo json_encode(['status' => updateUsuario($_post) ? 'success' : 'error']); break;
    case 'delete': echo json_encode(['status' => deleteUsuario($_post['id'] ?? 0) ? 'success' : 'error']); break;
    case 'getAllRoles': echo json_encode(['status' => 'success', 'data' => getAllRoles()]); break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>