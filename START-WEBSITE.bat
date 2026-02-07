@echo off
:: ═══════════════════════════════════════════════════════════════════════════════
:: HEADY EMERGENCY START — Fix Websites Not Working
:: ═══════════════════════════════════════════════════════════════════════════════

echo.
echo ╔═══════════════════════════════════════════════════════════════════════════════╗
echo ║           HEADY EMERGENCY WEBSITE FIX                                          ║
echo ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.

cd /d "C:\Heady" 2>nul || cd /d "%~dp0"

echo 🔍 Checking if HeadyManager is running...
curl -s http://localhost:3300/api/health >nul 2>&1
if %errorlevel% == 0 (
    echo ✅ HeadyManager is ALREADY RUNNING on port 3300
    echo    Website should be accessible at http://localhost:3300
    goto :browser
) else (
    echo ❌ HeadyManager NOT RUNNING — Starting now...
)

echo.
echo 📦 Installing dependencies (if needed)...
call npm install --silent 2>nul

echo.
echo 🚀 Starting HeadyManager on port 3300...
echo    Website will be available at: http://api.manager.local.heady.internal:3300
echo.
echo    Press Ctrl+C to stop
echo.

node heady-manager.js

:browser
echo.
echo 🌐 Opening browser...
start http://api.manager.local.heady.internal:3300

echo.
echo ✅ DONE! Website should now work.
pause
