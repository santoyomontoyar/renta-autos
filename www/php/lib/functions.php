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
