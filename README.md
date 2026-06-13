# FameBoost.de

## Wichtig beim Deployment

Nicht überschreiben / nicht löschen:

```text
/public_html/api/_private/config.local.php
```

Enthält die echten Secrets: Stripe Secret Key, Webhook Secret, Reseller API Key usw.

```text
/public_html/api/_private/data/
```

Darin liegen die Live-Daten. Diesen Ordner nicht überschreiben und nicht löschen.

## Upload-ZIP bauen

Unter Windows im Projekt-Root ausführen:

```bat
build-frontend-upload-zip.bat
```

Das erzeugt:

```text
dist/fameboost-frontend-upload.zip
```

Das ZIP enthält den Inhalt von `frontend`, aber nicht:

```text
frontend/api/_private/config.local.php
frontend/api/_private/data/
*.log
```

Wichtig: Beim Deployment das ZIP über die vorhandenen Dateien in `public_html` entpacken. Nicht vorher `public_html` löschen, sonst gehen die Live-Daten auf dem Server verloren.
