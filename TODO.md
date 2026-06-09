Wichtig für cPanel:

- Lege in cPanel am besten `noreply@fameboost.de` als E-Mail-Adresse an.
- Aktiviere/prüfe in cPanel unter **Email Deliverability** SPF und DKIM für `fameboost.de`.
- Wenn du deployest, muss der Inhalt von `frontend` in den Webroot, oder der Document Root muss auf `frontend` zeigen. Dann ist der Endpunkt erreichbar unter `/api/contact.php`.
