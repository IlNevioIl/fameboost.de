# FameBoost.de TODO

Stand: 12.06.2026

## Wichtig für cPanel

- Lege in cPanel am besten `noreply@fameboost.de` als E-Mail-Adresse an.
- Aktiviere/prüfe in cPanel unter **Email Deliverability** SPF, DKIM und wenn möglich DMARC für `fameboost.de`.
- Wenn du deployest, muss der Inhalt von `frontend` in den Webroot, oder der Document Root muss auf `frontend` zeigen. Dann sind die Endpunkte unter `/api/...` erreichbar.
- Beim Upload auf den Server nicht überschreiben oder löschen:
  - `/public_html/api/_private/config.local.php`
  - `/public_html/api/_private/data/`
- Nach jedem Upload prüfen: `/api/_private/config.php` und `/api/_private/config.local.php` dürfen nicht öffentlich lesbar sein.

## Live-Konfiguration

- In `config.local.php` auf dem Server final setzen und prüfen:
  - `stripe_secret_key`
  - `stripe_webhook_secret`
  - `reseller_api_key`
  - Admin-Mail-Adresse
  - Absender-Mail-Adresse
  - `reseller_min_balance`
  - `reseller_manual_review_threshold`
  - Speed-Aufpreise
- Schreibrechte für `/api/_private/data/` prüfen, damit Bestellungen, Newsletter, Mapping, Sessions und Logs gespeichert werden können.
- Backup-Plan für `/api/_private/data/` einrichten und testweise eine Wiederherstellung prüfen.

## Stripe und Zahlung

- Stripe Payment Methods aktivieren und live testen:
  - Karte
  - PayPal
  - Klarna
  - Sofort
  - Apple Pay / Google Pay, sofern im Stripe-Konto verfügbar
- Stripe Promotion Code `START15` anlegen und mit FameBoost.de testen.
- Stripe Webhook auf `https://fameboost.de/api/stripe-webhook.php` prüfen.
- Relevante Events:
  - `checkout.session.completed`
  - `checkout.session.async_payment_succeeded`
  - `checkout.session.async_payment_failed`
- Testen, dass doppelte Webhooks keine zweite Reseller-Ausführung starten.
- Komplette Testkäufe durchführen:
  - einzelnes Produkt
  - mehrere Produkte im Warenkorb
  - gültiger Rabattcode
  - ungültiger Rabattcode
  - abgebrochene Zahlung
  - erfolgreiche Zahlung
  - Statusseite nach Zahlung

## Reseller / JustAnotherPanel

- Alle aktiven FameBoost-Produkte im Admin sauber auf passende Reseller-Services mappen.
- Bei jedem Mapping prüfen:
  - Service ist aktiv
  - maximale Menge passt zu unseren angebotenen Mengen
  - Rate ist plausibel
  - Einkaufskosten und Marge passen
- Cronjob in cPanel einrichten, der jede Minute den Reseller-Service-Check ausführt.
- Health-Check live testen: Wenn ein gemappter Service nicht mehr verfügbar ist, muss das Produkt für Kunden als ausverkauft erscheinen und intern eine Warnung auslösen.
- Testen, dass Bestellungen mit Reseller-Kosten über dem Freigabewert auf Hold gehen und nicht automatisch gesendet werden.
- Testen, dass Bestellungen bei zu niedriger Reseller-Balance auf Hold gehen und der Kunde die neutrale 24-Stunden-Info bekommt.
- Noch offen: Nach jeder echten Reseller-Bestellung eine interne Admin-Mail mit Käuferdaten, Produkt, Menge, Verkaufspreis, Reseller-Kosten, verbleibender Balance und Order-ID senden.

## Neue Features

- Profil-Suche / Profil-Prüfung einbauen:
  - Kunde soll Profilname oder Link eingeben und optional eine Vorschau/Prüfung bekommen.
  - Plattform, Profilname, URL und öffentliche Erreichbarkeit sollen erkannt werden.
  - Vor Reseller-Ausführung sollen, soweit technisch/legal möglich, öffentliche Kennzahlen gespeichert werden.
  - Nach Abschluss sollen Kennzahlen erneut speicherbar sein, damit Admin Refill-Fälle besser prüfen kann.
  - Falls eine automatische Profil-Suche nicht zuverlässig möglich ist, braucht es einen Admin-Workflow für manuelle Prüfung.

## Analytics und Newsletter

- DSGVO-sauberes Analytics-Konzept finalisieren.
- Messen, sofern Consent vorliegt:
  - Seitenaufrufe
  - Produkt angesehen
  - Menge ausgewählt
  - Produkt in den Warenkorb gelegt
  - Checkout gestartet
  - Zahlung erfolgreich
  - Coupon eingegeben
- Newsletter weiter absichern:
  - Double-Opt-In prüfen oder einbauen
  - Abmeldelink einbauen
  - Export/Löschung von Newsletter-Adressen für Datenschutzanfragen vorbereiten

## Sicherheit und Abuse-Schutz

- Optional Cloudflare Turnstile oder vergleichbaren Schutz für besonders spam-anfällige Formulare einbauen:
  - Kontakt
  - Newsletter
  - Coupon
  - Admin-Login
- Admin-Login live mit starkem Passwort und 2FA testen.
- Rate Limits live prüfen.
- Fehlerlogging auf dem Server prüfen, ohne Secrets in Logs zu schreiben.
- Server-Zugriff, cPanel-Zugang, Stripe-Zugang und Reseller-Zugang mit 2FA absichern.

## Recht und Live-Check

- Rechtstexte vor Livebetrieb final prüfen lassen:
  - Impressum
  - Datenschutz
  - AGB
  - Widerrufsbelehrung
  - Cookie-Hinweis
  - Checkout-Texte
- Prüfen, ob der Verkauf der konkreten Social-Media-Services mit Plattformregeln, Zahlungsanbieter-Regeln und deutschem Recht vereinbar ist.
- Alle Markenhinweise prüfen: Social-Media-Logos und Zahlungslogos gehören den jeweiligen Rechteinhabern.
- Vor Livegang einmal komplett testen:
  - Desktop
  - Mobile
  - Warenkorb
  - Zahlung
  - Statusseite
  - Admin-Panel
  - Kontaktformular
  - Newsletter
  - SEO-Meta-Daten
  - Sitemap/robots
  - Ladezeit
