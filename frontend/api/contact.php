<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

const MAIL_TO = 'nevio@oivengames.com';
const MAIL_FROM = 'noreply@fameboost.de';
const MAIL_FROM_NAME = 'FameBoost.de';

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function field(string $key, int $max = 2000): string
{
    $value = trim((string)($_POST[$key] ?? ''));
    $value = str_replace(["\r", "\0"], '', $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max, 'UTF-8') : substr($value, 0, $max);
}

function header_text(string $value): string
{
    return function_exists('mb_encode_mimeheader') ? mb_encode_mimeheader($value, 'UTF-8', 'B', "\r\n") : '=?UTF-8?B?' . base64_encode($value) . '?=';
}

function is_local_request(): bool
{
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    return str_starts_with($host, '127.0.0.1') || str_starts_with($host, 'localhost');
}

function send_mail(string $to, string $subject, string $body, string $replyTo = ''): bool
{
    if (is_local_request()) {
        $entry = "TO: {$to}\nSUBJECT: {$subject}\nREPLY-TO: {$replyTo}\n\n{$body}\n\n---\n";
        return file_put_contents(__DIR__ . '/contact-local.log', $entry, FILE_APPEND | LOCK_EX) !== false;
    }

    $from = header_text(MAIL_FROM_NAME) . ' <' . MAIL_FROM . '>';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . $from,
        'X-Mailer: FameBoost Contact Form'
    ];

    if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }

    return mail($to, header_text($subject), $body, implode("\r\n", $headers), '-f' . MAIL_FROM);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['ok' => false, 'message' => 'Methode nicht erlaubt.']);
}

if (field('website', 250) !== '') {
    respond(200, ['ok' => true]);
}

$name = field('name', 120);
$email = field('email', 180);
$orderNumber = field('orderNumber', 120);
$topic = field('topic', 180);
$message = field('message', 5000);
$profile = field('profile', 240);
$formType = field('formType', 80) ?: 'Kontaktanfrage';

if ($name === '' || $email === '' || $message === '') {
    respond(422, ['ok' => false, 'message' => 'Bitte fülle Name, E-Mail und Nachricht aus.']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, ['ok' => false, 'message' => 'Bitte gib eine gültige E-Mail-Adresse ein.']);
}

$time = date('d.m.Y H:i:s');
$subject = 'Neue ' . $formType . ' über FameBoost.de';
$internalBody = <<<TEXT
Neue {$formType} über FameBoost.de

Name: {$name}
E-Mail: {$email}
Bestellnummer: {$orderNumber}
Thema/Produkt: {$topic}
Profil/Link: {$profile}
Zeitpunkt: {$time}

Nachricht:
{$message}

Hinweis:
Wenn du antwortest, nutze die Reply-To-Adresse oder schreibe direkt an {$email}.
TEXT;

$customerSubject = 'Wir haben deine Anfrage erhalten';
$customerBody = <<<TEXT
Hallo {$name},

vielen Dank für deine Nachricht an FameBoost.de.

Wir haben deine Anfrage erhalten und melden uns in Kürze bei dir.

Deine Angaben:
Thema/Produkt: {$topic}
Bestellnummer: {$orderNumber}

Deine Nachricht:
{$message}

Bitte antworte nicht direkt auf diese automatische E-Mail. Wenn du noch etwas ergänzen möchtest, nutze bitte erneut das Kontaktformular.

Viele Grüße
Dein FameBoost.de Team
TEXT;

$sentInternal = send_mail(MAIL_TO, $subject, $internalBody, $email);
if (!$sentInternal) {
    respond(500, ['ok' => false, 'message' => 'Die Anfrage konnte nicht versendet werden.']);
}

send_mail($email, $customerSubject, $customerBody);

respond(200, ['ok' => true, 'message' => 'Nachricht gesendet.']);
