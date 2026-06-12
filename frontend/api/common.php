<?php

declare(strict_types=1);

const APP_TIMEZONE = 'Europe/Berlin';
date_default_timezone_set(APP_TIMEZONE);

function fb_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fb_header_text(string $value): string
{
    return function_exists('mb_encode_mimeheader') ? mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n") : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function fb_is_local_request(): bool
{
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    return str_starts_with($host, '127.0.0.1') || str_starts_with($host, 'localhost');
}

function fb_send_text_mail(string $to, string $subject, string $body, string $replyTo = ''): bool
{
    $config = fb_config();
    $fromEmail = (string)($config['mail_from'] ?? 'noreply@fameboost.de');
    $fromName = (string)($config['mail_from_name'] ?? 'FameBoost.de');

    if (fb_is_local_request()) {
        $entry = "TO: {$to}\nSUBJECT: {$subject}\nREPLY-TO: {$replyTo}\n\n{$body}\n\n---\n";
        return file_put_contents(fb_data_path('email-local.log'), $entry, FILE_APPEND | LOCK_EX) !== false;
    }

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . fb_header_text($fromName) . ' <' . $fromEmail . '>',
        'X-Mailer: FameBoost Backend',
    ];
    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    return mail($to, fb_header_text($subject), $body, implode("\r\n", $headers), '-f' . $fromEmail);
}

function fb_client_ip(): string
{
    $candidates = [
        $_SERVER['HTTP_CF_CONNECTING_IP'] ?? '',
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '',
        $_SERVER['REMOTE_ADDR'] ?? '',
    ];
    foreach ($candidates as $candidate) {
        $ip = trim(explode(',', (string)$candidate)[0]);
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }
    return 'unknown';
}

function fb_rate_limit(string $scope, int $limit, int $windowSeconds): void
{
    $bucket = hash('sha256', $scope . '|' . fb_client_ip());
    $now = time();
    $result = fb_mutate_json_file(fb_rate_limit_file(), function (array $data) use ($bucket, $now, $limit, $windowSeconds) {
        $entries = isset($data['entries']) && is_array($data['entries']) ? $data['entries'] : [];
        foreach ($entries as $key => $entry) {
            if (($entry['reset_at'] ?? 0) < $now) {
                unset($entries[$key]);
            }
        }

        $entry = $entries[$bucket] ?? ['count' => 0, 'reset_at' => $now + $windowSeconds];
        if (($entry['reset_at'] ?? 0) < $now) {
            $entry = ['count' => 0, 'reset_at' => $now + $windowSeconds];
        }
        $entry['count'] = (int)($entry['count'] ?? 0) + 1;
        $entries[$bucket] = $entry;
        $data['entries'] = $entries;

        return ['data' => $data, 'blocked' => $entry['count'] > $limit, 'reset_at' => $entry['reset_at']];
    }, ['entries' => []]);

    if (!empty($result['blocked'])) {
        header('Retry-After: ' . max(1, (int)$result['reset_at'] - $now));
        fb_json_response(['ok' => false, 'message' => 'Zu viele Anfragen. Bitte versuche es spÃƒÂ¤ter erneut.'], 429);
    }
}

function fb_start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['SERVER_PORT'] ?? '') === '443');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('fb_admin_session');
    session_start();
}

function fb_is_admin_authenticated(): bool
{
    fb_start_admin_session();
    return !empty($_SESSION['fb_admin_authenticated']);
}

function fb_require_admin_auth(): void
{
    if (!fb_is_admin_authenticated()) {
        fb_json_response(['ok' => false, 'message' => 'Admin-Login erforderlich.'], 401);
    }
}

function fb_admin_auth(): array
{
    return fb_load_json_file(fb_admin_auth_file(), []);
}

function fb_save_admin_auth(array $data): void
{
    fb_save_json_file(fb_admin_auth_file(), $data);
}

function fb_base32_encode(string $binary): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $bits = '';
    $output = '';
    for ($i = 0, $length = strlen($binary); $i < $length; $i++) {
        $bits .= str_pad(decbin(ord($binary[$i])), 8, '0', STR_PAD_LEFT);
    }
    for ($i = 0, $length = strlen($bits); $i < $length; $i += 5) {
        $chunk = substr($bits, $i, 5);
        if (strlen($chunk) < 5) {
            $chunk = str_pad($chunk, 5, '0', STR_PAD_RIGHT);
        }
        $output .= $alphabet[bindec($chunk)];
    }
    return $output;
}

function fb_base32_decode(string $base32): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    $base32 = strtoupper(preg_replace('/[^A-Z2-7]/i', '', $base32) ?? '');
    $bits = '';
    $binary = '';

    for ($i = 0, $length = strlen($base32); $i < $length; $i++) {
        $position = strpos($alphabet, $base32[$i]);
        if ($position === false) {
            continue;
        }
        $bits .= str_pad(decbin($position), 5, '0', STR_PAD_LEFT);
    }

    for ($i = 0, $length = strlen($bits) - 7; $i < $length; $i += 8) {
        $binary .= chr(bindec(substr($bits, $i, 8)));
    }

    return $binary;
}

function fb_generate_totp_secret(): string
{
    return fb_base32_encode(random_bytes(20));
}

function fb_totp_code(string $secret, ?int $timeSlice = null): string
{
    $timeSlice ??= (int)floor(time() / 30);
    $secretKey = fb_base32_decode($secret);
    $counter = pack('N*', 0) . pack('N*', $timeSlice);
    $hash = hash_hmac('sha1', $counter, $secretKey, true);
    $offset = ord(substr($hash, -1)) & 0x0F;
    $value = unpack('N', substr($hash, $offset, 4))[1] & 0x7FFFFFFF;
    return str_pad((string)($value % 1000000), 6, '0', STR_PAD_LEFT);
}

function fb_verify_totp(string $secret, string $code): bool
{
    $code = preg_replace('/\s+/', '', $code) ?? '';
    if (!preg_match('/^\d{6}$/', $code)) {
        return false;
    }

    $currentSlice = (int)floor(time() / 30);
    for ($offset = -1; $offset <= 1; $offset++) {
        if (hash_equals(fb_totp_code($secret, $currentSlice + $offset), $code)) {
            return true;
        }
    }
    return false;
}

function fb_admin_otpauth_uri(string $username, string $secret): string
{
    $label = rawurlencode('FameBoost.de:' . $username);
    $issuer = rawurlencode('FameBoost.de');
    return "otpauth://totp/{$label}?secret={$secret}&issuer={$issuer}&algorithm=SHA1&digits=6&period=30";
}

function fb_float_value(mixed $value): ?float
{
    if (is_int($value) || is_float($value)) {
        return (float)$value;
    }
    if (!is_string($value)) {
        return null;
    }
    $clean = str_replace(',', '.', preg_replace('/[^0-9,\.\-]/', '', $value) ?? '');
    return is_numeric($clean) ? (float)$clean : null;
}

function fb_http_post_form(string $url, array $payload, int $timeout = 25): array
{
    $config = fb_config();
    $verifySsl = (bool)($config['reseller_ssl_verify'] ?? true);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        if (!$ch) {
            return ['ok' => false, 'reason' => 'curl_init_failed', 'message' => 'cURL konnte nicht gestartet werden.'];
        }

        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => http_build_query($payload),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_SSL_VERIFYPEER => $verifySsl,
            CURLOPT_SSL_VERIFYHOST => $verifySsl ? 2 : 0,
        ]);

        $raw = curl_exec($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        if ($raw === false || $curlError !== '') {
            return ['ok' => false, 'reason' => 'curl_error', 'message' => $curlError ?: 'API nicht erreichbar.'];
        }
        return ['ok' => true, 'http_code' => $httpCode, 'body' => $raw];
    }

    $body = http_build_query($payload);
    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\nContent-Length: " . strlen($body) . "\r\n",
            'content' => $body,
            'timeout' => $timeout,
            'ignore_errors' => true,
        ],
        'ssl' => [
            'verify_peer' => $verifySsl,
            'verify_peer_name' => $verifySsl,
        ],
    ]);

    $raw = @file_get_contents($url, false, $context);
    if ($raw === false) {
        $error = error_get_last();
        return ['ok' => false, 'reason' => 'http_error', 'message' => $error['message'] ?? 'API nicht erreichbar.'];
    }

    $httpCode = 0;
    foreach (($http_response_header ?? []) as $header) {
        if (preg_match('/^HTTP\/\S+\s+(\d{3})/', $header, $match)) {
            $httpCode = (int)$match[1];
            break;
        }
    }

    return ['ok' => true, 'http_code' => $httpCode, 'body' => $raw];
}

