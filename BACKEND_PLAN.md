# FameBoost.de Backend-Plan

Stand: 2026-06-10

Ziel dieser Datei ist die Planung des Production-Backends fuer FameBoost.de auf Namecheap/cPanel. Es wird hier noch nichts implementiert. Die JustAnotherPanel-API-Doku und eine Stripe-Payment-Link-CSV wurden bereits fuer die Planung beruecksichtigt. Fuer Phase 1 soll nur auf vorhandene Stripe Payment Links weitergeleitet werden. Es werden in Phase 1 keine Stripe Checkout Sessions und keine eigene Stripe-Zahlungslogik implementiert.

## 1. Zielbild

Das Backend soll verhindern, dass ein Auftrag an das Reseller-Panel gesendet wird, ohne dass vorher eine echte Zahlung bei Stripe bestaetigt wurde.

Gewuenschter Ablauf:

1. Kunde waehlt Produkt und Menge im Frontend.
2. Kunde gibt Profilname oder Link ein.
3. Backend erstellt eine interne Bestellung mit eigener Order-ID.
4. Kunde wird zu Stripe weitergeleitet.
5. Kunde bezahlt auf der externen Stripe Payment-Link-Seite.
6. Phase 1: Backend fuehrt ohne separate Zahlungsbestaetigung keine automatische Reseller-Bestellung aus.
7. Spaetere Automatisierungsphase: Erst wenn eine echte Zahlungsbestaetigung serverseitig verfuegbar ist, wird ein Auftrag an die Reseller-API gesendet.
8. Backend speichert Reseller-Order-ID, Status und Verlauf erst in der Automatisierungsphase.
9. Erfolgs-/Hinweisseite zeigt nur sichere Statusinformationen, keine internen Secrets.

## 2. Hosting-Umfeld

Geplant ist Namecheap/cPanel mit PHP und MySQL.

Empfohlene Mindestanforderungen:

- PHP 8.1 oder neuer, besser PHP 8.2+.
- MySQL/MariaDB.
- PHP-Erweiterungen: `curl`, `pdo_mysql`, `openssl`, `json`, `mbstring`.
- HTTPS fuer die Domain.
- cPanel Cron Jobs fuer Hintergrundverarbeitung.
- Zugriff auf Error Logs.
- Composer lokal oder vendor-Ordner per Upload, falls Stripe PHP SDK genutzt wird.

Wichtig fuer cPanel:

- Der oeffentliche Document Root sollte auf `frontend` zeigen oder der Inhalt von `frontend` muss in den Webroot.
- Private Backend-Dateien, Konfigurationen, API-Keys und Logs gehoeren nicht in oeffentlich erreichbare Ordner.
- Wenn moeglich:
  - Public: `public_html/` oder `frontend/`
  - Private App: `../app/`
  - Secrets: `../app/config/secrets.php`
  - Logs: `../app/storage/logs/`

Wenn private Ordner ausserhalb des Webroots nicht moeglich sind, muessen sensible Ordner per `.htaccess` blockiert werden. Besser ist aber eine Struktur ausserhalb des Webroots.

## 3. Stripe-Strategie

### 3.1 Phase 1: Nur vorhandene Stripe Payment Links

Fuer die erste Backend-Version sollen ausschliesslich die bereits vorhandenen Stripe Payment Links genutzt werden.

Das bedeutet:

- Keine Stripe Checkout Sessions.
- Keine serverseitige Erstellung von Stripe-Zahlungen.
- Keine Stripe Price-ID-Integration als Pflicht.
- Kein Multi-Produkt-Checkout auf unserer Seite.
- Keine automatische Rabattberechnung auf unserer Seite.
- Kunde wird zu genau dem Stripe Payment Link weitergeleitet, der zum ausgewaehlten Produkt und zur Menge passt.

Geplanter Phase-1-Ablauf:

1. Kunde waehlt genau ein Produkt/Paket.
2. Kunde gibt Profilname/Link und E-Mail ein.
3. Backend speichert eine interne Bestellung mit Status `pending_external_payment`.
4. Backend sucht den passenden Stripe Payment Link serverseitig aus der Produkt-/Link-Tabelle.
5. Backend gibt nur diese Redirect-URL an das Frontend zurueck.
6. Kunde bezahlt extern auf Stripe.
7. Ohne weitere Stripe-Anbindung bleibt die Bestellung intern zunaechst `pending_external_payment` oder `manual_payment_check`.

Wichtige Konsequenz:

- In Phase 1 darf keine automatische JustAnotherPanel-Bestellung ausgeloest werden, nur weil der Kunde auf eine Erfolgsseite kommt.
- Automatische Reseller-Ausfuehrung braucht spaeter eine serverseitig verifizierbare Zahlungsbestaetigung.
- Bis dahin ist die Reseller-Ausfuehrung manuell oder halbautomatisch zu behandeln.

### 3.2 Spaetere Option: Stripe Checkout Sessions

Stripe Checkout Sessions bleiben nur als spaetere Ausbaustufe dokumentiert.

Sie werden erst relevant, wenn:

- mehrere Produkte in einer Zahlung bezahlt werden sollen,
- die interne Order-ID sauber an Stripe uebergeben werden soll,
- Rabattcodes serverseitig kontrollierter werden sollen,
- die automatische Reseller-Erfuellung ohne manuelle Zahlungspruefung laufen soll.

