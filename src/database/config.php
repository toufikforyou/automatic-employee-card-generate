<?php

$host = 'localhost';
$dbname = 'toufikhasan_madrasha';
$username = 'root';
$password = '';

function getDbConnection()
{
    global $host, $dbname, $username, $password;
    $conn = new mysqli($host, $username, $password, $dbname);
    
    // Add proper charset configuration
    if (!$conn->set_charset("utf8mb4")) {
        die(json_encode([
            "status" => "error",
            "message" => "Error loading character set utf8mb4: " . $conn->error
        ]));
    }
    
    if ($conn->connect_error) {
        die(json_encode([
            "status" => "error",
            "message" => "Connection failed: " . $conn->connect_error
        ]));
    }
    return $conn;
}
