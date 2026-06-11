<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

try {
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $input = $method === 'POST' ? fb_read_input() : [];
    $action = (string)($_GET['action'] ?? $input['action'] ?? 'state');
    $auth = fb_admin_auth();
    $setupComplete = !empty($auth['setup_complete']);

    if ($action === 'state') {
        fb_json_response([
            'ok' => true,
            'authenticated' => fb_is_admin_authenticated(),
            'setup_required' => !$setupComplete,
            'username' => $setupComplete ? (string)($auth['username'] ?? '') : '',
        ]);
    }

    if ($action === 'setup_start') {
        fb_rate_limit('admin_setup_start', 5, 600);
        if ($setupComplete) {
            fb_json_response(['ok' => false, 'message' => 'Admin wurde bereits eingerichtet.'], 409);
        }

        $username = trim((string)($input['username'] ?? ''));
        $password = (string)($input['password'] ?? '');
        if (!preg_match('/^[a-zA-Z0-9._-]{3,40}$/', $username)) {
            throw new InvalidArgumentException('Benutzername: 3-40 Zeichen, nur Buchstaben, Zahlen, Punkt, Unterstrich oder Bindestrich.');
        }
        if (strlen($password) < 12) {
            throw new InvalidArgumentException('Bitte nutze ein Passwort mit mindestens 12 Zeichen.');
        }

        $secret = fb_generate_totp_secret();
        $auth = [
            'setup_complete' => false,
            'username' => $username,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'totp_secret' => $secret,
            'created_at' => fb_now(),
            'updated_at' => fb_now(),
        ];
        fb_save_admin_auth($auth);

        fb_json_response([
            'ok' => true,
            'message' => 'Einrichtung gestartet. Trage den Secret Key in Google Authenticator ein und bestätige den 6-stelligen Code.',
            'secret' => $secret,
            'otpauth_uri' => fb_admin_otpauth_uri($username, $secret),
        ]);
    }

    if ($action === 'setup_verify') {
        fb_rate_limit('admin_setup_verify', 10, 600);
        if ($setupComplete) {
            fb_json_response(['ok' => false, 'message' => 'Admin wurde bereits eingerichtet.'], 409);
        }
        if (empty($auth['username']) || empty($auth['totp_secret'])) {
            throw new InvalidArgumentException('Bitte starte die Admin-Einrichtung zuerst.');
        }

        $code = (string)($input['code'] ?? '');
        if (!fb_verify_totp((string)$auth['totp_secret'], $code)) {
            throw new InvalidArgumentException('Der Google-Authenticator-Code ist ungültig.');
        }

        $auth['setup_complete'] = true;
        $auth['updated_at'] = fb_now();
        fb_save_admin_auth($auth);

        fb_start_admin_session();
        session_regenerate_id(true);
        $_SESSION['fb_admin_authenticated'] = true;
        $_SESSION['fb_admin_username'] = $auth['username'];

        fb_json_response(['ok' => true, 'message' => 'Admin eingerichtet und angemeldet.']);
    }

    if ($action === 'login') {
        fb_rate_limit('admin_login', 12, 600);
        if (!$setupComplete) {
            fb_json_response(['ok' => false, 'message' => 'Admin ist noch nicht eingerichtet.'], 409);
        }

        $username = trim((string)($input['username'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $code = (string)($input['code'] ?? '');

        $validUser = hash_equals((string)($auth['username'] ?? ''), $username);
        $validPassword = $validUser && password_verify($password, (string)($auth['password_hash'] ?? ''));
        $validCode = $validPassword && fb_verify_totp((string)($auth['totp_secret'] ?? ''), $code);

        if (!$validUser || !$validPassword || !$validCode) {
            throw new InvalidArgumentException('Login fehlgeschlagen. Prüfe Benutzername, Passwort und Google-Authenticator-Code.');
        }

        fb_start_admin_session();
        session_regenerate_id(true);
        $_SESSION['fb_admin_authenticated'] = true;
        $_SESSION['fb_admin_username'] = $username;

        fb_json_response(['ok' => true, 'message' => 'Angemeldet.']);
    }

    if ($action === 'logout') {
        fb_start_admin_session();
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
        }
        session_destroy();
        fb_json_response(['ok' => true, 'message' => 'Abgemeldet.']);
    }

    fb_json_response(['ok' => false, 'message' => 'Unbekannte Auth-Aktion.'], 400);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('admin-auth failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Admin-Auth konnte nicht verarbeitet werden.'], 500);
}
