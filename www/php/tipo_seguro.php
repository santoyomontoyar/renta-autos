<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'lib/functions.php';

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $input['action'] ?? '';

switch ($action) {
    case 'getAll':
        $data = getAllTipoSeguro();
        echo json_encode([
            'status' => 'success',
            'data' => $data
        ]);
        break;

    case 'getOne':
        $id = $input['id_tipo_seguro'] ?? null;
        $data = getTipoSeguro($id);

        if ($data) {
            echo json_encode([
                'status' => 'success',
                'data' => $data
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Registro no encontrado'
            ]);
        }
        break;

    case 'create':
        $nombre = $input['nombre'] ?? '';
        $descripcion = $input['descripcion'] ?? '';

        $ok = createTipoSeguro($nombre, $descripcion);

        echo json_encode([
            'status' => $ok ? 'success' : 'error'
        ]);
        break;

    case 'update':
        $id = $input['id_tipo_seguro'] ?? null;
        $nombre = $input['nombre'] ?? '';
        $descripcion = $input['descripcion'] ?? '';

        $ok = updateTipoSeguro($id, $nombre, $descripcion);

        echo json_encode([
            'status' => $ok ? 'success' : 'error'
        ]);
        break;

    case 'delete':
        $id = $input['id_tipo_seguro'] ?? null;

        $ok = deleteTipoSeguro($id);

        echo json_encode([
            'status' => $ok ? 'success' : 'error',
            'message' => $ok ? null : 'No se pudo eliminar'
        ]);
        break;

    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid action'
        ]);
        break;
}