function fb_build_form_fields(array $data, string $prefix = ''): array
{
    $fields = [];
    foreach ($data as $key => $value) {
        $fieldKey = $prefix === '' ? (string)$key : $prefix . '[' . $key . ']';
        if (is_array($value)) {
            $fields += fb_build_form_fields($value, $fieldKey);
        } elseif ($value !== null) {
            $fields[$fieldKey] = is_bool($value) ? ($value ? 'true' : 'false') : (string)$value;
        }
    }
    return $fields;
}

function fb_stripe_request(string $method, string $path, array $params = []): array
{
    $config = fb_config();
    $secretKey = (string)($config['stripe_secret_key'] ?? '');
    if ($secretKey === '') {
        return ['ok' => false, 'reason' => 'missing_stripe_secret', 'message' => 'Stripe Secret Key ist nicht konfiguriert.'];
    }

    $method = strtoupper($method);
    $url = 'https://api.stripe.com/v1/' . ltrim($path, '/');
    $fields = fb_build_form_fields($params);
    if ($method === 'GET' && $fields) {
        $url .= (str_contains($url, '?') ? '&' : '?') . http_build_query($fields);
    }

    if (!function_exists('curl_init')) {
        return ['ok' => false, 'reason' => 'missing_curl', 'message' => 'cURL ist auf dem Server nicht verfÃ¼gbar.'];
    }

    $ch = curl_init($url);
    if (!$ch) {
        return ['ok' => false, 'reason' => 'curl_init_failed', 'message' => 'Stripe-Anfrage konnte nicht gestartet werden.'];
    }

    $headers = [
        'Authorization: Bearer ' . $secretKey,
        'Content-Type: application/x-www-form-urlencoded',
    ];
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    if ($method !== 'GET') {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($fields));
    }

    $raw = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($raw === false || $curlError !== '') {
        return ['ok' => false, 'reason' => 'curl_error', 'message' => $curlError ?: 'Stripe ist nicht erreichbar.'];
    }

    $json = json_decode((string)$raw, true);
    if (!is_array($json)) {
        return ['ok' => false, 'reason' => 'invalid_response', 'message' => 'Stripe hat keine gÃ¼ltige JSON-Antwort geliefert.', 'raw' => substr((string)$raw, 0, 1000), 'http_code' => $httpCode];
    }
    if ($httpCode < 200 || $httpCode >= 300 || isset($json['error'])) {
        return [
            'ok' => false,
            'reason' => 'stripe_error',
            'message' => (string)($json['error']['message'] ?? 'Stripe-Anfrage fehlgeschlagen.'),
            'response' => $json,
            'http_code' => $httpCode,
        ];
    }

    return ['ok' => true, 'response' => $json, 'http_code' => $httpCode];
}

function fb_stripe_find_promotion_code(string $code): ?array
{
    $code = trim($code);
    if ($code === '') {
        return null;
    }
    $result = fb_stripe_request('GET', 'promotion_codes', [
        'code' => $code,
        'active' => true,
        'limit' => 1,
    ]);
    if (empty($result['ok'])) {
        throw new RuntimeException($result['message'] ?? 'Rabattcode konnte nicht geprÃ¼ft werden.');
    }
    $data = $result['response']['data'] ?? [];
    $promotion = is_array($data) && isset($data[0]) && is_array($data[0]) ? $data[0] : null;
    if (!$promotion || empty($promotion['id'])) {
        return null;
    }
    return $promotion;
}

function fb_create_stripe_checkout_session(array $order, ?array $promotionCode = null, string $paymentMethod = 'all'): array
{
    $config = fb_config();
    $successUrl = (string)($config['stripe_success_url'] ?? 'https://fameboost.de/bestellung-erfolgreich/');
    $cancelUrl = (string)($config['stripe_cancel_url'] ?? 'https://fameboost.de/zahlung/');
    $allowed = $config['stripe_allowed_payment_methods'] ?? ['card', 'paypal', 'klarna', 'sofort'];
    $allowed = is_array($allowed) ? array_values(array_filter(array_map('strval', $allowed))) : ['card'];
    $paymentMethod = strtolower(trim($paymentMethod));
    $methodMap = [
        'card' => ['card'],
        'wallet' => ['card'],
        'paypal' => ['paypal'],
        'klarna' => ['klarna'],
        'sofort' => ['sofort'],
        'all' => $allowed,
        '' => $allowed,
    ];
    $selectedMethods = $methodMap[$paymentMethod] ?? $allowed;
    $selectedMethods = array_values(array_intersect($selectedMethods, $allowed));
    if (!$selectedMethods) {
        throw new InvalidArgumentException('Diese Zahlungsart ist aktuell nicht verfÃ¼gbar.');
    }

    $lineItems = [];
    foreach (($order['items'] ?? []) as $index => $item) {
        $lineItems[] = [
            'quantity' => 1,
            'price_data' => [
                'currency' => $order['currency'] ?? 'eur',
                'unit_amount' => (int)($item['price_cents'] ?? 0),
                'product_data' => [
                    'name' => (string)($item['name'] ?? ('FameBoost Paket ' . ($index + 1))),
                    'description' => trim((string)($item['quantity'] ?? '') . ' ' . (string)($item['type'] ?? '') . ' Â· ' . (string)($item['speed_label'] ?? 'Standard')),
                ],
            ],
        ];
    }

    $params = [
        'mode' => 'payment',
        'client_reference_id' => (string)$order['order_number'],
        'success_url' => $successUrl,
        'cancel_url' => $cancelUrl,
        'customer_email' => (string)($order['customer_email'] ?? ''),
        'billing_address_collection' => 'required',
        'allow_promotion_codes' => !empty($config['stripe_promotion_codes_enabled']) && $promotionCode === null,
        'payment_method_types' => $selectedMethods,
        'line_items' => $lineItems,
        'metadata' => [
            'order_number' => (string)$order['order_number'],
            'item_count' => (string)count($lineItems),
        ],
    ];
    if ($promotionCode && !empty($promotionCode['id'])) {
        $params['discounts'] = [['promotion_code' => (string)$promotionCode['id']]];
    }

    $result = fb_stripe_request('POST', 'checkout/sessions', $params);
    if (empty($result['ok'])) {
        throw new RuntimeException($result['message'] ?? 'Stripe Checkout konnte nicht erstellt werden.');
    }

    $session = $result['response'];
    if (empty($session['id']) || empty($session['url'])) {
        throw new RuntimeException('Stripe Checkout hat keine Weiterleitungs-URL geliefert.');
    }
    return $session;
}

function fb_map_reseller_status(string $status): string
{
    $normalized = strtolower(trim($status));
    return match ($normalized) {
        'pending', 'processing' => 'sent_to_reseller',
        'in progress', 'in_progress' => 'in_progress',
        'partial', 'partially completed' => 'partially_completed',
        'completed' => 'completed',
        'canceled', 'cancelled' => 'canceled',
        default => 'sent_to_reseller',
    };
}

function fb_call_reseller_status(array $order): array
{
    $config = fb_config();
    $item = $order['items'][0] ?? [];
    $apiKey = (string)($config['reseller_api_key'] ?? '');
    $apiUrl = (string)($config['reseller_api_url'] ?? 'https://justanotherpanel.com/api/v2');
    $resellerOrderId = (string)($item['reseller_order_id'] ?? '');

    if ($apiKey === '') {
        return ['ok' => false, 'reason' => 'missing_api_key', 'message' => 'Reseller-API-Key fehlt.'];
    }
    if ($resellerOrderId === '') {
        return ['ok' => false, 'reason' => 'missing_reseller_order_id', 'message' => 'Fuer diese Bestellung gibt es noch keine Reseller-Order-ID.'];
    }
    $payload = [
        'key' => $apiKey,
        'action' => 'status',
        'order' => $resellerOrderId,
    ];

    $response = fb_http_post_form($apiUrl, $payload);
    if (empty($response['ok'])) {
        return ['ok' => false, 'reason' => $response['reason'] ?? 'http_error', 'message' => $response['message'] ?? 'Reseller-API nicht erreichbar.'];
    }

    $raw = (string)$response['body'];
    $httpCode = (int)($response['http_code'] ?? 0);
    $json = json_decode($raw, true);
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($json)) {
        return ['ok' => false, 'reason' => 'invalid_response', 'message' => 'Unerwartete Reseller-Antwort.', 'raw' => substr($raw, 0, 1000)];
    }
    if (isset($json['error'])) {
        return ['ok' => false, 'reason' => 'reseller_error', 'message' => (string)$json['error'], 'response' => $json];
    }

    $status = (string)($json['status'] ?? '');
    return [
        'ok' => true,
        'status' => $status,
        'mapped_status' => fb_map_reseller_status($status),
        'start_count' => $json['start_count'] ?? null,
        'remains' => $json['remains'] ?? null,
        'charge' => $json['charge'] ?? null,
        'currency' => $json['currency'] ?? null,
        'response' => $json,
    ];
}

