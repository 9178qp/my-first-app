@echo off
chcp 65001 >nul
title My First App - Dev Server
set "PATH=F:\iOSDev\node;%PATH%"
cd /d "%~dp0"
echo.
echo   Starting the dev server...
echo   Scan the QR code below with the iPhone Camera app,
echo   it will open in Expo Go.
echo   Close this window to stop the server.
echo.
node "node_modules\expo\bin\cli" start
echo.
pause