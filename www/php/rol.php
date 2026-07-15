<?php

require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$data = "";

switch ($action) {

    case 'getAll':
        $data = getAllRoles();
        break;
    case 'insert':
        $data = insertar_rol($_post);
        break;    

    case 'update':
        $ok = actualizarRol($_post['id_rol'], $_post['name']);
        echo json_encode([
            'status'  => $ok ? 'success' : 'error',
            'message' => $ok ? 'Rol actualizado' : 'No se pudo actualizar el rol'
        ]);
        exit;    

    case 'delete_rol':
        $ok = deleteRol($_post['id_rol']);
        if ($ok === "en_uso") {
            echo json_encode([
                'status' => 'error',
                'message' => 'No se puede eliminar este rol porque está en uso'
            ]);
        } else {
            echo json_encode([
                'status' => $ok? 'success' : 'error',
                'message' => $ok ? 'Rol eliminado' : 'No se pudo eliminar este rol'
            ]);
        }
        exit;

    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid action'
        ]);
        exit;
}

if ($data) {
    echo json_encode([
        'status' => 'success',
        'data' => $data
    ]);
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to insert data'
    ]);
}