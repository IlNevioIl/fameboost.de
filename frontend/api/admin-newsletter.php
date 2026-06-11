<?php

declare(strict_types=1);

require __DIR__ . '/common.php';
fb_require_admin_auth();

try {
    $data = fb_load_json_file(fb_newsletter_file(), ['subscribers' => []]);
    $subscribers = array_values(array_filter($data['subscribers'] ?? [], 'is_array'));
    usort($subscribers, fn (array $a, array $b): int => strcmp((string)($b['updated_at'] ?? ''), (string)($a['updated_at'] ?? '')));

    fb_json_response([
        'ok' => true,
        'total' => count($subscribers),
        'subscribers' => array_map(static fn (array $subscriber): array => [
            'email' => (string)($subscriber['email'] ?? ''),
            'status' => (string)($subscriber['status'] ?? 'active'),
            'source' => (string)($subscriber['source'] ?? ''),
            'created_at' => (string)($subscriber['created_at'] ?? ''),
            'updated_at' => (string)($subscriber['updated_at'] ?? ''),
            'signup_count' => (int)($subscriber['signup_count'] ?? 1),
            'consent_text' => (string)($subscriber['consent_text'] ?? ''),
        ], $subscribers),
    ]);
} catch (Throwable $error) {
    fb_json_response(['ok' => false, 'message' => 'Newsletter-Daten konnten nicht geladen werden.'], 500);
}