function fb_call_reseller_services(bool $forceRefresh = false): array
{
    $config = fb_config();
    $apiKey = (string)($config['reseller_api_key'] ?? '');
    $apiUrl = (string)($config['reseller_api_url'] ?? 'https://justanotherpanel.com/api/v2');
    $cacheFile = fb_reseller_services_cache_file();
    $cache = fb_load_json_file($cacheFile, []);
    $cacheAge = isset($cache['fetched_at']) ? time() - strtotime((string)$cache['fetched_at']) : PHP_INT_MAX;

    if (!$forceRefresh && isset($cache['services']) && is_array($cache['services']) && $cacheAge < 21600) {
        return ['ok' => true, 'cached' => true, 'services' => $cache['services'], 'fetched_at' => $cache['fetched_at'] ?? null];
    }
    if ($apiKey === '') {
        if (isset($cache['services']) && is_array($cache['services'])) {
            return ['ok' => true, 'cached' => true, 'warning' => 'Reseller-API-Key fehlt, zeige gecachte Services.', 'services' => $cache['services'], 'fetched_at' => $cache['fetched_at'] ?? null];
        }
        return ['ok' => false, 'reason' => 'missing_api_key', 'message' => 'Reseller-API-Key fehlt.'];
    }
    $response = fb_http_post_form($apiUrl, ['key' => $apiKey, 'action' => 'services'], 35);
    if (empty($response['ok'])) {
        return ['ok' => false, 'reason' => $response['reason'] ?? 'http_error', 'message' => $response['message'] ?? 'Reseller-API nicht erreichbar.'];
    }

    $raw = (string)$response['body'];
    $httpCode = (int)($response['http_code'] ?? 0);
    $json = json_decode($raw, true);
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($json)) {
        return ['ok' => false, 'reason' => 'invalid_response', 'message' => 'Unerwartete Reseller-Antwort.', 'raw' => substr($raw, 0, 1000)];
    }
    if (isset($json['error'])) {
        return ['ok' => false, 'reason' => 'reseller_error', 'message' => (string)$json['error'], 'response' => $json];
    }

    $services = array_values(array_filter(array_map(function ($service): ?array {
        if (!is_array($service) || !isset($service['service'])) {
            return null;
        }
        return [
            'service' => (string)$service['service'],
            'name' => (string)($service['name'] ?? ''),
            'category' => (string)($service['category'] ?? ''),
            'type' => (string)($service['type'] ?? ''),
            'rate' => (string)($service['rate'] ?? ''),
            'min' => (string)($service['min'] ?? ''),
            'max' => (string)($service['max'] ?? ''),
            'refill' => $service['refill'] ?? null,
            'cancel' => $service['cancel'] ?? null,
        ];
    }, $json)));

    fb_save_json_file($cacheFile, ['fetched_at' => fb_now(), 'services' => $services]);
    return ['ok' => true, 'cached' => false, 'services' => $services, 'fetched_at' => fb_now()];
}

function fb_call_reseller_balance(): array
{
    $config = fb_config();
    $apiKey = (string)($config['reseller_api_key'] ?? '');
    $apiUrl = (string)($config['reseller_api_url'] ?? 'https://justanotherpanel.com/api/v2');

    if ($apiKey === '') {
        return ['ok' => false, 'reason' => 'missing_api_key', 'message' => 'Reseller-API-Key fehlt.'];
    }
    $response = fb_http_post_form($apiUrl, ['key' => $apiKey, 'action' => 'balance']);
    if (empty($response['ok'])) {
        return ['ok' => false, 'reason' => $response['reason'] ?? 'http_error', 'message' => $response['message'] ?? 'Reseller-API nicht erreichbar.'];
    }

    $raw = (string)$response['body'];
    $httpCode = (int)($response['http_code'] ?? 0);
    $json = json_decode($raw, true);
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($json)) {
        return ['ok' => false, 'reason' => 'invalid_response', 'message' => 'Unerwartete Reseller-Balance-Antwort.', 'raw' => substr($raw, 0, 1000)];
    }
    if (isset($json['error'])) {
        return ['ok' => false, 'reason' => 'reseller_error', 'message' => (string)$json['error'], 'response' => $json];
    }

    $balance = fb_float_value($json['balance'] ?? null);
    $currency = (string)($json['currency'] ?? '');
    if ($balance === null) {
        return ['ok' => false, 'reason' => 'invalid_balance', 'message' => 'Reseller-Balance konnte nicht gelesen werden.', 'response' => $json];
    }

    fb_save_json_file(fb_data_path('reseller_balance.json'), [
        'balance' => $balance,
        'currency' => $currency,
        'checked_at' => fb_now(),
        'response' => $json,
    ]);

    return ['ok' => true, 'balance' => $balance, 'currency' => $currency, 'response' => $json];
}

function fb_read_input(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    return $_POST;
}

function fb_private_path(string $path = ''): string
{
    $base = __DIR__ . DIRECTORY_SEPARATOR . '_private';
    return $path === '' ? $base : $base . DIRECTORY_SEPARATOR . str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path);
}

function fb_data_path(string $filename): string
{
    $dir = fb_private_path('data');
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir . DIRECTORY_SEPARATOR . $filename;
}

function fb_config(): array
{
    return require fb_private_path('config.php');
}

function fb_catalog(): array
{
    return require fb_private_path('catalog.php');
}

function fb_orders_file(): string
{
    return fb_data_path('orders.json');
}

function fb_rate_limit_file(): string
{
    return fb_data_path('rate_limits.json');
}

function fb_feedback_file(): string
{
    return fb_data_path('feedback.json');
}

function fb_newsletter_file(): string
{
    return fb_data_path('newsletter_subscribers.json');
}

function fb_admin_auth_file(): string
{
    return fb_data_path('admin_auth.json');
}

function fb_reseller_mappings_file(): string
{
    return fb_data_path('reseller_mappings.json');
}

function fb_reseller_services_cache_file(): string
{
    return fb_data_path('reseller_services_cache.json');
}

function fb_reseller_health_file(): string
{
    return fb_data_path('reseller_service_health.json');
}

function fb_reseller_mappings(): array
{
    $data = fb_load_json_file(fb_reseller_mappings_file(), ['product_mappings' => [], 'quantity_mappings' => []]);
    return [
        'product_mappings' => isset($data['product_mappings']) && is_array($data['product_mappings']) ? $data['product_mappings'] : [],
        'quantity_mappings' => isset($data['quantity_mappings']) && is_array($data['quantity_mappings']) ? $data['quantity_mappings'] : [],
    ];
}

function fb_reseller_service_mapping(string $slug, int $quantity): ?array
{
    $mappings = fb_reseller_mappings();
    $quantityKey = $slug . ':' . $quantity;
    if (isset($mappings['quantity_mappings'][$quantityKey]) && is_array($mappings['quantity_mappings'][$quantityKey])) {
        return $mappings['quantity_mappings'][$quantityKey];
    }
    if (isset($mappings['product_mappings'][$slug]) && is_array($mappings['product_mappings'][$slug])) {
        return $mappings['product_mappings'][$slug];
    }
    return null;
}

function fb_reseller_quantity_limits(string $slug): array
{
    $mappings = fb_reseller_mappings();
    $mapping = $mappings['product_mappings'][$slug] ?? null;
    if (!is_array($mapping)) {
        return ['min' => null, 'max' => null, 'has_mapping' => false];
    }

    $min = fb_float_value($mapping['min'] ?? null);
    $max = fb_float_value($mapping['max'] ?? null);

    return [
        'min' => $min !== null ? (int)floor($min) : null,
        'max' => $max !== null ? (int)floor($max) : null,
        'has_mapping' => !empty($mapping['service_id']),
    ];
}

function fb_catalog_product_label(string $slug): string
{
    $catalog = fb_catalog();
    $product = $catalog[$slug] ?? null;
    if (!is_array($product)) {
        return $slug;
    }
    return trim((string)($product['platform'] ?? '') . ' ' . (string)($product['type'] ?? '')) ?: $slug;
}

function fb_mapped_reseller_services(): array
{
    $mappings = fb_reseller_mappings();
    $items = [];

    foreach ($mappings['product_mappings'] as $slug => $mapping) {
        if (!is_array($mapping) || empty($mapping['service_id'])) {
            continue;
        }
        $items[(string)$slug] = [
            'key' => (string)$slug,
            'slug' => (string)$slug,
            'quantity' => null,
            'label' => fb_catalog_product_label((string)$slug),
            'service_id' => (string)$mapping['service_id'],
            'service_name' => (string)($mapping['service_name'] ?? ''),
        ];
    }

    foreach ($mappings['quantity_mappings'] as $key => $mapping) {
        if (!is_array($mapping) || empty($mapping['service_id'])) {
            continue;
        }
        [$slug, $quantity] = array_pad(explode(':', (string)$key, 2), 2, '');
        $label = fb_catalog_product_label($slug);
        if ($quantity !== '') {
            $label .= ' ' . number_format((int)$quantity, 0, ',', '.');
        }
        $items[(string)$key] = [
            'key' => (string)$key,
            'slug' => $slug,
            'quantity' => $quantity !== '' ? (int)$quantity : null,
            'label' => $label,
            'service_id' => (string)$mapping['service_id'],
            'service_name' => (string)($mapping['service_name'] ?? ''),
        ];
    }

    return array_values($items);
}

