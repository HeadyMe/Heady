# ===========================================================
# Mirror Distribution Pack to E/ (OnePlus Open)
# Copies the full distribution folder to CrossDevice
# ===========================================================
#
# Usage:
#   .\scripts\mirror-to-e.ps1                    # Full mirror
#   .\scripts\mirror-to-e.ps1 -Section browser   # Just browser extensions
#   .\scripts\mirror-to-e.ps1 -DryRun            # Show what would be copied

param(
    [string]$Section = "all",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# -- Paths -------------------------------------------------------
$HeadyRoot = Split-Path -Parent $PSScriptRoot
$DistSource = Join-Path $HeadyRoot "distribution"
$ETarget = Join-Path "C:\Users\erich\CrossDevice" "E''s OnePlus Open" | Join-Path -ChildPath "HeadyDistribution"

# Verify source exists
if (-not (Test-Path $DistSource)) {
    Write-Host "ERROR: Distribution folder not found at $DistSource" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host "  Heady Distribution Mirror -> E/             " -ForegroundColor Magenta
Write-Host "==============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "  Source: $DistSource" -ForegroundColor Cyan
Write-Host "  Target: $ETarget" -ForegroundColor Cyan
Write-Host "  Section: $Section" -ForegroundColor Cyan
if ($DryRun) { Write-Host "  Mode: DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# -- Section Map --------------------------------------------------
$sections = @{
    "all"         = @("*")
    "browser"     = @("browser")
    "ide"         = @("ide")
    "mobile"      = @("mobile")
    "docker"      = @("docker")
    "mcp"         = @("mcp")
    "headyos"     = @("headyos")
    "billing"     = @("billing-config")
    "bundles"     = @("bundles")
    "api"         = @("api-clients")
    "automations" = @("automations")
    "docs"        = @("docs")
}

if (-not $sections.ContainsKey($Section)) {
    $availKeys = $sections.Keys -join ", "
    $msg = "ERROR: Unknown section [$Section]. Available: $availKeys"
    Write-Host $msg -ForegroundColor Red
    exit 1
}

# -- Mirror Function ----------------------------------------------
function Mirror-Section {
    param([string]$Name)

    $src = Join-Path $DistSource $Name
    $dst = Join-Path $ETarget $Name

    if (-not (Test-Path $src)) {
        Write-Host "  SKIP: $Name (not found)" -ForegroundColor Yellow
        return
    }

    if ($DryRun) {
        $count = (Get-ChildItem -Path $src -Recurse -File).Count
        Write-Host "  WOULD COPY: $Name ($count files)" -ForegroundColor Yellow
    } else {
        Write-Host "  Copying: $Name..." -ForegroundColor Cyan -NoNewline

        # Create target directory
        if (-not (Test-Path $dst)) {
            New-Item -ItemType Directory -Path $dst -Force | Out-Null
        }

        # Robocopy for efficient mirroring
        $robocopyArgs = @($src, $dst, "/MIR", "/NJH", "/NJS", "/NDL", "/NP", "/NFL")
        $result = & robocopy @robocopyArgs 2>&1
        $exitCode = $LASTEXITCODE

        if ($exitCode -le 7) {
            $count = (Get-ChildItem -Path $dst -Recurse -File -ErrorAction SilentlyContinue).Count
            Write-Host " OK ($count files)" -ForegroundColor Green
        } else {
            Write-Host " FAIL (robocopy exit $exitCode)" -ForegroundColor Red
        }
    }
}

# -- Execute ------------------------------------------------------
if ($Section -eq "all") {
    # Also copy top-level README
    if (-not $DryRun) {
        if (-not (Test-Path $ETarget)) {
            New-Item -ItemType Directory -Path $ETarget -Force | Out-Null
        }
        $readmeSrc = Join-Path $DistSource "README.md"
        if (Test-Path $readmeSrc) {
            Copy-Item $readmeSrc (Join-Path $ETarget "README.md") -Force
        }
    }

    # Mirror each section
    $allSections = @(
        "headyos", "browser", "ide", "mobile", "mcp", "docker",
        "bundles", "billing-config", "api-clients", "automations", "docs"
    )
    foreach ($s in $allSections) {
        Mirror-Section $s
    }
} else {
    foreach ($s in $sections[$Section]) {
        Mirror-Section $s
    }
}

# -- Summary ------------------------------------------------------
Write-Host ""
if ($DryRun) {
    Write-Host "DRY RUN complete. No files were copied." -ForegroundColor Yellow
} else {
    $totalFiles = (Get-ChildItem -Path $ETarget -Recurse -File -ErrorAction SilentlyContinue).Count
    Write-Host "Mirror complete: $totalFiles files in $ETarget" -ForegroundColor Green
}
Write-Host ""
