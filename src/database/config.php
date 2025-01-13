<?php

$host = 'localhost';
$dbname = 'toufikhasan_madrasha';
$username = 'root';
$password = '';

function getDbConnection()
{
    global $host, $dbname, $username, $password;
    $conn = new mysqli($host, $username, $password, $dbname);
    if ($conn->connect_error) {
        die(json_encode([
            "status" => "error",
            "message" => "Connection failed: " . $conn->connect_error
        ]));
    }
    return $conn;
}
