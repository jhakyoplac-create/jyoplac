@echo off
cd /d "%~dp0"
echo Iniciando sistema dental para red local...
echo.
echo IMPORTANTE:
echo - Mantenga esta laptop encendida mientras otras laptops usen el sistema.
echo - Si Windows pregunta por permisos de firewall, permita el acceso en red privada.
echo.
set PORT=8790
set HOST=0.0.0.0
py backend\server.py
pause
