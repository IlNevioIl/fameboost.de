<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

try {
    fb_rate_limit('validate_coupon', 40, 900);

    $input = fb_read_input();
    $code = trim((string)($input['code'] ?? $input['coupon_code'] ?? ''));
    if ($code === '') {
        throw new InvalidArgumentException('Bitte gib einen Rabattcode ein.');
    }
    if (empty(fb_config()['stripe_promotion_codes_enabled'])) {
        throw new InvalidArgumentException('Rabattcodes sind aktuell nicht verfÃ¼gbar.');
    }

    $promotion = fb_stripe_find_promotion_code($code);
    if (!$promotion) {
        throw new InvalidArgumentException('Dieser Rabattcode ist ungÃ¼ltig oder nicht mehr aktiv.');
    }

    $coupon = is_array($promotion['coupon'] ?? null) ? $promotion['coupon'] : [];
    $label = 'Rabattcode aktiv';
    if (isset($coupon['percent_off'])) {
        $label = rtrim(rtrim(number_format((float)$coupon['percent_off'], 2, ',', '.'), '0'), ',') . ' % Rabatt';
    } elseif (isset($coupon['amount_off'])) {
        $label = fb_money((int)$coupon['amount_off']) . ' Rabatt';
    }

    fb_json_response([
        'ok' => true,
        'code' => $promotion['code'] ?? $code,
        'label' => $label,
        'promotion_code_id' => $promotion['id'] ?? null,
    ]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('validate-promotion-code failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Rabattcode konnte nicht geprÃ¼ft werden.'], 500);
}
