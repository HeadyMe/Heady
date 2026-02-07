---
description: HCFP Extension Installation Flow
auto_execution_mode: 3
---

# HCFP Extension Installation Flow

## Quick Start

```powershell
# Run the HCFP extension flow
.\scripts\install-all-extensions.ps1

# Preview without installing
.\scripts\install-all-extensions.ps1 -WhatIf

# Browser extensions only
.\scripts\install-all-extensions.ps1 -BrowserOnly

# IDE extensions only
.\scripts\install-all-extensions.ps1 -IDEOnly

# Force reinstall all
.\scripts\install-all-extensions.ps1 -Force
```

## HCFP Clean Flow

### Phase 1: Environment Scan
```powershell
# Check all browsers installed
- Chrome:    %LOCALAPPDATA%\Google\Chrome
- Firefox:   %ProgramFiles%\Mozilla Firefox
- Edge:      %ProgramFiles%\Microsoft\Edge
- Brave:     %LOCALAPPDATA%\BraveSoftware

# Check all IDEs installed
- VS Code:   %LOCALAPPDATA%\Programs\Microsoft VS Code
- JetBrains: %LOCALAPPDATA%\JetBrains or %ProgramFiles%\JetBrains
- Vim:       %USERPROFILE%\.vim or nvim config
```

### Phase 2: Extension Inventory
| Browser | Required Extensions | Status |
|---------|-------------------|--------|
| Chrome | Heady AI Companion | ✓ Ready |
| Chrome | React Developer Tools | ✓ Ready |
| Chrome | Wappalyzer | ✓ Ready |
| Chrome | uBlock Origin | ✓ Ready |
| Edge | Heady AI Companion | ✓ Ready |
| Firefox | Heady AI Companion | ✓ Ready |

| IDE | Required Extensions | Status |
|-----|-------------------|--------|
| VS Code | Heady Dev Companion | ✓ Ready |
| VS Code | GitHub Copilot | ✓ Ready |
| VS Code | Python/TypeScript/YAML | ✓ Ready |
| JetBrains | Heady Assistant | ✓ Ready |
| Vim | heady.vim | ✓ Ready |

### Phase 3: Clean Installation
```powershell
# Error handling per component
foreach ($browser in $browsers) {
    try {
        Install-BrowserExtensions -Name $browser
        Log-Success $browser
    } catch {
        $errorType = Classify-Error $_
        switch ($errorType) {
            "BrowserNotFound" { Log-Warning "$browser not installed, skipping" }
            "PermissionDenied" { Log-Error "Run as Administrator for $browser" }
            "NetworkError" { Retry-Install $browser -MaxRetries 2 }
            default { Log-Error $_ }
        }
    }
}
```

### Phase 4: Verification
```powershell
# Verify installations
- Check extension manifests exist
- Verify VS Code extension list: code --list-extensions
- Test browser extension loading
- Confirm settings sync enabled
```

### Phase 5: Sync Configuration
```powershell
# Enable cross-device sync
- VS Code: Settings Sync → Turn On
- JetBrains: Settings → Settings Sync
- Browsers: Profile sync + Heady auto-update
```

## Error Classification

| Error | Type | Recovery |
|-------|------|----------|
| Browser not found | Info | Skip, continue |
| Permission denied | Warning | Prompt elevation |
| Network timeout | Transient | Retry ×2 |
| Extension conflict | Warning | Prompt uninstall |
| VS Code not in PATH | Warning | Show manual install |

## Extension Sources

### Local (Heady Extensions)
```
distribution/browser/extensions/chrome/     → Chrome/Brave/Edge
distribution/browser/extensions/firefox/    → Firefox
distribution/browser/extensions/edge/       → Edge (native)
distribution/ide/vscode/heady-extension.vsix → VS Code
distribution/ide/jetbrains/heady-assistant.jar → JetBrains
distribution/ide/vim/heady.vim              → Vim/Neovim
```