Fuer Phase 1 wird das nicht implementiert.

### 3.3 Aktueller Stripe-Payment-Link-Import

Am 2026-06-10 wurde die Datei `payment_links.csv` aus dem Downloads-Ordner ausgewertet.

Ergebnis:

- 55 aktive Stripe Payment Links.
- Waehrung: `eur`.
- Plattform-Abdeckung:
  - Facebook: 5 Links.
  - Instagram: 18 Links.
  - TikTok: 17 Links.
  - Twitch: 5 Links.
  - YouTube: 10 Links.

Die CSV-Spalten sind:

- `id` - Stripe Payment Link ID, z. B. `plink_...`.
- `Created (UTC)` - Erstellzeitpunkt.
- `Active` - Aktivstatus.
- `Currency` - Waehrung.
- `Url` - Stripe Payment Link.
- `Name` - Produktname, z. B. `Instagram Follower Paket - 100 Follower`.

Plan fuer die spaetere Nutzung:

- Die CSV wird nicht als dauerhafte Datenquelle im Frontend verwendet.
- Die Links werden in eine serverseitige Tabelle `product_catalog` importiert.
- Das Frontend sendet nur Produkt-Slug und Menge.
- Das Backend sucht den passenden Stripe Payment Link anhand von Produkt und Menge.
- Payment Links bleiben oeffentlich, aber die Zuordnung zu Reseller-Service-IDs bleibt privat.

Wichtiger Sicherheits-/Architekturhinweis:

- Ein Payment Link allein beweist noch nicht, zu welcher internen Bestellung ein Kunde gehoert.
- Vor der Weiterleitung muss immer eine interne Order-ID erzeugt werden.
- Phase 1 macht deshalb nur die sichere interne Vor-Erfassung und Weiterleitung.
- Ohne separate Zahlungsbestaetigung bleibt die Bestellung nach der Weiterleitung zahlungstechnisch ungeprueft.
- Automatische Reseller-Erfuellung wird erst spaeter aktiviert, wenn eine sichere Zahlungszuordnung verfuegbar ist.

## 4. Daten, die vor Stripe gespeichert werden

Beim Klick auf "Zur Kasse" oder "Jetzt kaufen" erstellt das Backend zuerst eine interne Bestellung.

Zu speichern:

- Interne Order-ID, z. B. `FB-20260610-000123`.
- Oeffentlicher Order-Token fuer Statusseite.
- Kundendaten:
  - E-Mail.
  - Vorname/Nachname, falls vorhanden.
  - Rechnungsdaten, falls benoetigt.
- Produktdaten:
  - Interne Produkt-ID.
  - Plattform.
  - Produktart, z. B. Follower, Likes, Views.
  - Menge.
  - Preis in Cent.
  - Waehrung.
  - Stripe Price ID oder Stripe Payment Link ID/URL.
  - Reseller Service ID, aber nur serverseitig sichtbar.
- Zielangaben:
  - Profilname oder Link.
  - Validierte/normalisierte Version.
  - Plattformtyp.
- Zusatzoptionen:
  - Liefergeschwindigkeit.
  - Refill-Option.
- Status:
  - `pending_external_payment`.
- Zeitstempel:
  - Erstellt am.
  - Weiterleitungszeitpunkt oder Zahlungsfrist.

Wichtig:

- Preis und Produkt duerfen nicht aus dem Frontend vertraut werden.
- Das Frontend sendet nur Produkt-Slug, Menge, Profil/Link und Kundendaten.
- Das Backend bestimmt anhand einer serverseitigen Produktliste den echten Preis, Stripe-Ziel und Reseller-Service.

## 5. Datenbankmodell

### 5.1 Tabelle `orders`

Zweck: Kopf der Bestellung.

Felder:

- `id` bigint primary key.
- `order_number` varchar unique, z. B. `FB-20260610-000123`.
- `public_token_hash` varchar.
- `customer_email` varchar.
- `customer_first_name` varchar nullable.
- `customer_last_name` varchar nullable.
- `billing_address_json` json nullable.
- `currency` varchar, z. B. `eur`.
- `amount_subtotal_cents` int.
- `amount_discount_cents` int.
- `amount_total_cents` int.
- `coupon_code` varchar nullable.
- `status` varchar.
- `stripe_checkout_session_id` varchar nullable unique.
- `stripe_payment_intent_id` varchar nullable unique.
- `stripe_payment_link_id` varchar nullable.
- `stripe_payment_status` varchar nullable.
- `reseller_status` varchar nullable.
- `ip_hash` varchar nullable.
- `user_agent_hash` varchar nullable.
- `created_at` datetime.
- `updated_at` datetime.
- `paid_at` datetime nullable.
- `fulfilled_at` datetime nullable.

### 5.2 Tabelle `order_items`

Zweck: Einzelne Produkte innerhalb einer Bestellung.

Felder:

- `id` bigint primary key.
- `order_id` bigint foreign key.
- `product_slug` varchar.
- `platform` varchar.
- `service_type` varchar.
- `quantity` int.
- `target_input` varchar.
- `target_normalized` varchar.
- `speed_option` varchar.
- `refill_option` varchar.
- `unit_price_cents` int.
- `total_price_cents` int.
- `stripe_price_id` varchar nullable.
- `stripe_payment_link_url` varchar nullable.
- `reseller_service_id` varchar nullable.
- `reseller_order_id` varchar nullable.
- `reseller_response_json` json nullable.
- `status` varchar.
- `created_at` datetime.
- `updated_at` datetime.

### 5.3 Spaeter: Tabelle `stripe_events`

Zweck: Doppelte Webhooks verhindern, sobald Stripe Webhooks in einer spaeteren Automatisierungsphase genutzt werden.

Felder:

- `id` bigint primary key.
- `stripe_event_id` varchar unique.
- `event_type` varchar.
- `livemode` tinyint.
- `payload_hash` varchar.
- `processed_at` datetime nullable.
- `processing_status` varchar, z. B. `received`, `processed`, `ignored`, `failed`.
- `error_message` text nullable.
- `created_at` datetime.

Wichtig:

- `stripe_event_id` muss unique sein.
- Wenn Stripe denselben Event erneut sendet, darf kein zweiter Reseller-Auftrag entstehen.

### 5.4 Tabelle `fulfillment_jobs`

Zweck: Reseller-Auftraege asynchron verarbeiten.

Felder:

- `id` bigint primary key.
- `order_id` bigint.
- `order_item_id` bigint.
- `job_type` varchar, z. B. `send_to_reseller`, `poll_reseller_status`.
- `status` varchar, z. B. `queued`, `running`, `done`, `failed`, `retry_wait`, `manual_review`.
- `attempts` int.
- `max_attempts` int.
- `next_run_at` datetime.
- `locked_until` datetime nullable.
- `idempotency_key` varchar unique.
- `last_error` text nullable.
- `created_at` datetime.
- `updated_at` datetime.

### 5.5 Tabelle `status_history`

Zweck: Nachvollziehbarer Bestellverlauf.

Felder:

- `id` bigint primary key.
- `order_id` bigint.
- `order_item_id` bigint nullable.
- `old_status` varchar nullable.
- `new_status` varchar.
- `message_public` varchar nullable.
- `message_internal` text nullable.
- `created_at` datetime.

### 5.6 Tabelle `product_catalog`

Zweck: Server-seitige Wahrheit fuer Produkte.

Felder:

- `id` bigint primary key.
- `slug` varchar unique.
- `platform` varchar.
- `service_type` varchar.
- `quantity` int.
- `price_cents` int.
- `currency` varchar.
- `stripe_price_id` varchar nullable.
- `stripe_payment_link_url` varchar nullable.
- `reseller_service_id` varchar nullable.
- `active` tinyint.
- `min_quantity` int.
- `max_quantity` int.
- `created_at` datetime.
- `updated_at` datetime.

## 6. Statusmodell

### 6.1 Order-Status

- `draft` - Bestellung vorbereitet, noch nicht zur Zahlung weitergeleitet.
- `pending_external_payment` - Bestellung wurde intern gespeichert und wartet auf externe Zahlung per Stripe Payment Link.
- `payment_link_opened` - Kunde wurde zum Stripe Payment Link weitergeleitet.
- `manual_payment_check` - Zahlung muss manuell oder spaeter ueber eine sichere Stripe-Zuordnung geprueft werden.
- `paid` - Spaeter: Zahlung durch Stripe Webhook oder sichere manuelle Pruefung bestaetigt.
- `payment_failed` - Zahlung fehlgeschlagen oder abgebrochen.
- `fulfillment_queued` - Auftrag wartet auf Reseller-Verarbeitung.
- `fulfillment_processing` - Backend arbeitet an der Reseller-Uebergabe.
- `sent_to_reseller` - Auftrag wurde an Reseller-API gesendet.
- `in_progress` - Reseller meldet laufende Bearbeitung.
- `partially_completed` - Teilweise erledigt.
- `completed` - Auftrag abgeschlossen.
- `needs_review` - Manuelle Pruefung noetig.
- `refill_requested` - Refill wurde angefragt.
- `canceled` - Bestellung storniert.
- `refunded` - Zahlung erstattet.

### 6.2 Item-Status

Jedes `order_item` bekommt ebenfalls einen eigenen Status. Das ist wichtig, falls eine Bestellung spaeter mehrere Produkte enthaelt und ein Produkt klappt, ein anderes aber haengt.

## 7. Backend-Endpunkte

### 7.1 `POST /api/orders/create.php`

Aufgabe:

- Eingaben validieren.
- Produkt serverseitig finden.
- Preis serverseitig berechnen.
- Order und Order Items speichern.
- Passenden Stripe Payment Link aus interner Tabelle auswaehlen.
- Weiterleitungs-URL an Frontend zurueckgeben.

Request vom Frontend:

- `items[]`
  - `product_slug`
  - `quantity`
  - `target`
  - `speed_option`
  - `refill_option`
- `customer_email`
- optionale Rechnungsdaten.

Response:

- `order_number`
- `public_status_token`
- `redirect_url` zum passenden Stripe Payment Link.

Sicherheit:

- Keine Preise aus dem Frontend akzeptieren.
- Keine Stripe URLs aus dem Frontend akzeptieren.
- Keine Reseller Service IDs aus dem Frontend akzeptieren.
- Rate-Limit auf IP/E-Mail.
- CSRF-Token oder SameSite-Strategie fuer Browser-Requests.

