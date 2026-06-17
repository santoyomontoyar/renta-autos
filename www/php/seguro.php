<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

$data = "";

switch ($action) {
    case 'getAll':
        $data = getAllSeguros();
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