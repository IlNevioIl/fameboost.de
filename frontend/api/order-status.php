<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_rate_limit('order_status', 90, 300);

$orderNumber = (string)($_GET['order'] ?? '');
$token = (string)($_GET['token'] ?? '');

if ($orderNumber === '' || $token === '') {
    fb_json_response(['ok' => false, 'message' => 'Bestellung nicht gefunden.'], 400);
}
if (!preg_match('/^FB-\d{8}-\d{5}$/', $orderNumber) || !preg_match('/^[a-f0-9]{32}$/', $token)) {
    fb_json_response(['ok' => false, 'message' => 'Bestellung nicht gefunden.'], 404);
}

$order = fb_find_order($orderNumber);
if (!$order || !hash_equals($order['public_token_hash'] ?? '', fb_hash_token($token))) {
    fb_json_response(['ok' => false, 'message' => 'Bestellung nicht gefunden.'], 404);
}

fb_json_response(['ok' => true, 'order' => fb_public_order($order)]);
