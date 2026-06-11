<?php

declare(strict_types=1);

require __DIR__ . '/common.php';

fb_require_admin_auth();

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        fb_json_response(['ok' => false, 'message' => 'Methode nicht erlaubt.'], 405);
    }

    fb_rate_limit('admin_test_mail', 10, 300);

    $input = fb_read_input();
    $email = trim((string)($input['email'] ?? ''));

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Bitte gib eine gültige E-Mail-Adresse ein.');
    }

    $subject = 'FameBoost.de Testmail';
    $time = date('d.m.Y H:i:s');
    $host = (string)($_SERVER['HTTP_HOST'] ?? 'unbekannt');
    $body = <<<TEXT
Hallo,

das ist eine Testmail aus dem FameBoost.de Admin-Panel.

Wenn du diese Nachricht erhalten hast, funktioniert der Mailversand grundsätzlich.

Zeitpunkt: {$time}
Host: {$host}

Viele Grüße
FameBoost.de
TEXT;

    if (!fb_send_text_mail($email, $subject, $body)) {
        fb_json_response(['ok' => false, 'message' => 'Testmail konnte nicht versendet werden.'], 500);
    }

    fb_json_response(['ok' => true, 'message' => 'Testmail wurde gesendet. Prüfe auch Spam/Junk.']);
} catch (InvalidArgumentException $error) {
    fb_json_response(['ok' => false, 'message' => $error->getMessage()], 422);
} catch (Throwable $error) {
    error_log('admin-test-mail failed: ' . $error->getMessage() . "\n" . $error->getTraceAsString() . "\n", 3, fb_data_path('errors.log'));
    fb_json_response(['ok' => false, 'message' => 'Testmail konnte nicht verarbeitet werden.'], 500);
}
