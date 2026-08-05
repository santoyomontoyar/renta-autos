<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

requireAuth(['Administrador', 'Mecánico']);

switch ($action) {
    case 'getAll':
        $page     = $_post['page'] ?? 1;
        $orderBy  = $_post['order_by'] ?? 'id_imagen';
        $orderDir = $_post['order_dir'] ?? 'ASC';
        $buscar   = $_post['buscar'] ?? '';
        $idUsuarioFiltro = esRol('Mecánico') ? usuarioActual()['id_usuario'] : null;

        $resultado = getImagenesFallaPaginado($page, $orderBy, $orderDir, $buscar, $idUsuarioFiltro);
        echo json_encode([
            'status' => 'success',
            'data' => $resultado['data'],
            'pagination' => $resultado['pagination']
        ]);
        break;

    case 'getOne':
        $data = getImagenFallaById($_post['id_imagen']);
        if ($data && esRol('Mecánico') && getIdUsuarioDeFalla($data['id_falla']) !== usuarioActual()['id_usuario']) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'No puedes ver imágenes de fallas de otro mecánico']);
            break;
        }
        echo json_encode(['status' => $data ? 'success' : 'error', 'data' => $data]);
        break;

    case 'getFormNeeds':
        $data = ['fallas' => getAllFallas()];
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'insert':
        $datos = $_post['datos'] ?? [];
        if (esRol('Mecánico') && getIdUsuarioDeFalla($datos['id_falla'] ?? 0) !== usuarioActual()['id_usuario']) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'No puedes agregar imágenes a la falla de otro mecánico']);
            break;
        }
        $result = insertImagenFalla($datos);
        echo json_encode($result !== false
            ? ['status' => 'success', 'id' => $result]
            : ['status' => 'error', 'message' => 'No se pudo insertar']);
        break;

    case 'update':
        $datos = $_post['datos'] ?? [];
        $imagenActual = getImagenFallaById($datos['id_imagen'] ?? 0);
        if ($imagenActual && esRol('Mecánico') && getIdUsuarioDeFalla($imagenActual['id_falla']) !== usuarioActual()['id_usuario']) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'No puedes editar imágenes de fallas de otro mecánico']);
            break;
        }
        $result = updateImagenFalla($datos);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo actualizar']);
        break;

    case 'delete':
        $imagenActual = getImagenFallaById($_post['id_imagen'] ?? 0);
        if ($imagenActual && esRol('Mecánico') && getIdUsuarioDeFalla($imagenActual['id_falla']) !== usuarioActual()['id_usuario']) {
            http_response_code(403);
            echo json_encode(['status' => 'error', 'message' => 'No puedes eliminar imágenes de fallas de otro mecánico']);
            break;
        }
        $result = deleteImagenFalla($_post['id_imagen']);
        echo json_encode($result
            ? ['status' => 'success']
            : ['status' => 'error', 'message' => 'No se pudo eliminar']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}