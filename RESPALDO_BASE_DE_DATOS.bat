@echo off
cd /d "%~dp0"
if not exist "backups" mkdir "backups"
for /f %%a in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd-HHmmss"') do set MARCA=%%a
set DESTINO=backups\dental-%MARCA%.sqlite3
copy "database\dental.sqlite3" "%DESTINO%"
echo.
echo Respaldo creado:
echo %CD%\%DESTINO%
echo.
pause
