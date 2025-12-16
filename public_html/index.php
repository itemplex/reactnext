<?php
session_start();

$loginError = '';

// Handle logout
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: index.php');
    exit;
}

// Handle login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($username === 'test' && $password === 'test') {
        $_SESSION['user'] = $username;
        header('Location: index.php');
        exit;
    }

    $loginError = '아이디 또는 비밀번호가 올바르지 않습니다.';
}
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>로그인</title>
    <style>
        body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #e3f2fd, #f5f7fa); display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: #fff; padding: 28px; border-radius: 14px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); width: 360px; }
        h1 { margin: 0 0 18px; font-size: 22px; text-align: center; color: #1e293b; }
        form { display: flex; flex-direction: column; gap: 12px; }
        label { font-size: 14px; color: #475569; }
        input[type="text"], input[type="password"] { padding: 11px; border: 1px solid #d6d9dd; border-radius: 9px; font-size: 14px; }
        button { padding: 12px; background: #2563eb; color: #fff; border: none; border-radius: 9px; font-size: 15px; cursor: pointer; }
        button:hover { background: #1d4ed8; }
        .error { color: #d32f2f; margin: 8px 0; font-size: 14px; text-align: center; }
        .welcome { text-align: center; color: #1e293b; }
        .logout { margin-top: 14px; display: inline-block; color: #2563eb; text-decoration: none; }
    </style>
</head>
<body>
<div class="card">
    <?php if (!empty($_SESSION['user'])): ?>
        <div class="welcome">
            <h1>환영합니다, <?= htmlspecialchars($_SESSION['user']); ?>님</h1>
            <a class="logout" href="?logout=1">로그아웃</a>
        </div>
    <?php else: ?>
        <h1>로그인</h1>
        <?php if ($loginError): ?>
            <div class="error"><?= $loginError; ?></div>
        <?php endif; ?>
        <form method="post">
            <div>
                <label for="username">아이디</label>
                <input type="text" id="username" name="username" required value="test">
            </div>
            <div>
                <label for="password">비밀번호</label>
                <input type="password" id="password" name="password" required value="test">
            </div>
            <button type="submit">로그인</button>
        </form>
    <?php endif; ?>
</div>
</body>
</html>
