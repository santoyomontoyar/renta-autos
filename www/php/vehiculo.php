<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

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
                $whereClause = "WHERE m.marca LIKE :s 
                                OR m.nombre_modelo LIKE :s 
                                OR v.placa LIKE :s 
                                OR m.categoria LIKE :s 
                                OR s.nombre LIKE :s";
                $params[':s'] = "%$search%";
            }

            
            $countSql = "SELECT COUNT(*) 
                         FROM vehiculo v
                         INNER JOIN modelo_vehiculo m ON v.id_modelo = m.id_modelo
                         INNER JOIN sucursal s ON v.id_sucursal_actual = s.id_sucursal
                         $whereClause";
            $stmtCount = $db->prepare($countSql);
            $stmtCount->execute($params);
            $totalRows = (int)$stmtCount->fetchColumn();

            $totalPages = (int)ceil($totalRows / $limit);

            
            $orderByParam = $_post['order_by'] ?? 'v.id_vehiculo';
            $orderDirParam = (strtoupper($_post['order_dir'] ?? '') === 'DESC') ? 'DESC' : 'ASC';
            $estadoPrioridad = $_post['estado_prioridad'] ?? 'DISPONIBLE_PRIMERO';

            if ($orderByParam === 'estado_prioridad') {
                if ($estadoPrioridad === 'RENTADO_PRIMERO') {
                    $orderClause = "ORDER BY CASE v.estado WHEN 'Rentado' THEN 1 ELSE 2 END ASC, v.id_vehiculo ASC";
                } elseif ($estadoPrioridad === 'MANTENIMIENTO_PRIMERO') {
                    $orderClause = "ORDER BY CASE v.estado WHEN 'Mantenimiento' THEN 1 ELSE 2 END ASC, v.id_vehiculo ASC";
                } else { 
                    $orderClause = "ORDER BY CASE v.estado WHEN 'Disponible' THEN 1 ELSE 2 END ASC, v.id_vehiculo ASC";
                }
            } elseif (in_array($orderByParam, array('m.nombre_modelo', 'm.costo_diario'))) {
                $orderClause = "ORDER BY $orderByParam $orderDirParam, v.id_vehiculo ASC";
            } else {
                $orderClause = "ORDER BY v.id_vehiculo $orderDirParam";
            }

            $sql = "SELECT 
                        v.id_vehiculo, 
                        v.placa, 
                        v.estado, 
                        v.transmision,
                        m.nombre_modelo, 
                        m.marca, 
                        m.year, 
                        m.categoria, 
                        m.costo_diario,
                        s.nombre AS sucursal
                    FROM vehiculo v
                    INNER JOIN modelo_vehiculo m ON v.id_modelo = m.id_modelo
                    INNER JOIN sucursal s ON v.id_sucursal_actual = s.id_sucursal
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

    case 'getOne':
        $data = getVehiculoById($_post['id_vehiculo'] ?? 0);
        if ($data) {
            echo json_encode(array('status' => 'success', 'data' => $data));
        } else {
            echo json_encode(array('status' => 'error', 'message' => 'Vehículo no encontrado'));
        }
        break;

    case 'insert':
        $result = insertVehiculo($_post);
        echo json_encode($result !== false
            ? array('status' => 'success', 'id' => $result)
            : array('status' => 'error', 'message' => 'No se pudo insertar'));
        break;

    case 'update':
        $result = updateVehiculo($_post);
        echo json_encode($result
            ? array('status' => 'success')
            : array('status' => 'error', 'message' => 'No se pudo actualizar'));
        break;

    case 'delete':
        $result = deleteVehiculo($_post['id_vehiculo'] ?? 0);
        if ($result === "en_uso") {
            echo json_encode(array('status' => 'error', 'message' => 'El vehículo tiene rentas asociadas'));
        } else {
            echo json_encode($result
                ? array('status' => 'success')
                : array('status' => 'error', 'message' => 'No se pudo eliminar'));
        }
        break;

    default:
        echo json_encode(array('status' => 'error', 'message' => 'Acción inválida'));
}
?>