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
            $data = getAllsucursal();
            echo json_encode([
                "status" => "success",
                "data" => $data
            ]);
            break;

        case "insert":
          $data = insertar_sucursal($_post);
          echo json_encode ([ "status" => $data ? "success" : "error",
                "data" => $data,
                "message" => $data ? null : "No se pudo guardar la sucursal"
            ]);
         break;    

          case "update":
            $ok = actualizarSucursal($_post['id_sucursal'], $_post['nombre'], $_post['ciudad'] ?? '');
            echo json_encode([
                "status"  => $ok ? "success" : "error",
                "message" => $ok ? "Sucursal actualizada" : "No se pudo actualizar la sucursal"
            ]);
            break;   

        case "delete_sucursal":
            $ok = deleteSucursal($_post['id_sucursal']);
            if ($ok === "en_uso") {
                echo json_encode([
                    "status" => "error",
                    "message" => "No se puede eliminar esta sucursal porque está en uso"
                ]);
            } else {
                echo json_encode([
                    "status" => $ok ? "success" : "error",
                    "message" => $ok ? "Sucursal eliminada" : "No se pudo eliminar esta sucursal"
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