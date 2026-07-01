<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'lib/functions.php';

$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

switch ($action) {

case 'update':
    $id = $input['id_tipo_seguro'];
    $nombre = $input['nombre'];

    updateTipoSeguro($id, $nombre);

    echo json_encode([
        'status' => 'success'
    ]);
    break;

    case 'getAll':
        $data = getAllTipoSeguro();
        echo json_encode([
            'status' => 'success',
            'data' => $data
        ]);
        break;

    default:
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid action'
        ]);
        break;
    
    case 'create':
    $nombre = $input['nombre'] ?? '';
    $ok = createTipoSeguro($nombre);

    echo json_encode([
        'status' => $ok ? 'success' : 'error'
    ]);
    break;

    case 'delete':
    $id = $input['id_tipo_seguro'];

    if(deleteTipoSeguro($id)){
        echo json_encode([
            'status' => 'success'
        ]);
    }else{
        echo json_encode([
            'status' => 'error',
            'message' => 'No se pudo eliminar'
        ]);
    }
    break;
        
}