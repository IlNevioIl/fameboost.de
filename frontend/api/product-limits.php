<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

try {
    $catalog = fb_catalog();
    $health = fb_reseller_health();
    $healthProducts = isset($health['products']) && is_array($health['products']) ? $health['products'] : [];
    $mappings = fb_reseller_mappings();
    $productMappings = isset($mappings['product_mappings']) && is_array($mappings['product_mappings']) ? $mappings['product_mappings'] : [];
    $limits = [];

    foreach ($catalog as $slug => $product) {
        $resellerLimits = fb_reseller_quantity_limits((string)$slug);
        $catalogQuantities = array_map('intval', array_keys($product['items'] ?? []));
        $catalogMax = $catalogQuantities ? max($catalogQuantities) : null;
        $healthStatus = is_array($healthProducts[$slug] ?? null) ? $healthProducts[$slug] : null;
        $mapping = is_array($productMappings[$slug] ?? null) ? $productMappings[$slug] : null;
        $mappedServiceId = (string)($mapping['service_id'] ?? '');
        if ($healthStatus && $mappedServiceId !== '' && (string)($healthStatus['service_id'] ?? '') !== $mappedServiceId) {
            $healthStatus = null;
        }
        $hasMapping = (bool)$resellerLimits['has_mapping'];
        $available = $hasMapping && (!$healthStatus || ($healthStatus['available'] ?? true) !== false);
        $availabilityMessage = '';
        if (!$hasMapping) {
            $availabilityMessage = 'Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.';
        } elseif (!$available) {
            $availabilityMessage = 'Dieses Produkt ist aktuell ausverkauft und sollte in ein paar Stunden wieder verfügbar sein.';
        }

        $limits[$slug] = [
            'min' => $resellerLimits['min'],
            'max' => $resellerLimits['max'],
            'catalog_max' => $catalogMax,
            'has_reseller_mapping' => $hasMapping,
            'available' => $available,
            'availability_message' => $availabilityMessage,
            'availability_checked_at' => $healthStatus['checked_at'] ?? ($health['checked_at'] ?? null),
        ];
    }

    fb_json_response([
        'ok' => true,
        'limits' => $limits,
    ]);
} catch (Throwable $error) {
    error_log('product-limits failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Produktlimits konnten nicht geladen werden.'], 500);
}
