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
        fb_json_response(['ok' => false, 'message' => 'Zu viele Anfragen. Bitte versuche es später erneut.'], 429);
    }
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
        throw new RuntimeException('Storage konnte nicht geöffnet werden.');
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
        throw new RuntimeException('Storage konnte nicht geöffnet werden.');
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
    $paymentDone = ($order['payment_status'] ?? '') === 'paid' || in_array($order['status'], ['paid', 'fulfillment_hold', 'sent_to_reseller', 'in_progress', 'completed'], true);
    $steps = [
        ['key' => 'created', 'label' => 'Bestellung vorbereitet', 'state' => 'done'],
        ['key' => 'payment', 'label' => 'Zahlung über Stripe', 'state' => $paymentDone ? 'done' : 'active'],
        ['key' => 'review', 'label' => 'Prüfung und Zuordnung', 'state' => in_array($order['status'], ['needs_review', 'manual_payment_check'], true) ? 'active' : (in_array($order['status'], ['pending_external_payment', 'payment_link_opened'], true) ? 'pending' : 'done')],
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
        'currency' => $order['currency'] ?? 'eur',
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
        'manual_payment_check' => 'Zahlung wird geprüft',
        'payment_failed' => 'Zahlung fehlgeschlagen',
        'paid' => 'Zahlung bestätigt',
        'fulfillment_queued' => 'Bearbeitung vorbereitet',
        'fulfillment_hold' => 'Wartet auf Freigabe',
        'sent_to_reseller' => 'An Anbieter übergeben',
        'in_progress' => 'Bearbeitung läuft',
        'partially_completed' => 'Teilweise abgeschlossen',
        'completed' => 'Abgeschlossen',
        'refill_requested' => 'Refill angefragt',
        'needs_review' => 'Manuelle Prüfung',
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
        'pending_external_payment' => 'Deine Bestellung wurde vorbereitet. Schließe die Zahlung auf der sicheren Stripe-Seite ab.',
        'payment_link_opened' => 'Du wurdest zu Stripe weitergeleitet. Nach der Zahlung wird die Bestellung geprüft.',
        'manual_payment_check' => 'Wir prüfen die Zahlung und ordnen die Bestellung zu.',
        'payment_failed' => 'Die Zahlung wurde nicht bestätigt. Bitte starte den Kauf erneut oder kontaktiere den Support.',
        'paid' => 'Die Zahlung wurde bestätigt. Die Bearbeitung kann vorbereitet werden.',
        'fulfillment_queued' => 'Dein Auftrag wartet auf die Übergabe an den Anbieter.',
        'fulfillment_hold' => 'Deine Bestellung ist bezahlt und vorgemerkt. Die Bearbeitung wird innerhalb von 24 Stunden freigegeben.',
        'sent_to_reseller' => 'Der Auftrag wurde an den Anbieter übergeben.',
        'in_progress' => 'Die Bearbeitung läuft. Bitte ändere den Profilnamen nicht.',
        'partially_completed' => 'Der Auftrag ist teilweise abgeschlossen und wird geprüft.',
        'completed' => 'Der Auftrag wurde abgeschlossen. Danke für deine Bestellung.',
        'refill_requested' => 'Eine Refill-Prüfung wurde vorgemerkt.',
        'needs_review' => 'Die Bestellung benötigt eine manuelle Prüfung.',
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
    return number_format($cents / 100, 2, ',', '.') . ' €';
}

function fb_money_float(float $amount, string $currency = ''): string
{
    $suffix = $currency !== '' ? ' ' . strtoupper($currency) : '';
    return number_format($amount, 4, ',', '.') . $suffix;
}

function fb_estimated_reseller_cost(array $order): ?float
{
    $item = $order['items'][0] ?? [];
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
        throw new InvalidArgumentException('Bitte gib einen gültigen Profilnamen oder Link ein.');
    }
    if (preg_match('/[\r\n]/', $target)) {
        throw new InvalidArgumentException('Der Profilname oder Link enthält ungültige Zeichen.');
    }
    return $target;
}

