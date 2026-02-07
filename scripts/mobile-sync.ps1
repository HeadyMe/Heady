# Heady Mobile Sync Script
# Manages sync between desktop and mobile devices

param(
    [string]$Action = "status",
    [string]$DeviceIP = "",
    [string]$DeviceName = "OnePlus_Open"
)

$HeadyRoot = "C:\Users\erich\Heady"
$CrossDeviceRoot = "C:\Users\erich\CrossDevice\E's OnePlus Open"

Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  HEADY MOBILE SYNC                                        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Get local IP
$localIP = Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Wi-Fi -ErrorAction SilentlyContinue | Select -ExpandProperty IPAddress
if (-not $localIP) {
    $localIP = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"} | Select -First 1 -ExpandProperty IPAddress
}

switch ($Action) {
    "status" {
        Write-Host "`n📊 Sync Status:" -ForegroundColor Yellow
        Write-Host "Desktop IP: $localIP"
        Write-Host "Desktop Port: 3300"
        Write-Host "CrossDevice Path: $CrossDeviceRoot"
        
        # Check if sync service is running
        $syncJob = Get-Job -Name "MobileSync" -ErrorAction SilentlyContinue
        if ($syncJob -and $syncJob.State -eq "Running") {
            Write-Host "✅ Sync Service: Running" -ForegroundColor Green
        } else {
            Write-Host "❌ Sync Service: Not Running" -ForegroundColor Red
        }
        
        # Check for connected devices
        Write-Host "`n📱 Looking for devices..." -ForegroundColor Cyan
        Test-Connection -ComputerName "192.168.1.1-254" -Count 1 -Quiet -ErrorAction SilentlyContinue
    }
    
    "start" {
        Write-Host "Starting Mobile Sync Service..." -ForegroundColor Yellow
        
        # Create sync daemon
        $syncDaemon = @"
const express = require('express');
const WebSocket = require('ws');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 8100;

// WebSocket server for real-time sync
const wss = new WebSocket.Server({ port: 8101 });

// Sync endpoints
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', desktop_ip: '$localIP', timestamp: new Date() });
});

app.post('/sync/files', async (req, res) => {
    const { files, device } = req.body;
    console.log(`Syncing files from \${device}`);
    // Sync logic here
    res.json({ success: true });
});

app.get('/sync/config', (req, res) => {
    res.json({
        desktop_ip: '$localIP',
        manager_port: 3300,
        sync_port: 8100,
        crossdevice_path: '$CrossDeviceRoot'.replace(/\\/g, '/')
    });
});

// WebSocket connections
wss.on('connection', (ws) => {
    console.log('Mobile device connected');
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received:', data);
        
        // Handle different message types
        switch(data.type) {
            case 'sync_request':
                // Handle sync
                ws.send(JSON.stringify({ type: 'sync_response', status: 'ok' }));
                break;
            case 'command':
                // Execute command
                break;
        }
    });
});

app.listen(PORT, () => {
    console.log(`Mobile Sync Server running on port \${PORT}`);
    console.log(`WebSocket on port 8101`);
});
"@
        
        # Save and start sync daemon
        $syncDaemon | Set-Content "$HeadyRoot\scripts\mobile-sync-daemon.js" -Encoding UTF8
        
        Start-Job -Name "MobileSync" -ScriptBlock {
            cd $using:HeadyRoot
            node scripts/mobile-sync-daemon.js
        } | Out-Null
        
        Write-Host "✅ Mobile Sync Started!" -ForegroundColor Green
        Write-Host "Sync API: http://${localIP}:8100" -ForegroundColor Cyan
        Write-Host "WebSocket: ws://${localIP}:8101" -ForegroundColor Cyan
    }
    
    "stop" {
        Write-Host "Stopping Mobile Sync..." -ForegroundColor Yellow
        Stop-Job -Name "MobileSync" -ErrorAction SilentlyContinue
        Remove-Job -Name "MobileSync" -ErrorAction SilentlyContinue
        Write-Host "✅ Mobile Sync Stopped" -ForegroundColor Green
    }
    
    "pair" {
        if (-not $DeviceIP) {
            Write-Host "Please provide device IP with -DeviceIP parameter" -ForegroundColor Red
            return
        }
        
        Write-Host "Pairing with device at $DeviceIP..." -ForegroundColor Yellow
        
        # Generate pairing code
        $pairingCode = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 6 | % {[char]$_})
        
        Write-Host "`n📱 PAIRING CODE: $pairingCode" -ForegroundColor Green
        Write-Host "Enter this code on your mobile device" -ForegroundColor Cyan
        
        # Save pairing info
        @{
            device_name = $DeviceName
            device_ip = $DeviceIP
            desktop_ip = $localIP
            pairing_code = $pairingCode
            paired_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        } | ConvertTo-Json | Set-Content "$HeadyRoot\config\paired-devices.json"
    }
    
    default {
        Write-Host "Usage: .\mobile-sync.ps1 -Action [status|start|stop|pair]" -ForegroundColor Yellow
        Write-Host "  status - Show sync status"
        Write-Host "  start  - Start sync service"
        Write-Host "  stop   - Stop sync service"
        Write-Host "  pair   - Pair with mobile device"
    }
}
