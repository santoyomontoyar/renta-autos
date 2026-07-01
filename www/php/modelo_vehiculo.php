<?php

require_once 'lib/functions.php';

$_post = json_decode(file_get_contents('php://input'), true);
$action = $_post['action'] ?? "";
$data = "";

switch($action){

    case 'getAll':
        $data = getAllModelos();
    break;

    case 'getOne':
        $data = getOneModelo($_post['id_modelo']);
    break;

    case 'insert':
        $data = insertModelo($_post);
    break;

    case 'update':
        $data = updateModelo($_post);
    break;

    case 'delete':
        $data = deleteModelo($_post['id_modelo']);
    break;
    default:
        echo json_encode([
            "status"=>"error",
            "message"=>"Invalid action"
        ]);
        exit;

}

if($data){

    echo json_encode([
        "status"=>"success",
        "data"=>$data

    ]);

}else{
    echo json_encode([
        "status"=>"error",
        "message"=>"Failed"
    ]);

}
?>