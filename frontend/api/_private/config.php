<?php

$config = [
    'reseller_api_url' => 'https://justanotherpanel.com/api/v2',
    'reseller_api_key' => '',
    'reseller_ssl_verify' => true,
    'reseller_min_balance' => 20.0,
    'reseller_manual_review_threshold' => 5.0,
    'reseller_health_check_interval' => 60,
    'reseller_health_alert_throttle' => 21600,
    'stripe_webhook_secret' => '',
    'mail_from' => 'noreply@fameboost.de',
    'mail_from_name' => 'FameBoost.de',
    'admin_email' => 'nevio.vogt@gmail.com',
    'admin_notice' => 'Phase 1 nutzt Stripe Payment Links. Reseller-Automation startet erst, wenn API-Key und Zahlungsprüfung final angebunden sind.',
];

$local = __DIR__ . '/config.local.php';
if (is_file($local)) {
    $override = require $local;
    if (is_array($override)) {
        $config = array_replace($config, $override);
    }
}

return $config;