function fb_check_reseller_mapped_services(bool $forceRefresh = false, bool $sendAlerts = true): array
{
    $config = fb_config();
    $previous = fb_load_json_file(fb_reseller_health_file(), ['products' => []]);
    $mapped = fb_mapped_reseller_services();
    $servicesResult = fb_call_reseller_services($forceRefresh);
    $now = fb_now();

    if (empty($servicesResult['ok'])) {
        $previous['ok'] = false;
        $previous['checked_at'] = $now;
        $previous['message'] = $servicesResult['message'] ?? 'Reseller-Services konnten nicht geprueft werden.';
        $previous['reason'] = $servicesResult['reason'] ?? 'service_check_failed';
        $previous['mapped_count'] = count($mapped);
        fb_save_json_file(fb_reseller_health_file(), $previous);
        return $previous;
    }

    $services = $servicesResult['services'] ?? [];
    $servicesById = [];
    foreach ($services as $service) {
        if (is_array($service) && isset($service['service'])) {
            $servicesById[(string)$service['service']] = $service;
        }
    }

    $products = [];
    $unavailable = [];
    $alertThrottle = (int)($config['reseller_health_alert_throttle'] ?? 21600);
    $previousProducts = isset($previous['products']) && is_array($previous['products']) ? $previous['products'] : [];

    foreach ($mapped as $entry) {
        $key = (string)$entry['key'];
        $serviceId = (string)$entry['service_id'];
        $currentService = $servicesById[$serviceId] ?? null;
        $previousStatus = is_array($previousProducts[$key] ?? null) ? $previousProducts[$key] : [];
        $wasAvailable = ($previousStatus['available'] ?? true) === true;
        $lastAlertAt = (string)($previousStatus['last_alert_at'] ?? '');
        $lastAlertTime = $lastAlertAt !== '' ? strtotime($lastAlertAt) : 0;
        $shouldAlert = $currentService === null && ($wasAvailable || !$lastAlertTime || time() - $lastAlertTime >= $alertThrottle);

        $status = [
            'key' => $key,
            'slug' => $entry['slug'],
            'quantity' => $entry['quantity'],
            'label' => $entry['label'],
            'service_id' => $serviceId,
            'service_name' => $entry['service_name'],
            'available' => $currentService !== null,
            'checked_at' => $now,
            'last_alert_at' => $lastAlertAt !== '' ? $lastAlertAt : null,
        ];

        if ($currentService === null) {
            $status['message'] = 'Der zugewiesene Reseller-Service ist aktuell nicht verfuegbar.';
            if ($sendAlerts && $shouldAlert && fb_notify_admin_service_unavailable($entry, $status)) {
                $status['last_alert_at'] = $now;
            }
            $unavailable[] = $status;
        } else {
            $status['message'] = 'Service verfuegbar.';
            $status['current_service_name'] = $currentService['name'] ?? '';
            $status['current_rate'] = $currentService['rate'] ?? null;
            $status['current_min'] = $currentService['min'] ?? null;
            $status['current_max'] = $currentService['max'] ?? null;
            $status['last_alert_at'] = null;
        }

        $products[$key] = $status;
    }

    $health = [
        'ok' => true,
        'checked_at' => $now,
        'service_count' => count($services),
        'mapped_count' => count($mapped),
        'unavailable_count' => count($unavailable),
        'cached' => !empty($servicesResult['cached']),
        'fetched_at' => $servicesResult['fetched_at'] ?? null,
        'products' => $products,
        'unavailable' => $unavailable,
    ];

    fb_save_json_file(fb_reseller_health_file(), $health);
    return $health;
}

function fb_reseller_health(): array
{
    return fb_load_json_file(fb_reseller_health_file(), []);
}

function fb_ensure_reseller_health_fresh(): array
{
    $config = fb_config();
    $interval = max(30, (int)($config['reseller_health_check_interval'] ?? 60));
    $health = fb_reseller_health();
    $checkedAt = isset($health['checked_at']) ? strtotime((string)$health['checked_at']) : 0;
    if (!$checkedAt || time() - $checkedAt >= $interval) {
        return fb_check_reseller_mapped_services(true, true);
    }
    return $health;
}

function fb_mapping_health_status(string $slug, int $quantity, ?array $mapping = null): ?array
{
    if (!$mapping || empty($mapping['service_id'])) {
        return null;
    }

    $expectedServiceId = (string)$mapping['service_id'];
    $health = fb_ensure_reseller_health_fresh();
    $products = isset($health['products']) && is_array($health['products']) ? $health['products'] : [];
    $quantityKey = $slug . ':' . $quantity;
    $status = null;

    if (isset($products[$quantityKey]) && is_array($products[$quantityKey])) {
        $status = $products[$quantityKey];
    } elseif (isset($products[$slug]) && is_array($products[$slug])) {
        $status = $products[$slug];
    }

    if ($status && (string)($status['service_id'] ?? '') !== $expectedServiceId) {
        $health = fb_check_reseller_mapped_services(true, true);
        $products = isset($health['products']) && is_array($health['products']) ? $health['products'] : [];
        if (isset($products[$quantityKey]) && is_array($products[$quantityKey])) {
            $status = $products[$quantityKey];
        } elseif (isset($products[$slug]) && is_array($products[$slug])) {
            $status = $products[$slug];
        } else {
            $status = null;
        }
    }

    if ($status && (string)($status['service_id'] ?? '') !== $expectedServiceId) {
        return null;
    }

    return $status;
}

