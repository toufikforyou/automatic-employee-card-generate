<?php

function uploadProfileImage($file)
{
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
    $max_size = 5 * 1024 * 1024; // 5MB

    $file_type = $file['type'];
    $file_size = $file['size'];
    $file_tmp_name = $file['tmp_name'];

    if (!in_array($file_type, $allowed_types)) {
        return [
            "status" => "error",
            "message" => "Invalid file type."
        ];
    }

    if ($file_size > $max_size) {
        return [
            "status" => "error",
            "message" => "File size exceeds the maximum limit of 5MB."
        ];
    }

    $file_name = uniqid('profile_', true) . '.' . pathinfo($file['name'], PATHINFO_EXTENSION);
    $upload_dir = '../public/images/';

    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $file_path = $upload_dir . $file_name;

    if (move_uploaded_file($file_tmp_name, $file_path)) {
        return [
            "status" => "success",
            "file_path" => $file_path
        ];
    } else {
        return [
            "status" => "error",
            "message" => "Error uploading file."
        ];
    }
}
