<?php
header('Content-Type: application/json; charset=utf-8');

$data = [
    'service' => 'aion2',
    'route' => 'game-money',
    'ts' => time(),
];

echo json_encode($data, JSON_UNESCAPED_UNICODE);
