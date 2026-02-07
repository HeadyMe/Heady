@echo off
:: ═══════════════════════════════════════════════════════════════════════════════
:: HEADY SYSTEMS — DESKTOP E FOLDER SETUP
:: Creates branded E drive experience on Desktop
:: ═══════════════════════════════════════════════════════════════════════════════

set "DESKTOP=%USERPROFILE%\Desktop"
set "E_FOLDER=%DESKTOP%\E"
set "SOURCE=%~dp0"

echo.
echo ╔═══════════════════════════════════════════════════════════════════════════════╗
echo ║           HEADY SYSTEMS — Desktop E Folder Setup                             ║
echo ║           Sacred Geometry • Organic Systems • Breathing Interfaces             ║
echo ╚═══════════════════════════════════════════════════════════════════════════════╝
echo.

:: Check if E folder already exists
if exist "%E_FOLDER%" (
    echo ⚠️  E folder already exists at: %E_FOLDER%
    echo    Updating contents...
    rmdir /S /Q "%E_FOLDER%" 2>nul
)

:: Create E folder structure
echo 📁 Creating E folder structure...
mkdir "%E_FOLDER%\HeadyOS" 2>nul
mkdir "%E_FOLDER%\HeadyOS\node" 2>nul
mkdir "%E_FOLDER%\HeadyOS\python" 2>nul
mkdir "%E_FOLDER%\HeadyOS\heady" 2>nul
mkdir "%E_FOLDER%\HeadyOS\scripts" 2>nul
mkdir "%E_FOLDER%\ISOs" 2>nul
mkdir "%E_FOLDER%\ventoy" 2>nul
mkdir "%E_FOLDER%\distribution" 2>nul
mkdir "%E_FOLDER%\distribution\bundles" 2>nul
mkdir "%E_FOLDER%\distribution\payment-schema" 2>nul
mkdir "%E_FOLDER%\distribution\gift-packs" 2>nul
mkdir "%E_FOLDER%\projects" 2>nul
mkdir "%E_FOLDER%\backups" 2>nul

:: Copy Heady project files
echo 📦 Copying Heady project files...
xcopy /E /I /Y "%SOURCE%\heady-manager.js" "%E_FOLDER%\HeadyOS\heady\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\package.json" "%E_FOLDER%\HeadyOS\heady\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\configs" "%E_FOLDER%\HeadyOS\heady\configs\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\src" "%E_FOLDER%\HeadyOS\heady\src\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\frontend" "%E_FOLDER%\HeadyOS\heady\frontend\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\public" "%E_FOLDER%\HeadyOS\heady\public\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\distribution" "%E_FOLDER%\distribution\" >nul 2>&1
xcopy /E /I /Y "%SOURCE%\scripts" "%E_FOLDER%\HeadyOS\scripts\" >nul 2>&1

:: Create launcher scripts
echo 🚀 Creating launcher scripts...
(
echo @echo off
echo :: HeadyManager Launcher
echo cd /d "%%~dp0HeadyOS\heady"
echo echo Starting HeadyManager on port 3300...
echo call npm install 2^>nul
echo node heady-manager.js
echo pause
) > "%E_FOLDER%\Launch HeadyManager.bat"

(
echo @echo off
echo :: Heady Shell
echo cd /d "%%~dp0HeadyOS\heady"
echo echo ╔══════════════════════════════════════════════════════════════════╗
echo echo ║  HEADY SHELL - Sacred Geometry Environment                       ║
echo echo ╚══════════════════════════════════════════════════════════════════╝
echo echo.
echo echo Available commands:
echo echo   heady status     - Check system status
echo echo   heady sync       - Sync all repositories
echo echo   heady build      - Run clean build
echo echo   heady deploy     - Deploy to cloud
echo echo.
echo cmd /k "cd /d %%~dp0HeadyOS\heady ^&^& set HEADY_ENV=local ^&^& set HEADY_DOMAIN_ROOT=heady.internal"
) > "%E_FOLDER%\Heady Shell.bat"

(
echo @echo off
echo :: Quick Status Check
echo echo Checking Heady Systems status...
echo curl -s http://localhost:3300/api/health ^|^| echo ❌ HeadyManager not running
echo echo.
echo echo Press any key to exit...
echo pause ^>nul
) > "%E_FOLDER%\Status Check.bat"

:: Create README
echo 📝 Creating README...
(
echo # 🌟 E DRIVE — Heady Systems Desktop Portal
echo.
echo ## Quick Start
echo.
echo - **Launch HeadyManager.bat** — Start the Heady orchestrator
echo - **Heady Shell.bat** — Open development environment
echo - **Status Check.bat** — Quick health check
echo.
echo ## Folder Structure
echo.
echo ```
echo E:
echo ├── HeadyOS
echo │   ├── heady	https://github.com/HeadySystems/Heady
)
