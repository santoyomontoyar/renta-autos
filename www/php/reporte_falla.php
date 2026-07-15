<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json; charset=utf-8");

require_once "lib/functions.php";

$_post = json_decode(file_get_contents("php://input"), true);
$action = $_post['action'] ?? '';

try {

    switch ($action) {

        case "getAll":
            $data = getAllFallas();
            echo json_encode([
                "status" => "success",
                "data" => $data
            ]);
            break;

        case "insert":
            $data = insertar_falla($_post);
            echo json_encode([
                "status" => $data ? "success" : "error",
                "data" => $data,
                "message" => $data ? null : "No se pudo guardar el reporte"
            ]);
            break;

         case "update":
            $ok = actualizarFalla($_post['id_falla'], $_post['id_renta'], $_post['id_usuario'], $_post['descripcion']);
            echo json_encode([
                "status"  => $ok ? "success" : "error",
                "message" => $ok ? "Reporte actualizado" : "No se pudo actualizar el reporte"
            ]);
            break;
 
        case "delete_falla":
            $ok = deleteFalla($_post['id_falla']);
            if ($ok === "en_uso") {
                echo json_encode([
                    "status" => "error",
                    "message" => "No se puede eliminar este reporte porque está en uso"
                ]);
            } else {
                echo json_encode([
                    "status" => $ok ? "success" : "error",
                    "message" => $ok ? "Reporte eliminado" : "No se pudo eliminar este reporte"
                ]);
            }
            break;    

        default:
            echo json_encode([
                "status" => "error",
                "message" => "Invalid action"
            ]);
            exit;
    }

} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}