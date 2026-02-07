# HEADY_BRAND:BEGIN
# HEADY SYSTEMS :: SACRED GEOMETRY
# FILE: heady_nexus_daemon.ps1
# LAYER: root
# 
#         _   _  _____    _    ____   __   __
#        | | | || ____|  / \  |  _ \ \ \ / /
#        | |_| ||  _|   / _ \ | | | | \ V / 
#        |  _  || |___ / ___ \| |_| |  | |  
#        |_| |_||_____/_/   \_\____/   |_|  
# 
#    Sacred Geometry :: Organic Systems :: Breathing Interfaces
# HEADY_BRAND:END

<#
.SYNOPSIS
    Heady Nexus Daemon - Automated background synchronization for all remotes.
    
.DESCRIPTION
    Monitors the local repository for changes and automatically pushes to all configured remotes.
    Ensures that "Heady-Me", "Heady-Sys", "Sandbox", and "Origin" are always in sync.
#>

param(
    [int]$IntervalSeconds = 60,
    [switch]$RunOnce
)

$ROOT = $PSScriptRoot
Set-Location $ROOT

Write-Host "∞ INITIATING NEXUS DAEMON ∞" -ForegroundColor Cyan
Write-Host "Monitoring for changes every $IntervalSeconds seconds..." -ForegroundColor Gray

function Sync-Nexus {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Starting automated sync..." -ForegroundColor Yellow
    
    # 1. Check for local changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "Changes detected. Propagating to Nexus..." -ForegroundColor Cyan
        & "$ROOT\nexus_deploy.ps1"
    } else {
        # 2. Even if no local changes, check if we need to fetch/pull from origin to keep local updated
        Write-Host "No local changes. Checking for remote updates..." -ForegroundColor Gray
        git fetch origin
        $behind = git rev-list --count "HEAD..origin/$(git branch --show-current)"
        if ($behind -gt 0) {
            Write-Host "Local is $behind commits behind origin. Pulling..." -ForegroundColor Cyan
            git pull origin $(git branch --show-current)
            # After pulling, push the updates to other remotes
            & "$ROOT\nexus_deploy.ps1"
        } else {
            Write-Host "System is fully synchronized." -ForegroundColor Green
        }
    }
}

# Main Loop
do {
    try {
        Sync-Nexus
    } catch {
        Write-Error "Daemon sync failed: $_"
    }
    
    if ($RunOnce) { break }
    
    Start-Sleep -Seconds $IntervalSeconds
} while ($true)
