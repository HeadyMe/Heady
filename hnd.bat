@echo off
set "ROOT=%~dp0"
powershell.exe -ExecutionPolicy Bypass -File "%ROOT%heady_nexus_daemon.ps1" %*
