<?php
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

switch ($action) {
    case 'getAll':
        $data = getAllDocumentos();
        echo json_encode(['status' => 'success', 'data' => $data]);
        break;

    case 'getById':
        $data = getDocumentoById($_post['id_documento']);
        if ($data) {
            echo json_encode(['status' => 'success', 'data' => $data]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Documento no encontrado']);
        }
        break; 

    case 'insert':
        insertDocumentos($_post);
        echo json_encode(['status' => 'success']);
        break;

    case 'update':
        $stmtUrl = $db->prepare("SELECT url_archivo FROM documento_cliente WHERE id_documento = :id");
        $stmtUrl->execute([':id' => $_post['id_documento']]);
        $docOriginal = $stmtUrl->fetch(PDO::FETCH_ASSOC);
        
        $urlExistente = $docOriginal ? $docOriginal['url_archivo'] : '';

        try {
            $stmtUp = $db->prepare("UPDATE documento_cliente SET 
                                        id_cliente = :id_cliente, 
                                        tipo_documento = :tipo_documento, 
                                        numero_documento = :numero_documento, 
                                        url_archivo = :url_archivo, 
                                        fecha_vencimiento = :fecha_vencimiento 
                                    WHERE id_documento = :id_documento");
            
            $ok = $stmtUp->execute([
                ':id_cliente'        => intval($_post['id_cliente']), 
                ':tipo_documento'    => $_post['tipo_documento'],
                ':numero_documento'  => $_post['numero_documento'],
                ':url_archivo'       => $urlExistente, 
                ':fecha_vencimiento' => $_post['fecha_vencimiento'],
                ':id_documento'      => intval($_post['id_documento'])
            ]);
            
            echo json_encode(['status' => 'success']);
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Error al actualizar en BD: ' . $e->getMessage()]);
        }
        break;
   
    case 'delete':
        deleteDocumentos($_post['id_documento']);
        echo json_encode(['status' => 'success']);
        break;        
        
    default:
        echo json_encode(['status' => 'error', 'message' => 'Acción inválida']);
}
?>