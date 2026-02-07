/**
 * Heady AI Assistant — Firefox Extension Background Script
 * Uses browser.* APIs (WebExtension standard for Firefox)
 */

const DEFAULT_API_URL = 'http://localhost:3300';

// ── Installation ────────────────────────────────────────────
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'ask-heady',
    title: 'Ask Heady about "%s"',
    contexts: ['selection'],
  });

  browser.contextMenus.create({
    id: 'summarize-page',
    title: 'Summarize this page with Heady',
    contexts: ['page'],
  });

  browser.contextMenus.create({
    id: 'explain-selection',
    title: 'Explain this with Heady',
    contexts: ['selection'],
  });
});

// ── Context Menu Handler ────────────────────────────────────
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'ask-heady' && info.selectionText) {
    await handleChat(`Explain: ${info.selectionText}`, 'context_menu');
  }
  if (info.menuItemId === 'summarize-page') {
    const content = await getPageContent(tab.id);
    await handleChat(`Summarize: ${content.text.slice(0, 5000)}`, 'context_menu');
  }
  if (info.menuItemId === 'explain-selection' && info.selectionText) {
    await handleChat(`Explain simply: ${info.selectionText}`, 'context_menu');
  }
});

// ── Message Handler ─────────────────────────────────────────
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'CHAT') {
    return handleChat(message.query, message.context);
  }
  if (message.type === 'HEALTH_CHECK') {
    return checkHealth();
  }
  if (message.type === 'GET_PAGE_CONTENT') {
    return getPageContent(sender.tab?.id);
  }
});

// ── API Communication ───────────────────────────────────────
async function getApiUrl() {
  const result = await browser.storage.sync.get(['apiUrl']);
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
        source: 'browser-extension-firefox',
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
    const results = await browser.tabs.executeScript(tabId, {
      code: `(function() {
        const article = document.querySelector('article') || document.querySelector('main') || document.body;
        return article?.innerText?.slice(0, 8000) || '';
      })()`,
    });
    return { text: results[0] || '' };
  } catch {
    return { text: '' };
  }
}
