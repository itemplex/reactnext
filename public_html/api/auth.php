<?php
// Simple PHP session auth for Next.js frontend
require_once __DIR__ . '/../session_bootstrap.php';
session_start();

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    // Allow caller origin and credentials for dev/prod; tighten as needed
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

function respond(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = $_SESSION['user'] ?? null;
    respond([
        'authenticated' => $user !== null,
        'user' => $user,
        'session_id' => session_id(),
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $username = trim($input['username'] ?? '');
    $password = $input['password'] ?? '';

    if ($username === 'test' && $password === 'test') {
        session_regenerate_id(true);
        $_SESSION['user'] = $username;
        respond([
            'authenticated' => true,
            'user' => $username,
            'session_id' => session_id(),
        ]);
    }

    respond([
        'authenticated' => false,
        'error' => '아이디 또는 비밀번호가 올바르지 않습니다.',
    ], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    session_regenerate_id(true);
    $_SESSION = [];
    respond([
        'authenticated' => false,
        'session_id' => session_id(),
    ]);
}

respond(['error' => 'Method not allowed'], 405);
