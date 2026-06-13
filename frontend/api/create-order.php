<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

try {
    fb_rate_limit('create_order', 20, 900);

    $input = fb_read_input();
    $itemsInput = $input['items'] ?? [];
    if (is_array($itemsInput) && isset($itemsInput['slug'])) {
        $itemsInput = [$itemsInput];
    }
    if (!is_array($itemsInput) || count($itemsInput) < 1) {
        throw new InvalidArgumentException('Dein Warenkorb ist leer.');
    }
    if (count($itemsInput) > 20) {
        throw new InvalidArgumentException('Bitte bestelle maximal 20 Positionen auf einmal.');
    }

    $email = trim((string)($input['email'] ?? $input['customer_email'] ?? ''));
    $firstName = trim((string)($input['firstName'] ?? $input['first_name'] ?? ''));
    $lastName = trim((string)($input['lastName'] ?? $input['last_name'] ?? ''));
    $address = trim((string)($input['address'] ?? ''));
    $couponCode = trim((string)($input['coupon_code'] ?? $input['coupon'] ?? ''));
    $paymentMethod = trim((string)($input['payment_method'] ?? 'all'));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Bitte gib eine gültige E-Mail-Adresse ein.');
    }

    $orderItems = [];
    $amountTotal = 0;

    foreach ($itemsInput as $index => $itemInput) {
        if (!is_array($itemInput)) {
            throw new InvalidArgumentException('Ein Warenkorb-Artikel ist ungültig.');
        }
        $slug = (string)($itemInput['slug'] ?? $itemInput['product_slug'] ?? '');
        $quantity = (int)($itemInput['quantity'] ?? 0);
        $speed = fb_speed_option((string)($itemInput['speed'] ?? 'standard'));

        [$product, $catalogItem] = fb_catalog_item($slug, $quantity);
        $target = fb_validate_target_for_product((string)$product['platform'], (string)$product['type'], (string)($itemInput['profile'] ?? $itemInput['target'] ?? ''));
        $itemPrice = (int)$catalogItem['price_cents'] + (int)$speed['price_cents'];
        if ($itemPrice <= 0) {
            throw new InvalidArgumentException('Der Preis für ein Produkt konnte nicht berechnet werden.');
        }

        $amountTotal += $itemPrice;
        $orderItems[] = [
            'slug' => $slug,
            'name' => $catalogItem['name'],
            'platform' => $product['platform'],
            'type' => $product['type'],
            'quantity' => $quantity,
            'custom_quantity' => !empty($catalogItem['custom_quantity']),
            'price_tier_quantity' => $catalogItem['price_tier_quantity'] ?? null,
            'target' => $target,
            'target_url' => fb_target_url((string)$product['platform'], $target),
            'speed' => $speed['key'],
            'speed_label' => $speed['label'],
            'speed_price_cents' => $speed['price_cents'],
            'refill' => 'Ohne Refill',
            'price_cents' => $itemPrice,
            'base_price_cents' => (int)$catalogItem['price_cents'],
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
        ];
    }

    $promotionCode = null;
    if ($couponCode !== '') {
        fb_rate_limit_coupon_attempt();
        $couponCode = fb_validate_coupon_code_input($couponCode);
        if (empty(fb_config()['stripe_promotion_codes_enabled'])) {
            throw new InvalidArgumentException('Rabattcodes sind aktuell nicht verfügbar.');
        }
        $promotionCode = fb_stripe_find_promotion_code($couponCode);
        if (!$promotionCode) {
            throw new InvalidArgumentException('Dieser Rabattcode ist ungültig oder nicht mehr aktiv.');
        }
    }

    $token = fb_random_token();
    $orderShell = fb_mutate_json_file(fb_orders_file(), function (array $data) use ($orderItems, $amountTotal, $email, $firstName, $lastName, $address, $couponCode, $token) {
        $orders = isset($data['orders']) && is_array($data['orders']) ? $data['orders'] : [];
        $orderNumber = fb_generate_order_number($orders);
        $now = fb_now();

        $order = [
            'order_number' => $orderNumber,
            'public_token_hash' => fb_hash_token($token),
            'customer_email' => $email,
            'customer_first_name' => $firstName,
            'customer_last_name' => $lastName,
            'customer_address' => $address,
            'currency' => 'eur',
            'amount_total_cents' => $amountTotal,
            'amount_subtotal_cents' => $amountTotal,
            'amount_paid_cents' => null,
            'coupon_code' => $couponCode !== '' ? $couponCode : null,
            'status' => 'pending_external_payment',
            'payment_status' => 'pending_external_payment',
            'reseller_status' => 'not_started',
            'created_at' => $now,
            'updated_at' => $now,
            'history' => [
                ['status' => 'pending_external_payment', 'message' => 'Bestellung intern erstellt und Stripe Checkout vorbereitet.', 'created_at' => $now],
            ],
            'items' => $orderItems,
        ];

        array_unshift($orders, $order);
        $data['orders'] = $orders;

        return ['data' => $data, 'order' => $order];
    }, ['orders' => []]);

    $order = $orderShell['order'];
    $session = fb_create_stripe_checkout_session($order, $promotionCode, $paymentMethod);

    fb_mutate_json_file(fb_orders_file(), function (array $data) use ($order, $session, $promotionCode) {
        $orders = isset($data['orders']) && is_array($data['orders']) ? $data['orders'] : [];
        foreach ($orders as &$storedOrder) {
            if (($storedOrder['order_number'] ?? '') !== $order['order_number']) {
                continue;
            }
            $storedOrder['stripe_checkout_session_id'] = $session['id'];
            $storedOrder['stripe_checkout_url'] = $session['url'];
            $storedOrder['stripe_payment_status'] = $session['payment_status'] ?? null;
            if ($promotionCode) {
                $storedOrder['stripe_promotion_code_id'] = $promotionCode['id'] ?? null;
                $storedOrder['stripe_coupon_id'] = $promotionCode['coupon']['id'] ?? null;
            }
            $storedOrder = fb_append_history($storedOrder, 'pending_external_payment', 'Stripe Checkout Session wurde erstellt.');
            break;
        }
        $data['orders'] = $orders;
        return ['data' => $data];
    }, ['orders' => []]);

    fb_json_response([
        'ok' => true,
        'order_number' => $order['order_number'],
        'public_token' => $token,
        'status_url' => '/bestellung-erfolgreich/',
        'redirect_url' => $session['url'],
        'message' => 'Bestellung vorbereitet. Du wirst zu Stripe weitergeleitet.',
    ]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('create-order failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Die Bestellung konnte nicht erstellt werden.'], 500);
}
