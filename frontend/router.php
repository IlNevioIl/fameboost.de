<?php

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$file = __DIR__ . str_replace('/', DIRECTORY_SEPARATOR, rawurldecode($path));

if ($path !== '/' && is_file($file)) {
    return false;
}

if (preg_match('/\.(?:css|js|mjs|json|png|jpg|jpeg|gif|webp|svg|ico|txt|xml|map|woff2?)$/i', $path)) {
    http_response_code(404);
    return true;
}

require __DIR__ . '/index.html';