### 7.2 Spaeter: `POST /api/stripe/webhook.php`

Dieser Endpunkt wird in Phase 1 noch nicht benoetigt, wenn wirklich nur auf feste Stripe Payment Links verwiesen wird und keine Stripe-Automatisierung stattfindet.

Er wird erst relevant, sobald automatische Reseller-Erfuellung nach Zahlung gewuenscht ist.

Aufgabe:

- Raw Body lesen.
- Stripe-Signatur pruefen.
- Event-ID deduplizieren.
- Bei `checkout.session.completed` oder passendem Zahlungs-Event Bestellung laden.
- Zahlung und Betrag pruefen.
- Order auf `paid` setzen.
- Fulfillment-Jobs erzeugen.
- Schnell `200` zurueckgeben.

Sicherheit:

- Niemals ohne gueltige Stripe-Signatur verarbeiten.
- Niemals nur anhand eines Frontend-Redirects erfuellen.
- Event-ID unique speichern.
- Betrag, Waehrung und Produkt/Price ID pruefen.
- Livemode/Testmode gegen Konfiguration pruefen.

Stripe-Doku-Abgleich:

- Stripe verlangt fuer die Signaturpruefung den Raw Body und den `Stripe-Signature` Header.
- Stripe empfiehlt, Webhook-Endpoints schnell mit 2xx antworten zu lassen und komplexe Arbeit zu verschieben.
- Live-Webhooks muessen oeffentlich per HTTPS erreichbar sein.

### 7.3 `GET /api/orders/status.php`

Aufgabe:

- Status fuer Erfolgsseite liefern.
- Nur mit `order_number` und `public_status_token`.
- Keine internen IDs, keine Reseller-Service-IDs, keine API-Antworten komplett ausgeben.

Response-Beispiel:

```json
{
  "orderNumber": "FB-20260610-000123",
  "status": "sent_to_reseller",
  "progress": 65,
  "headline": "Dein Auftrag wurde gestartet",
  "steps": [
    {"label": "Zahlung bestaetigt", "state": "done"},
    {"label": "Auftrag vorbereitet", "state": "done"},
    {"label": "Bearbeitung gestartet", "state": "active"},
    {"label": "Abschluss", "state": "pending"}
  ]
}
```

### 7.4 `POST /api/cron/process-jobs.php`

Aufgabe:

- Von cPanel Cron aufgerufen.
- Offene Fulfillment-Jobs verarbeiten.
- Reseller-API aufrufen.
- Status aktualisieren.
- Retry-Logik ausfuehren.

Absicherung:

- Cron-Secret als Header oder CLI-only.
- Endpoint nicht offen ohne Secret ausfuehrbar.
- Rate-Limit und Locking, damit Cron nicht parallel denselben Job ausfuehrt.

### 7.5 `POST /api/reseller/poll-status.php` oder Cron-Job

Aufgabe:

- Reseller-Status periodisch abrufen, falls API das erlaubt.
- Reseller-Order-ID verwenden.
- Interne Status aktualisieren.

Wird final erst nach Sichtung der Reseller-API definiert.

## 8. Reseller-API-Integration

Prinzipien:

- API-Key bleibt nur serverseitig.
- Frontend bekommt nie API-Key, Service-ID oder echte Supplier-Response.
- Frontend darf nie direkt die Reseller-API aufrufen.
- Service-Auswahl erfolgt nur ueber interne Mapping-Tabelle.

Workflow pro Order Item:

1. Job `send_to_reseller` wird erzeugt.
2. Worker laedt Order Item.
3. Worker prueft:
   - Order ist bezahlt.
   - Item ist noch nicht gesendet.
   - Produkt ist aktiv.
   - Reseller Service ID existiert.
   - Menge liegt innerhalb erlaubter Grenzen.
4. Worker sendet API-Request an Reseller.
5. Worker speichert:
   - Reseller-Order-ID.
   - gekuerzte/sichere Response.
   - Status.
6. Bei Fehler:
   - Retry mit Backoff.
   - Nach mehreren Fehlern `needs_review`.

Idempotenz:

- Pro `order_item_id` darf nur ein erfolgreicher Reseller-Auftrag entstehen.
- `fulfillment_jobs.idempotency_key` z. B. `reseller-send-{order_item_id}`.
- Vor jedem Reseller-Call pruefen, ob `reseller_order_id` bereits existiert.
- Wenn Reseller selbst Idempotency Keys unterstuetzt, diese ebenfalls nutzen.

### 8.1 JustAnotherPanel API

Reseller-API-Doku:

- API-Seite: https://justanotherpanel.com/api
- API-Endpunkt: `https://justanotherpanel.com/api/v2`
- HTTP-Methode: `POST`
- Response-Format: `JSON`

Wichtige Actions laut API-Doku:

- `services` - Service-Liste abrufen.
- `add` - Bestellung erstellen.
- `status` - Status einer Bestellung abfragen.
- `refill` - Refill anfragen.
- `refill_status` - Refill-Status abfragen.
- `cancel` - Storno anfragen.
- `balance` - Account-Guthaben abfragen.

Basisparameter:

- `key` - API-Key.
- `action` - API-Aktion.

