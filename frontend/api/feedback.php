<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_rate_limit('feedback', 20, 300);

try {
    $input = fb_read_input();
    $orderNumber = (string)($input['order_number'] ?? '');
    $token = (string)($input['token'] ?? '');
    $rating = (int)($input['rating'] ?? 0);
    $message = trim((string)($input['message'] ?? ''));

    if (!preg_match('/^FB-\d{8}-\d{5}$/', $orderNumber) || !preg_match('/^[a-f0-9]{32}$/', $token)) {
        throw new InvalidArgumentException('Bestellung nicht gefunden.');
    }

    if ($rating < 1 || $rating > 5) {
        throw new InvalidArgumentException('Bitte wähle eine Bewertung zwischen 1 und 5 Sternen.');
    }
    if (strlen($message) > 1000) {
        throw new InvalidArgumentException('Die Bewertung ist zu lang.');
    }

    $order = fb_find_order($orderNumber);
    if (!$order || !hash_equals($order['public_token_hash'] ?? '', fb_hash_token($token))) {
        throw new InvalidArgumentException('Bestellung nicht gefunden.');
    }
    if (!empty($order['feedback_submitted'])) {
        throw new InvalidArgumentException('Feedback wurde für diese Bestellung bereits gespeichert.');
    }

    fb_mutate_json_file(fb_feedback_file(), function (array $data) use ($orderNumber, $rating, $message) {
        $data['feedback'] = $data['feedback'] ?? [];
        $data['feedback'][] = [
            'order_number' => $orderNumber,
            'rating' => $rating,
            'message' => $message,
            'created_at' => fb_now(),
            'approved_public' => false,
        ];
        return ['data' => $data];
    }, ['feedback' => []]);

    fb_mutate_json_file(fb_orders_file(), function (array $data) use ($orderNumber) {
        foreach ($data['orders'] as &$order) {
            if (($order['order_number'] ?? '') === $orderNumber) {
                $order['feedback_submitted'] = true;
                $order = fb_append_history($order, $order['status'], 'Kundenfeedback wurde abgegeben.');
                break;
            }
        }
        return ['data' => $data];
    }, ['orders' => []]);

    fb_json_response(['ok' => true, 'message' => 'Danke für dein Feedback.']);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    fb_json_response(['ok' => false, 'message' => 'Feedback konnte nicht gespeichert werden.'], 500);
}
