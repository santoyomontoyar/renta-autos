<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

switch ($action) {
    case 'getStats':
        echo json_encode([
            'status' => 'success',
            'data' => [
                'modelos_por_categoria'  => getStatsModelosPorCategoria(),
                'fallas_por_mes'         => getStatsFallasPorMes(),
                'fallas_resumen_mes'     => getStatsFallasResumenMes(),
                'top_mecanicos'          => getStatsTopMecanicos(),
                'imagenes_por_tipo'      => getStatsImagenesPorTipo(),
                'fallas_con_evidencia'   => getStatsFallasConEvidencia()
            ]
        ]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}