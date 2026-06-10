Wichtig für cPanel:

- Lege in cPanel am besten `noreply@fameboost.de` als E-Mail-Adresse an.
- Aktiviere/prüfe in cPanel unter **Email Deliverability** SPF und DKIM für `fameboost.de`.
- Wenn du deployest, muss der Inhalt von `frontend` in den Webroot, oder der Document Root muss auf `frontend` zeigen. Dann sind die Endpunkte unter `/api/...` erreichbar.

PHP-/Backend-Hinweis:

- Das aktuelle PHP-Setup ist für lokale Tests, Kontaktformular, Bestellvorbereitung, Stripe Payment Links, Stripe Webhooks und erste Admin-Aktionen vorbereitet.
- Für Production müssen wir daran noch weiterarbeiten, besonders an Admin-Login, Rate Limits, Spam-Schutz, Monitoring, sauberem Fehlerlogging, Backup-Strategie und E-Mail-Zustellung.
- Das lokale PHP-Setup ist noch kein vollständig gehärtetes Production-Backend.

Analytics-/Tracking-Hinweis:

- Für den Livebetrieb brauchen wir ein DSGVO-sauberes Analytics-Setup, damit sichtbar wird, wie viel Traffic auf die Website kommt und welche Seiten besucht werden.
- Zusätzlich sollten Shop-Events gemessen werden, zum Beispiel Produkt angesehen, Paket konfiguriert, Produkt in den Warenkorb gelegt, Warenkorb geöffnet, Checkout gestartet und Kauf abgeschlossen.
- Besonders wichtig ist die Auswertung, welche Produkte und Mengen am häufigsten in den Warenkorb gelegt werden, wo Nutzer abspringen und welche Plattform-Seiten am besten funktionieren.
- Die Umsetzung sollte mit Cookie-Banner/Consent verbunden werden, damit Tracking erst nach Zustimmung aktiv wird, sofern rechtlich erforderlich.

Backend Phase 1:

- JAP/JustAnotherPanel API-Key fehlt noch und muss lokal in `frontend/api/_private/config.local.php` eingetragen werden. Diese Datei ist absichtlich nicht im Git.
- Stripe Webhook Secret fehlt noch und muss lokal in `frontend/api/_private/config.local.php` eingetragen werden.
- Reseller-Service-IDs fehlen noch pro Produkt/Menge und müssen serverseitig im Katalog ergänzt werden, bevor echte Reseller-Aufträge ausgelöst werden.
- Im `/admin/` gibt es jetzt ein Reseller-Service-Mapping: Alle Panel-Services können geladen, durchsucht und einem FameBoost-Produkt zugeordnet werden. Die ausgewählte Service-ID wird privat in `_private/data/reseller_mappings.json` gespeichert.
- Für Production in cPanel einen Cronjob einrichten, der jede Minute `https://fameboost.de/api/admin-reseller-health.php?refresh=1` aufruft. Dadurch wird geprüft, ob gemappte Reseller-Services noch verfügbar sind. Falls ein Service fehlt, bleibt das Mapping gespeichert, Käufe für das Produkt werden blockiert und eine Admin-Mail wird gesendet.
- Vor echter Automation müssen alle aktiven FameBoost-Produkte auf passende Reseller-Services gemappt und mit Testbestellungen geprüft werden.
- In Stripe muss ein Webhook auf `https://fameboost.de/api/stripe-webhook.php` eingerichtet werden. Relevante Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
- Stripe Payment Links sind angebunden und bekommen automatisch `client_reference_id` mit der internen Order-ID. Stripe muss für den Livebetrieb passend auf die Erfolgs-/Statusseite zurückleiten, z. B. `/bestellung-erfolgreich/`.
- Die Erfolgsseite pollt den Bestellstatus und wartet zuerst auf den Stripe-Webhook. Danach können Reseller-Statusupdates angezeigt werden, sobald JAP-Service-IDs und API-Key hinterlegt sind.
- Öffentliche Statuslinks sind mit zufälligem Token geschützt, rate-limitiert und zeigen keine sensiblen Zielprofile/Links mehr an. Wenn jemand Order-ID und Token aktiv weitergibt, kann die Statusseite trotzdem gesehen werden; deshalb dürfen dort keine internen oder sensiblen Daten stehen.
- Nach jeder echten Reseller-Bestellung soll automatisch die JAP/Reseller-Balance abgefragt und intern gespeichert werden.
- Nach jeder Reseller-Bestellung soll eine interne Admin-Mail an `nevio.vogt@gmail.com` gesendet werden mit: Käuferdaten, Produkt, Menge, Profil/Link, Kundenzahlbetrag, Reseller-Kosten, verbleibender Reseller-Balance und interner Order-ID.
- Wenn die Reseller-Balance vor dem Senden unter `reseller_min_balance` liegt, darf kein Auftrag automatisch an JAP gesendet werden. Die Bestellung wird auf `fulfillment_hold` gesetzt, der Kunde erhält einmalig eine neutrale 24-Stunden-Info-Mail, und die Freigabe erfolgt später manuell im Admin.
- Wenn die geschätzten Reseller-Kosten über `reseller_manual_review_threshold` liegen oder nicht berechnet werden können, wird die Bestellung ebenfalls auf `fulfillment_hold` gesetzt und nicht automatisch an JAP gesendet. Diese Bestellungen müssen immer einzeln im Admin geprüft und freigegeben werden.
- Für Hold-Fälle soll eine interne Admin-Mail an `nevio.vogt@gmail.com` gesendet werden, damit hohe Reseller-Kosten oder niedrige Balance nicht übersehen werden.
- Für mehrere pausierte Bestellungen gibt es eine dynamische Hold-Freigabe im Admin: einzelne Bestellung freigeben oder alle Holds prüfen/freigeben, nachdem Balance nachgeladen wurde.
- In Phase 1 wird genau ein Produkt pro Zahlung unterstützt. Multi-Warenkorb kommt erst später mit sauberer Zahlungszuordnung.
- `/admin/` ist aktuell bewusst ohne Login für Tests. Vor Production muss ein geschützter Admin-Login ergänzt werden.
- Nach Deployment prüfen: `https://fameboost.de/api/_private/config.php` muss 403/Forbidden liefern. Wenn nicht, liegt die private Config zu nah am Webroot oder `.htaccess` greift nicht.
- `frontend/.htaccess` ist für cPanel vorbereitet, damit direkte Seitenaufrufe und Reloads funktionieren, während echte Dateien wie API-Endpunkte normal erreichbar bleiben.
