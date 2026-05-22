@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File "%~dp0backup_cloud.ps1" -SaveCredentials
echo.
echo Creando tarea automatica diaria a las 21:00...
schtasks /Create /F /SC DAILY /ST 21:00 /TN "CM Odontologia Respaldo Nube" /TR "powershell -ExecutionPolicy Bypass -File \"%~dp0backup_cloud.ps1\""
echo.
echo Listo. El respaldo automatico correra todos los dias a las 9:00 p.m.
echo Tambien puedes ejecutarlo manualmente con RESPALDO_NUBE_CM.bat
pause
