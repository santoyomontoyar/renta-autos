<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? "";

global $db;

switch ($action) {

    case 'getAll':
        $page      = $_post['page'] ?? 1;
        $orderBy   = $_post['order_by'] ?? 'id_modelo';
        $orderDir  = $_post['order_dir'] ?? 'ASC';
        $buscar    = $_post['buscar'] ?? '';
        $categoria = $_post['categoria'] ?? '';

        $resultado = getModelosPaginado($page, $orderBy, $orderDir, $buscar, $categoria);
        echo json_encode([
            "status" => "success",
            "data" => $resultado['data'],
            "pagination" => $resultado['pagination']
        ]);
        break;

    case 'getCategorias':
        $data = getCategoriasModelo();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'getAllForSelect':
        // Usado para llenar el <select> de modelos en otros formularios (sin paginar)
        $data = getAllModelos();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case 'getOne':
        $data = getOneModelo($_post['id_modelo']);
        echo json_encode(["status" => $data ? "success" : "error", "data" => $data]);
        break;

    case 'insert':
        $ok = insertModelo($_post);
        echo json_encode(["status" => $ok ? "success" : "error"]);
        break;

    case 'update':
        $ok = updateModelo($_post);
        echo json_encode(["status" => $ok ? "success" : "error"]);
        break;

    case 'delete':
        $ok = deleteModelo($_post['id_modelo']);
        echo json_encode(["status" => $ok ? "success" : "error"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
}