# FameBoost.de Offene Livegang-Punkte

Stand: 11.06.2026

Diese Liste enthält nur noch offene Punkte vor dem öffentlichen Livegang. Bereits umgesetzte Frontend-, Admin-, Cookie-, Mailtest- und UI-Punkte wurden entfernt.

## 1. Rechtliches und Platzhalter

- [ ] Datenschutzseite final juristisch prüfen lassen.
- [ ] AGB final juristisch prüfen lassen.
- [ ] Widerrufsbelehrung final juristisch prüfen lassen.
- [ ] Lieferbedingungen final prüfen lassen.
- [ ] Zahlungsarten-Seite final prüfen.
- [ ] Cookie-Hinweise final prüfen.
- [ ] In der Widerrufsbelehrung ist noch ein Platzhalter:
  - `[Anschrift der Oiven Games GmbH ergänzen]`
- [ ] Datenschutzseite auf reale Dienstleister final abstimmen:
  - Namecheap/cPanel
  - Stripe
  - JustAnotherPanel beziehungsweise Reseller-Panel
  - E-Mail-System
  - Newsletter-Speicherung
- [ ] Checkout rechtlich prüfen:
  - AGB-Checkbox
  - Datenschutz-Checkbox
  - mögliche Zustimmung zum Beginn der Ausführung vor Ablauf der Widerrufsfrist
  - Hinweis auf mögliches Erlöschen des Widerrufsrechts bei digitalen Leistungen
- [ ] Rechtlich prüfen, ob die geplanten Social-Media-Leistungen in dieser Form verkauft werden dürfen.

## 2. Hosting, Domain und SSL

- [ ] SSL-Zertifikat für `fameboost.de` aktivieren.
- [ ] HTTPS-Aufruf testen:
  - `https://fameboost.de/`
  - `https://www.fameboost.de/`
- [ ] HTTP dauerhaft auf HTTPS weiterleiten.
- [ ] Prüfen, ob direkte Unterseiten auf dem Server funktionieren:
  - `/instagram-follower-kaufen/`
  - `/warenkorb/`
  - `/kasse/`
  - `/bestellung-erfolgreich/`
  - `/admin/`
- [ ] Prüfen, dass `api/_private/` nicht öffentlich erreichbar ist.
- [ ] Prüfen, dass `config.local.php` nicht öffentlich auslesbar ist.

## 3. Server-Konfiguration

- [ ] Auf dem Server `public_html/api/_private/config.local.php` anlegen beziehungsweise final befüllen.
- [ ] In `config.local.php` final setzen:
  - Reseller API-Key
  - Stripe Webhook Secret
  - Admin-E-Mail
  - Mail-Absender
  - Reseller-Minimum-Balance
  - Reseller-Kosten-Hold-Grenze
- [ ] Schreibrechte für `public_html/api/_private/data/` prüfen.
- [ ] Prüfen, ob JSON-Datenbanken auf dem Server geschrieben werden können:
  - `orders.json`
  - `newsletter_subscribers.json`
  - `reseller_mappings.json`
  - `reseller_service_health.json`
  - `feedback.json`
  - `stripe_events.json`

## 4. Admin-Panel und Sicherheit

- [ ] Admin-Ersteinrichtung auf dem Live-Server durchführen.
- [ ] Starkes Admin-Passwort setzen.
- [ ] Google-Authenticator-QR scannen und Login testen.
- [ ] Prüfen, dass Admin-APIs ohne Login `401 Admin-Login erforderlich` liefern.
- [ ] Mail-Test im Admin-Panel auf dem Live-Server ausführen.
- [ ] Newsletter-Liste im Admin prüfen.
- [ ] Bestellungen-Ansicht prüfen.
- [ ] Reseller-Service-Mapping prüfen.
- [ ] Mapping entfernen und neu zuweisen testen.

## 5. Stripe

- [ ] Alle Stripe Payment Links im Live-Modus prüfen.
- [ ] Jeder Stripe Payment Link muss auf `/bestellung-erfolgreich/` zurückleiten.
- [ ] Prüfen, ob Stripe Payment Links die interne Order-ID sauber zuordnen können.
- [ ] Stripe Webhook einrichten:
  - Endpoint: `https://fameboost.de/api/stripe-webhook.php`
  - Events:
    - `checkout.session.completed`
    - `checkout.session.async_payment_succeeded`
    - `checkout.session.async_payment_failed`
- [ ] Stripe Webhook-Signaturprüfung testen.
- [ ] Testkauf durchführen und prüfen:
  - interne Order wird erstellt
  - Weiterleitung zu Stripe funktioniert
  - nach Zahlung kommt Webhook an
  - Order wechselt auf bezahlt beziehungsweise Weiterverarbeitung
  - Statusseite zeigt korrekten Zustand

## 6. Reseller-Panel / JustAnotherPanel

