<?php
$host_db = "localhost";
$name_db = "renta_vehiculos";
$user_db = "root";
$password_db = "";


try {
  $db = new PDO("mysql:host=$host_db;dbname=$name_db", $user_db, $password_db);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
