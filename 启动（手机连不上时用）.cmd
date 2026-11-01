@echo off
chcp 65001 >nul
title My First App - Tunnel Mode
set "PATH=F:\iOSDev\node;%PATH%"
cd /d "%~dp0"
echo.
echo   Tunnel mode: use this if your phone cannot reach the PC
echo   on the same Wi-Fi. The first run downloads a small helper
echo   (ngrok) - type y and press Enter when asked.
echo.
node "node_modules\expo\bin\cli" start --tunnel
echo.
pause