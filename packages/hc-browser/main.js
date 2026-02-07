// HEADY_BRAND:BEGIN
// HEADY SYSTEMS :: SACRED GEOMETRY
// FILE: packages/hc-browser/main.js
// LAYER: browser-core
// HEADY_BRAND:END

const { app, BrowserWindow, ipcMain, screen, shell } = require('electron');
const path = require('path');
const axios = require('axios'); // For MCP communication

// Fix for Access Denied errors on some systems/worktrees
const userDataPath = path.join(app.getPath('userData'), 'hc-browser-data');
app.setPath('userData', userDataPath);

let mainWindow;
let buddyOverlay;

const HEADY_MANAGER_URL = 'http://localhost:3300';

function createBrowserWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: Math.floor(width * 0.9),
    height: Math.floor(height * 0.9),
    frame: false,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true
    },
    backgroundColor: '#0f172a'
  });

  mainWindow.loadFile('src/index.html');
}

function createBuddyOverlay() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  buddyOverlay = new BrowserWindow({
    width: 350,
    height: 600,
    x: width - 370,
    y: 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  buddyOverlay.loadFile('src/buddy.html');
  buddyOverlay.hide();

  // Forward context from browser to buddy
  ipcMain.on('browser-context-change', (event, data) => {
    if (buddyOverlay) {
      buddyOverlay.webContents.send('context-update', data);
    }
  });

  // Forward actions from buddy to browser
  ipcMain.on('buddy-to-browser', (event, action) => {
    if (mainWindow) {
      mainWindow.webContents.send('buddy-action', action);
    }
  });

  // MCP Integration for HeadyBuddy
  ipcMain.handle('buddy-ask-mcp', async (event, { query, context }) => {
    try {
      const response = await axios.post(`${HEADY_MANAGER_URL}/api/conductor/orchestrate`, {
        request: query,
        context: context
      });
      return response.data;
    } catch (error) {
      console.error('MCP Communication Error:', error);
      return { error: 'Failed to connect to HeadyBrain' };
    }
  });
}

app.whenReady().then(() => {
  createBrowserWindow();
  createBuddyOverlay();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createBrowserWindow();
  });
});

ipcMain.on('toggle-buddy', () => {
  if (buddyOverlay.isVisible()) {
    buddyOverlay.hide();
  } else {
    buddyOverlay.show();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
