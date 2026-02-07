@echo off
set "ROOT=%~dp0"
cd /d "%ROOT%"

:: Start the Heady Nexus Daemon in the background
start /b powershell.exe -ExecutionPolicy Bypass -File "%ROOT%heady_nexus_daemon.ps1"

:: Proceed with existing build logic
node src\heady_intelligence_verifier.js
if %ERRORLEVEL% NEQ 0 exit /b 1
node src\hc_autobuild.js %*
