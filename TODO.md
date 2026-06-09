Wichtig für cPanel:

- Lege in cPanel am besten `noreply@fameboost.de` als E-Mail-Adresse an.
- Aktiviere/prüfe in cPanel unter **Email Deliverability** SPF und DKIM für `fameboost.de`.
- Wenn du deployest, muss der Inhalt von `frontend` in den Webroot, oder der Document Root muss auf `frontend` zeigen. Dann ist der Endpunkt erreichbar unter `/api/contact.php`.

PHP-/Backend-Hinweis:

- Das aktuelle PHP-Setup ist vor allem für lokale Tests und den einfachen Kontaktformular-Versand vorbereitet.
- Für Production müssen wir daran noch weiterarbeiten, besonders an Stripe Checkout, Bestellverarbeitung, sicherer serverseitiger Validierung, Fehlerlogging, Spam-Schutz und sauberer E-Mail-Zustellung.
- Das lokale PHP-Setup ist noch kein fertiges Production-Backend.