- [ ] Reseller-Balance aufladen.
- [ ] Alle kaufbaren Produkte im Admin einem aktiven Reseller-Service zuweisen.
- [ ] Für jedes Mapping prüfen:
  - Service ist verfügbar
  - Service-Maximum ist mindestens so hoch wie unsere größte angebotene Menge
  - Min-Menge passt zu unserer kleinsten angebotenen Menge
  - Rate ist wirtschaftlich sinnvoll
  - Einkaufskosten pro Menge sehen plausibel aus
- [ ] Testauftrag mit kleiner Menge ausführen.
- [ ] Reseller-Statusabruf testen.
- [ ] Hold-Regeln testen:
  - Balance unter Mindestwert
  - Reseller-Kosten über Freigabegrenze
  - fehlendes Mapping
  - nicht verfügbarer Reseller-Service
- [ ] Prüfen, ob Kunde bei Hold eine neutrale Info-Mail bekommt.
- [ ] Prüfen, ob Admin bei Hold eine Mail bekommt.

## 7. Cronjobs und Monitoring

- [ ] Sicheren Cron-Endpunkt mit Secret/Token bauen oder bestehenden Health-Endpunkt für Cron absichern.
- [ ] cPanel Cronjob für Reseller-Service-Health einrichten.
- [ ] Empfohlener Rhythmus: alle 5 Minuten, später ggf. jede Minute.
- [ ] Cron darf nicht öffentlich ohne Schutz Aktionen auslösen.
- [ ] Error-Log regelmäßig prüfen:
  - `api/_private/data/errors.log`
- [ ] Uptime-Monitoring einrichten:
  - Startseite
  - API Health
  - Stripe Webhook optional

## 8. E-Mail

- [ ] SPF prüfen.
- [ ] DKIM prüfen.
- [ ] DMARC DNS-Record ergänzen.
- [ ] Kontaktformular live testen:
  - interne Mail an `nevio@oivengames.com`
  - automatische Bestätigung an Kunden
- [ ] Hold-Mail an Kunden testen.
- [ ] Admin-Mail bei Hold/Reseller-Kosten testen.
- [ ] Spam-Ordner prüfen.

## 9. Newsletter

- [ ] Entscheiden, ob die lokale Newsletter-JSON-Liste für den Start reicht.
- [ ] Vor echtem Newsletter-Versand Double-Opt-In einbauen oder rechtlich prüfen lassen.
- [ ] Abmeldelink/Unsubscribe-Prozess einbauen.
- [ ] Export-Funktion für Newsletter-E-Mails optional ergänzen.
- [ ] Datenschutztext zum Newsletter final prüfen.

## 10. Kaufprozess

- [ ] Prüfen, dass genau ein Produkt pro Zahlung in Phase 1 aktiv bleibt.
- [ ] Warenkorb testen.
- [ ] Kasse testen.
- [ ] Leerer Warenkorb testen.
- [ ] Statusseite `/bestellung-erfolgreich/` testen.
- [ ] Feedback-Formular nach Bestellung testen.
- [ ] Produkte ohne Reseller-Mapping blockieren testen.
- [ ] Produkte mit inaktivem Reseller-Service blockieren testen.
- [ ] Feste Mengen über Service-Maximum blockieren testen.

## 11. SEO und Indexierung

- [ ] `robots.txt` final prüfen.
- [ ] `sitemap.xml` final erstellen oder prüfen.
- [ ] Produktseiten indexierbar machen.
- [ ] Admin/API/private Seiten nicht indexieren.
- [ ] Meta Titles und Meta Descriptions final prüfen.
- [ ] Open Graph Tags prüfen.
- [ ] Canonical URLs prüfen.
- [ ] FAQ Schema prüfen.
- [ ] Breadcrumb Schema prüfen.
- [ ] Interne Links prüfen.

## 12. Performance und Mobile

- [ ] Mobile Startseite auf echtem Handy prüfen.
- [ ] Produktseiten auf Mobile prüfen.
- [ ] Warenkorb/Kasse auf Mobile prüfen.
- [ ] Admin-Panel mindestens auf Desktop final prüfen.
- [ ] Bilder/Logos prüfen.
- [ ] Favicon prüfen.
- [ ] Core Web Vitals grob prüfen.
- [ ] Keine Texte mit schlechtem Kontrast.
- [ ] Keine Elemente, die sich überlappen.

## 13. Backup und Betrieb

- [ ] Automatische Backups für `api/_private/data/` einrichten.
- [ ] Backup vor jedem größeren Deployment erstellen.
- [ ] Wiederherstellung einmal testen.
- [ ] Server-Dateien nach Upload mit lokalem Stand vergleichen.

## Lokaler Start

```powershell
tools\php\php.exe -S 127.0.0.1:8080 -t frontend frontend\router.php
```

```text
http://127.0.0.1:8080/
```
