@echo off
cd /d "%~dp0"
echo Same Answer will be available at http://127.0.0.1:4173
echo Keep this window open while using the app.
node tools\serve.mjs
pause
