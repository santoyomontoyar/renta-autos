<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$data = "";
switch ($action) {
    case 'getAll':
        $data = getAllDocumentos();
        break;
    case 'insert':
        $data = insertDocumentos($_post);
        break;
    case 'update':
        $data = updateDocumentos($_post);
        break;
    case 'getById':
        $data = getDocumentoById($_post['id_documento']);
        break;    
    case 'delete':
        $data = deleteDocumentos($_post['id_documento']);
        break;        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
}

if ($data !== "") {
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch data']);
}