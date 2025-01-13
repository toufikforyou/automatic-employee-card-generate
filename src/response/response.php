<?php

function sendResponse($statusCode, $message, $data = null)
{
    header('Content-Type: application/json');
    http_response_code($statusCode);

    $response = [
        "status" => ($statusCode >= 200 && $statusCode < 300) ? "success" : "error",
        "message" => $message
    ];

    if ($data) {
        $response['data'] = $data;
    }

    echo json_encode($response);
    exit;
}
