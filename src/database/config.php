<?php
error_reporting(0);

$host = 'localhost';
$dbname = 'toufikhasan_madrasha';
$username = 'root';
$password = '';

function getDbConnection()
{
    global $host, $dbname, $username, $password;
    
    try {
        $conn = new mysqli($host, $username, $password, $dbname);
        
        if ($conn->connect_errno) {
            throw new Exception("Database connection failed");
        }
        
        if (!$conn->set_charset("utf8mb4")) {
            throw new Exception("Character set error");
        }
        
        return $conn;
    } catch(Exception $e) {
        throw new Exception("Database error: " . $e->getMessage());
    }
}