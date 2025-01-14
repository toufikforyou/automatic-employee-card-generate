<?php

include './database/config.php';
include './file/file-upload.php';
include './response/response.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $fullname = $_POST['fullname'];
    $stdclass = $_POST['stdclass'];
    $roll = $_POST['roll'];
    $father = $_POST['father'];
    $address = $_POST['address'];
    $mobile = $_POST['mobile'];

    $profile = NULL;

    if (isset($_FILES['profile']) && $_FILES['profile']['error'] == 0) {
        $uploadResult = uploadProfileImage($_FILES['profile']);

        if ($uploadResult['status'] === 'error') {
            sendResponse(400, $uploadResult['message']);
            exit;
        }

        $profile = $uploadResult['file_path'];
    }

    $conn = getDbConnection();
    $conn->set_charset("utf8mb4");

    $stmt = $conn->prepare("INSERT INTO students (`fullname`, `stdclass`, `roll`, `father`, `address`, `mobile`, `profile`) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssissss", $fullname, $stdclass, $roll, $father, $address, $mobile, $profile);

    if ($stmt->execute()) {
        $uid = mysqli_insert_id($conn);
        $newStudent = [
            "uid" => $uid,
            "fullname" => $fullname,
            "stdclass" => $stdclass,
            "roll" => $roll,
            "father" => $father,
            "address" => $address,
            "mobile" => $mobile,
            "profile" => $profile
        ];
        sendResponse(201, "Student record created successfully", $newStudent);
    } else {
        sendResponse(400, $stmt->error || "Database operation failed");
    }

    $stmt->close();
    $conn->close();
} else {
    sendResponse(405, "Invalid request method.");
}
