@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0backup_cloud.ps1"
echo.
pause
