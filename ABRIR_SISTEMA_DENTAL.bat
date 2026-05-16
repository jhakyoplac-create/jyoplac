@echo off
cd /d "%~dp0"
start "" "http://127.0.0.1:8787/index.html"
"C:\Users\Jhank Yoplac Cabrera\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8787 --bind 127.0.0.1
