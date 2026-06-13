@echo off
setlocal

set "ROOT=%~dp0"
set "SRC=%ROOT%frontend"
set "OUT=%ROOT%dist"
set "STAGE=%OUT%\frontend-upload-staging"
set "ZIP=%OUT%\fameboost-frontend-upload.zip"

if not exist "%SRC%" (
  echo Fehler: frontend-Ordner wurde nicht gefunden: "%SRC%"
  exit /b 1
)

if not exist "%OUT%" mkdir "%OUT%"

if exist "%STAGE%" (
  echo Entferne alten temporaeren Staging-Ordner...
  rmdir /s /q "%STAGE%"
)

mkdir "%STAGE%"

echo Kopiere Frontend-Dateien ohne Live-Secrets und Live-Daten...
robocopy "%SRC%" "%STAGE%" /E /XD "%SRC%\api\_private\data" /XF "config.local.php" "*.log" "*.zip" >nul
if %ERRORLEVEL% GEQ 8 (
  echo Fehler: Dateien konnten nicht kopiert werden. Robocopy-Code: %ERRORLEVEL%
  exit /b %ERRORLEVEL%
)

if exist "%ZIP%" del /f /q "%ZIP%"

echo Erstelle ZIP...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Compress-Archive -Path '%STAGE%\*' -DestinationPath '%ZIP%' -Force"
if %ERRORLEVEL% NEQ 0 (
  echo Fehler: ZIP konnte nicht erstellt werden.
  exit /b %ERRORLEVEL%
)

rmdir /s /q "%STAGE%"

echo.
echo Fertig:
echo %ZIP%
echo.
echo Nicht enthalten:
echo - frontend\api\_private\config.local.php
echo - frontend\api\_private\data\
echo - *.log
echo - *.zip

endlocal
