<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

switch ($action) {
    case 'getAll':
        $stmt = $db->prepare("SELECT id_cargo, id_falla, id_renta, descripcion, monto_total, monto_seguro, monto_cliente, monto_devuelto, monto_extra_pagado, fecha_cargo FROM cargo_adicional ORDER BY id_cargo DESC");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'getFallas':
        $data = getAllFallas();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'getOne':
        $stmt = $db->prepare("SELECT * FROM cargo_adicional WHERE id_cargo = :id");
        $stmt->execute([':id' => $_post['id_cargo']]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'insert':
        try {
            $stmt = $db->prepare("INSERT INTO cargo_adicional (id_falla, id_renta, descripcion, monto_total, monto_seguro, monto_cliente, monto_devuelto, monto_extra_pagado) 
                                  VALUES (:id_falla, :id_renta, :descripcion, :monto_total, :monto_seguro, :monto_cliente, :monto_devuelto, :monto_extra_pagado)");
            $ok = $stmt->execute([
                ':id_falla'           => $_post['id_falla'],
                ':id_renta'           => $_post['id_renta'],
                ':descripcion'        => $_post['descripcion'],
                ':monto_total'        => $_post['monto_total'],
                ':monto_seguro'       => $_post['monto_seguro'],
                ':monto_cliente'      => $_post['monto_cliente'],
                ':monto_devuelto'     => $_post['monto_devuelto'],
                ':monto_extra_pagado' => $_post['monto_extra_pagado']
            ]);
            echo json_encode(['status' => $ok ? 'success' : 'error']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'update':
        try {
            $stmt = $db->prepare("UPDATE cargo_adicional SET 
                                    id_falla = :id_falla, 
                                    id_renta = :id_renta, 
                                    descripcion = :descripcion, 
                                    monto_total = :monto_total, 
                                    monto_seguro = :monto_seguro, 
                                    monto_cliente = :monto_cliente,
                                    monto_devuelto = :monto_devuelto,
                                    monto_extra_pagado = :monto_extra_pagado 
                                  WHERE id_cargo = :id_cargo");
            $ok = $stmt->execute([
                ':id_falla'           => $_post['id_falla'],
                ':id_renta'           => $_post['id_renta'],
                ':descripcion'        => $_post['descripcion'],
                ':monto_total'        => $_post['monto_total'],
                ':monto_seguro'       => $_post['monto_seguro'],
                ':monto_cliente'      => $_post['monto_cliente'],
                ':monto_devuelto'     => $_post['monto_devuelto'],
                ':monto_extra_pagado' => $_post['monto_extra_pagado'],
                ':id_cargo'           => $_post['id_cargo']
            ]);
            echo json_encode(['status' => $ok ? 'success' : 'error']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;

    case 'delete':
        $stmt = $db->prepare("DELETE FROM cargo_adicional WHERE id_cargo = :id");
        $ok = $stmt->execute([':id' => $_post['id_cargo']]);
        echo json_encode(['status' => $ok ? 'success' : 'error']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Acción inválida']);
}
?>