<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

$config = fb_config();
$rawOrders = fb_orders();
$holdCount = count(array_filter($rawOrders, fn(array $order): bool => ($order['status'] ?? '') === 'fulfillment_hold'));
usort($rawOrders, function (array $a, array $b): int {
    $rank = function (array $order): int {
        if (($order['priority'] ?? '') === 'priority_booked' || (($order['status'] ?? '') === 'fulfillment_hold' && ($order['hold_reason'] ?? '') === 'manual_approval_required')) {
            return 0;
        }
        if (($order['status'] ?? '') === 'fulfillment_hold') {
            return 1;
        }
        if (in_array(($order['status'] ?? ''), ['needs_review', 'manual_payment_check'], true)) {
            return 2;
        }
        return 3;
    };
    $rankCompare = $rank($a) <=> $rank($b);
    if ($rankCompare !== 0) {
        return $rankCompare;
    }
    return strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? ''));
});
$balance = fb_load_json_file(fb_data_path('reseller_balance.json'), []);
$liveBalance = fb_call_reseller_balance();
if (!empty($liveBalance['ok'])) {
    $balance = fb_load_json_file(fb_data_path('reseller_balance.json'), []);
} elseif (!$balance) {
    $balance = [
        'ok' => false,
        'message' => $liveBalance['message'] ?? 'Reseller-Balance konnte nicht geladen werden.',
        'checked_at' => fb_now(),
    ];
}

$orders = array_map(function (array $order): array {
    $public = fb_public_order($order);
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
            'speed_label' => $entry['speed_label'] ?? ($entry['speed'] ?? 'Standard'),
            'speed_price_cents' => $entry['speed_price_cents'] ?? 0,
            'price_cents' => $entry['price_cents'] ?? 0,
            'reseller_service_id' => $entry['reseller_service_id'] ?? null,
            'reseller_service_name' => $entry['reseller_service_name'] ?? null,
            'reseller_rate' => $entry['reseller_rate'] ?? null,
            'estimated_reseller_cost' => fb_estimated_reseller_item_cost($entry),
            'reseller_order_id' => $entry['reseller_order_id'] ?? null,
            'status' => $entry['status'] ?? ($order['status'] ?? ''),
            'baseline_count' => $entry['baseline_count'] ?? null,
            'completed_count' => $entry['completed_count'] ?? null,
            'lost_count' => $entry['lost_count'] ?? null,
            'reseller_remains' => $entry['reseller_remains'] ?? null,
        ];
    }, isset($order['items']) && is_array($order['items']) ? $order['items'] : []);
    return $public + [
        'customer_email' => $order['customer_email'] ?? '',
        'customer_name' => trim(($order['customer_first_name'] ?? '') . ' ' . ($order['customer_last_name'] ?? '')),
        'payment_link_id' => $order['stripe_payment_link_id'] ?? '',
        'payment_link_url' => $order['stripe_payment_link_url'] ?? '',
        'stripe_checkout_session_id' => $order['stripe_checkout_session_id'] ?? '',
        'stripe_checkout_url' => $order['stripe_checkout_url'] ?? '',
        'items' => $items,
        'baseline_count' => $item['baseline_count'] ?? null,
        'completed_count' => $item['completed_count'] ?? null,
        'lost_count' => $item['lost_count'] ?? null,
        'reseller_status' => $order['reseller_status'] ?? '',
        'reseller_service_id' => $item['reseller_service_id'] ?? null,
        'reseller_service_name' => $item['reseller_service_name'] ?? null,
        'reseller_rate' => $item['reseller_rate'] ?? null,
        'reseller_order_id' => $item['reseller_order_id'] ?? null,
        'reseller_start_count' => $item['reseller_start_count'] ?? null,
        'reseller_remains' => $item['reseller_remains'] ?? null,
        'hold_reason' => $order['hold_reason'] ?? '',
        'priority' => $order['priority'] ?? '',
        'priority_label' => $order['priority_label'] ?? '',
        'hold_started_at' => $order['hold_started_at'] ?? null,
        'hold_email_sent_at' => $order['hold_email_sent_at'] ?? null,
        'last_reseller_balance' => $order['last_reseller_balance'] ?? null,
        'min_reseller_balance' => $order['min_reseller_balance'] ?? null,
        'estimated_reseller_cost' => $order['estimated_reseller_cost'] ?? fb_estimated_reseller_cost($order),
        'manual_review_threshold' => $order['manual_review_threshold'] ?? ($config['reseller_manual_review_threshold'] ?? 5.0),
        'admin_hold_email_sent_at' => $order['admin_hold_email_sent_at'] ?? null,
        'history' => $order['history'] ?? [],
    ];
}, $rawOrders);

fb_json_response([
    'ok' => true,
    'notice' => $config['admin_notice'] ?? '',
    'hold_count' => $holdCount,
    'min_reseller_balance' => (float)($config['reseller_min_balance'] ?? 20.0),
    'manual_review_threshold' => (float)($config['reseller_manual_review_threshold'] ?? 5.0),
    'last_reseller_balance' => $balance,
    'orders' => $orders,
]);
