# ╔══════════════════════════════════════════════════════════╗
# ║  Heady Browser Extensions — Build All                    ║
# ║  Packages extensions for Chrome, Firefox, Edge, Safari   ║
# ╚══════════════════════════════════════════════════════════╝

param(
    [string]$OutputDir = ".\dist",
    [switch]$ChromeOnly,
    [switch]$FirefoxOnly
)

$ExtRoot = $PSScriptRoot

Write-Host ""
Write-Host "  ⬡ Heady Browser Extensions — Build All" -ForegroundColor Magenta
Write-Host ""

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

function Build-ChromeExtension {
    Write-Host "  [Chrome/Edge/Brave/Vivaldi/Arc] Building..." -ForegroundColor Cyan
    $ChromeDir = Join-Path $ExtRoot "chrome"
    $ZipPath = Join-Path $OutputDir "heady-chrome.zip"
    
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    
    Compress-Archive -Path "$ChromeDir\*" -DestinationPath $ZipPath -Force
    Write-Host "    ✓ $ZipPath" -ForegroundColor Green
    
    # Edge uses same build
    Copy-Item $ZipPath (Join-Path $OutputDir "heady-edge.zip") -Force
    Write-Host "    ✓ heady-edge.zip (copy of Chrome build)" -ForegroundColor Green
}

function Build-FirefoxExtension {
    Write-Host "  [Firefox] Building..." -ForegroundColor Cyan
    $FirefoxDir = Join-Path $ExtRoot "firefox"
    $ZipPath = Join-Path $OutputDir "heady-firefox.xpi"
    
    if (Test-Path $ZipPath) { Remove-Item $ZipPath }
    
    Compress-Archive -Path "$FirefoxDir\*" -DestinationPath $ZipPath -Force
    Write-Host "    ✓ $ZipPath" -ForegroundColor Green
}

function Build-SafariExtension {
    Write-Host "  [Safari] Skipping (requires Xcode on macOS)" -ForegroundColor Yellow
    Write-Host "    See safari/README.md for macOS build instructions" -ForegroundColor Gray
}

# Build based on flags
if ($ChromeOnly) {
    Build-ChromeExtension
} elseif ($FirefoxOnly) {
    Build-FirefoxExtension
} else {
    Build-ChromeExtension
    Build-FirefoxExtension
    Build-SafariExtension
}

Write-Host ""
Write-Host "  Build complete! Output in: $OutputDir" -ForegroundColor Green
Write-Host ""
Write-Host "  Installation:" -ForegroundColor Gray
Write-Host "    Chrome:  chrome://extensions → Load unpacked → select chrome/" -ForegroundColor Gray
Write-Host "    Edge:    edge://extensions → Load unpacked → select edge/" -ForegroundColor Gray  
Write-Host "    Firefox: about:debugging → Load Temporary Add-on → select firefox/manifest.json" -ForegroundColor Gray
Write-Host "    Brave:   brave://extensions → Load unpacked → select chrome/" -ForegroundColor Gray
Write-Host ""