Standard-Order fuer normale Pakete:

```text
POST https://justanotherpanel.com/api/v2
key=JAP_API_KEY
action=add
service=RESELLER_SERVICE_ID
link=PROFIL_ODER_POST_LINK
quantity=MENGE
```

Erwartete erfolgreiche Antwort:

```json
{
  "order": 23501
}
```

Statusabfrage:

```text
POST https://justanotherpanel.com/api/v2
key=JAP_API_KEY
action=status
order=23501
```

Beispielantwort laut API-Doku:

```json
{
  "charge": "0.27819",
  "start_count": "3572",
  "status": "Partial",
  "remains": "157",
  "currency": "USD"
}
```

Mehrere Statusabfragen:

```text
action=status
orders=1,10,100
```

Die API erlaubt laut Doku bis zu 100 Order-IDs kommasepariert.

Refill:

```text
action=refill
order=23501
```

Cancel:

```text
action=cancel
orders=23501,23502
```

Balance:

```text
action=balance
```

### 8.2 JAP-Service-Mapping

Die Action `services` liefert pro Service unter anderem:

- `service` - Service ID.
- `name` - Name des Services.
- `type` - Service-Typ.
- `category` - Kategorie.
- `rate` - Einkaufspreis/Rate.
- `min` - Mindestmenge.
- `max` - Maximalmenge.
- `refill` - Refill verfuegbar.
- `cancel` - Cancel verfuegbar.

Diese Daten duerfen nicht direkt dem Kunden gezeigt werden.

Geplante interne Tabelle:

```text
reseller_services
- id
- provider = "justanotherpanel"
- reseller_service_id
- name_internal
- category_internal
- service_type
- min_quantity
- max_quantity
- reseller_rate
- reseller_currency
- refill_available
- cancel_available
- active
- last_synced_at
```

Die Shop-Produkte werden dann so verbunden:

```text
product_catalog.product_slug + quantity
-> stripe_payment_link_url oder stripe_price_id
-> reseller_service_id
```

Wichtig:

- Der Kunde darf keine `service` ID senden.
- Der Kunde darf keine `quantity` ausserhalb unserer erlaubten Staffel senden.
- Das Backend prueft zusaetzlich gegen JAP `min` und `max`.
- Wenn JAP einen Service deaktiviert oder veraendert, muss das Produkt im Shop pausiert oder manuell geprueft werden.

### 8.3 JAP-Status-Mapping

JAP gibt Statuswerte als Text zurueck. In der Doku sind unter anderem `Partial` und `In progress` sichtbar. Weitere Statuswerte muessen mit echten API-Antworten bestaetigt werden.

Vorlaeufiges Mapping:

```text
JAP Pending        -> fulfillment_queued oder in_progress
JAP Processing     -> in_progress
JAP In progress    -> in_progress
JAP Partial        -> partially_completed
JAP Completed      -> completed
JAP Canceled       -> canceled
JAP Error/unknown  -> needs_review
```

Bei `Partial`:

- `remains` speichern.
- Kunde bekommt nur eine vorsichtige Statusmeldung.
- Intern markieren als `partially_completed`.
- Je nach Refill-/Support-Regel spaeter manuell pruefen.

### 8.4 JAP-spezifische Sicherheitsregeln

- `key` wird nur serverseitig gespeichert.
- Keine JAP-Rohantwort komplett an die Statusseite ausgeben.
- `charge`, `rate`, `currency`, `start_count` sind interne Daten.
- Nur oeffentliche Statuslabels anzeigen.
- Jeder JAP-`add` Request braucht interne Idempotenz, weil die API laut Doku keine eigene Idempotency beschreibt.
- Vor jedem `add` pruefen:
  - Order ist bezahlt.
  - Order Item hat noch keine `reseller_order_id`.
  - Kein aktiver `send_to_reseller` Job laeuft bereits.
  - Menge ist erlaubt.
  - Reseller-Service ist aktiv.

Besonders kritisch:

- Wenn ein Cron-Job doppelt laeuft oder Stripe den Webhook mehrfach sendet, darf kein zweiter JAP-`add` Request entstehen.
- Das wird ueber DB-Unique-Constraints, Job-Locking und `reseller_order_id IS NULL` vor dem Call abgesichert.

## 9. Erfolgsseite und Progress

Nach erfolgreicher Zahlung landet der Kunde auf:

`/bestellung-erfolgreich/?order=FB-...&token=...`

Die Seite zeigt:

- Danke-Hinweis.
- Bestellnummer.
- Produktuebersicht.
- Phase 1: Hinweis, dass die Zahlung extern ueber Stripe erfolgt ist und die Bestellung geprueft/verarbeitet wird.
- Spaeter: Sichere Progress-Anzeige, sobald Zahlungsbestaetigung und Reseller-Automatisierung angebunden sind.
- Hinweise, dass Profil oeffentlich bleiben soll.
- Support-Link.

Progress-Status fuer spaetere Automatisierung:

- `payment_confirmed` = Zahlung bestaetigt.
- `order_prepared` = Auftrag vorbereitet.
- `queued` = Auftrag in Warteschlange.
- `sent_to_reseller` = Auftrag gestartet.
- `in_progress` = Bearbeitung laeuft.
- `completed` = abgeschlossen.
- `needs_review` = Support prueft.