function fb_load_json_file(string $file, array $fallback = []): array
{
    if (!is_file($file)) {
        return $fallback;
    }
    $raw = file_get_contents($file);
    if ($raw === false || trim($raw) === '') {
        return $fallback;
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $fallback;
}

function fb_save_json_file(string $file, array $data): void
{
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $handle = fopen($file, 'c+');
    if (!$handle) {
        throw new RuntimeException('Storage konnte nicht geÃƒÂ¶ffnet werden.');
    }

    flock($handle, LOCK_EX);
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function fb_mutate_json_file(string $file, callable $callback, array $fallback = []): array
{
    $dir = dirname($file);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $handle = fopen($file, 'c+');
    if (!$handle) {
        throw new RuntimeException('Storage konnte nicht geÃƒÂ¶ffnet werden.');
    }

    flock($handle, LOCK_EX);
    $raw = stream_get_contents($handle);
    $data = $raw ? json_decode($raw, true) : $fallback;
    if (!is_array($data)) {
        $data = $fallback;
    }

    $result = $callback($data);
    $next = is_array($result) && array_key_exists('data', $result) ? $result['data'] : $data;

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($next, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return is_array($result) ? $result : ['data' => $next];
}

function fb_orders(): array
{
    $data = fb_load_json_file(fb_orders_file(), ['orders' => []]);
    return isset($data['orders']) && is_array($data['orders']) ? $data['orders'] : [];
}

function fb_find_order(string $orderNumber): ?array
{
    foreach (fb_orders() as $order) {
        if (($order['order_number'] ?? '') === $orderNumber) {
            return $order;
        }
    }
    return null;
}

function fb_public_order(array $order): array
{
    $item = $order['items'][0] ?? [];
    $items = array_map(function (array $entry): array {
        return [
            'slug' => $entry['slug'] ?? '',
            'name' => $entry['name'] ?? '',
            'platform' => $entry['platform'] ?? '',
            'type' => $entry['type'] ?? '',
            'quantity' => $entry['quantity'] ?? 0,
            'custom_quantity' => !empty($entry['custom_quantity']),
            'target' => $entry['target'] ?? '',
            'target_url' => $entry['target_url'] ?? '',
            'speed' => $entry['speed'] ?? 'standard',
            'speed_label' => $entry['speed_label'] ?? ($entry['speed'] ?? 'Standard'),
            'speed_price_cents' => $entry['speed_price_cents'] ?? 0,
            'price_cents' => $entry['price_cents'] ?? 0,
            'status' => $entry['status'] ?? ($order['status'] ?? ''),
            'reseller_service_id' => $entry['reseller_service_id'] ?? null,
            'reseller_service_name' => $entry['reseller_service_name'] ?? null,
            'reseller_order_id' => $entry['reseller_order_id'] ?? null,
            'reseller_rate' => $entry['reseller_rate'] ?? null,
            'baseline_count' => $entry['baseline_count'] ?? null,
            'completed_count' => $entry['completed_count'] ?? null,
            'lost_count' => $entry['lost_count'] ?? null,
            'reseller_remains' => $entry['reseller_remains'] ?? null,
        ];
    }, isset($order['items']) && is_array($order['items']) ? $order['items'] : []);
    $paymentDone = ($order['payment_status'] ?? '') === 'paid' || in_array($order['status'], ['paid', 'fulfillment_hold', 'sent_to_reseller', 'in_progress', 'completed'], true);
    $steps = [
        ['key' => 'created', 'label' => 'Bestellung vorbereitet', 'state' => 'done'],
        ['key' => 'payment', 'label' => 'Zahlung ÃƒÂ¼ber Stripe', 'state' => $paymentDone ? 'done' : 'active'],
        ['key' => 'review', 'label' => 'PrÃƒÂ¼fung und Zuordnung', 'state' => in_array($order['status'], ['needs_review', 'manual_payment_check'], true) ? 'active' : (in_array($order['status'], ['pending_external_payment', 'payment_link_opened'], true) ? 'pending' : 'done')],
        ['key' => 'fulfillment', 'label' => 'Bearbeitung', 'state' => in_array($order['status'], ['fulfillment_hold', 'sent_to_reseller', 'in_progress'], true) ? 'active' : ($order['status'] === 'completed' ? 'done' : 'pending')],
        ['key' => 'done', 'label' => 'Abgeschlossen', 'state' => $order['status'] === 'completed' ? 'done' : 'pending'],
    ];

    return [
        'order_number' => $order['order_number'],
        'status' => $order['status'],
        'status_label' => fb_status_label($order['status']),
        'progress' => fb_status_progress($order['status']),
        'created_at' => $order['created_at'],
        'updated_at' => $order['updated_at'],
        'product' => $item['name'] ?? '',
        'platform' => $item['platform'] ?? '',
        'type' => $item['type'] ?? '',
        'quantity' => $item['quantity'] ?? 0,
        'amount_total_cents' => $order['amount_total_cents'] ?? 0,
        'amount_paid_cents' => $order['amount_paid_cents'] ?? null,
        'currency' => $order['currency'] ?? 'eur',
        'items' => $items,
        'item_count' => count($items),
        'steps' => $steps,
        'message' => fb_status_message($order['status']),
        'feedback_submitted' => !empty($order['feedback_submitted']),
    ];
}

function fb_status_label(string $status): string
{
    $labels = [
        'pending_external_payment' => 'Wartet auf externe Zahlung',
        'payment_link_opened' => 'Zu Stripe weitergeleitet',
        'manual_payment_check' => 'Zahlung wird geprÃƒÂ¼ft',
        'payment_failed' => 'Zahlung fehlgeschlagen',
        'paid' => 'Zahlung bestÃƒÂ¤tigt',
        'fulfillment_queued' => 'Bearbeitung vorbereitet',
        'fulfillment_hold' => 'Wartet auf Freigabe',
        'sent_to_reseller' => 'Bearbeitung gestartet',
        'in_progress' => 'Bearbeitung lÃƒÂ¤uft',
        'partially_completed' => 'Teilweise abgeschlossen',
        'completed' => 'Abgeschlossen',
        'refill_requested' => 'Refill angefragt',
        'needs_review' => 'Manuelle PrÃƒÂ¼fung',
        'canceled' => 'Storniert',
        'refunded' => 'Erstattet',
    ];
    return $labels[$status] ?? $status;
}

function fb_status_progress(string $status): int
{
    $map = [
        'pending_external_payment' => 20,
        'payment_link_opened' => 30,
        'manual_payment_check' => 38,
        'payment_failed' => 12,
        'paid' => 50,
        'fulfillment_queued' => 58,
        'fulfillment_hold' => 58,
        'sent_to_reseller' => 68,
        'in_progress' => 78,
        'partially_completed' => 82,
        'completed' => 100,
        'refill_requested' => 62,
        'needs_review' => 45,
        'canceled' => 0,
        'refunded' => 0,
    ];
    return $map[$status] ?? 25;
}

function fb_status_message(string $status): string
{
    $messages = [
        'pending_external_payment' => 'Deine Bestellung wurde vorbereitet. SchlieÃƒÅ¸e die Zahlung auf der sicheren Stripe-Seite ab.',
        'payment_link_opened' => 'Du wurdest zu Stripe weitergeleitet. Nach der Zahlung wird die Bestellung geprÃƒÂ¼ft.',
        'manual_payment_check' => 'Wir prÃƒÂ¼fen die Zahlung und ordnen die Bestellung zu.',
        'payment_failed' => 'Die Zahlung wurde nicht bestÃƒÂ¤tigt. Bitte starte den Kauf erneut oder kontaktiere den Support.',
        'paid' => 'Die Zahlung wurde bestÃƒÂ¤tigt. Die Bearbeitung kann vorbereitet werden.',
        'fulfillment_queued' => 'Dein Auftrag ist eingeplant und wird fÃ¼r die Bearbeitung vorbereitet.',
        'fulfillment_hold' => 'Deine Bestellung ist bezahlt und vorgemerkt. Die Bearbeitung wird innerhalb von 24 Stunden freigegeben.',
        'sent_to_reseller' => 'Die Bearbeitung deiner Bestellung wurde gestartet.',
        'in_progress' => 'Die Bearbeitung lÃƒÂ¤uft. Bitte ÃƒÂ¤ndere den Profilnamen nicht.',
        'partially_completed' => 'Der Auftrag ist teilweise abgeschlossen und wird geprÃƒÂ¼ft.',
        'completed' => 'Der Auftrag wurde abgeschlossen. Danke fÃƒÂ¼r deine Bestellung.',
        'refill_requested' => 'Eine Refill-PrÃƒÂ¼fung wurde vorgemerkt.',
        'needs_review' => 'Die Bestellung benÃƒÂ¶tigt eine manuelle PrÃƒÂ¼fung.',
    ];
    return $messages[$status] ?? 'Status wird aktualisiert.';
}

function fb_now(): string
{
    return date('c');
}

function fb_generate_order_number(array $orders): string
{
    $prefix = 'FB-' . date('Ymd') . '-';
    $next = count($orders) + 1;
    do {
        $number = $prefix . str_pad((string)$next, 5, '0', STR_PAD_LEFT);
        $next++;
    } while (array_filter($orders, fn($order) => ($order['order_number'] ?? '') === $number));
    return $number;
}

function fb_random_token(): string
{
    return bin2hex(random_bytes(16));
}

function fb_hash_token(string $token): string
{
    return hash('sha256', $token);
}

function fb_money(int $cents): string
{
    return number_format($cents / 100, 2, ',', '.') . ' Ã¢â€šÂ¬';
}

function fb_money_float(float $amount, string $currency = ''): string
{
    $suffix = $currency !== '' ? ' ' . strtoupper($currency) : '';
    return number_format($amount, 4, ',', '.') . $suffix;
}

function fb_estimated_reseller_cost(array $order): ?float
{
    $items = isset($order['items']) && is_array($order['items']) ? $order['items'] : [];
    $total = 0.0;
    $found = false;
    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $rate = fb_float_value($item['reseller_rate'] ?? null);
        $quantity = (int)($item['quantity'] ?? 0);
        if ($rate === null || $quantity <= 0) {
            continue;
        }
        $total += ($rate / 1000) * $quantity;
        $found = true;
    }
    return $found ? $total : null;
}

function fb_estimated_reseller_item_cost(array $item): ?float
{
    $rate = fb_float_value($item['reseller_rate'] ?? null);
    $quantity = (int)($item['quantity'] ?? 0);
    if ($rate === null || $quantity <= 0) {
        return null;
    }
    return ($rate / 1000) * $quantity;
}

function fb_target_url(string $platform, string $target): string
{
    $target = trim($target);
    if (preg_match('/^https?:\/\//i', $target)) {
        return $target;
    }

    $name = ltrim($target, '@');
    $encoded = rawurlencode($name);
    return match (strtolower($platform)) {
        'instagram' => 'https://www.instagram.com/' . $encoded . '/',
        'tiktok' => 'https://www.tiktok.com/@' . $encoded,
        'youtube' => 'https://www.youtube.com/results?search_query=' . $encoded,
        'twitch' => 'https://www.twitch.tv/' . $encoded,
        'facebook' => 'https://www.facebook.com/search/top?q=' . $encoded,
        default => $target,
    };
}

function fb_payment_link_with_reference(string $url, string $orderNumber): string
{
    $separator = str_contains($url, '?') ? '&' : '?';
    return $url . $separator . 'client_reference_id=' . rawurlencode($orderNumber);
}

function fb_validate_target(string $target): string
{
    $target = trim($target);
    if ($target === '' || strlen($target) > 300) {
        throw new InvalidArgumentException('Bitte gib einen gÃƒÂ¼ltigen Profilnamen oder Link ein.');
    }
    if (preg_match('/[\r\n]/', $target)) {
        throw new InvalidArgumentException('Der Profilname oder Link enthÃƒÂ¤lt ungÃƒÂ¼ltige Zeichen.');
    }
    return $target;
}

function fb_speed_options(): array
{
    $config = fb_config();
    $options = $config['speed_options'] ?? [];
    if (!is_array($options) || !$options) {
        $options = [
            'standard' => ['label' => 'Standard', 'price_cents' => 0],
            'fast' => ['label' => 'Schnellere Bearbeitung', 'price_cents' => 399],
            'custom' => ['label' => 'Individuelle Geschwindigkeit', 'price_cents' => 399],
        ];
    }
    return $options;
}

function fb_normalize_speed_key(string $speed): string
{
    $map = [
        'standard' => 'standard',
        'Standard' => 'standard',
        'fast' => 'fast',
        'Schnellere Bearbeitung' => 'fast',
        'custom' => 'custom',
        'Individuelle Geschwindigkeit' => 'custom',
    ];
    $speed = trim($speed);
    return $map[$speed] ?? strtolower($speed);
}

function fb_speed_option(string $speed): array
{
    $key = fb_normalize_speed_key($speed);
    $options = fb_speed_options();
    if (!isset($options[$key]) || !is_array($options[$key])) {
        throw new InvalidArgumentException('Diese Liefergeschwindigkeit ist aktuell nicht verfÃ¼gbar.');
    }
    return [
        'key' => $key,
        'label' => (string)($options[$key]['label'] ?? $key),
        'price_cents' => max(0, (int)($options[$key]['price_cents'] ?? 0)),
    ];
}

function fb_catalog_item(string $slug, int $quantity): array
{
    $catalog = fb_catalog();
    if (!isset($catalog[$slug])) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.');
    }
    if ($quantity <= 0) {
        throw new InvalidArgumentException('Bitte wähle eine gültige Menge.');
    }

    $limits = fb_reseller_quantity_limits($slug);
    if (($limits['min'] ?? null) !== null && $quantity < (int)$limits['min']) {
        throw new InvalidArgumentException('Die gewählte Menge ist für dieses Produkt aktuell zu niedrig. Mindestens möglich sind ' . number_format((int)$limits['min'], 0, ',', '.') . '.');
    }
    if (($limits['max'] ?? null) !== null && $quantity > (int)$limits['max']) {
        throw new InvalidArgumentException('Die gewählte Menge ist für dieses Produkt aktuell zu hoch. Maximal möglich sind ' . number_format((int)$limits['max'], 0, ',', '.') . '.');
    }

    $items = isset($catalog[$slug]['items']) && is_array($catalog[$slug]['items']) ? $catalog[$slug]['items'] : [];
    if (!$items) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.');
    }

    $isCustom = !isset($items[$quantity]);
    if (!$isCustom) {
        $item = $items[$quantity];
    } else {
        $tiers = $items;
        ksort($tiers, SORT_NUMERIC);
        $priceTierQuantity = null;
        $priceTier = null;
        foreach ($tiers as $tierQuantity => $tier) {
            if ((int)$tierQuantity >= $quantity) {
                $priceTierQuantity = (int)$tierQuantity;
                $priceTier = $tier;
                break;
            }
        }
        if (!$priceTier) {
            $priceTierQuantity = (int)array_key_last($tiers);
            $priceTier = $tiers[$priceTierQuantity];
        }
        $unitCents = (int)ceil(((int)$priceTier['price_cents']) / max(1, (int)$priceTierQuantity));
        $type = (string)($catalog[$slug]['type'] ?? 'Einheiten');
        $platform = (string)($catalog[$slug]['platform'] ?? '');
        $item = [
            'name' => trim($platform . ' ' . $type . ' Paket - ' . number_format($quantity, 0, ',', '.') . ' ' . $type),
            'price_cents' => max(1, $unitCents * $quantity),
            'custom_quantity' => true,
            'price_tier_quantity' => $priceTierQuantity,
        ];
    }

    $mapping = fb_reseller_service_mapping($slug, $quantity);
    if (!$mapping || empty($mapping['service_id'])) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.');
    }
    $healthStatus = fb_mapping_health_status($slug, $quantity, $mapping);
    if ($healthStatus && ($healthStatus['available'] ?? true) === false) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.');
    }

    $item['reseller_service_id'] = (string)$mapping['service_id'];
    $item['reseller_service_name'] = $mapping['service_name'] ?? null;
    $item['reseller_service_category'] = $mapping['category'] ?? null;
    $item['reseller_rate'] = $mapping['rate'] ?? null;
    $item['reseller_min'] = $mapping['min'] ?? null;
    $item['reseller_max'] = $mapping['max'] ?? null;
    $item['custom_quantity'] = $isCustom;

    return [$catalog[$slug], $item];
}

