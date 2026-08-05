<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'lib/functions.php';
require_once 'lib/auth.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? '';

requireAuth(['Administrador', 'Mecánico']);

switch ($action) {
    case 'getStats':
        echo json_encode([
            'status' => 'success',
            'data' => [
                'modelos_por_categoria' => getStatsModelosPorCategoria(),
                'fallas_por_mes'        => getStatsFallasPorMes(),
                'top_mecanicos'         => getStatsTopMecanicos(),
                'ventas_resumen_mes'    => getStatsVentasResumenMes(),
                'ventas_por_dia'        => getStatsVentasPorDia()
            ]
        ]);
        break;

    case 'getFallasPorMesFiltro':
        $mes = $_post['mes'] ?? date('Y-m');
        echo json_encode([
            'status' => 'success',
            'data' => ['total' => getStatsFallasPorMesFiltro($mes)]
        ]);
        break;

    default:
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
}