Nicht anzeigen:

- Reseller-API-Key.
- Reseller-Service-ID.
- Einkaufspreise.
- Vollstaendige API-Rohantworten.
- Interne Fehlermeldungen.
- Hinweise, welcher Supplier genutzt wird.

Technik:

- Phase 1 braucht kein Live-Reseller-Polling auf Kundenseite.
- Spaeter cPanel-freundlich per Polling alle 3-5 Sekunden.
- Kein WebSocket noetig.
- Nach z. B. 2 Minuten Polling verlangsamen.
- Nach z. B. 10 Minuten statischen Hinweis anzeigen: "Du kannst die Seite schliessen, wir bearbeiten weiter."

## 10. Sicherheitspruefung

### 10.1 Angriff: Direkter Aufruf der Reseller-Ausfuehrung

Risiko:

Ein Angreifer ruft `/api/cron/process-jobs.php` oder einen Reseller-Endpunkt direkt auf.

Schutz:

- Keine oeffentlichen Reseller-Ausfuehrungsendpunkte ohne Secret.
- Cron-Secret pruefen.
- Wenn moeglich CLI-only.
- Vor jedem Reseller-Call pruefen: Order muss `paid` oder manuell als bezahlt freigegeben sein.
- Reseller-Call nur aus DB-Jobs, nie aus rohen Request-Daten.

### 10.2 Angriff: Frontend manipuliert Preis oder Menge

Risiko:

Angreifer aendert JavaScript oder Request-Daten und sendet 10.000 Einheiten zum Preis von 1,99 Euro.

Schutz:

- Backend ignoriert Frontend-Preis.
- Backend nutzt `product_catalog`.
- Maximalmengen serverseitig pruefen.
- Phase 1: Payment Link wird serverseitig ausgewaehlt, nicht vom Frontend uebernommen.
- Spaeter: Stripe-Betrag nach Zahlung gegen Order-Betrag pruefen.

### 10.3 Angriff: Fake-Zahlung durch Erfolg-URL

Risiko:

Angreifer ruft `/bestellung-erfolgreich/` direkt auf und erwartet Fulfillment.

Schutz:

- Erfolg-URL veraendert keinen Status.
- Phase 1: Erfolg-URL loest niemals Reseller-Fulfillment aus.
- Spaeter: Fulfillment nur durch serverseitig bestaetigte Zahlung, z. B. Stripe Webhook oder manuelle Admin-Freigabe.
- Statusseite zeigt nur DB-Status.

### 10.4 Spaeter: Angriff durch gefaelschten Stripe Webhook

Risiko:

Angreifer sendet JSON an `/api/stripe/webhook.php`.

Schutz:

- Stripe-Signatur mit Raw Body pruefen.
- Ungueltige Signatur = 400 und keine Verarbeitung.
- Endpoint Secret nicht im Webroot.

### 10.5 Spaeter: Doppelte Webhooks erzeugen doppelte Reseller-Bestellungen

Risiko:

Stripe sendet Events mehrfach oder ein Event wird manuell wiederholt.

Schutz:

- `stripe_event_id` unique speichern.
- `reseller_order_id` vor Reseller-Call pruefen.
- DB-Transaktionen und Locks.
- Idempotency-Key pro Order Item.

### 10.6 Angriff: Zugriff auf andere Bestellungen

Risiko:

Angreifer erratet Order-ID und schaut Status anderer Kunden an.

Schutz:

- Statusseite braucht Order-ID und geheimen Public Token.
- Token nur gehasht speichern.
- Keine Kundendetails in Status-API ausgeben.
- Rate-Limit fuer Statusabfragen.

### 10.7 Angriff: Secrets auslesen

Risiko:

API-Keys liegen in oeffentlich erreichbaren Dateien.

Schutz:

- Secrets ausserhalb Webroot.
- `.env`, `config.php`, Logs per `.htaccess` sperren, falls ausserhalb nicht moeglich.
- Keine Secrets in Git.
- `.gitignore` erweitern.
- cPanel-Dateirechte restriktiv setzen.

### 10.8 Angriff: SQL Injection

Risiko:

Manipulierte Profilnamen, Links oder E-Mails landen in SQL.

Schutz:

- Nur PDO Prepared Statements.
- Keine SQL-Strings aus Userdaten bauen.
- Eingaben validieren und laengenbegrenzen.

### 10.9 Angriff: Reseller-Panel-Spam ohne Zahlung

Risiko:

Angreifer erstellt massenhaft Pending Orders.

Schutz:

- Pending Orders sind harmlos, solange kein Fulfillment ohne Zahlung laeuft.
- Rate-Limits auf Order-Erstellung.
- Alte Pending Orders automatisch ablaufen lassen.
- Keine Reseller-Jobs vor Stripe-Zahlung erzeugen.

### 10.10 Spaeter: Webhook Timeout

Risiko:

Webhook macht zu viel Arbeit, Stripe markiert ihn als fehlgeschlagen und sendet erneut.

Schutz:

- Webhook nur verifizieren, speichern, Order paid setzen, Job erzeugen.
- Reseller-Aufruf im Cron/Worker, nicht direkt im Webhook.
- Schnell 2xx antworten.

## 11. Fehler- und Retry-Konzept

Spaeterer Stripe Webhook:

- Ungueltige Signatur: 400.
- Unbekannter Event: 200, aber `ignored` loggen.
- Doppelte Event-ID: 200, aber nicht erneut verarbeiten.
- DB-Fehler: 500, damit Stripe erneut versucht.

Reseller API:

- Timeout: Retry.
- 5xx: Retry mit Backoff.
- 4xx wegen falscher Daten: `needs_review`.
- Ungueltiger Service: `needs_review`.
- Keine Reseller-Order-ID: `needs_review`.

Backoff-Beispiel:

- Versuch 1 sofort.
- Versuch 2 nach 2 Minuten.
- Versuch 3 nach 10 Minuten.
- Versuch 4 nach 30 Minuten.
- Danach manuelle Pruefung.

## 12. Logging und Monitoring

Zu loggen:

- Order erstellt.
- Stripe Payment Link fuer Phase 1 zugeordnet.
- Spaeter: Webhook empfangen.
- Spaeter: Webhook verifiziert.
- Zahlung bestaetigt.
- Reseller Job erzeugt.
- Reseller Request gestartet.
- Reseller Response erhalten.
- Fehler und Retry.

Nicht in Logs:

- Vollstaendige API-Keys.
- Stripe Secret Keys.
- Webhook Secret.
- Vollstaendige Kundendaten, wenn nicht noetig.
- Vollstaendige Reseller-Responses mit sensiblen Daten.

## 13. Admin-Funktionen spaeter

Backend/Admin soll spaeter koennen:

- Bestellungen suchen.
- Status einsehen.
- Status manuell setzen.
- Reseller-Order-ID sehen.
- Reseller-Status neu abfragen.
- Fehlgeschlagene Fulfillment-Jobs erneut starten.
- Produkte pflegen.
- Stripe Price IDs oder Payment Links pflegen.
- Reseller Service IDs pflegen.
- Preise pflegen.
- Logs pro Bestellung ansehen.

Admin-Sicherheit:

- Login.
- Starke Passwoerter.
- 2FA, falls moeglich.
- CSRF-Schutz.
- Rollen/Rechte.
- IP-Rate-Limit.

## 14. Produkt- und Stripe-Mapping

Serverseitige Mapping-Tabelle:

```text
product_slug
platform
service_type
quantity
price_cents
stripe_price_id oder stripe_payment_link_url
reseller_service_id
active
```

Wichtig:

- Stripe-Link/Price ID wird nie aus dem Frontend genommen.
- Reseller-Service-ID wird nie im Frontend angezeigt.
- Wenn Stripe Payment Links genutzt werden, wird pro Produkt/Menge der passende Link aus der DB genommen.
- Wenn Checkout Sessions genutzt werden, wird pro Produkt/Menge die passende Stripe Price ID genutzt.

## 15. Rechtliches und Datenschutz

Zu pruefen:

- Datenschutz fuer Stripe.
- Datenschutz fuer Reseller/API-Dienstleister.
- AV-Vertrag oder Datenschutzrolle des Resellers, falls personenbezogene Daten verarbeitet werden.
- Speicherdauer fuer Bestellungen.
- Loeschkonzept.
- Impressum und AGB auf automatisierte digitale Leistung anpassen.
- Widerrufsprozess fuer digitale Leistungen sauber abbilden.

## 16. Testplan

Stripe Payment Links Phase 1:

- Passender Payment Link wird serverseitig anhand Produkt und Menge ausgewaehlt.
- Frontend kann keine Stripe-URL manipulieren.
- Bestellung wird vor Weiterleitung intern gespeichert.
- Status bleibt nach Weiterleitung `pending_external_payment` oder `manual_payment_check`.
- Kein automatischer Reseller-Auftrag ohne Zahlungspruefung.

Spaeterer Stripe-Webhook-Testplan:

- Testmodus aktivieren.
- Testzahlung erfolgreich.
- Testzahlung fehlgeschlagen.
- Webhook mit ungueltiger Signatur.
- Doppelte Webhook-Zustellung.
- Betrag manipuliert.
- Falsche Price ID, falls Checkout Sessions spaeter genutzt werden.
- Abgebrochener Payment Link/Checkout.
- Rabattcode auf Stripe-Seite.

Backend:

- Order-Erstellung mit gueltigen Daten.
- Order-Erstellung mit falschem Produkt.
- Order-Erstellung mit zu hoher Menge.
- Profil-Link zu lang.
- Statusseite mit falschem Token.
- Statusseite mit richtigem Token.
- Cron doppelt gestartet.
- Reseller API Timeout.
- Reseller API Fehler.
- Reseller API Erfolg.

Security:

- Direkter Reseller-Endpunkt-Aufruf ohne Zahlung.
- Direkter Cron-Aufruf ohne Secret.
- SQL-Injection-Versuche.
- XSS-Versuche in Profilnamen.
- Rate-Limit-Test.

## 17. Offene Punkte bis zur Implementierung

Vom Nutzer noch benoetigt:

