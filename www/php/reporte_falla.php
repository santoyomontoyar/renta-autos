<?php
header("Content-Type: application/json; charset=utf-8");
require_once "lib/functions.php";
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents("php://input"), true);
$action = $_post['action'] ?? '';

global $db;

// Módulo del Mecánico: solo Administrador y Mecánico entran, y un Mecánico
// únicamente puede ver/editar/borrar los reportes de falla que él capturó.
requireAuth(['Administrador', 'Mecánico']);

try {
    switch ($action) {

        case "getAll":
            $page     = $_post['page'] ?? 1;
            $orderBy  = $_post['order_by'] ?? 'id_falla';
            $orderDir = $_post['order_dir'] ?? 'ASC';
            $buscar   = $_post['buscar'] ?? '';
            $idUsuarioFiltro = esRol('Mecánico') ? usuarioActual()['id_usuario'] : null;

            $resultado = getFallasPaginado($page, $orderBy, $orderDir, $buscar, $idUsuarioFiltro);
            echo json_encode([
                "status" => "success",
                "data" => $resultado['data'],
                "pagination" => $resultado['pagination']
            ]);
            break;

        case "insert":
            // Un mecánico siempre reporta a su propio nombre, sin importar
            // qué id_usuario haya mandado el front.
            if (esRol('Mecánico')) {
                $_post['id_usuario'] = usuarioActual()['id_usuario'];
            }
            $data = insertar_falla($_post);
            echo json_encode([
                "status" => $data ? "success" : "error",
                "data" => $data,
                "message" => $data ? null : "No se pudo guardar el reporte"
            ]);
            break;

        case "update":
            requireDuenoDeFalla($_post['id_falla'] ?? 0);
            $ok = actualizarFalla($_post['id_falla'], $_post['id_renta'], $_post['id_usuario'], $_post['descripcion']);
            echo json_encode([
                "status"  => $ok ? "success" : "error",
                "message" => $ok ? "Reporte actualizado" : "No se pudo actualizar el reporte"
            ]);
            break;

        case "delete_falla":
            requireDuenoDeFalla($_post['id_falla'] ?? 0);
            $ok = deleteFalla($_post['id_falla']);
            if ($ok === "en_uso") {
                echo json_encode(["status" => "error", "message" => "No se puede eliminar este reporte porque está en uso"]);
            } else {
                echo json_encode([
                    "status" => $ok ? "success" : "error",
                    "message" => $ok ? "Reporte eliminado" : "No se pudo eliminar este reporte"
                ]);
            }
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Invalid action"]);
            exit;
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}