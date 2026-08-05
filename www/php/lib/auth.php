<?php
session_start([
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);

/**
 * Corta la ejecución si no hay sesión, o si el rol de la sesión no está
 * dentro de $rolesPermitidos (cuando se especifica la lista).
 */
function requireAuth(array $rolesPermitidos = []) {
    if (!isset($_SESSION['usuario'])) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No has iniciado sesión']);
        exit;
    }
    if (!empty($rolesPermitidos) && !in_array($_SESSION['usuario']['rol'], $rolesPermitidos, true)) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'No tienes permiso para este módulo']);
        exit;
    }
}

/** Devuelve el usuario autenticado en la sesión actual (o null). */
function usuarioActual() {
    return $_SESSION['usuario'] ?? null;
}

/** true si el usuario en sesión tiene el rol dado. */
function esRol(string $rol) {
    $usuario = usuarioActual();
    return $usuario !== null && $usuario['rol'] === $rol;
}

/**
 * Resuelve el id_cliente asociado al usuario en sesión (solo tiene sentido
 * cuando el rol es "Cliente"). Se usa para que un cliente nunca pueda leer
 * o modificar datos de otro cliente, sin importar lo que mande en el POST.
 */
function getIdClienteSesion() {
    global $db;
    $usuario = usuarioActual();
    if ($usuario === null) {
        return null;
    }
    $stmt = $db->prepare("SELECT id_cliente FROM cliente WHERE id_usuario = :id_usuario");
    $stmt->execute([':id_usuario' => $usuario['id_usuario']]);
    $fila = $stmt->fetch(PDO::FETCH_ASSOC);
    return $fila ? (int)$fila['id_cliente'] : null;
}

/**
 * Corta la ejecución con 403 si el cliente en sesión intenta operar sobre
 * un id_cliente que no es el suyo. Los administradores no tienen esta
 * restricción.
 */
function requireClientePropio(int $idClienteSolicitado) {
    if (esRol('Administrador')) {
        return;
    }
    $idClienteSesion = getIdClienteSesion();
    if ($idClienteSesion === null || $idClienteSesion !== $idClienteSolicitado) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'No puedes acceder a información de otro cliente']);
        exit;
    }
}

/**
 * Corta la ejecución con 403 si el mecánico en sesión intenta operar sobre
 * un reporte de falla que no capturó él. Los administradores no tienen
 * esta restricción. Requiere getIdUsuarioDeFalla() de lib/functions.php.
 */
function requireDuenoDeFalla($id_falla) {
    if (esRol('Administrador')) {
        return;
    }
    $usuario = usuarioActual();
    if ($usuario === null || getIdUsuarioDeFalla($id_falla) !== (int)$usuario['id_usuario']) {
        http_response_code(403);
        echo json_encode(['status' => 'error', 'message' => 'No puedes operar sobre el reporte de falla de otro mecánico']);
        exit;
    }
}

/**
 * Exige sesión con alguno de $rolesGenerales para usar el módulo, y si la
 * acción actual está en $accionesRestringidas, exige además que el rol esté
 * en $rolesRestringidos. Evita repetir el patrón "requireAuth + if + requireAuth"
 * en cada endpoint que combina roles de lectura amplios con roles de escritura
 * más estrechos.
 */
function requireAccion(string $accion, array $rolesGenerales, array $accionesRestringidas = [], array $rolesRestringidos = []) {
    requireAuth($rolesGenerales);
    if (in_array($accion, $accionesRestringidas, true)) {
        requireAuth($rolesRestringidos);
    }
}