### Web Store/Marketplace
```
Chrome Web Store:  https://chrome.google.com/webstore/detail/{ID}
Firefox Add-ons:     https://addons.mozilla.org/firefox/addon/{ID}
Edge Add-ons:        https://microsoftedge.microsoft.com/addons/detail/{ID}
VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName={ID}
JetBrains Marketplace: In-IDE plugin manager
```

## Post-Installation

### Manual Steps Required
1. **Chrome/Edge**: Enable Developer mode → Load unpacked → Select `distribution/browser/extensions/chrome/`
2. **Firefox**: about:debugging → Load Temporary Add-on → Select manifest.json
3. **VS Code**: Extensions view → ... → Install from VSIX → Select `heady-extension.vsix`
4. **JetBrains**: Settings → Plugins → ⚙️ → Install from disk → Select `heady-assistant.jar`
5. **Vim**: Copy `heady.vim` to `~/.vim/plugin/`

### Settings Sync
```powershell
# Verify sync is working
$extensionVersions = @{
    "Chrome Heady" = Get-ChromeExtensionVersion "heady-ai-extension"
    "VS Code Heady" = Get-VSCodeExtensionVersion "heady.heady-dev-companion"
    "JetBrains Heady" = Get-JetBrainsPluginVersion "Heady Assistant"
}

# All versions should match across devices
$extensionVersions | Format-Table
```

## Troubleshooting

### Extension Not Loading
```powershell
# Check manifest format
Test-ExtensionManifest -Path "distribution/browser/extensions/chrome/manifest.json"

# Verify permissions
Get-ExtensionPermissions -Browser chrome -Extension "heady-ai-extension"
```

### VS Code Extension Fails
```powershell
# Check code command available
Get-Command code

# Manual install fallback
$vsix = "distribution/ide/vscode/heady-extension.vsix"
& "$env:LOCALAPPDATA\Programs\Microsoft VS Code\bin\code.cmd" --install-extension $vsix
```

### JetBrains Plugin Not Found
```powershell
# Check product install location
Get-JetBrainsProducts | Select Name, InstallPath

# Manual copy to plugins folder
$pluginsDir = "$env:USERPROFILE\AppData\Roaming\JetBrains\IntelliJIdea2023.3\plugins"
Copy-Item "distribution/ide/jetbrains/heady-assistant.jar" $pluginsDir
```

## Monitoring

### Extension Health Check
```powershell
# Run as part of HCFP health check
.\scripts\extension-health-check.ps1

# Output:
# ✓ Chrome: 12 extensions active
# ✓ VS Code: 15 extensions active  
# ✓ JetBrains: 5 plugins active
# ⚠ Firefox: Heady extension disabled (click to enable)
```

### Update Check
```powershell
# Check for extension updates
.\scripts\check-extension-updates.ps1

# Auto-update if version mismatch
Update-Extensions -AutoUpdate:$true
```

## CI/CD Integration

### GitHub Action
```yaml
name: Extension HCFP
on: [push, pull_request]
jobs:
  extensions:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Extensions
        run: |
          .\scripts\install-all-extensions.ps1 -WhatIf
      - name: Verify Manifests
        run: |
          Test-ExtensionManifests -FailOnError
```

## Alert Configuration

Notify when:
- Extension installation fails after retries
- New extension version available
- Extension compatibility issue detected
- Settings sync failing across devices

```yaml
# configs/observability.yaml
alerts:
  - name: ExtensionInstallFailed
    condition: extension_install_success == 0
    action: "Check extension manifest and browser compatibility"
    
  - name: ExtensionVersionMismatch
    condition: extension_version_drift > 0
    action: "Update extensions to latest version"
```

## Related Workflows

- `.windsurf/workflows/hcfp-clean-build.md` — Main build pipeline
- `.windsurf/workflows/headysync-prep.md` — Post-install sync
- `.windsurf/workflows/monte-carlo-optimization.md` — Performance tuning

---

**Run the flow:** `.

\scripts\install-all-extensions.ps1`