function fb_catalog_item(string $slug, int $quantity): array
{
    $catalog = fb_catalog();
    if (!isset($catalog[$slug])) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell nicht verfügbar.');
    }
    $limits = fb_reseller_quantity_limits($slug);
    if (($limits['max'] ?? null) !== null && $quantity > (int)$limits['max']) {
        throw new InvalidArgumentException('Die gewählte Menge ist für dieses Produkt aktuell zu hoch. Maximal möglich sind ' . number_format((int)$limits['max'], 0, ',', '.') . '.');
    }
    if (!isset($catalog[$slug]['items'][$quantity])) {
        throw new InvalidArgumentException('Für diese Menge ist noch kein Stripe Payment Link hinterlegt.');
    }
    $item = $catalog[$slug]['items'][$quantity];
    $mapping = fb_reseller_service_mapping($slug, $quantity);
    if (!$mapping || empty($mapping['service_id'])) {
        throw new InvalidArgumentException('Dieses Produkt ist aktuell noch nicht kaufbar, weil im Admin kein Reseller-Service zugewiesen ist.');
    }
    if ($mapping && !empty($mapping['service_id'])) {
        $healthStatus = fb_mapping_health_status($slug, $quantity, $mapping);
        if ($healthStatus && ($healthStatus['available'] ?? true) === false) {
            throw new InvalidArgumentException('Dieses Produkt ist aktuell kurzzeitig nicht verfügbar. Bitte wähle später erneut oder kontaktiere den Support.');
        }
        $item['reseller_service_id'] = (string)$mapping['service_id'];
        $item['reseller_service_name'] = $mapping['service_name'] ?? null;
        $item['reseller_service_category'] = $mapping['category'] ?? null;
        $item['reseller_rate'] = $mapping['rate'] ?? null;
        $item['reseller_min'] = $mapping['min'] ?? null;
        $item['reseller_max'] = $mapping['max'] ?? null;
    }
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
            $currency = strtolower((string)($session['currency'] ?? 'eur'));
            $expected = (int)($order['amount_total_cents'] ?? 0);
            $paymentStatus = (string)($session['payment_status'] ?? '');

            $order['stripe_checkout_session_id'] = $session['id'] ?? null;
            $order['stripe_payment_intent_id'] = $session['payment_intent'] ?? null;
            $order['stripe_payment_status'] = $paymentStatus;
            $order['stripe_customer_email'] = $session['customer_details']['email'] ?? ($session['customer_email'] ?? null);

            if ($amountTotal !== null && $amountTotal !== $expected) {
                $order['status'] = 'needs_review';
                $order['payment_status'] = 'amount_mismatch';
                $order = fb_append_history($order, 'needs_review', 'Stripe-Zahlbetrag weicht vom erwarteten Betrag ab.');
            } elseif ($currency !== strtolower((string)($order['currency'] ?? 'eur'))) {
                $order['status'] = 'needs_review';
                $order['payment_status'] = 'currency_mismatch';
                $order = fb_append_history($order, 'needs_review', 'Stripe-Währung weicht von der Bestellung ab.');
            } elseif ($eventType === 'checkout.session.completed' && $paymentStatus === 'paid') {
                $order['status'] = 'paid';
                $order['payment_status'] = 'paid';
                $order['paid_at'] = fb_now();
                $order = fb_append_history($order, 'paid', 'Stripe Webhook hat die Zahlung bestätigt.');
            } elseif ($eventType === 'checkout.session.async_payment_succeeded') {
                $order['status'] = 'paid';
                $order['payment_status'] = 'paid';
                $order['paid_at'] = fb_now();
                $order = fb_append_history($order, 'paid', 'Asynchrone Stripe-Zahlung wurde bestätigt.');
            } elseif ($eventType === 'checkout.session.async_payment_failed') {
                $order['status'] = 'payment_failed';
                $order['payment_status'] = 'failed';
                $order = fb_append_history($order, 'payment_failed', 'Asynchrone Stripe-Zahlung ist fehlgeschlagen.');
            } else {
                $order['status'] = 'manual_payment_check';
                $order['payment_status'] = $paymentStatus ?: 'manual_payment_check';
                $order = fb_append_history($order, 'manual_payment_check', 'Stripe Webhook erhalten, Zahlung aber noch nicht final bestätigt.');
            }

            $updated = $order;
            break;
        }
        $data['orders'] = $orders;
        return ['data' => $data, 'order' => $updated];
    }, ['orders' => []]);

    return $result['order'] ?? null;
}

function fb_call_reseller_add(array $order, bool $skipBalanceCheck = false): array
{
    $config = fb_config();
    $item = $order['items'][0] ?? [];
    $apiKey = (string)($config['reseller_api_key'] ?? '');
    $apiUrl = (string)($config['reseller_api_url'] ?? 'https://justanotherpanel.com/api/v2');
    $serviceId = (string)($item['reseller_service_id'] ?? '');
    $minBalance = (float)($config['reseller_min_balance'] ?? 20.0);
    $manualThreshold = (float)($config['reseller_manual_review_threshold'] ?? 5.0);

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
            ];
        }

        $estimatedCost = fb_estimated_reseller_cost($order);
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

vielen Dank für deine Bestellung bei FameBoost.de.

Deine Zahlung wurde erfolgreich erfasst. Deine Bestellung ist bei uns vorgemerkt und wird innerhalb von 24 Stunden bearbeitet.

Bestelldetails:
Bestellnummer: {$orderNumber}
Produkt: {$product}
Profil/Link: {$target}

Wichtig: Bitte ändere während der Bearbeitung deinen Profilnamen nicht und stelle sicher, dass dein Profil öffentlich erreichbar ist.

Bei Fragen kannst du jederzeit über unsere Kontaktseite eine Nachricht senden.

Viele Grüße
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
    $balanceText = is_numeric($balance) ? fb_money_float((float)$balance, $balanceCurrency) : 'nicht verfügbar';
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
Geschätzte Reseller-Kosten: {$costText}
Manueller Freigabewert: {$threshold}
Letzte Reseller-Balance: {$balanceText}

Aktion:
Balance/Bestellung prüfen und danach im Admin freigeben.
TEXT;

    return fb_send_text_mail($to, $subject, $body);
}
