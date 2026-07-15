<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

global $db;

switch ($action) {
    case 'getAll':
        $stmt = $db->prepare("SELECT img.id_imagen, img.id_modelo, img.url_archivo, img.es_principal, 
                                     m.marca, m.nombre_modelo, m.year 
                              FROM imagen_modelo_vehiculo img 
                              INNER JOIN modelo_vehiculo m ON img.id_modelo = m.id_modelo 
                              ORDER BY img.id_imagen DESC");
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'getOne':
        $stmt = $db->prepare("SELECT * FROM imagen_modelo_vehiculo WHERE id_imagen = :id");
        $stmt->execute([':id' => $_post['id_imagen']]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'insert':
        try {
            $stmt = $db->prepare("INSERT INTO imagen_modelo_vehiculo (id_modelo, url_archivo, es_principal) 
                                  VALUES (:id_modelo, :url_archivo, :es_principal)");
            $ok = $stmt->execute([
                ':id_modelo'    => $_post['id_modelo'],
                ':url_archivo'  => $_post['url_archivo'],
                ':es_principal' => $_post['es_principal']
            ]);
            echo json_encode(['status' => $ok ? 'success' : 'error']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'update':
        try {
            $stmt = $db->prepare("UPDATE imagen_modelo_vehiculo SET 
                                    id_modelo = :id_modelo, 
                                    url_archivo = :url_archivo, 
                                    es_principal = :es_principal 
                                  WHERE id_imagen = :id_imagen");
            $ok = $stmt->execute([
                ':id_modelo'    => $_post['id_modelo'],
                ':url_archivo'  => $_post['url_archivo'],
                ':es_principal' => $_post['es_principal'],
                ':id_imagen'    => $_post['id_imagen']
            ]);
            echo json_encode(['status' => $ok ? 'success' : 'error']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
        break;

    case 'delete':
        $stmt = $db->prepare("DELETE FROM imagen_modelo_vehiculo WHERE id_imagen = :id");
        $ok = $stmt->execute([':id' => $_post['id_imagen']]);
        echo json_encode(['status' => $ok ? 'success' : 'error']);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Acción inválida']);
}
?>