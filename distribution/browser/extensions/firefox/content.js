// Heady AI — Firefox Content Script
(function () {
  'use strict';

  const HEADY_API = 'http://localhost:3300';

  document.addEventListener('mouseup', () => {
    const selection = window.getSelection().toString().trim();
    if (selection.length > 10) {
      browser.runtime.sendMessage({
        type: 'TEXT_SELECTED',
        text: selection,
        url: window.location.href,
        title: document.title
      });
    }
  });

  browser.runtime.onMessage.addListener((msg, sender) => {
    switch (msg.type) {
      case 'GET_PAGE_CONTENT':
        return Promise.resolve({
          title: document.title,
          url: window.location.href,
          text: document.body.innerText.slice(0, 50000),
          html: document.documentElement.outerHTML.slice(0, 100000),
          meta: getPageMeta()
        });

      case 'GET_SELECTION':
        return Promise.resolve({ text: window.getSelection().toString() });

      case 'HIGHLIGHT_TEXT':
        highlightMatches(msg.text);
        return Promise.resolve({ ok: true });

      case 'INJECT_RESPONSE':
        injectResponse(msg.html, msg.position);
        return Promise.resolve({ ok: true });
    }
  });

  function getPageMeta() {
    const meta = {};
    document.querySelectorAll('meta').forEach(m => {
      const name = m.getAttribute('name') || m.getAttribute('property');
      if (name) meta[name] = m.getAttribute('content');
    });
    return meta;
  }

  function highlightMatches(text) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.textContent.includes(text)) {
        const span = document.createElement('span');
        span.style.backgroundColor = 'rgba(124, 58, 237, 0.3)';
        span.style.borderRadius = '2px';
        const range = document.createRange();
        const idx = node.textContent.indexOf(text);
        range.setStart(node, idx);
        range.setEnd(node, idx + text.length);
        range.surroundContents(span);
        break;
      }
    }
  }

  function injectResponse(html) {
    const el = document.createElement('div');
    el.className = 'heady-injected-response';
    el.innerHTML = html;
    el.style.cssText = `
      position: fixed; bottom: 20px; right: 20px; max-width: 400px;
      background: #1a1a2e; color: #e0e0e0; padding: 16px;
      border-radius: 16px; border: 1px solid rgba(124,58,237,0.3);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4); z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px; line-height: 1.5;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 15000);
  }

  console.log('[Heady AI] Firefox content script loaded');
})();
