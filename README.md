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
