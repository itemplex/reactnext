<?php
// Shared Redis-backed session bootstrap using custom handler (no ini-based session.save_handler/save_path)
if (!defined('SESSION_BOOTSTRAPPED')) {
    define('SESSION_BOOTSTRAPPED', true);

    class RedisSessionHandler implements SessionHandlerInterface
    {
        private Redis $redis;
        private string $prefix;
        private int $ttl;
        private string $host;
        private int $port;
        private int $db;
        private string $username;
        private string $password;

        public function __construct(array $config)
        {
            $this->host = $config['host'];
            $this->port = (int)$config['port'];
            $this->db = (int)$config['db'];
            $this->username = $config['username'];
            $this->password = $config['password'];
            $this->prefix = $config['prefix'];
            $this->ttl = (int)$config['ttl'];
            $this->redis = new Redis();
        }

        private function connect(): bool
        {
            if ($this->redis->isConnected()) {
                return true;
            }

            if (!$this->redis->connect($this->host, $this->port, 2.5)) {
                return false;
            }

            if ($this->password !== '') {
                // Try ACL style then plain password
                try {
                    if ($this->username !== '') {
                        $this->redis->auth([$this->username, $this->password]);
                    } else {
                        $this->redis->auth($this->password);
                    }
                } catch (Throwable $e) {
                    return false;
                }
            }

            if ($this->db > 0) {
                $this->redis->select($this->db);
            }

            return true;
        }

        public function open($savePath, $sessionName): bool
        {
            return $this->connect();
        }

        public function close(): bool
        {
            if ($this->redis->isConnected()) {
                $this->redis->close();
            }
            return true;
        }

        public function read($sessionId): string
        {
            if (!$this->connect()) {
                return '';
            }
            $data = $this->redis->get($this->prefix . $sessionId);
            return $data === false ? '' : $data;
        }

        public function write($sessionId, $data): bool
        {
            if (!$this->connect()) {
                return false;
            }
            return (bool)$this->redis->setEx($this->prefix . $sessionId, $this->ttl, $data);
        }

        public function destroy($sessionId): bool
        {
            if ($this->connect()) {
                $this->redis->del($this->prefix . $sessionId);
            }
            return true;
        }

        public function gc($max_lifetime): int|false
        {
            // Redis TTL handles GC
            return 0;
        }
    }

    $host = getenv('REDIS_HOST') ?: '127.0.0.1';
    $port = getenv('REDIS_PORT') ?: '6379';
    $db = getenv('REDIS_DB') ?: '0';
    $username = getenv('REDIS_USERNAME') !== false ? getenv('REDIS_USERNAME') : 'itemmania';
    $password = getenv('REDIS_PASSWORD') ?: 'itemmania';
    $prefix = getenv('REDIS_SESSION_PREFIX') ?: 'php_sess:';
    $ttl = (int)(ini_get('session.gc_maxlifetime') ?: 1440);

    $handler = new RedisSessionHandler([
        'host' => $host,
        'port' => (int)$port,
        'db' => (int)$db,
        'username' => $username,
        'password' => $password,
        'prefix' => $prefix,
        'ttl' => $ttl,
    ]);
    session_set_save_handler($handler, true);

    // Cookie settings (adjust SameSite if needed)
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    session_set_cookie_params([
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}
