<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=utf-8");

require_once "../lib/functions.php";

$_post = json_decode(file_get_contents("php://input"), true);
$action = $_post['action'] ?? '';

try {

    switch ($action) {

        case "getAll":
            $data = getAllSucursales();
            break;

        default:
            echo json_encode([
                "status" => "error",
                "message" => "Invalid action"
            ]);
            exit;
    }

    echo json_encode([
        "status" => "success",
        "data" => $data
    ]);

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}