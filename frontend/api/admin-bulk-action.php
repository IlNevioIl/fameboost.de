<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    $input = fb_read_input();
    $action = (string)($input['action'] ?? '');
    if ($action !== 'release_holds') {
        throw new InvalidArgumentException('Unbekannte Bulk-Aktion.');
    }

    $stats = ['checked' => 0, 'sent' => 0, 'still_on_hold' => 0, 'failed' => 0];

    fb_mutate_json_file(fb_orders_file(), function (array $data) use (&$stats) {
        $orders = $data['orders'] ?? [];

        foreach ($orders as &$order) {
            if (($order['status'] ?? '') !== 'fulfillment_hold') {
                continue;
            }

            $stats['checked']++;
            $reseller = fb_call_reseller_add($order);

            if (!empty($reseller['ok'])) {
                $order = fb_apply_reseller_result_to_order($order, $reseller, 'Hold freigegeben und Auftrag an die Reseller-API übergeben.');
                $stats['sent']++;
            } elseif (in_array(($reseller['reason'] ?? ''), ['balance_hold', 'cost_hold'], true)) {
                $order['last_reseller_balance'] = $reseller['balance'] ?? null;
                $order['min_reseller_balance'] = $reseller['min_balance'] ?? null;
                $order['estimated_reseller_cost'] = $reseller['estimated_cost'] ?? fb_estimated_reseller_cost($order);
                $order['manual_review_threshold'] = $reseller['manual_threshold'] ?? null;
                if (empty($order['admin_hold_email_sent_at'])) {
                    $adminSent = fb_notify_admin_hold($order, $reseller);
                    $order['admin_hold_email_sent_at'] = $adminSent ? fb_now() : null;
                }
                $message = ($reseller['reason'] ?? '') === 'cost_hold' ? 'Hold bleibt aktiv, Reseller-Kosten liegen über dem Freigabewert.' : 'Hold bleibt aktiv, Reseller-Balance weiterhin unter Mindestwert.';
                $order = fb_append_history($order, 'fulfillment_hold', $message);
                $stats['still_on_hold']++;
            } else {
                $order = fb_apply_reseller_result_to_order($order, $reseller, 'Teilweise Reseller-Übergabe gespeichert.');
                if (($order['status'] ?? '') !== 'needs_review') {
                    $order['status'] = 'needs_review';
                    $order['reseller_status'] = $reseller['reason'] ?? 'reseller_error';
                    $order = fb_append_history($order, 'needs_review', ($reseller['message'] ?? 'Freigabe fehlgeschlagen.') . ' Auftrag wurde nicht gesendet.');
                }
                $stats['failed']++;
            }
        }

        $data['orders'] = $orders;
        return ['data' => $data];
    }, ['orders' => []]);

    fb_json_response(['ok' => true, 'message' => 'Hold-Freigabe geprÃ¼ft.', 'stats' => $stats]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('admin-bulk-action failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Bulk-Aktion konnte nicht ausgefÃ¼hrt werden.'], 500);
}
