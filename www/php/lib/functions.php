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
    $stmt = $db->prepare("SELECT * FROM usuario");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllClientes() {
    global $db;
    $stmt = $db->prepare("SELECT c.id_cliente, u.nombre, u.apellido, u.correo, u.telefono, u.estado 
                          FROM cliente c 
                          INNER JOIN usuario u ON c.id_usuario = u.id_usuario");
    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
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