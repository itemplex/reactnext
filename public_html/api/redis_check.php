<?php
header('Content-Type: text/plain');

$host = getenv('REDIS_HOST') ?: '127.0.0.1';
$port = (int)(getenv('REDIS_PORT') ?: 6379);
$db   = (int)(getenv('REDIS_DB') !== false ? getenv('REDIS_DB') : 0);

$username = getenv('REDIS_USERNAME') !== false ? getenv('REDIS_USERNAME') : 'itemmania';
$password = getenv('REDIS_PASSWORD') !== false ? getenv('REDIS_PASSWORD') : 'itemmania';

$prefix = getenv('REDIS_SESSION_PREFIX') ?: 'php_sess:';

// 1) Redis 연결 검증
$redis = new Redis();
$redis->connect($host, $port, 2.5);
if ($password !== '') {
    $redis->auth([$username, $password]);   // ACL
}
if ($db > 0) $redis->select($db);
echo "ping=" . var_export($redis->ping(), true) . "\n";

// 2) 세션 핸들러 설정(ACL user/pass는 auth[] 권장)
$savePath = sprintf(
  'tcp://%s:%s?database=%d&prefix=%s&auth%%5B0%%5D=%s&auth%%5B1%%5D=%s&timeout=2.5&read_timeout=2.5',
  $host, $port, $db,
  rawurlencode($prefix),
  rawurlencode($username), rawurlencode($password)
);

ini_set('session.save_handler', 'redis');
ini_set('session.save_path', $savePath);

session_start();
$_SESSION['probe'] = time();
$sid = session_id();
echo "sid=$sid\n";

// 3) Redis에서 세션 키 존재 확인
$key = $prefix . $sid;
echo "exists=" . $redis->exists($key) . "\n";
echo "ttl=" . $redis->ttl($key) . "\n";
