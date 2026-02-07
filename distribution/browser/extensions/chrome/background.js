/**
 * Heady AI Assistant — Chrome Extension Background Service Worker
 * Handles side panel, context menus, and API communication
 */

const DEFAULT_API_URL = 'http://localhost:3300';

// ── Installation ────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(() => {
  // Context menu: right-click → Ask Heady
  chrome.contextMenus.create({
    id: 'ask-heady',
    title: 'Ask Heady about "%s"',
    contexts: ['selection'],
  });

  chrome.contextMenus.create({
    id: 'summarize-page',
    title: 'Summarize this page with Heady',
    contexts: ['page'],
  });

  chrome.contextMenus.create({
    id: 'explain-selection',
    title: 'Explain this with Heady',
    contexts: ['selection'],
  });

  // Enable side panel on action click
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

// ── Context Menu Handler ────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const apiUrl = await getApiUrl();

  if (info.menuItemId === 'ask-heady' && info.selectionText) {
    await openSidePanelWithQuery(tab, `Explain: ${info.selectionText}`, apiUrl);
  }

  if (info.menuItemId === 'summarize-page') {
    await openSidePanelWithQuery(tab, 'Summarize this page', apiUrl);
  }

  if (info.menuItemId === 'explain-selection' && info.selectionText) {
    await openSidePanelWithQuery(tab, `Explain simply: ${info.selectionText}`, apiUrl);
  }
});

// ── Keyboard Shortcut Handler ───────────────────────────────
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'ask_heady') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      // Get selected text from page
      const [result] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || '',
      });
      const selectedText = result?.result || '';
      if (selectedText) {
        const apiUrl = await getApiUrl();
        await openSidePanelWithQuery(tab, selectedText, apiUrl);
      }
    }
  }
});

// ── Message Handler (from popup / side panel / content) ─────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHAT') {
    handleChat(message.query, message.context).then(sendResponse);
    return true; // async
  }

  if (message.type === 'HEALTH_CHECK') {
    checkHealth().then(sendResponse);
    return true;
  }

  if (message.type === 'GET_PAGE_CONTENT') {
    getPageContent(sender.tab?.id).then(sendResponse);
    return true;
  }
});

// ── API Communication ───────────────────────────────────────
async function getApiUrl() {
  const result = await chrome.storage.sync.get(['apiUrl']);
  return result.apiUrl || DEFAULT_API_URL;
}

async function handleChat(query, context = '') {
  const apiUrl = await getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: query,
        context: context,
        source: 'browser-extension',
        history: [],
      }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return { ok: true, reply: data.reply || data.message || "I'm here to help!" };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

async function checkHealth() {
  const apiUrl = await getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/api/health`);
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

async function getPageContent(tabId) {
  if (!tabId) return { text: '' };
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const article = document.querySelector('article') || document.querySelector('main') || document.body;
        return article?.innerText?.slice(0, 8000) || '';
      },
    });
    return { text: result?.result || '' };
  } catch {
    return { text: '' };
  }
}

async function openSidePanelWithQuery(tab, query, apiUrl) {
  await chrome.sidePanel.open({ tabId: tab.id });
  // Send query to side panel once it's ready
  setTimeout(() => {
    chrome.runtime.sendMessage({ type: 'SIDE_PANEL_QUERY', query });
  }, 500);
}