function fb_append_history(array $order, string $status, string $message): array
{
    $order['history'][] = [
        'status' => $status,
        'message' => $message,
        'created_at' => fb_now(),
    ];
    $order['updated_at'] = fb_now();
    return $order;
}

function fb_mark_stripe_event(array $event, string $status, ?string $error = null): void
{
    fb_mutate_json_file(fb_data_path('stripe_events.json'), function (array $data) use ($event, $status, $error) {
        $events = $data['events'] ?? [];
        $events[$event['id']] = [
            'id' => $event['id'],
            'type' => $event['type'] ?? '',
            'status' => $status,
            'error' => $error,
            'created_at' => $events[$event['id']]['created_at'] ?? fb_now(),
            'processed_at' => $status === 'processed' ? fb_now() : null,
        ];
        $data['events'] = $events;
        return ['data' => $data];
    }, ['events' => []]);
}

function fb_stripe_event_seen(string $eventId): bool
{
    $data = fb_load_json_file(fb_data_path('stripe_events.json'), ['events' => []]);
    return isset($data['events'][$eventId]) && ($data['events'][$eventId]['status'] ?? '') === 'processed';
}

function fb_verify_stripe_signature(string $payload, string $signatureHeader, string $secret, int $tolerance = 300): bool
{
    if ($secret === '' || $signatureHeader === '') {
        return false;
    }

    $timestamp = null;
    $signatures = [];
    foreach (explode(',', $signatureHeader) as $part) {
        [$key, $value] = array_pad(explode('=', trim($part), 2), 2, '');
        if ($key === 't') {
            $timestamp = (int)$value;
        } elseif ($key === 'v1') {
            $signatures[] = $value;
        }
    }

    if (!$timestamp || !$signatures) {
        return false;
    }
    if (abs(time() - $timestamp) > $tolerance) {
        return false;
    }

    $expected = hash_hmac('sha256', $timestamp . '.' . $payload, $secret);
    foreach ($signatures as $signature) {
        if (hash_equals($expected, $signature)) {
            return true;
        }
    }
    return false;
}

