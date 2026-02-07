/**
 * Heady AI Assistant — Edge Extension Background Service Worker
 * Edge uses the same Manifest V3 APIs as Chrome (chrome.* namespace)
 */

const DEFAULT_API_URL = 'http://localhost:3300';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: 'ask-heady', title: 'Ask Heady about "%s"', contexts: ['selection'] });
  chrome.contextMenus.create({ id: 'summarize-page', title: 'Summarize this page with Heady', contexts: ['page'] });
  chrome.contextMenus.create({ id: 'explain-selection', title: 'Explain this with Heady', contexts: ['selection'] });
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

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

chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'ask_heady') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CHAT') { handleChat(message.query, message.context).then(sendResponse); return true; }
  if (message.type === 'HEALTH_CHECK') { checkHealth().then(sendResponse); return true; }
  if (message.type === 'GET_PAGE_CONTENT') { getPageContent(sender.tab?.id).then(sendResponse); return true; }
});

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
      body: JSON.stringify({ message: query, context, source: 'browser-extension-edge', history: [] }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return { ok: true, reply: data.reply || data.message || "I'm here to help!" };
  } catch (err) { return { ok: false, error: err.message }; }
}

async function checkHealth() {
  const apiUrl = await getApiUrl();
  try { const res = await fetch(`${apiUrl}/api/health`); return { ok: res.ok }; }
  catch { return { ok: false }; }
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
  } catch { return { text: '' }; }
}

async function openSidePanelWithQuery(tab, query) {
  await chrome.sidePanel.open({ tabId: tab.id });
  setTimeout(() => { chrome.runtime.sendMessage({ type: 'SIDE_PANEL_QUERY', query }); }, 500);
}
