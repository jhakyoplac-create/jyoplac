@echo off
cd /d "%~dp0"
echo Iniciando sistema dental con base de datos...
set PORT=8790
py backend\server.py
pause
