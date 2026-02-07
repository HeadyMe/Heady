@echo off
:: ╔══════════════════════════════════════════════════════════╗
:: ║  Heady E:/ Distribution Sync Script                      ║
:: ║  Mirrors repo distribution to E:/ drive                  ║
:: ╚══════════════════════════════════════════════════════════╝

set REPO_DIST=C:\Users\erich\Heady\distribution
set E_DIST=E:\distribution

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  Heady Distribution Sync to E:/                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

if not exist E:\ (
    echo [ERROR] E: drive not found!
    exit /b 1
)

echo [INFO] Syncing from: %REPO_DIST%
echo [INFO] Syncing to:   %E_DIST%
echo.

:: Create directories
echo [1/4] Creating directory structure...
mkdir "%E_DIST%" 2>nul
mkdir "%E_DIST%\headyos\desktop\mac" 2>nul
mkdir "%E_DIST%\headyos\desktop\windows" 2>nul
mkdir "%E_DIST%\headyos\desktop\linux" 2>nul
mkdir "%E_DIST%\headyos\browser-shell\local" 2>nul
mkdir "%E_DIST%\headyos\browser-shell\hybrid" 2>nul
mkdir "%E_DIST%\headyos\browser-shell\cloud" 2>nul
mkdir "%E_DIST%\headyos\web-shell" 2>nul
mkdir "%E_DIST%\headyos\mobile-shell\apks" 2>nul
mkdir "%E_DIST%\browser\extensions\chrome" 2>nul
mkdir "%E_DIST%\browser\extensions\edge" 2>nul
mkdir "%E_DIST%\browser\extensions\firefox" 2>nul
mkdir "%E_DIST%\browser\extensions\safari" 2>nul
mkdir "%E_DIST%\mobile\android\apks" 2>nul
mkdir "%E_DIST%\ide\vscode" 2>nul
mkdir "%E_DIST%\ide\jetbrains" 2>nul
mkdir "%E_DIST%\ide\neovim" 2>nul
mkdir "%E_DIST%\ide\eclipse" 2>nul
mkdir "%E_DIST%\ide\emacs" 2>nul
mkdir "%E_DIST%\ide\sublime" 2>nul
mkdir "%E_DIST%\ide\vim" 2>nul
mkdir "%E_DIST%\ide\visual-studio" 2>nul
mkdir "%E_DIST%\ide\windsurf" 2>nul
mkdir "%E_DIST%\ide\xcode" 2>nul
mkdir "%E_DIST%\mcp\servers" 2>nul
mkdir "%E_DIST%\mcp\configs" 2>nul
mkdir "%E_DIST%\docker\base" 2>nul
mkdir "%E_DIST%\docker\profiles" 2>nul
mkdir "%E_DIST%\bundles" 2>nul
mkdir "%E_DIST%\billing-config" 2>nul
mkdir "%E_DIST%\docs\install" 2>nul
mkdir "%E_DIST%\docs\admin" 2>nul
mkdir "%E_DIST%\docs\connectors" 2>nul
mkdir "E:\install" 2>nul
mkdir "E:\config" 2>nul
mkdir "E:\logs" 2>nul
mkdir "E:\notes" 2>nul

echo [2/4] Copying distribution files...
robocopy "%REPO_DIST%" "%E_DIST%" /E /XD node_modules .git /NFL /NDL /NJH /NJS

echo [3/4] Creating install scripts...

call :create_install_desktop
call :create_install_browser
call :create_install_ide
call :create_docker_quickstart

echo [4/4] Creating README shortcut...
copy "%REPO_DIST%\E_DRIVE_QUICKREF.md" "E:\README.md" >nul

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  Sync Complete!                                            ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo E:/distribution is now ready with:
echo   - All HeadyOS forms (desktop, browser, web, mobile)
echo   - Browser extensions (Chrome, Edge, Firefox, Safari)
echo   - IDE extensions (VS Code, JetBrains, Neovim, etc.)
echo   - MCP server configs
echo   - Docker Compose profiles
echo   - Billing and pricing configs
echo   - Installation scripts
echo.
echo Quick start:
echo   E:\install\install-desktop.bat    - Install HeadyOS Desktop
echo   E:\install\install-browser.bat    - Install browser extension
echo   E:\install\install-ide.bat        - Install IDE extensions
echo   E:\install\docker-quickstart.bat  - Start Docker stack
echo.

exit /b 0

:create_install_desktop
(
echo @echo off
echo :: Install HeadyOS Desktop
echo set PLATFORM=windows
echo if exist "E:\distribution\headyos\desktop\windows\headyos-desktop-setup.exe" ^(
echo     echo Installing HeadyOS Desktop for Windows...
echo     start "HeadyOS Desktop Installer" "E:\distribution\headyos\desktop\windows\headyos-desktop-setup.exe"
echo ^) else ^(
echo     echo [ERROR] Installer not found. Build from source first.
echo     echo Source: C:\Users\erich\Heady\desktop-overlay\
echo ^)
) > "E:\install\install-desktop.bat"
exit /b 0

