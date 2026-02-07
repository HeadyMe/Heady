#!/usr/bin/env node
// Heady Mobile Connector - Runs on Termux/Android
// Provides full connectivity to desktop Heady ecosystem

const express = require('express');
const WebSocket = require('ws');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 8080;

// Load config
let config = {
    desktop_ip: process.env.DESKTOP_IP || '192.168.1.100',
    desktop_port: process.env.DESKTOP_PORT || 3300,
    device_name: process.env.DEVICE_NAME || 'Android_Device',
    sync_enabled: true
};

// Try to load config from file
const configPath = path.join(process.env.HOME || '/data/data/com.termux/files/home', 'heady', 'config.json');
if (fs.existsSync(configPath)) {
    config = { ...config, ...JSON.parse(fs.readFileSync(configPath, 'utf8')) };
}

// Express middleware
app.use(express.json());
app.use(express.static('public'));

// WebSocket connection to desktop
let desktopWS = null;
let reconnectInterval = null;

function connectToDesktop() {
    const wsUrl = `ws://${config.desktop_ip}:8101`;
    console.log(`Connecting to desktop at ${wsUrl}...`);
    
    desktopWS = new WebSocket(wsUrl);
    
    desktopWS.on('open', () => {
        console.log('✅ Connected to desktop!');
        clearInterval(reconnectInterval);
        
        // Send identification
        desktopWS.send(JSON.stringify({
            type: 'identify',
            device_name: config.device_name,
            platform: 'android',
            capabilities: ['chat', 'sync', 'commands', 'voice']
        }));
    });
    
    desktopWS.on('message', (data) => {
        const message = JSON.parse(data);
        handleDesktopMessage(message);
    });
    
    desktopWS.on('close', () => {
        console.log('❌ Desktop connection lost. Reconnecting...');
        desktopWS = null;
        startReconnect();
    });
    
    desktopWS.on('error', (err) => {
        console.error('WebSocket error:', err.message);
    });
}

function startReconnect() {
    if (!reconnectInterval) {
        reconnectInterval = setInterval(() => {
            if (!desktopWS || desktopWS.readyState !== WebSocket.OPEN) {
                connectToDesktop();
            }
        }, 5000);
    }
}

function handleDesktopMessage(message) {
    console.log('Received from desktop:', message.type);
    
    switch(message.type) {
        case 'sync_files':
            syncFiles(message.files);
            break;
        case 'execute_command':
            executeCommand(message.command);
            break;
        case 'chat_message':
            displayChatMessage(message.content);
            break;
    }
}

// API Endpoints
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Heady Mobile Connector</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        h1 {
            font-size: 2.5em;
            margin-bottom: 0.5em;
        }
        .status {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }
        .status.connected {
            border-left: 4px solid #4ade80;
        }
        .status.disconnected {
            border-left: 4px solid #f87171;
        }
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 5px;
            cursor: pointer;
        }
        .chat-container {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            height: 300px;
            overflow-y: auto;
        }
        input {
            width: calc(100% - 24px);
            padding: 12px;
            border-radius: 8px;
            border: none;
            margin-top: 10px;
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Heady Mobile</h1>
        <div class="status ${desktopWS && desktopWS.readyState === WebSocket.OPEN ? 'connected' : 'disconnected'}">
            <h3>Connection Status</h3>
            <p>Desktop: ${config.desktop_ip}:${config.desktop_port}</p>
            <p>Status: ${desktopWS && desktopWS.readyState === WebSocket.OPEN ? '✅ Connected' : '❌ Disconnected'}</p>
            <p>Device: ${config.device_name}</p>
        </div>
        
        <div>
            <button onclick="location.reload()">Refresh</button>
            <button onclick="openChat()">Open Chat</button>
            <button onclick="syncNow()">Sync Now</button>
            <button onclick="openSettings()">Settings</button>
        </div>
        
        <div class="chat-container" id="chat">
            <div id="messages"></div>
            <input type="text" id="chatInput" placeholder="Type a message..." onkeypress="if(event.key==='Enter')sendMessage()">
        </div>
    </div>
    
    <script>
        const ws = new WebSocket('ws://' + window.location.host + '/ws');
        
        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'chat_message') {
                addMessage(message.content);
            }
        };
        
        function sendMessage() {
            const input = document.getElementById('chatInput');
            if (input.value.trim()) {
                ws.send(JSON.stringify({
                    type: 'chat_message',
                    content: input.value
                }));
                addMessage('You: ' + input.value);
                input.value = '';
            }
        }
        
        function addMessage(text) {
            const messages = document.getElementById('messages');
            messages.innerHTML += '<p>' + text + '</p>';
            messages.scrollTop = messages.scrollHeight;
        }
        
        function syncNow() {
            ws.send(JSON.stringify({ type: 'sync_request' }));
            alert('Sync initiated!');
        }
        
        function openChat() {
            document.getElementById('chat').style.display = 'block';
        }
        
        function openSettings() {
            window.location.href = '/settings';
        }
    </script>
</body>
</html>
    `);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        device: config.device_name,
        desktop_connected: desktopWS && desktopWS.readyState === WebSocket.OPEN,
        uptime: process.uptime()
    });
});

app.get('/config', (req, res) => {
    res.json(config);
});

app.post('/config', (req, res) => {
    config = { ...config, ...req.body };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    res.json({ success: true, config });
    
    // Reconnect with new config
    if (desktopWS) {
        desktopWS.close();
    }
    connectToDesktop();
});

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    
    try {
        // Forward to desktop Heady Manager
        const response = await axios.post(`http://${config.desktop_ip}:${config.desktop_port}/api/chat`, {
            message,
            device: config.device_name
        });
        
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to connect to desktop' });
    }
});

app.post('/sync', (req, res) => {
    if (desktopWS && desktopWS.readyState === WebSocket.OPEN) {
        desktopWS.send(JSON.stringify({
            type: 'sync_request',
            device: config.device_name
        }));
        res.json({ success: true, message: 'Sync initiated' });
    } else {
        res.status(503).json({ error: 'Desktop not connected' });
    }
});

// WebSocket server for local clients
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
    console.log('Local client connected');
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        // Forward to desktop if connected
        if (desktopWS && desktopWS.readyState === WebSocket.OPEN) {
            desktopWS.send(message);
        }
    });
});

// Upgrade HTTP to WebSocket
app.server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  HEADY MOBILE CONNECTOR                                   ║
╚══════════════════════════════════════════════════════════╝

🚀 Server running at http://localhost:${PORT}
📱 Device: ${config.device_name}
🖥️  Desktop: ${config.desktop_ip}:${config.desktop_port}

Open browser to http://localhost:${PORT} for UI
    `);
    
    // Start desktop connection
    connectToDesktop();
});

app.server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
});

// Helper functions
function syncFiles(files) {
    console.log(`Syncing ${files.length} files...`);
    // Implement file sync logic
}

function executeCommand(command) {
    console.log(`Executing: ${command}`);
    require('child_process').exec(command, (error, stdout, stderr) => {
        if (desktopWS && desktopWS.readyState === WebSocket.OPEN) {
            desktopWS.send(JSON.stringify({
                type: 'command_result',
                stdout,
                stderr,
                error: error ? error.message : null
            }));
        }
    });
}

function displayChatMessage(content) {
    console.log(`Chat: ${content}`);
    // Broadcast to local WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'chat_message',
                content
            }));
        }
    });
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    if (desktopWS) desktopWS.close();
    wss.close();
    process.exit(0);
});