function fb_update_order_from_stripe_session(array $session, string $eventType): ?array
{
    $orderNumber = (string)($session['client_reference_id'] ?? '');
    if ($orderNumber === '') {
        return null;
    }

    $result = fb_mutate_json_file(fb_orders_file(), function (array $data) use ($orderNumber, $session, $eventType) {
        $orders = $data['orders'] ?? [];
        $updated = null;
        foreach ($orders as &$order) {
            if (($order['order_number'] ?? '') !== $orderNumber) {
                continue;
            }

            $amountTotal = isset($session['amount_total']) ? (int)$session['amount_total'] : null;
            $amountSubtotal = isset($session['amount_subtotal']) ? (int)$session['amount_subtotal'] : null;
            $currency = strtolower((string)($session['currency'] ?? 'eur'));
            $expected = (int)($order['amount_total_cents'] ?? 0);
            $paymentStatus = (string)($session['payment_status'] ?? '');

            $order['stripe_checkout_session_id'] = $session['id'] ?? null;
            $order['stripe_payment_intent_id'] = $session['payment_intent'] ?? null;
            $order['stripe_payment_status'] = $paymentStatus;
            $order['stripe_customer_email'] = $session['customer_details']['email'] ?? ($session['customer_email'] ?? null);
            $order['amount_paid_cents'] = $amountTotal;

            if ($amountSubtotal !== null && $amountSubtotal !== $expected) {
                $order['status'] = 'needs_review';
                $order['payment_status'] = 'amount_mismatch';
                $order = fb_append_history($order, 'needs_review', 'Stripe-Zwischensumme weicht vom erwarteten Betrag ab.');
            } elseif ($amountSubtotal === null && $amountTotal !== null && $amountTotal > $expected) {
                $order['status'] = 'needs_review';
                $order['payment_status'] = 'amount_mismatch';
                $order = fb_append_history($order, 'needs_review', 'Stripe-Zahlbetrag ist höher als der erwartete Betrag.');
            } elseif ($currency !== strtolower((string)($order['currency'] ?? 'eur'))) {
                $order['status'] = 'needs_review';
                $order['payment_status'] = 'currency_mismatch';
                $order = fb_append_history($order, 'needs_review', 'Stripe-WÃƒÂ¤hrung weicht von der Bestellung ab.');
            } elseif ($eventType === 'checkout.session.completed' && $paymentStatus === 'paid') {
                $order['status'] = 'paid';
                $order['payment_status'] = 'paid';
                $order['paid_at'] = fb_now();
                $order = fb_append_history($order, 'paid', 'Stripe Webhook hat die Zahlung bestÃƒÂ¤tigt.');
            } elseif ($eventType === 'checkout.session.async_payment_succeeded') {
                $order['status'] = 'paid';
                $order['payment_status'] = 'paid';
                $order['paid_at'] = fb_now();
                $order = fb_append_history($order, 'paid', 'Asynchrone Stripe-Zahlung wurde bestÃƒÂ¤tigt.');
            } elseif ($eventType === 'checkout.session.async_payment_failed') {
                $order['status'] = 'payment_failed';
                $order['payment_status'] = 'failed';
                $order = fb_append_history($order, 'payment_failed', 'Asynchrone Stripe-Zahlung ist fehlgeschlagen.');
            } else {
                $order['status'] = 'manual_payment_check';
                $order['payment_status'] = $paymentStatus ?: 'manual_payment_check';
                $order = fb_append_history($order, 'manual_payment_check', 'Stripe Webhook erhalten, Zahlung aber noch nicht final bestÃƒÂ¤tigt.');
            }

            $updated = $order;
            break;
        }
        $data['orders'] = $orders;
        return ['data' => $data, 'order' => $updated];
    }, ['orders' => []]);

    return $result['order'] ?? null;
}

function fb_call_reseller_add_item(array $order, int $itemIndex): array
{
    $config = fb_config();
    $item = $order['items'][$itemIndex] ?? [];
    $apiKey = (string)($config['reseller_api_key'] ?? '');
    $apiUrl = (string)($config['reseller_api_url'] ?? 'https://justanotherpanel.com/api/v2');
    $serviceId = (string)($item['reseller_service_id'] ?? '');

    if ($apiKey === '') {
        return ['ok' => false, 'reason' => 'missing_api_key', 'message' => 'Reseller-API-Key fehlt.'];
    }
    if ($serviceId === '') {
        return ['ok' => false, 'reason' => 'missing_service_id', 'message' => 'Reseller-Service-ID fehlt für dieses Produkt.'];
    }
    if (!empty($item['reseller_order_id'])) {
        return ['ok' => true, 'already_sent' => true, 'order_id' => $item['reseller_order_id']];
    }
    if (($order['payment_status'] ?? '') !== 'paid') {
        return ['ok' => false, 'reason' => 'not_paid', 'message' => 'Bestellung ist noch nicht als bezahlt markiert.'];
    }

    $payload = [
        'key' => $apiKey,
        'action' => 'add',
        'service' => $serviceId,
        'link' => $item['target'] ?? '',
        'quantity' => (string)($item['quantity'] ?? ''),
    ];

    $response = fb_http_post_form($apiUrl, $payload);
    if (empty($response['ok'])) {
        return ['ok' => false, 'reason' => $response['reason'] ?? 'http_error', 'message' => $response['message'] ?? 'Reseller-API nicht erreichbar.'];
    }

    $raw = (string)$response['body'];
    $httpCode = (int)($response['http_code'] ?? 0);
    $json = json_decode($raw, true);
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($json)) {
        return ['ok' => false, 'reason' => 'invalid_response', 'message' => 'Unerwartete Reseller-Antwort.', 'raw' => substr($raw, 0, 1000)];
    }

    if (isset($json['order'])) {
        return ['ok' => true, 'order_id' => (string)$json['order'], 'response' => $json];
    }

    return ['ok' => false, 'reason' => 'reseller_error', 'message' => $json['error'] ?? 'Reseller hat keine Order-ID zurückgegeben.', 'response' => $json];
}

function fb_call_reseller_add(array $order, bool $skipBalanceCheck = false): array
{
    $config = fb_config();
    $items = isset($order['items']) && is_array($order['items']) ? $order['items'] : [];
    $minBalance = (float)($config['reseller_min_balance'] ?? 20.0);
    $manualThreshold = (float)($config['reseller_manual_review_threshold'] ?? 5.0);

    if (!$items) {
        return ['ok' => false, 'reason' => 'missing_items', 'message' => 'Bestellung enthält keine Positionen.'];
    }
    if (($order['payment_status'] ?? '') !== 'paid') {
        return ['ok' => false, 'reason' => 'not_paid', 'message' => 'Bestellung ist noch nicht als bezahlt markiert.'];
    }

    $balance = null;
    $estimatedCost = fb_estimated_reseller_cost($order);
    if (!$skipBalanceCheck) {
        $balance = fb_call_reseller_balance();
        if (empty($balance['ok'])) {
            return ['ok' => false, 'reason' => 'balance_check_failed', 'message' => $balance['message'] ?? 'Reseller-Balance konnte nicht geprüft werden.', 'balance' => $balance];
        }
        if ((float)$balance['balance'] < $minBalance) {
            return [
                'ok' => false,
                'reason' => 'balance_hold',
                'message' => 'Reseller-Balance liegt unter dem Mindestwert. Auftrag wurde nicht gesendet.',
                'balance' => $balance,
                'min_balance' => $minBalance,
                'estimated_cost' => $estimatedCost,
            ];
        }
        if ($estimatedCost === null || $estimatedCost > $manualThreshold) {
            return [
                'ok' => false,
                'reason' => 'cost_hold',
                'message' => 'Reseller-Kosten liegen über dem Freigabewert oder konnten nicht berechnet werden. Auftrag wurde nicht gesendet.',
                'estimated_cost' => $estimatedCost,
                'manual_threshold' => $manualThreshold,
                'balance' => $balance,
            ];
        }
    }

    $sent = [];
    $failed = [];
    $alreadySent = [];
    foreach ($items as $index => $item) {
        if (!is_array($item)) {
            continue;
        }
        $result = fb_call_reseller_add_item($order, (int)$index);
        if (!empty($result['ok']) && !empty($result['already_sent'])) {
            $alreadySent[(int)$index] = $result;
        } elseif (!empty($result['ok'])) {
            $sent[(int)$index] = $result;
        } else {
            $failed[(int)$index] = $result;
        }
    }

    if ($failed) {
        return [
            'ok' => false,
            'reason' => 'partial_reseller_error',
            'message' => 'Mindestens eine Position konnte nicht an den Reseller gesendet werden.',
            'sent' => $sent,
            'already_sent' => $alreadySent,
            'failed' => $failed,
            'balance' => $balance,
            'estimated_cost' => $estimatedCost,
        ];
    }

    return [
        'ok' => true,
        'sent' => $sent,
        'already_sent' => $alreadySent,
        'order_id' => $sent ? reset($sent)['order_id'] : ($alreadySent ? reset($alreadySent)['order_id'] : null),
        'balance' => $balance,
        'estimated_cost' => $estimatedCost,
    ];
}

function fb_apply_reseller_result_to_order(array $order, array $reseller, string $successMessage): array
{
    $sent = isset($reseller['sent']) && is_array($reseller['sent']) ? $reseller['sent'] : [];
    $alreadySent = isset($reseller['already_sent']) && is_array($reseller['already_sent']) ? $reseller['already_sent'] : [];

    foreach ($sent + $alreadySent as $index => $result) {
        $index = (int)$index;
        if (!isset($order['items'][$index]) || !is_array($result)) {
            continue;
        }
        $order['items'][$index]['status'] = 'sent_to_reseller';
        $order['items'][$index]['reseller_order_id'] = $result['order_id'] ?? ($order['items'][$index]['reseller_order_id'] ?? null);
        $order['items'][$index]['reseller_response'] = $result['response'] ?? ($order['items'][$index]['reseller_response'] ?? null);
    }

    if (!empty($reseller['ok'])) {
        $order['status'] = 'sent_to_reseller';
        $order['reseller_status'] = 'sent';
        $order['hold_released_at'] = fb_now();
        return fb_append_history($order, 'sent_to_reseller', $successMessage);
    }

    if ($sent || $alreadySent) {
        $order['status'] = 'needs_review';
        $order['reseller_status'] = $reseller['reason'] ?? 'partial_reseller_error';
        return fb_append_history($order, 'needs_review', ($reseller['message'] ?? 'Mindestens eine Position konnte nicht gesendet werden.') . ' Bereits gesendete Positionen wurden gespeichert.');
    }

    return $order;
}

