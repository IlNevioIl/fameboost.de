<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    $input = fb_read_input();
    $slug = trim((string)($input['slug'] ?? ''));
    $serviceId = trim((string)($input['service_id'] ?? ''));
    $catalog = fb_catalog();

    if ($slug === '' || !isset($catalog[$slug])) {
        throw new InvalidArgumentException('Unbekanntes FameBoost-Produkt.');
    }

    fb_mutate_json_file(fb_reseller_mappings_file(), function (array $data) use ($slug, $serviceId, $input) {
        $productMappings = isset($data['product_mappings']) && is_array($data['product_mappings']) ? $data['product_mappings'] : [];
        $quantityMappings = isset($data['quantity_mappings']) && is_array($data['quantity_mappings']) ? $data['quantity_mappings'] : [];

        if ($serviceId === '') {
            unset($productMappings[$slug]);
        } else {
            $productMappings[$slug] = [
                'service_id' => $serviceId,
                'service_name' => trim((string)($input['service_name'] ?? '')),
                'category' => trim((string)($input['category'] ?? '')),
                'type' => trim((string)($input['type'] ?? '')),
                'rate' => trim((string)($input['rate'] ?? '')),
                'min' => trim((string)($input['min'] ?? '')),
                'max' => trim((string)($input['max'] ?? '')),
                'refill' => $input['refill'] ?? null,
                'cancel' => $input['cancel'] ?? null,
                'updated_at' => fb_now(),
            ];
        }

        $data['product_mappings'] = $productMappings;
        $data['quantity_mappings'] = $quantityMappings;
        return ['data' => $data];
    }, ['product_mappings' => [], 'quantity_mappings' => []]);

    $health = null;
    try {
        $health = fb_check_reseller_mapped_services(true, true);
    } catch (Throwable $healthError) {
        error_log('admin-reseller-mapping health refresh failed: ' . $healthError->getMessage() . "\n", 3, fb_data_path('errors.log'));
    }

    fb_json_response([
        'ok' => true,
        'message' => $serviceId === '' ? 'Mapping entfernt.' : 'Mapping gespeichert.',
        'health' => $health,
    ]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('admin-reseller-mapping failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Mapping konnte nicht gespeichert werden.'], 500);
}
