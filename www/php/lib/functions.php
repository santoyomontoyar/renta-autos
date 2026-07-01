<?php
require_once 'db.php';
function login($email, $password)
{
  global $db;
  $stmt = $db->prepare("SELECT * FROM usuario WHERE correo = :email");
  $stmt->bindParam(':email', $email);
  $stmt->execute();
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    return $user;
  }
  return false;
}
function getAllUsuarios() {
    global $db;
    $stmt = $db->prepare("SELECT
    u.id_usuario, u.nombre, u.apellido, u.correo, u.telefono, u.estado, r.nombre AS rol
                          FROM usuario u
                          INNER JOIN rol r ON u.id_rol = r.id_rol");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllClientes() {
    global $db;
    try {
        $stmt = $db->prepare("SELECT 
                                c.id_cliente, 
                                c.id_usuario, 
                                u.nombre, 
                                u.apellido, 
                                u.correo, 
                                u.telefono, 
                                u.estado 
                              FROM cliente c 
                              INNER JOIN usuario u ON c.id_usuario = u.id_usuario");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }
}
function getAllDocumentos() {
    global $db;
    $stmt = $db->prepare("SELECT d.id_documento, d.tipo_documento, d.numero_documento, d.url_archivo, d.fecha_vencimiento,
                                 u.nombre, u.apellido 
                          FROM documento_cliente d
                          INNER JOIN cliente c ON d.id_cliente = c.id_cliente
                          INNER JOIN usuario u ON c.id_usuario = u.id_usuario");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllVehiculos() {
    global $db;
    $stmt = $db->prepare("SELECT v.id_vehiculo, v.placa, v.estado,
                                 m.nombre_modelo, m.marca, m.year, m.categoria, m.costo_diario
                          FROM vehiculo v
                          INNER JOIN modelo_vehiculo m ON v.id_modelo = m.id_modelo");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllRentas() {
    global $db;
    $stmt = $db->prepare("
        SELECT 
            r.id_renta,
            CONCAT(u.nombre, ' ', u.apellido) AS cliente,
            CONCAT(mv.marca, ' ', mv.nombre_modelo) AS vehiculo,
            ts.nombre AS seguro,
            so.nombre AS sucursal_origen,
            sd.nombre AS sucursal_destino,
            r.fecha_inicio,
            r.fecha_fin,
            r.monto_deposito,
            r.estado_deposito,
            r.precio_cobrado,
            r.estado
        FROM renta r
        JOIN cliente c ON r.id_cliente = c.id_cliente
        JOIN usuario u ON c.id_usuario = u.id_usuario
        JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
        JOIN modelo_vehiculo mv ON v.id_modelo = mv.id_modelo
        JOIN seguro s ON r.id_seguro = s.id_seguro
        JOIN tipo_seguro ts ON s.id_tipo_seguro = ts.id_tipo_seguro
        JOIN sucursal so ON r.id_sucursal_origen = so.id_sucursal
        JOIN sucursal sd ON r.id_sucursal_destino = sd.id_sucursal
    ");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


function getAllTipoSeguro() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            id_tipo_seguro,
            nombre
        FROM tipo_seguro
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllSeguros() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            s.id_seguro,
            ts.nombre AS tipo_seguro,
            s.costo_diario
        FROM seguro s
        INNER JOIN tipo_seguro ts 
            ON s.id_tipo_seguro = ts.id_tipo_seguro
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllModelos() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            id_modelo,
            nombre_modelo,
            marca,
            year,
            categoria,
            costo_diario
        FROM modelo_vehiculo
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


function getAllRoles() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            id_rol,
            nombre
        FROM rol
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getAllsucursal() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            id_sucursal,
            nombre,
            ciudad
        FROM sucursal
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllFallas() {
    global $db;

    $stmt = $db->prepare("
        SELECT 
            id_falla,
            id_renta,
            id_usuario,
            descripcion,
            fecha_reporte
        FROM reporte_falla
    ");

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertUsuarios($datos){
    $name = $datos["name"];
    $lastname = $datos["lastname"];
    $email = $datos["email"];
    $phone = $datos["phone"];
    $status = $datos["status"];
    $rol = $datos["role"];
    
    $consulta = "INSERT INTO usuario (nombre, apellido, telefono, correo, password, estado, id_rol) VALUES ('$name','$lastname', '$phone', '$email','','$status', $rol )";
    
}

function insertCliente($id_usuario) {
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO cliente (id_usuario) VALUES (:id_usuario)");
        return $stmt->execute([':id_usuario' => $id_usuario]);
    } catch (PDOException $e) {
        return false;
    }
}

function updateCliente($id_cliente, $id_usuario) {
    global $db;
    try {
        $stmt = $db->prepare("UPDATE cliente SET id_usuario = :id_usuario WHERE id_cliente = :id_cliente");
        return $stmt->execute([
            ':id_usuario' => $id_usuario, 
            ':id_cliente' => $id_cliente
        ]);
    } catch (PDOException $e) {
        return false;
    }
}

function deleteCliente($id_cliente) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM cliente WHERE id_cliente = :id_cliente");
        return $stmt->execute([':id_cliente' => $id_cliente]);
    } catch (PDOException $e) {
        return false;
    }
}

function getUsuariosIds() {
    global $db;
    try {
        $stmt = $db->prepare("SELECT id_usuario, nombre, apellido FROM usuario");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return false;
    }
}