<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';
$email = $_post['email'] ?? '';
$password = $_post['password'] ?? '';

global $db;

switch ($action) {
    case 'login':
        $data = login($email, $password);
        if ($data !== false) {
            $_SESSION['usuario'] = $data;
            echo json_encode(['status' => 'success', 'data' => $data]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Credenciales incorrectas']);
        }
        break;

    case 'checkSession':
        requireAuth();
        echo json_encode(['status' => 'success', 'data' => $_SESSION['usuario']]);
        break;

    case 'logout':
        session_destroy();
        echo json_encode(['status' => 'success']);
        break;

    case 'getAll':
        requireAuth(['Administrador']);
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

    case 'insert':
        requireAuth(['Administrador']);
        $data = insertUsuarios($_post);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'getOne':
        requireAuth(['Administrador']);
        $data = getUsuarioById($_post['id'] ?? 0);
        echo json_encode(['status' => $data ? 'success' : 'error', 'data' => $data]);
        break;

    case 'update':
        requireAuth(['Administrador']);
        $data = updateUsuario($_post);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'delete':
        requireAuth(['Administrador']);
        $data = deleteUsuario($_post['id'] ?? 0);
        echo json_encode(['status' => $data ? 'success' : 'error']);
        break;

    case 'getAllRoles':
        requireAuth(['Administrador']);
        $data = getAllRoles();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}
?>