<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

try {
    $input = fb_read_input();
    $items = $input['items'] ?? [];
    if (is_array($items) && isset($items['slug'])) {
        $items = [$items];
    }
    if (!is_array($items) || count($items) !== 1) {
        throw new InvalidArgumentException('Bitte kaufe aktuell genau ein Produkt pro Zahlung. Mehrere Produkte bitte nacheinander bestellen.');
    }

    $itemInput = $items[0];
    $slug = (string)($itemInput['slug'] ?? $itemInput['product_slug'] ?? '');
    $quantity = (int)($itemInput['quantity'] ?? 0);
    $target = fb_validate_target((string)($itemInput['profile'] ?? $itemInput['target'] ?? ''));
    $email = trim((string)($input['email'] ?? $input['customer_email'] ?? ''));
    $firstName = trim((string)($input['firstName'] ?? $input['first_name'] ?? ''));
    $lastName = trim((string)($input['lastName'] ?? $input['last_name'] ?? ''));
    $speed = (string)($itemInput['speed'] ?? 'Standard');
    $refill = (string)($itemInput['refill'] ?? 'Ohne Refill');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Bitte gib eine gÃ¼ltige E-Mail-Adresse ein.');
    }
    if ($speed !== 'Standard' || $refill !== 'Ohne Refill') {
        throw new InvalidArgumentException('Diese Zusatzoptionen sind aktuell noch nicht verfügbar. Bitte bestelle das Paket ohne Zusatzoptionen.');
    }

    [$product, $catalogItem] = fb_catalog_item($slug, $quantity);
    $token = fb_random_token();

    $result = fb_mutate_json_file(fb_orders_file(), function (array $data) use ($product, $catalogItem, $slug, $quantity, $target, $email, $firstName, $lastName, $speed, $refill, $token) {
        $orders = isset($data['orders']) && is_array($data['orders']) ? $data['orders'] : [];
        $orderNumber = fb_generate_order_number($orders);
        $now = fb_now();

        $order = [
            'order_number' => $orderNumber,
            'public_token_hash' => fb_hash_token($token),
            'customer_email' => $email,
            'customer_first_name' => $firstName,
            'customer_last_name' => $lastName,
            'currency' => 'eur',
            'amount_total_cents' => $catalogItem['price_cents'],
            'status' => 'pending_external_payment',
            'payment_status' => 'pending_external_payment',
            'reseller_status' => 'not_started',
            'stripe_payment_link_id' => $catalogItem['payment_link_id'],
            'stripe_payment_link_url' => $catalogItem['payment_url'],
            'created_at' => $now,
            'updated_at' => $now,
            'history' => [
                ['status' => 'pending_external_payment', 'message' => 'Bestellung intern erstellt und Stripe Payment Link vorbereitet.', 'created_at' => $now],
            ],
            'items' => [[
                'slug' => $slug,
                'name' => $catalogItem['name'],
                'platform' => $product['platform'],
                'type' => $product['type'],
                'quantity' => $quantity,
                'target' => $target,
                'target_url' => fb_target_url($product['platform'], $target),
                'speed' => $speed,
                'refill' => $refill,
                'price_cents' => $catalogItem['price_cents'],
                'reseller_service_id' => $catalogItem['reseller_service_id'] ?? null,
                'reseller_service_name' => $catalogItem['reseller_service_name'] ?? null,
                'reseller_service_category' => $catalogItem['reseller_service_category'] ?? null,
                'reseller_rate' => $catalogItem['reseller_rate'] ?? null,
                'reseller_min' => $catalogItem['reseller_min'] ?? null,
                'reseller_max' => $catalogItem['reseller_max'] ?? null,
                'reseller_order_id' => null,
                'baseline_count' => null,
                'completed_count' => null,
                'lost_count' => null,
                'status' => 'pending_external_payment',
            ]],
        ];

        array_unshift($orders, $order);
        $data['orders'] = $orders;

        return ['data' => $data, 'order' => $order];
    }, ['orders' => []]);

    $order = $result['order'];
    fb_json_response([
        'ok' => true,
        'order_number' => $order['order_number'],
        'public_token' => $token,
        'status_url' => '/bestellung-erfolgreich/',
        'redirect_url' => fb_payment_link_with_reference($order['stripe_payment_link_url'], $order['order_number']),
        'message' => 'Bestellung vorbereitet. Du wirst zu Stripe weitergeleitet.',
    ]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('create-order failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Die Bestellung konnte nicht erstellt werden.'], 500);
}
