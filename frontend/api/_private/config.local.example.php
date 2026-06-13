<?php

return [
    'stripe_secret_key' => 'sk_live_HIER_STRIPE_SECRET_KEY_EINTRAGEN',
    'stripe_webhook_secret' => 'whsec_HIER_STRIPE_WEBHOOK_SECRET_EINTRAGEN',
    'stripe_success_url' => 'https://fameboost.de/bestellung-erfolgreich/',
    'stripe_cancel_url' => 'https://fameboost.de/zahlung/',
    'reseller_api_key' => 'HIER_JAP_API_KEY_EINTRAGEN',
    'reseller_ssl_verify' => true,
    'reseller_min_balance' => 20.0,
    'reseller_manual_review_threshold' => 5.0,
    'speed_options' => [
        'standard' => ['label' => 'Standard', 'price_cents' => 0],
        'fast' => ['label' => 'Schnellere Bearbeitung', 'price_cents' => 399],
    ],
];
