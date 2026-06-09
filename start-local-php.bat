@echo off
cd /d "%~dp0"
tools\php\php.exe -S 127.0.0.1:8080 -t frontend frontend\router.php
pause
