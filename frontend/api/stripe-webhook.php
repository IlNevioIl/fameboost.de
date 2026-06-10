<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

$config = fb_config();
$secret = (string)($config['stripe_webhook_secret'] ?? '');
$payload = file_get_contents('php://input') ?: '';
$signature = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if ($secret === '') {
    fb_json_response(['ok' => false, 'message' => 'Stripe Webhook Secret ist nicht konfiguriert.'], 500);
}

if (!fb_verify_stripe_signature($payload, $signature, $secret)) {
    fb_json_response(['ok' => false, 'message' => 'Ungültige Stripe Signatur.'], 400);
}

$event = json_decode($payload, true);
if (!is_array($event) || empty($event['id']) || empty($event['type'])) {
    fb_json_response(['ok' => false, 'message' => 'Ungültiges Stripe Event.'], 400);
}

if (fb_stripe_event_seen((string)$event['id'])) {
    fb_json_response(['ok' => true, 'message' => 'Event wurde bereits verarbeitet.']);
}

try {
    fb_mark_stripe_event($event, 'received');

    $type = (string)$event['type'];
    $object = $event['data']['object'] ?? [];
    $handled = false;

    if (in_array($type, ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.async_payment_failed'], true) && is_array($object)) {
        $order = fb_update_order_from_stripe_session($object, $type);
        $handled = $order !== null;
    }

    fb_mark_stripe_event($event, 'processed');
    fb_json_response([
        'ok' => true,
        'handled' => $handled,
        'event_type' => $type,
    ]);
} catch (Throwable $error) {
    fb_mark_stripe_event($event, 'failed', $error->getMessage());
    error_log('stripe-webhook failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Webhook konnte nicht verarbeitet werden.'], 500);
}
