<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$file = __DIR__ . str_replace('/', DIRECTORY_SEPARATOR, rawurldecode($path));

if (str_contains($path, '/_private/')) {
    http_response_code(403);
    echo 'Forbidden';
    return true;
}

if (in_array(trim($path, '/'), ['lieferbedingungen', 'zahlungsarten'], true)) {
    http_response_code(410);
    echo 'Gone';
    return true;
}

if ($path !== '/' && is_file($file)) {
    return false;
}

if ($path !== '/' && is_dir($file) && is_file($file . DIRECTORY_SEPARATOR . 'index.html')) {
    require $file . DIRECTORY_SEPARATOR . 'index.html';
    return true;
}

if (preg_match('/\.(?:css|js|mjs|json|png|jpg|jpeg|gif|webp|svg|ico|txt|xml|map|woff2?)$/i', $path)) {
    http_response_code(404);
    return true;
}

require __DIR__ . '/index.html';
