<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    $input = fb_read_input();
    $orderNumber = (string)($input['order_number'] ?? '');
    $action = (string)($input['action'] ?? '');
    if ($orderNumber === '' || $action === '') {
        throw new InvalidArgumentException('Order und Aktion fehlen.');
    }

    $result = fb_mutate_json_file(fb_orders_file(), function (array $data) use ($orderNumber, $action, $input) {
        $orders = $data['orders'] ?? [];
        $found = false;

        foreach ($orders as &$order) {
            if (($order['order_number'] ?? '') !== $orderNumber) {
                continue;
            }
            $found = true;
            $item = $order['items'][0] ?? [];

            if ($action === 'set_status') {
                $status = (string)($input['status'] ?? '');
                if ($status === '') {
                    throw new InvalidArgumentException('Status fehlt.');
                }
                $order['status'] = $status;
                $order['payment_status'] = in_array($status, ['paid', 'fulfillment_queued', 'fulfillment_hold', 'sent_to_reseller', 'in_progress', 'completed'], true) ? 'paid' : ($order['payment_status'] ?? 'pending_external_payment');
                $order = fb_append_history($order, $status, 'Status manuell im Admin geÃ¤ndert.');
            } elseif ($action === 'save_counts') {
                $baseline = $input['baseline_count'] ?? null;
                $completed = $input['completed_count'] ?? null;
                $order['items'][0]['baseline_count'] = is_numeric($baseline) ? (int)$baseline : null;
                $order['items'][0]['completed_count'] = is_numeric($completed) ? (int)$completed : null;
                if (is_numeric($baseline) && is_numeric($completed) && isset($item['quantity'])) {
                    $expected = (int)$baseline + (int)$item['quantity'];
                    $order['items'][0]['lost_count'] = max(0, $expected - (int)$completed);
                }
                $order = fb_append_history($order, $order['status'], 'ZÃ¤hlerstÃ¤nde im Admin gespeichert.');
            } elseif ($action === 'request_refill') {
                $order['status'] = 'refill_requested';
                $order['items'][0]['refill_requested_at'] = fb_now();
                $order = fb_append_history($order, 'refill_requested', 'Refill-PrÃ¼fung im Admin vorgemerkt.');
            } elseif ($action === 'send_reseller' || $action === 'release_hold') {
                $reseller = fb_call_reseller_add($order, $action === 'release_hold');
                if (!empty($reseller['ok'])) {
                    $order = fb_apply_reseller_result_to_order($order, $reseller, 'Auftrag wurde an die Reseller-API übergeben.');
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
                    foreach (($order['items'] ?? []) as $index => $lineItem) {
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
            } elseif ($action === 'poll_reseller') {
                $reseller = fb_call_reseller_status($order);
                if (!empty($reseller['ok'])) {
                    $mappedStatus = (string)($reseller['mapped_status'] ?? 'sent_to_reseller');
                    $order['status'] = $mappedStatus;
                    $order['reseller_status'] = $reseller['status'] ?? $mappedStatus;
                    $order['items'][0]['reseller_status_response'] = $reseller['response'] ?? null;
                    $order['items'][0]['reseller_start_count'] = $reseller['start_count'] ?? null;
                    $order['items'][0]['reseller_remains'] = $reseller['remains'] ?? null;
                    if (is_numeric($reseller['start_count'] ?? null)) {
                        $order['items'][0]['baseline_count'] = (int)$reseller['start_count'];
                    }
                    if ($mappedStatus === 'completed' && is_numeric($item['quantity'] ?? null) && is_numeric($reseller['remains'] ?? null)) {
                        $order['items'][0]['completed_count'] = (int)($order['items'][0]['baseline_count'] ?? 0) + max(0, (int)$item['quantity'] - (int)$reseller['remains']);
                    }
                    $order = fb_append_history($order, $mappedStatus, 'Reseller-Status wurde abgefragt: ' . ($reseller['status'] ?? 'unbekannt') . '.');
                } else {
                    $order['reseller_status'] = $reseller['reason'] ?? 'reseller_status_error';
                    $order = fb_append_history($order, $order['status'], ($reseller['message'] ?? 'Reseller-Status konnte nicht abgefragt werden.'));
                }
            } else {
                throw new InvalidArgumentException('Unbekannte Aktion.');
            }
            break;
        }

        if (!$found) {
            throw new InvalidArgumentException('Bestellung nicht gefunden.');
        }

        $data['orders'] = $orders;
        return ['data' => $data];
    }, ['orders' => []]);

    fb_json_response(['ok' => true, 'message' => 'Aktion gespeichert.']);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    fb_json_response(['ok' => false, 'message' => 'Aktion konnte nicht gespeichert werden.'], 500);
}