:create_install_browser
(
echo @echo off
echo :: Install Heady Browser Extension
echo echo.
echo echo ╔══════════════════════════════════════════════════════════╗
echo echo ║  Heady Browser Extension Installer                       ║
echo ╚══════════════════════════════════════════════════════════╝
echo echo.
echo echo Select browser:
echo echo   [1] Chrome
echo echo   [2] Edge
echo echo   [3] Firefox
echo echo.
echo set /p choice=Enter choice [1-3]: 
echo.
echo if "%%choice%%"=="1" ^(
echo     echo Opening Chrome extensions page...
echo     start chrome://extensions
echo     echo Load unpacked extension from: E:\distribution\browser\extensions\chrome\
echo ^)
echo if "%%choice%%"=="2" ^(
echo     echo Opening Edge extensions page...
echo     start ms-edge://extensions
echo     echo Load unpacked extension from: E:\distribution\browser\extensions\edge\
echo ^)
echo if "%%choice%%"=="3" ^(
echo     echo Opening Firefox...
echo     start firefox
echo     echo Navigate to: about:debugging
echo     echo Load temporary addon from: E:\distribution\browser\extensions\firefox\
echo ^)
) > "E:\install\install-browser.bat"
exit /b 0

:create_install_ide
(
echo @echo off
echo :: Install Heady IDE Extensions
echo echo.
echo echo ╔══════════════════════════════════════════════════════════╗
echo echo ║  Heady IDE Extension Installer                           ║
echo ╚══════════════════════════════════════════════════════════╝
echo echo.
echo echo Available IDEs:
echo echo   [1] VS Code
echo echo   [2] JetBrains ^(IntelliJ, PyCharm, etc.^)
echo echo   [3] Neovim
echo echo   [4] Windsurf
echo echo.
echo set /p choice=Enter choice [1-4]: 
echo.
echo if "%%choice%%"=="1" ^(
echo     if exist "E:\distribution\ide\vscode\heady-dev-companion.vsix" ^(
echo         echo Installing VS Code extension...
echo         code --install-extension "E:\distribution\ide\vscode\heady-dev-companion.vsix"
echo     ^) else ^(
echo         echo [WARN] VSIX file not found. Build from: C:\Users\erich\Heady\distribution\ide\vscode\
echo     ^)
echo ^)
echo if "%%choice%%"=="2" ^(
echo     echo JetBrains plugin installation:
echo     echo 1. Open IDE ^→ Settings ^→ Plugins ^→ Install from disk
echo     echo 2. Select: E:\distribution\ide\jetbrains\heady-assistant.zip
echo ^)
echo if "%%choice%%"=="3" ^(
echo     echo Neovim setup:
echo     echo 1. Copy config to your nvim config directory
echo     echo 2. xcopy /E "E:\distribution\ide\neovim" "%%LOCALAPPDATA%%\nvim\pack\heady\start\heady-nvim\" 
echo ^)
echo if "%%choice%%"=="4" ^(
echo     echo Windsurf: Extension should auto-install via Windsurf marketplace
echo     echo Or copy from: E:\distribution\ide\windsurf\
echo ^)
) > "E:\install\install-ide.bat"
exit /b 0

:create_docker_quickstart
(
echo @echo off
echo :: Docker Quick Start
echo echo.
echo echo ╔══════════════════════════════════════════════════════════╗
echo echo ║  Heady Docker Quick Start                                ║
echo ╚══════════════════════════════════════════════════════════╝
echo echo.
echo echo Select deployment mode:
echo echo   [1] Local Offline ^(everything on-device^)
echo echo   [2] Hybrid ^(local + cloud fallback^)
echo echo   [3] Cloud SaaS ^(full cloud deployment^)
echo echo   [4] API Only ^(headless API^)
echo echo   [5] Full Suite ^(everything enabled^)
echo echo.
echo set /p choice=Enter choice [1-5]: 
echo.
echo cd /d "E:\distribution\docker"
echo.
echo if "%%choice%%"=="1" docker compose -f base.yml -f profiles\local-offline.yml up -d
echo if "%%choice%%"=="2" docker compose -f base.yml -f profiles\hybrid.yml up -d
echo if "%%choice%%"=="3" docker compose -f base.yml -f profiles\cloud-saas.yml up -d
echo if "%%choice%%"=="4" docker compose -f base.yml -f profiles\api-only.yml up -d
echo if "%%choice%%"=="5" docker compose -f base.yml -f profiles\full-suite.yml up -d
echo.
echo echo.
echo echo Heady services starting...
echo echo API:      http://localhost:3300
echo echo Web:      http://localhost:3000
echo echo IDE:      http://localhost:8443
echo echo.
) > "E:\install\docker-quickstart.bat"
exit /b 0
