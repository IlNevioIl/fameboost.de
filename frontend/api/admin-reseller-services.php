<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    $catalog = fb_catalog();
    $mappings = fb_reseller_mappings();
    $products = [];

    foreach ($catalog as $slug => $product) {
        $items = [];
        foreach (($product['items'] ?? []) as $quantity => $item) {
            $items[] = [
                'quantity' => (int)$quantity,
                'name' => (string)($item['name'] ?? ''),
                'price_cents' => (int)($item['price_cents'] ?? 0),
            ];
        }
        $products[] = [
            'slug' => $slug,
            'label' => trim(($product['platform'] ?? '') . ' ' . ($product['type'] ?? '')),
            'platform' => $product['platform'] ?? '',
            'type' => $product['type'] ?? '',
            'quantities' => array_map(static fn (array $item): int => $item['quantity'], $items),
            'items' => $items,
            'mapping' => $mappings['product_mappings'][$slug] ?? null,
        ];
    }

    $forceRefresh = ($_GET['refresh'] ?? '') === '1';
    $services = fb_call_reseller_services($forceRefresh);
    $health = fb_reseller_health();
    if (empty($services['ok'])) {
        fb_json_response([
            'ok' => false,
            'message' => $services['message'] ?? 'Reseller-Services konnten nicht geladen werden.',
            'products' => $products,
            'health' => $health,
        ], 422);
    }

    fb_json_response([
        'ok' => true,
        'products' => $products,
        'services' => $services['services'] ?? [],
        'health' => $health,
        'cached' => !empty($services['cached']),
        'warning' => $services['warning'] ?? '',
        'fetched_at' => $services['fetched_at'] ?? null,
    ]);
} catch (Throwable $error) {
    error_log('admin-reseller-services failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Reseller-Services konnten nicht geladen werden.'], 500);
}