function fb_attempt_order_fulfillment(string $orderNumber, bool $skipBalanceCheck = false): ?array
{
    $result = fb_mutate_json_file(fb_orders_file(), function (array $data) use ($orderNumber, $skipBalanceCheck) {
        $orders = isset($data['orders']) && is_array($data['orders']) ? $data['orders'] : [];
        $updated = null;

        foreach ($orders as &$order) {
            if (($order['order_number'] ?? '') !== $orderNumber) {
                continue;
            }
            if (($order['payment_status'] ?? '') !== 'paid') {
                $updated = $order;
                break;
            }

            $reseller = fb_call_reseller_add($order, $skipBalanceCheck);
            if (!empty($reseller['ok'])) {
                $order = fb_apply_reseller_result_to_order($order, $reseller, 'Bezahlte Bestellung wurde automatisch an die Reseller-API übergeben.');
            } elseif (in_array(($reseller['reason'] ?? ''), ['balance_hold', 'cost_hold'], true)) {
                $order['status'] = 'fulfillment_hold';
                $order['payment_status'] = 'paid';
                $order['reseller_status'] = $reseller['reason'] ?? 'hold';
                $order['hold_reason'] = ($reseller['reason'] ?? '') === 'cost_hold' ? 'manual_cost_review' : 'low_reseller_balance';
                $order['hold_started_at'] = $order['hold_started_at'] ?? fb_now();
                $order['last_reseller_balance'] = $reseller['balance'] ?? null;
                $order['min_reseller_balance'] = $reseller['min_balance'] ?? null;
                $order['estimated_reseller_cost'] = $reseller['estimated_cost'] ?? fb_estimated_reseller_cost($order);
                $order['manual_review_threshold'] = $reseller['manual_threshold'] ?? null;
                foreach (($order['items'] ?? []) as $index => $item) {
                    $order['items'][$index]['status'] = 'fulfillment_hold';
                }
                if (empty($order['hold_email_sent_at'])) {
                    $sent = fb_notify_customer_balance_hold($order);
                    $order['hold_email_sent_at'] = $sent ? fb_now() : null;
                }
                if (empty($order['admin_hold_email_sent_at'])) {
                    $adminSent = fb_notify_admin_hold($order, $reseller);
                    $order['admin_hold_email_sent_at'] = $adminSent ? fb_now() : null;
                }
                $message = ($reseller['reason'] ?? '') === 'cost_hold' ? 'Reseller-Kosten über Freigabewert. Auftrag wurde pausiert und nicht gesendet.' : 'Reseller-Balance unter Mindestwert. Auftrag wurde pausiert und nicht gesendet.';
                $order = fb_append_history($order, 'fulfillment_hold', $message);
            } else {
                $order = fb_apply_reseller_result_to_order($order, $reseller, 'Teilweise Reseller-Übergabe gespeichert.');
                if (($order['status'] ?? '') !== 'needs_review') {
                    $order['status'] = 'needs_review';
                    $order['reseller_status'] = $reseller['reason'] ?? 'reseller_error';
                    $order = fb_append_history($order, 'needs_review', ($reseller['message'] ?? 'Reseller-Übergabe fehlgeschlagen.') . ' Auftrag wurde nicht gesendet.');
                }
            }

            $updated = $order;
            break;
        }

        $data['orders'] = $orders;
        return ['data' => $data, 'order' => $updated];
    }, ['orders' => []]);

    return $result['order'] ?? null;
}

function fb_notify_customer_balance_hold(array $order): bool
{
    $email = (string)($order['customer_email'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $item = $order['items'][0] ?? [];
    $firstName = trim((string)($order['customer_first_name'] ?? ''));
    $name = $firstName !== '' ? $firstName : 'du';
    $orderNumber = (string)($order['order_number'] ?? '');
    $product = (string)($item['name'] ?? 'dein Paket');
    $target = (string)($item['target'] ?? '');

    $subject = 'Update zu deiner Bestellung bei FameBoost.de';
    $body = <<<TEXT
Hallo {$name},

vielen Dank fÃƒÂ¼r deine Bestellung bei FameBoost.de.

Deine Zahlung wurde erfolgreich erfasst. Deine Bestellung ist bei uns vorgemerkt und wird innerhalb von 24 Stunden bearbeitet.

Bestelldetails:
Bestellnummer: {$orderNumber}
Produkt: {$product}
Profil/Link: {$target}

Wichtig: Bitte ÃƒÂ¤ndere wÃƒÂ¤hrend der Bearbeitung deinen Profilnamen nicht und stelle sicher, dass dein Profil ÃƒÂ¶ffentlich erreichbar ist.

Bei Fragen kannst du jederzeit ÃƒÂ¼ber unsere Kontaktseite eine Nachricht senden.

Viele GrÃƒÂ¼ÃƒÅ¸e
Dein FameBoost.de Team
TEXT;

    return fb_send_text_mail($email, $subject, $body);
}

function fb_notify_admin_service_unavailable(array $entry, array $status): bool
{
    $config = fb_config();
    $to = (string)($config['admin_email'] ?? 'nevio.vogt@gmail.com');
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $label = (string)($entry['label'] ?? $entry['slug'] ?? 'Produkt');
    $slug = (string)($entry['slug'] ?? '');
    $serviceId = (string)($entry['service_id'] ?? '');
    $serviceName = (string)($entry['service_name'] ?? '');
    $checkedAt = (string)($status['checked_at'] ?? fb_now());

    $subject = 'DRINGEND: FameBoost Reseller-Service fixen';
    $body = <<<TEXT
Ein zugewiesener Reseller-Service ist nicht mehr in der aktuellen Service-Liste verfuegbar.

Dringend fixen:
Produkt: {$label}
Slug: {$slug}
Reseller-Service-ID: {$serviceId}
Gespeicherter Service-Name: {$serviceName}
Geprueft am: {$checkedAt}

Auswirkung:
Das Mapping bleibt gespeichert, aber Kaeufe fuer dieses Produkt werden blockiert, bis ein verfuegbarer Service im Admin-Panel zugewiesen wurde.

Aktion:
Oeffne /admin/, suche einen passenden verfuegbaren Reseller-Service und weise ihn dem Produkt neu zu.
TEXT;

    return fb_send_text_mail($to, $subject, $body);
}

function fb_notify_admin_hold(array $order, array $hold): bool
{
    $config = fb_config();
    $to = (string)($config['admin_email'] ?? 'nevio.vogt@gmail.com');
    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $item = $order['items'][0] ?? [];
    $orderNumber = (string)($order['order_number'] ?? '');
    $customer = trim((string)($order['customer_first_name'] ?? '') . ' ' . (string)($order['customer_last_name'] ?? ''));
    $customerEmail = (string)($order['customer_email'] ?? '');
    $product = (string)($item['name'] ?? '');
    $target = (string)($item['target'] ?? '');
    $quantity = (int)($item['quantity'] ?? 0);
    $paid = fb_money((int)($order['amount_total_cents'] ?? 0));
    $cost = $hold['estimated_cost'] ?? fb_estimated_reseller_cost($order);
    $costText = $cost === null ? 'nicht berechenbar' : fb_money_float((float)$cost, (string)($hold['balance']['currency'] ?? ''));
    $threshold = $hold['manual_threshold'] ?? ($config['reseller_manual_review_threshold'] ?? 5.0);
    $balance = $hold['balance']['balance'] ?? null;
    $balanceCurrency = (string)($hold['balance']['currency'] ?? '');
    $balanceText = is_numeric($balance) ? fb_money_float((float)$balance, $balanceCurrency) : 'nicht verfÃƒÂ¼gbar';
    $reason = (string)($hold['reason'] ?? 'hold');

    $subject = 'FameBoost Hold: ' . $orderNumber;
    $body = <<<TEXT
Eine Bestellung wurde auf Hold gesetzt und nicht automatisch an den Reseller gesendet.

Grund: {$reason}
Interne Order-ID: {$orderNumber}

Kunde:
Name: {$customer}
E-Mail: {$customerEmail}

Bestellung:
Produkt: {$product}
Menge: {$quantity}
Profil/Link: {$target}
Kunde bezahlt: {$paid}

Reseller:
Service-ID: {$item['reseller_service_id']}
Service-Name: {$item['reseller_service_name']}
Rate pro 1000: {$item['reseller_rate']}
GeschÃƒÂ¤tzte Reseller-Kosten: {$costText}
Manueller Freigabewert: {$threshold}
Letzte Reseller-Balance: {$balanceText}

Aktion:
Balance/Bestellung prÃƒÂ¼fen und danach im Admin freigeben.
TEXT;

    return fb_send_text_mail($to, $subject, $body);
}
