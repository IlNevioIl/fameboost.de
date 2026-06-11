<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    fb_json_response(['ok' => false, 'message' => 'Methode nicht erlaubt.'], 405);
}

fb_rate_limit('newsletter', 6, 3600);

try {
    $input = fb_read_input();
    $email = strtolower(trim((string)($input['email'] ?? '')));
    $honeypot = trim((string)($input['website'] ?? ''));
    $consent = !empty($input['consent']);

    if ($honeypot !== '') {
        fb_json_response(['ok' => true, 'message' => 'Danke, deine Anmeldung wurde gespeichert.']);
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Bitte gib eine gültige E-Mail-Adresse ein.');
    }
    if (!$consent) {
        throw new InvalidArgumentException('Bitte bestätige, dass du E-Mail-Angebote erhalten möchtest.');
    }

    $now = fb_now();
    $consentText = 'Ich möchte Paket-Angebote und Rabattaktionen per E-Mail erhalten.';
    $result = fb_mutate_json_file(fb_newsletter_file(), function (array $data) use ($email, $now, $consentText) {
        $data['subscribers'] = isset($data['subscribers']) && is_array($data['subscribers']) ? $data['subscribers'] : [];
        $key = hash('sha256', $email);
        $existing = isset($data['subscribers'][$key]) && is_array($data['subscribers'][$key]) ? $data['subscribers'][$key] : [];
        $isNew = empty($existing);

        $data['subscribers'][$key] = array_merge($existing, [
            'email' => $email,
            'status' => 'active',
            'source' => 'footer_newsletter',
            'consent_text' => $consentText,
            'consent_at' => $existing['consent_at'] ?? $now,
            'created_at' => $existing['created_at'] ?? $now,
            'updated_at' => $now,
            'signup_count' => (int)($existing['signup_count'] ?? 0) + 1,
            'ip_hash' => hash('sha256', fb_client_ip()),
            'user_agent' => substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 240),
        ]);

        return ['data' => $data, 'is_new' => $isNew];
    }, ['subscribers' => []]);

    fb_json_response([
        'ok' => true,
        'message' => !empty($result['is_new'])
            ? 'Danke, deine Anmeldung wurde gespeichert.'
            : 'Du bist bereits eingetragen. Danke dir.',
    ]);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    fb_json_response(['ok' => false, 'message' => 'Newsletter-Anmeldung konnte nicht gespeichert werden.'], 500);
}
