@echo off
chcp 65001 >nul
title Receive IPA
set "PATH=F:\iOSDev\node;%PATH%"
cd /d "%~dp0"
node "scripts\serve-ipa.js"
pause