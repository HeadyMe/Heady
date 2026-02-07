// Heady AI — Edge Popup Script (same chrome.* API as Chrome)
const HEADY_API = 'http://localhost:3300';

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('input');
  const sendBtn = document.getElementById('send');
  const chat = document.getElementById('chat');

  document.getElementById('summarize').addEventListener('click', () => sendAction('summarize'));
  document.getElementById('explain').addEventListener('click', () => sendAction('explain'));
  document.getElementById('research').addEventListener('click', () => sendAction('research'));
  document.getElementById('draft').addEventListener('click', () => sendAction('draft'));
  document.getElementById('translate').addEventListener('click', () => sendAction('translate'));
  document.getElementById('tasks').addEventListener('click', () => sendAction('tasks'));
  document.getElementById('code').addEventListener('click', () => sendAction('code'));
  document.getElementById('open-sidebar').addEventListener('click', () => {
    chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    window.close();
  });

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

  async function sendMessage() {
    const text = input.value.trim(); if (!text) return;
    appendMessage('user', text); input.value = '';
    try {
      const res = await fetch(`${HEADY_API}/api/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context: 'browser_popup' })
      });
      const data = await res.json();
      appendMessage('assistant', data.reply || data.message || 'No response');
    } catch (err) { appendMessage('assistant', `Connection error: ${err.message}`); }
  }

  async function sendAction(action) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_CONTENT' }, async (pageData) => {
      if (!pageData) { appendMessage('assistant', 'Could not read page content.'); return; }
      appendMessage('user', `[${action}] ${pageData.title}`);
      try {
        const res = await fetch(`${HEADY_API}/api/chat`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `${action}: ${pageData.title}`, context: 'browser_action', pageContent: pageData.text.slice(0, 10000), pageUrl: pageData.url })
        });
        const data = await res.json();
        appendMessage('assistant', data.reply || data.message || 'No response');
      } catch (err) { appendMessage('assistant', `Error: ${err.message}`); }
    });
  }

  function appendMessage(role, text) {
    const div = document.createElement('div');
    div.style.cssText = `margin:8px 0;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.5;word-wrap:break-word;${role === 'user' ? 'background:rgba(124,58,237,0.2);margin-left:40px;text-align:right;' : 'background:rgba(255,255,255,0.05);margin-right:40px;'}`;
    div.textContent = text; chat.appendChild(div); chat.scrollTop = chat.scrollHeight;
  }
});
