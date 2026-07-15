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

function getDocumentoById($id_documento) {
    global $db;
    $stmt = $db->prepare("SELECT d.id_documento, d.id_cliente, d.tipo_documento, d.numero_documento, d.url_archivo, d.fecha_vencimiento,
                                 u.nombre, u.apellido 
                          FROM documento_cliente d
                          INNER JOIN cliente c ON d.id_cliente = c.id_cliente
                          INNER JOIN usuario u ON c.id_usuario = u.id_usuario
                          WHERE d.id_documento = :id_documento");
    $stmt->bindParam(':id_documento', $id_documento);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function insertDocumentos($datos){
    
    $id_cliente = $datos["id_cliente"];
    $tipo_documento = $datos["tipo_documento"];
    $numero_documento = $datos["numero_documento"];
    $url_archivo = $datos["url_archivo"];
    $fecha_vencimiento = $datos["fecha_vencimiento"];

    $consultaDocu = "INSERT INTO documento_cliente (id_cliente, tipo_documento, numero_documento, url_archivo, fecha_vencimiento) VALUES ('$id_cliente', '$tipo_documento', '$numero_documento', '$url_archivo', '$fecha_vencimiento')";
    global $db;
    $stmt = $db->prepare($consultaDocu);
    $stmt->execute();
}

function updateDocumentos($datos){
    $id_documento = $datos["id_documento"];
    $tipo_documento = $datos["tipo_documento"];
    $numero_documento = $datos["numero_documento"];
    $url_archivo = $datos["url_archivo"];
    $fecha_vencimiento = $datos["fecha_vencimiento"];

    $consultaDocu = "UPDATE documento_cliente SET tipo_documento = '$tipo_documento', numero_documento = '$numero_documento', url_archivo = '$url_archivo', fecha_vencimiento = '$fecha_vencimiento' WHERE id_documento = '$id_documento'";
    global $db;
    $stmt = $db->prepare($consultaDocu);
    $stmt->execute();
}

function deleteDocumentos($id_documento){
    global $db;
    $stmt = $db->prepare("DELETE FROM documento_cliente WHERE id_documento = :id_documento");
    $stmt->bindParam(':id_documento', $id_documento);
    $stmt->execute();
}

function getAllVehiculos() {
    global $db;
    $stmt = $db->prepare("SELECT v.id_vehiculo, v.placa, v.estado, v.transmision,
                                 m.nombre_modelo, m.marca, m.year, m.categoria, m.costo_diario,
                                 s.nombre AS sucursal
                          FROM vehiculo v
                          INNER JOIN modelo_vehiculo m ON v.id_modelo = m.id_modelo
                          INNER JOIN sucursal s ON v.id_sucursal_actual = s.id_sucursal");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertVehiculo($datos) {
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO vehiculo (id_modelo, id_sucursal_actual, estado, placa, transmision)
                               VALUES (:id_modelo, :id_sucursal_actual, :estado, :placa, :transmision)");
        $stmt->bindParam(':id_modelo', $datos['id_modelo'], PDO::PARAM_INT);
        $stmt->bindParam(':id_sucursal_actual', $datos['id_sucursal_actual'], PDO::PARAM_INT);
        $stmt->bindParam(':estado', $datos['estado']);
        $stmt->bindParam(':placa', $datos['placa']);
        $stmt->bindParam(':transmision', $datos['transmision']);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
        return false;
    } catch (PDOException $e) {
        error_log('insertVehiculo error: ' . $e->getMessage());
        return false;
    }
}

function getVehiculoById($id) {
    global $db;
    $stmt = $db->prepare("SELECT v.id_vehiculo, v.id_modelo, v.id_sucursal_actual, v.estado, v.placa, v.transmision,
                                 m.marca, m.nombre_modelo, m.year
                           FROM vehiculo v
                           INNER JOIN modelo_vehiculo m ON v.id_modelo = m.id_modelo
                           WHERE v.id_vehiculo = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateVehiculo($datos) {
    global $db;
    try {
        $stmt = $db->prepare("UPDATE vehiculo SET
                                 id_modelo = :id_modelo,
                                 id_sucursal_actual = :id_sucursal_actual,
                                 estado = :estado,
                                 placa = :placa,
                                 transmision = :transmision
                               WHERE id_vehiculo = :id");
        $stmt->bindParam(':id_modelo', $datos['id_modelo'], PDO::PARAM_INT);
        $stmt->bindParam(':id_sucursal_actual', $datos['id_sucursal_actual'], PDO::PARAM_INT);
        $stmt->bindParam(':estado', $datos['estado']);
        $stmt->bindParam(':placa', $datos['placa']);
        $stmt->bindParam(':transmision', $datos['transmision']);
        $stmt->bindParam(':id', $datos['id_vehiculo'], PDO::PARAM_INT);

        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('updateVehiculo error: ' . $e->getMessage());
        return false;
    }
}

function deleteVehiculo($id) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM vehiculo WHERE id_vehiculo = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            return "en_uso"; // tiene rentas asociadas
        }
        error_log('deleteVehiculo error: ' . $e->getMessage());
        return false;
    }
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
        SELECT id_tipo_seguro, nombre, descripcion
        FROM tipo_seguro
    ");
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getTipoSeguro($id) {
    global $db;

    $stmt = $db->prepare("SELECT id_tipo_seguro, nombre, descripcion FROM tipo_seguro WHERE id_tipo_seguro = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateTipoSeguro($id, $nombre, $descripcion) {
    global $db;

    $stmt = $db->prepare("
        UPDATE tipo_seguro
        SET
            nombre = :nombre,
            descripcion = :descripcion
        WHERE id_tipo_seguro = :id
    ");

    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":id", $id);

    return $stmt->execute();
}

function createTipoSeguro($nombre, $descripcion) {
    global $db;

    $stmt = $db->prepare("
        INSERT INTO tipo_seguro (nombre, descripcion)
        VALUES (:nombre, :descripcion)
    ");

    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":descripcion", $descripcion);

    return $stmt->execute();
}

function deleteTipoSeguro($id){
    global $db;

    $stmt = $db->prepare("
        DELETE FROM tipo_seguro
        WHERE id_tipo_seguro = :id
    ");

    $stmt->bindParam(":id", $id);

    return $stmt->execute();
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
function insertSeguro($datos) {
    global $db;
    $id_tipo_seguro = $datos["id_tipo_seguro"] ?? 0;
    $costo_diario = $datos["costo_diario"] ?? 0;

    try {
        $stmt = $db->prepare("INSERT INTO seguro (id_tipo_seguro, costo_diario) VALUES (:id_tipo_seguro, :costo_diario)");
        $stmt->bindParam(':id_tipo_seguro', $id_tipo_seguro, PDO::PARAM_INT);
        $stmt->bindParam(':costo_diario', $costo_diario);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
    } catch (PDOException $e) {
        error_log('insertSeguro error: ' . $e->getMessage());
    }
    return false;
}

function deleteSeguro($id) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM seguro WHERE id_seguro = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('deleteSeguro error: ' . $e->getMessage());
        return false;
    }
}

function getSeguroById($id) {
    global $db;
    $stmt = $db->prepare("
        SELECT
            s.id_seguro,
            s.id_tipo_seguro,
            ts.nombre AS tipo_seguro,
            s.costo_diario
        FROM seguro s
        INNER JOIN tipo_seguro ts
            ON s.id_tipo_seguro = ts.id_tipo_seguro
        WHERE s.id_seguro = :id
    ");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateSeguro($datos) {
    global $db;
    $id = $datos["id"] ?? 0;
    $id_tipo_seguro = $datos["id_tipo_seguro"] ?? 0;
    $costo_diario = $datos["costo_diario"] ?? 0;

    try {
        $stmt = $db->prepare("UPDATE seguro
                               SET id_tipo_seguro = :id_tipo_seguro, costo_diario = :costo_diario
                               WHERE id_seguro = :id");
        $stmt->bindParam(':id_tipo_seguro', $id_tipo_seguro, PDO::PARAM_INT);
        $stmt->bindParam(':costo_diario', $costo_diario);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('updateSeguro error: ' . $e->getMessage());
        return false;
    }
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

function insertar_falla($datos) {
    global $db;
    $id_renta = $datos["id_renta"] ?? 0;
    $id_usuario = $datos["id_usuario"] ?? 0;
    $descripcion = $datos["descripcion"] ?? '';

    try {
        $stmt = $db->prepare("INSERT INTO reporte_falla (id_renta, id_usuario, descripcion, fecha_reporte)
                               VALUES (:id_renta, :id_usuario, :descripcion, NOW())");
        $stmt->bindParam(':id_renta', $id_renta, PDO::PARAM_INT);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
        $stmt->bindParam(':descripcion', $descripcion);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
    } catch (PDOException $e) {
        error_log('insertar_falla error: ' . $e->getMessage());
    }
    return false;
}

function actualizarFalla($id_falla, $id_renta, $id_usuario, $descripcion) {
    global $db;

    $stmt = $db->prepare("
        UPDATE reporte_falla
        SET id_renta = :id_renta, id_usuario = :id_usuario, descripcion = :descripcion
        WHERE id_falla = :id
    ");

    $stmt->bindParam(":id_renta", $id_renta, PDO::PARAM_INT);
    $stmt->bindParam(":id_usuario", $id_usuario, PDO::PARAM_INT);
    $stmt->bindParam(":descripcion", $descripcion);
    $stmt->bindParam(":id", $id_falla, PDO::PARAM_INT);

    return $stmt->execute();
}

function deleteFalla($id_falla) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM reporte_falla WHERE id_falla = :id_falla");
        $stmt->execute(['id_falla' => $id_falla]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            return "en_uso";
        }
        return false;
    }
}


function insertUsuarios($datos){
    global $db;
    $name = $datos["name"] ?? '';
    $lastname = $datos["lastname"] ?? '';
    $email = $datos["email"] ?? '';
    $phone = $datos["phone"] ?? '';
    $status = $datos["status"] ?? '';
    $rol = $datos["role"] ?? 0;

    try {
        $stmt = $db->prepare("INSERT INTO usuario (nombre, apellido, telefono, correo, password, estado, id_rol)
                               VALUES (:nombre, :apellido, :telefono, :correo, '', :estado, :id_rol)");
        $stmt->bindParam(':nombre', $name);
        $stmt->bindParam(':apellido', $lastname);
        $stmt->bindParam(':telefono', $phone);
        $stmt->bindParam(':correo', $email);
        $stmt->bindParam(':estado', $status);
        $stmt->bindParam(':id_rol', $rol, PDO::PARAM_INT);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
    } catch (PDOException $e) {
        error_log('insertUsuarios error: ' . $e->getMessage());
    }

    return false;
}

function insertRenta($datos) {
    global $db;
    $stmt = $db->prepare("
        INSERT INTO renta (
            id_cliente, id_vehiculo, id_seguro, id_sucursal_origen, id_sucursal_destino, 
            fecha_inicio, fecha_fin, monto_deposito, estado_deposito, precio_cobrado, estado
        ) VALUES (
            :id_cliente, :id_vehiculo, :id_seguro, :id_sucursal_origen, :id_sucursal_destino, 
            :fecha_inicio, :fecha_fin, :monto_deposito, :estado_deposito, :precio_cobrado, :estado
        )
    ");
    return $stmt->execute([
        ':id_cliente'          => $datos['id_cliente'],
        ':id_vehiculo'         => $datos['id_vehiculo'],
        ':id_seguro'           => $datos['id_seguro'],
        ':id_sucursal_origen'  => $datos['id_sucursal_origen'],
        ':id_sucursal_destino' => $datos['id_sucursal_destino'],
        ':fecha_inicio'        => $datos['fecha_inicio'],
        ':fecha_fin'           => $datos['fecha_fin'],
        ':monto_deposito'      => $datos['monto_deposito'],
        ':estado_deposito'     => $datos['estado_deposito'],
        ':precio_cobrado'      => $datos['precio_cobrado'],
        ':estado'              => $datos['estado']
    ]);
}
function getRentaById($id_renta) {
    global $db;
    $stmt = $db->prepare("
        SELECT id_renta, id_cliente, id_vehiculo, id_seguro, id_sucursal_origen, id_sucursal_destino,
               fecha_inicio, fecha_fin, monto_deposito, estado_deposito, precio_cobrado, estado
        FROM renta WHERE id_renta = :id
    ");
    $stmt->bindParam(':id', $id_renta, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateRenta($datos) {
    global $db;
    try {
        $stmt = $db->prepare("
            UPDATE renta SET
                id_cliente = :id_cliente,
                id_vehiculo = :id_vehiculo,
                id_seguro = :id_seguro,
                id_sucursal_origen = :id_sucursal_origen,
                id_sucursal_destino = :id_sucursal_destino,
                fecha_inicio = :fecha_inicio,
                fecha_fin = :fecha_fin,
                monto_deposito = :monto_deposito,
                estado_deposito = :estado_deposito,
                precio_cobrado = :precio_cobrado,
                estado = :estado
            WHERE id_renta = :id_renta
        ");
        return $stmt->execute([
            ':id_cliente'          => $datos['id_cliente'],
            ':id_vehiculo'         => $datos['id_vehiculo'],
            ':id_seguro'           => $datos['id_seguro'],
            ':id_sucursal_origen'  => $datos['id_sucursal_origen'],
            ':id_sucursal_destino' => $datos['id_sucursal_destino'],
            ':fecha_inicio'        => $datos['fecha_inicio'],
            ':fecha_fin'           => $datos['fecha_fin'],
            ':monto_deposito'      => $datos['monto_deposito'],
            ':estado_deposito'     => $datos['estado_deposito'],
            ':precio_cobrado'      => $datos['precio_cobrado'],
            ':estado'              => $datos['estado'],
            ':id_renta'            => $datos['id_renta']
        ]);
    } catch (PDOException $e) {
        error_log('updateRenta error: ' . $e->getMessage());
        return false;
    }
}

function deleteRenta($id_renta) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM renta WHERE id_renta = :id");
        $stmt->bindParam(':id', $id_renta, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('deleteRenta error: ' . $e->getMessage());
        return false;
    }
}

function getReservasVehiculo() {
    global $db;
    $stmt = $db->prepare("SELECT id_renta, id_cliente, id_vehiculo, fecha_inicio, fecha_fin, estado FROM renta");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}


function insertar_rol($datos){
    global $db;
    $name = $datos["name"];

    $consulta = "INSERT INTO rol (nombre) VALUES ('$name')";
    $db->exec($consulta);

    return true;
}

function actualizarRol($id_rol, $nombre) {
    global $db;

    $stmt = $db->prepare("
        UPDATE rol
        SET nombre = :nombre
        WHERE id_rol = :id
    ");

    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":id", $id_rol);

    return $stmt->execute();
}

function deleteRol($id_rol) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM rol WHERE id_rol = :id_rol");
        $stmt->execute(['id_rol' => $id_rol]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            return "en_uso";
        }
        return false;
    }
}
function insertCliente($id_usuario) {
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO cliente (id_usuario) VALUES (:id_usuario)");
        return $stmt->execute([':id_usuario' => $id_usuario]);
    } catch (PDOException $e) {
        error_log('insertCliente error: ' . $e->getMessage());
        return false;
    }
}

function getOneModelo($id_modelo){
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
        WHERE id_modelo = :id
    ");

    $stmt->bindParam(":id",$id_modelo);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);

}
function insertModelo($datos){

    global $db;
    $stmt = $db->prepare("
    INSERT INTO modelo_vehiculo

    (
    nombre_modelo,
    marca,
    year,
    categoria,
    costo_diario
    )

    VALUES

    (
    :nombre,
    :marca,
    :year,
    :categoria,
    :costo
    )

    ");

    $stmt->bindParam(":nombre",$datos["nombre_modelo"]);
    $stmt->bindParam(":marca",$datos["marca"]);
    $stmt->bindParam(":year",$datos["year"]);
    $stmt->bindParam(":categoria",$datos["categoria"]);
    $stmt->bindParam(":costo",$datos["costo_diario"]);

    return $stmt->execute();

}
function updateModelo($datos){
    global $db;
    $stmt=$db->prepare("

    UPDATE modelo_vehiculo SET
    nombre_modelo=:nombre,
    marca=:marca,
    year=:year,
    categoria=:categoria,
    costo_diario=:costo
    WHERE id_modelo=:id
    ");

    $stmt->bindParam(":nombre",$datos["nombre_modelo"]);
    $stmt->bindParam(":marca",$datos["marca"]);
    $stmt->bindParam(":year",$datos["year"]);
    $stmt->bindParam(":categoria",$datos["categoria"]);
    $stmt->bindParam(":costo",$datos["costo_diario"]);
    $stmt->bindParam(":id",$datos["id_modelo"]);

    return $stmt->execute();
}

function deleteModelo($id_modelo){
    global $db;

    try {
        $stmt = $db->prepare("DELETE FROM modelo_vehiculo WHERE id_modelo = :id");
        $stmt->bindParam(":id", $id_modelo, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('deleteModelo error: ' . $e->getMessage());
        return false;
    }
}

function getUsuarioById($id) {
    global $db;
    $stmt = $db->prepare("SELECT id_usuario, nombre, apellido, correo, telefono, estado, id_rol
                           FROM usuario WHERE id_usuario = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateUsuario($datos){
    global $db;
    $id = $datos["id"] ?? 0;
    $name = $datos["name"] ?? '';
    $lastname = $datos["lastname"] ?? '';
    $email = $datos["email"] ?? '';
    $phone = $datos["phone"] ?? '';
    $status = $datos["status"] ?? '';
    $rol = $datos["role"] ?? 0;

    try {
        $stmt = $db->prepare("UPDATE usuario
                               SET nombre = :nombre, apellido = :apellido, correo = :correo,
                                   telefono = :telefono, estado = :estado, id_rol = :id_rol
                               WHERE id_usuario = :id");
        $stmt->bindParam(':nombre', $name);
        $stmt->bindParam(':apellido', $lastname);
        $stmt->bindParam(':correo', $email);
        $stmt->bindParam(':telefono', $phone);
        $stmt->bindParam(':estado', $status);
        $stmt->bindParam(':id_rol', $rol, PDO::PARAM_INT);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);

        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('updateUsuario error: ' . $e->getMessage());
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
function deleteUsuario($id) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM usuario WHERE id_usuario = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('deleteUsuario error: ' . $e->getMessage());
        return false;
    }
}

function insertar_sucursal($datos) {
    global $db;
    $nombre = $datos["nombre"] ?? '';
    $ciudad = $datos["ciudad"] ?? '';

    try {
        $stmt = $db->prepare("INSERT INTO sucursal (nombre, ciudad) VALUES (:nombre, :ciudad)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':ciudad', $ciudad);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
    } catch (PDOException $e) {
        error_log('insertSucursal error: ' . $e->getMessage());
    }
    return false;
}

function actualizarSucursal($id_sucursal, $nombre, $ciudad) {
    global $db;

    $stmt = $db->prepare("
        UPDATE sucursal
        SET nombre = :nombre, ciudad = :ciudad
        WHERE id_sucursal = :id
    ");

    $stmt->bindParam(":nombre", $nombre);
    $stmt->bindParam(":ciudad", $ciudad);
    $stmt->bindParam(":id", $id_sucursal);

    return $stmt->execute();
}

function deleteSucursal($id_sucursal) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM sucursal WHERE id_sucursal = :id_sucursal");
        $stmt->execute(['id_sucursal' => $id_sucursal]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) {
            return "en_uso";
        }
        return false;
    }
}

function deleteCliente($id_cliente) {
    global $db;
    $stmt = $db->prepare("DELETE FROM cliente WHERE id_cliente = :id_cliente");
    $stmt->execute(['id_cliente' => $id_cliente]);
    return $stmt->rowCount() > 0;
}

function getAllImagenesFalla() {
    global $db;
    $stmt = $db->prepare("
        SELECT i.id_imagen, i.id_falla, i.url_archivo, i.fecha_subida,
               f.descripcion AS falla_descripcion
        FROM imagen_falla i
        INNER JOIN reporte_falla f ON i.id_falla = f.id_falla
    ");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getImagenFallaById($id_imagen) {
    global $db;
    $stmt = $db->prepare("SELECT id_imagen, id_falla, url_archivo, fecha_subida
                           FROM imagen_falla WHERE id_imagen = :id");
    $stmt->bindParam(':id', $id_imagen, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function insertImagenFalla($datos) {
    global $db;
    try {
        $stmt = $db->prepare("INSERT INTO imagen_falla (id_falla, url_archivo) VALUES (:id_falla, :url_archivo)");
        $stmt->bindParam(':id_falla', $datos['id_falla'], PDO::PARAM_INT);
        $stmt->bindParam(':url_archivo', $datos['url_archivo']);

        if ($stmt->execute()) {
            return $db->lastInsertId();
        }
        return false;
    } catch (PDOException $e) {
        error_log('insertImagenFalla error: ' . $e->getMessage());
        return false;
    }
}

function updateImagenFalla($datos) {
    global $db;
    try {
        $stmt = $db->prepare("UPDATE imagen_falla SET id_falla = :id_falla, url_archivo = :url_archivo
                               WHERE id_imagen = :id_imagen");
        $stmt->bindParam(':id_falla', $datos['id_falla'], PDO::PARAM_INT);
        $stmt->bindParam(':url_archivo', $datos['url_archivo']);
        $stmt->bindParam(':id_imagen', $datos['id_imagen'], PDO::PARAM_INT);

        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('updateImagenFalla error: ' . $e->getMessage());
        return false;
    }
}

function deleteImagenFalla($id_imagen) {
    global $db;
    try {
        $stmt = $db->prepare("DELETE FROM imagen_falla WHERE id_imagen = :id");
        $stmt->bindParam(':id', $id_imagen, PDO::PARAM_INT);
        return $stmt->execute();
    } catch (PDOException $e) {
        error_log('deleteImagenFalla error: ' . $e->getMessage());
        return false;
    }
}