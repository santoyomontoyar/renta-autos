<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

// Un cliente solo puede ver sus propios documentos; el resto del módulo
// (alta, edición, baja, y ver los documentos de todos) es solo de Administrador.
requireAccion($action, ['Administrador', 'Cliente'], ['insert', 'update', 'delete'], ['Administrador']);

switch ($action) {
    case 'getAll':
        try {
            $page = isset($_post['page']) ? (int)$_post['page'] : 1;
            $limit = 50;
            if ($page < 1) $page = 1;
            $offset = ($page - 1) * $limit;

            $search = trim($_post['search'] ?? '');
            $condiciones = array();
            $params = array();

            if ($search !== '') {
                $condiciones[] = "(u.nombre LIKE :s
                                OR u.apellido LIKE :s
                                OR d.tipo_documento LIKE :s
                                OR d.numero_documento LIKE :s)";
                $params[':s'] = "%$search%";
            }

            // Si quien pregunta es un Cliente, se le filtra a sus propios documentos
            // sin importar lo que haya mandado en la petición (ni el buscador lo saltan).
            if (esRol('Cliente')) {
                $condiciones[] = "d.id_cliente = :id_cliente_sesion";
                $params[':id_cliente_sesion'] = getIdClienteSesion();
            }

            $whereClause = count($condiciones) > 0 ? "WHERE " . implode(' AND ', $condiciones) : "";

            $countSql = "SELECT COUNT(*)
                         FROM documento_cliente d
                         INNER JOIN cliente c ON d.id_cliente = c.id_cliente
                         INNER JOIN usuario u ON c.id_usuario = u.id_usuario
                         $whereClause";
            $stmtCount = $db->prepare($countSql);
            $stmtCount->execute($params);
            $totalRows = (int)$stmtCount->fetchColumn();
            $totalPages = (int)ceil($totalRows / $limit);

            $orderByParam = $_post['order_by'] ?? 'd.id_documento';
            $orderDirParam = (strtoupper($_post['order_dir'] ?? '') === 'DESC') ? 'DESC' : 'ASC';
            $tipoPrioridad = $_post['tipo_prioridad'] ?? 'INE_PRIMERO';

            if ($orderByParam === 'tipo_prioridad') {
                if ($tipoPrioridad === 'LICENCIA_PRIMERO') {
                    $orderClause = "ORDER BY CASE d.tipo_documento WHEN 'Licencia_Conducir' THEN 1 ELSE 2 END ASC, d.id_documento ASC";
                } else {
                    $orderClause = "ORDER BY CASE d.tipo_documento WHEN 'INE' THEN 1 ELSE 2 END ASC, d.id_documento ASC";
                }
            } elseif (in_array($orderByParam, array('u.nombre', 'd.numero_documento', 'd.fecha_vencimiento'))) {
                $orderClause = "ORDER BY $orderByParam $orderDirParam, d.id_documento ASC";
            } else {
                $orderClause = "ORDER BY d.id_documento $orderDirParam";
            }

            $sql = "SELECT
                        d.id_documento,
                        d.id_cliente,
                        d.tipo_documento,
                        d.numero_documento,
                        d.url_archivo,
                        d.fecha_vencimiento,
                        u.nombre,
                        u.apellido
                    FROM documento_cliente d
                    INNER JOIN cliente c ON d.id_cliente = c.id_cliente
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
            echo json_encode(array('status' => 'error', 'message' => $e->getMessage()));
        }
        break;

    case 'getById':
        $data = getDocumentoById($_post['id_documento'] ?? 0);
        if ($data) {
            // Un cliente no puede leer el documento de otro cliente aunque
            // adivine el id_documento correcto.
            requireClientePropio((int)$data['id_cliente']);
            echo json_encode(array('status' => 'success', 'data' => $data));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Documento no encontrado'));
        }
        break;

    case 'insert':
        insertDocumentos($_post);
        echo json_encode(array('status' => 'success'));
        break;

    case 'update':
        $stmtUrl = $db->prepare("SELECT url_archivo FROM documento_cliente WHERE id_documento = :id");
        $stmtUrl->execute(array(':id' => $_post['id_documento']));
        $docOriginal = $stmtUrl->fetch(PDO::FETCH_ASSOC);

        $urlExistente = $docOriginal ? $docOriginal['url_archivo'] : '';

        try {
            $stmtUp = $db->prepare("UPDATE documento_cliente SET
                                        id_cliente = :id_cliente,
                                        tipo_documento = :tipo_documento,
                                        numero_documento = :numero_documento,
                                        url_archivo = :url_archivo,
                                        fecha_vencimiento = :fecha_vencimiento
                                    WHERE id_documento = :id_documento");

            $ok = $stmtUp->execute(array(
                ':id_cliente'        => intval($_post['id_cliente']),
                ':tipo_documento'    => $_post['tipo_documento'],
                ':numero_documento'  => $_post['numero_documento'],
                ':url_archivo'       => $urlExistente,
                ':fecha_vencimiento' => $_post['fecha_vencimiento'],
                ':id_documento'      => intval($_post['id_documento'])
            ));

            echo json_encode(array('status' => 'success'));
        } catch (PDOException $e) {
            echo json_encode(array('status' => 'error', 'message' => 'Error al actualizar en BD: ' . $e->getMessage()));
        }
        break;

    case 'delete':
        deleteDocumentos($_post['id_documento']);
        echo json_encode(array('status' => 'success'));
        break;

    default:
        echo json_encode(array('status' => 'error', 'message' => 'Acción inválida'));
}
?>