<?php
header('Content-Type: application/json; charset=utf-8');
include './database/config.php';
include './file/file-upload.php';
include './response/response.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'] ?? null;
    
    if (!$id) {
        sendResponse(400, "Student ID is required for update");
        exit;
    }

    // Get existing profile path
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT profile FROM students WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $existing = $result->fetch_assoc();
    $profile = $existing['profile'] ?? null;

    // Handle new file upload
    if (isset($_FILES['profile']) && $_FILES['profile']['error'] == 0) {
        $uploadResult = uploadProfileImage($_FILES['profile']);
        
        if ($uploadResult['status'] === 'error') {
            sendResponse(400, $uploadResult['message']);
            exit;
        }
        
        $profile = $uploadResult['file_path'];
    }

    // Update query
    $stmt = $conn->prepare("UPDATE students SET 
        fullname = ?, 
        stdclass = ?, 
        roll = ?, 
        father = ?, 
        address = ?, 
        mobile = ?, 
        profile = ?
        WHERE id = ?");

    $stmt->bind_param("ssissssi",
        $_POST['fullname'],
        $_POST['stdclass'],
        $_POST['roll'],
        $_POST['father'],
        $_POST['address'],
        $_POST['mobile'],
        $profile,
        $id
    );

    if ($stmt->execute()) {
        sendResponse(200, "Student record updated successfully", ['uid' => $id]);
    } else {
        sendResponse(400, $stmt->error ?: "Update operation failed");
    }

    $stmt->close();
    $conn->close();
} else {
    sendResponse(405, "Invalid request method.");
} 