- Reseller-API-Key oder Test-Key, spaeter sicher als Secret.
- Reseller-Service-IDs fuer jedes Produkt und jede Produktart.
- Pruefung, ob die 55 importierten Stripe Payment Links final sind.
- Mapping der 55 Payment Links in die serverseitige Produkttabelle.
- Stripe Webhook Secret fuer die Live-Webhook-Signatur.
- Checkout Sessions und Stripe Price IDs sind nur fuer eine spaetere Ausbaustufe relevant.
- Multi-Warenkorb bleibt in Phase 1 eingeschraenkt; Kunden sollen Produkte einzeln bezahlen.
- Finale Produktpreise.
- Finale E-Mail-Absenderadresse.
- cPanel PHP-Version und verfuegbare Erweiterungen.

## 18. Vorlaeufige Architektur-Empfehlung

Fuer eine sichere erste Production-Version mit nur Stripe Payment Links:

1. Frontend bleibt statisch in `frontend`.
2. PHP/MySQL-Backend wird unter `/api` bereitgestellt.
3. Private App-Dateien liegen ausserhalb des Webroots.
4. Es gibt eine MySQL-Datenbank fuer Orders und Items.
5. Frontend erstellt vor Stripe eine interne Bestellung.
6. Backend gibt den passenden vorhandenen Stripe Payment Link zurueck.
7. Kunde bezahlt extern bei Stripe.
8. Stripe Webhook bestaetigt serverseitig die Zahlung anhand von `client_reference_id`.
9. Reseller-Ausfuehrung erfolgt in Phase 1 manuell oder halbautomatisch im Admin.
10. Admin/Backoffice kommt spaeter als geschuetzter Bereich.

## 19. Recherche-Abgleich

Stripe Checkout Sessions, nur spaetere Option:

- Checkout Sessions werden serverseitig erstellt und koennen `line_items`, `success_url`, `client_reference_id`, `metadata`, `custom_fields` und `allow_promotion_codes` enthalten.
- `client_reference_id` ist fuer interne Kunden-, Warenkorb- oder Order-Referenzen gedacht.
- `custom_fields` sind begrenzt und eignen sich nicht als Ersatz fuer eine saubere interne Order-Datenbank.
- Fuer Phase 1 wird das nicht umgesetzt.

Stripe Webhooks fuer Phase 1 Payment Links:

- Webhook-Endpoints empfangen POST-Requests mit JSON Events.
- Live-Webhooks muessen als oeffentliche HTTPS-URL registriert werden.
- Die Signaturpruefung braucht den unveraenderten Raw Body.
- Der Webhook soll schnell mit 2xx antworten; komplexe Verarbeitung gehoert in Jobs/Cron.
- Stripe garantiert nicht, dass Events immer in der erwarteten Reihenfolge ankommen.
- Verarbeitete Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`.
- Payment Links bekommen beim Redirect automatisch `client_reference_id` mit der internen Order-ID.
- Automatische JAP-Uebergabe direkt im Webhook bleibt bewusst deaktiviert, bis API-Key, Service-IDs, Admin-Schutz und Monitoring vorhanden sind.

Stripe Idempotency:

- Stripe unterstuetzt Idempotency Keys fuer POST-Requests, damit Wiederholungen nicht doppelte Objekte erzeugen.
- Fuer unsere eigene Reseller-Verarbeitung brauchen wir zusaetzlich interne Idempotenz ueber Datenbank-Constraints und Job-Keys.

JustAnotherPanel:

- Die API nutzt `POST` gegen `https://justanotherpanel.com/api/v2` und antwortet mit JSON.
- Neue Orders werden mit `action=add`, `service`, `link` und `quantity` erstellt.
- Status wird mit `action=status` und einer oder mehreren Reseller-Order-IDs abgefragt.
- Die API-Doku beschreibt keine eigene Idempotency-Funktion fuer `add`; deshalb muss Deduplizierung intern erfolgen.
- Refill, Refill-Status, Cancel und Balance sind ueber eigene Actions verfuegbar.

Quellen:

- Stripe Checkout Sessions API: https://docs.stripe.com/api/checkout/sessions/create
- Stripe Webhooks: https://docs.stripe.com/webhooks
- Stripe Webhook-Signaturen: https://docs.stripe.com/webhooks/signature
- Stripe Idempotent Requests: https://docs.stripe.com/api/idempotent_requests
- JustAnotherPanel API: https://justanotherpanel.com/api

## 20. Sicherheitsfazit

Das Backend ist sicher planbar, wenn folgende Regeln strikt gelten:

- Kein Reseller-Auftrag ohne serverseitig bestaetigte Zahlung.
- Phase 1: Kein Reseller-Auftrag allein durch Payment-Link-Weiterleitung oder Erfolg-URL.
- Phase 1: Zahlung gilt nur nach gueltigem Stripe-Webhook oder bewusst gesetzter Admin-Pruefung als bestaetigt.
- Kein Vertrauen in Frontend-Preis, Frontend-Produktdaten oder Erfolg-URL.
- Secrets niemals ins Frontend oder in oeffentliche Ordner.
- Doppelte Stripe Events und doppelte Cron-Laeufe muessen technisch abgefangen werden.
- Reseller-Auftraege werden ueber Jobs verarbeitet und pro Order Item dedupliziert.
- Die Erfolgsseite zeigt nur Kundensafe-Statusdaten.

Der wichtigste Architekturpunkt ist: Die Reseller-API darf nur aus einem serverseitigen, bezahlten, eindeutig zugeordneten Order Item heraus aufgerufen werden.
