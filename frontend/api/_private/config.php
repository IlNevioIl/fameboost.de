<?php

$config = [
    'reseller_api_url' => 'https://justanotherpanel.com/api/v2',
    'reseller_api_key' => '',
    'reseller_ssl_verify' => true,
    'reseller_min_balance' => 20.0,
    'reseller_manual_review_threshold' => 5.0,
    'reseller_health_check_interval' => 60,
    'reseller_health_alert_throttle' => 21600,
    'stripe_secret_key' => '',
    'stripe_webhook_secret' => '',
    'stripe_success_url' => 'https://fameboost.de/bestellung-erfolgreich/',
    'stripe_cancel_url' => 'https://fameboost.de/zahlung/',
    'stripe_allowed_payment_methods' => ['card', 'paypal', 'klarna', 'sofort'],
    'stripe_promotion_codes_enabled' => true,
    'speed_options' => [
        'standard' => ['label' => 'Standard', 'price_cents' => 0],
        'fast' => ['label' => 'Schnellere Bearbeitung', 'price_cents' => 399],
        'custom' => ['label' => 'Individuelle Geschwindigkeit', 'price_cents' => 399],
    ],
    'mail_from' => 'noreply@fameboost.de',
    'mail_from_name' => 'FameBoost.de',
    'admin_email' => 'nevio.vogt@gmail.com',
    'admin_notice' => 'Stripe Checkout Sessions sind vorbereitet. Automatische Weitergabe startet nur bei bezahlten Bestellungen und gÃ¼ltigem Reseller-Mapping.',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $override = require $local;
    if (is_array($override)) {
        $config = array_replace($config, $override);
    }
}

return $config;
