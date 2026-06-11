<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    $refresh = ($_GET['refresh'] ?? '') === '1';
    $health = $refresh ? fb_check_reseller_mapped_services(true, true) : fb_reseller_health();

    if (!$health) {
        $health = fb_check_reseller_mapped_services(true, true);
    }

    fb_json_response([
        'ok' => true,
        'health' => $health,
    ]);
} catch (Throwable $error) {
    error_log('admin-reseller-health failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Reseller-Service-Health konnte nicht geprüft werden.'], 500);
}
