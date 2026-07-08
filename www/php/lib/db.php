<?php
$user_db = "app_user";
$password_db = "app_password";
$host_db = "mysql";
$name_db = "app_db";

try {
  $db = new PDO("mysql:host=$host_db;dbname=$name_db", $user_db, $password_db);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  echo "Connection failed: " . $e->getMessage();
}
