# ╔══════════════════════════════════════════════════════════╗
# ║  Heady — Sync Distribution Pack to E:\ Drive            ║
# ║  Mirrors distribution/ to OnePlus Open CrossDevice       ║
# ║  Usage: .\scripts\sync-to-e-drive.ps1                   ║
# ╚══════════════════════════════════════════════════════════╝

param(
    [string]$Source = "C:\Users\erich\Heady\distribution",
    [string]$Dest = "C:\Users\erich\CrossDevice\E's OnePlus Open\HeadyStack\distribution",
    [switch]$DryRun
)

Write-Host ""
Write-Host "  ╔══════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║  Heady — E:\ Drive Sync              ║" -ForegroundColor Cyan
Write-Host "  ║  ∞ SACRED GEOMETRY ∞                 ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Validate source
if (-not (Test-Path $Source)) {
    Write-Host "ERROR: Source not found: $Source" -ForegroundColor Red
    exit 1
}

# Create destination if needed
if (-not (Test-Path $Dest)) {
    Write-Host "Creating destination: $Dest" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
}

Write-Host "Source:      $Source" -ForegroundColor Gray
Write-Host "Destination: $Dest" -ForegroundColor Gray
Write-Host ""

# Robocopy flags
$RoboFlags = @(
    "/MIR"           # Mirror (sync deletions too)
    "/XD", "node_modules", ".git", "__pycache__", ".next", "dist", "build"
    "/XF", "*.log", "*.tmp", "*.bak"
    "/NP"            # No progress percentage (cleaner output)
    "/NFL"           # No file list (summary only)
    "/NDL"           # No directory list
    "/NJH"           # No job header
    "/NJS"           # No job summary
)

if ($DryRun) {
    $RoboFlags += "/L"  # List only, don't copy
    Write-Host "[DRY RUN] No files will be copied" -ForegroundColor Yellow
    Write-Host ""
}

# Sync distribution pack
Write-Host "Syncing distribution pack..." -ForegroundColor Green
robocopy $Source $Dest @RoboFlags

# Also sync key top-level files
$ExtraFiles = @(
    @{ Src = "C:\Users\erich\Heady\docs\HEADY_STACK_DISTRIBUTION_PROTOCOL.md"; Dst = "$Dest\..\docs\" },
    @{ Src = "C:\Users\erich\Heady\docs\HEADY_BROWSER_BUDDY_IDE_PROTOCOL.md"; Dst = "$Dest\..\docs\" },
    @{ Src = "C:\Users\erich\Heady\docs\HEADY_AUTO_IDE.md"; Dst = "$Dest\..\docs\" },
    @{ Src = "C:\Users\erich\Heady\scripts\phone-ssh-setup.sh"; Dst = "$Dest\..\scripts\" },
    @{ Src = "C:\Users\erich\Heady\configs\heady-browser.yaml"; Dst = "$Dest\..\configs\" },
    @{ Src = "C:\Users\erich\Heady\configs\heady-buddy-always-on.yaml"; Dst = "$Dest\..\configs\" },
    @{ Src = "C:\Users\erich\Heady\configs\heady-ide.yaml"; Dst = "$Dest\..\configs\" }
)

Write-Host "Syncing key docs and configs..." -ForegroundColor Green
foreach ($f in $ExtraFiles) {
    if (Test-Path $f.Src) {
        $DestDir = $f.Dst
        if (-not (Test-Path $DestDir)) {
            New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
        }
        if (-not $DryRun) {
            Copy-Item $f.Src -Destination $DestDir -Force
        }
        $Name = Split-Path $f.Src -Leaf
        Write-Host "  ✓ $Name" -ForegroundColor DarkGreen
    }
}

# Create install shortcuts on E:\
$InstallDir = Join-Path (Split-Path $Dest -Parent) "install"
if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

# Copy install docs
$InstallDocs = Get-ChildItem "C:\Users\erich\Heady\distribution\docs\install\*.md" -ErrorAction SilentlyContinue
foreach ($doc in $InstallDocs) {
    if (-not $DryRun) {
        Copy-Item $doc.FullName -Destination $InstallDir -Force
    }
    Write-Host "  ✓ install/$($doc.Name)" -ForegroundColor DarkGreen
}

Write-Host ""
Write-Host "  ═══════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Sync complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  E:\ drive contents:" -ForegroundColor Gray
Write-Host "    HeadyStack/" -ForegroundColor White
Write-Host "      distribution/    Full distribution pack" -ForegroundColor Gray
Write-Host "      docs/            Key protocol docs" -ForegroundColor Gray
Write-Host "      configs/         Browser, Buddy, IDE configs" -ForegroundColor Gray
Write-Host "      scripts/         Phone SSH setup script" -ForegroundColor Gray
Write-Host "      install/         Quick start + install guides" -ForegroundColor Gray
Write-Host "  ═══════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
