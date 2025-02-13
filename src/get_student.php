<?php
error_reporting(0); // Disable PHP warnings in response
header('Content-Type: application/json; charset=utf-8');
include './database/config.php';

try {
    if(!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        throw new Exception('Invalid student ID');
    }
    
    $conn = getDbConnection();
    $studentId = (int)$_GET['id'];
    
    $stmt = $conn->prepare("SELECT * FROM students WHERE id = ?");
    if(!$stmt) {
        throw new Exception("Database query error");
    }
    
    $stmt->bind_param("i", $studentId);
    
    if(!$stmt->execute()) {
        throw new Exception("Database error");
    }
    
    $result = $stmt->get_result();
    
    if($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Student not found']);
        exit;
    }
    
    $student = $result->fetch_assoc();
    echo json_encode(['status' => 'success', 'data' => $student]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}

exit; 