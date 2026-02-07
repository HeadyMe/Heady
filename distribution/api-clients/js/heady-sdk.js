/**
 * Heady SDK — JavaScript/TypeScript Client
 * Communicates with heady-manager API from any JS environment
 *
 * Usage:
 *   import { HeadyClient } from '@headysystems/heady-sdk';
 *   const heady = new HeadyClient({ apiUrl: 'http://localhost:3300' });
 *   const reply = await heady.chat('Hello');
 */

export class HeadyClient {
  constructor({ apiUrl = 'http://localhost:3300', apiKey = '', timeout = 30000 } = {}) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  _headers() {
    const h = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  async _fetch(path, opts = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const res = await fetch(`${this.apiUrl}${path}`, {
        ...opts,
        headers: { ...this._headers(), ...opts.headers },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`Heady API ${res.status}: ${res.statusText}`);
      return res.json();
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Health ──────────────────────────────────────────────
  async health() {
    return this._fetch('/api/health');
  }

  async pulse() {
    return this._fetch('/api/pulse');
  }

  // ── Chat / Buddy ────────────────────────────────────────
  async chat(message, { context = '', history = [], source = 'sdk' } = {}) {
    const data = await this._fetch('/api/buddy/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context, history, source }),
    });
    return data.reply || data.message || '';
  }

  async suggestions() {
    const data = await this._fetch('/api/buddy/suggestions');
    return data.suggestions || [];
  }

  // ── Monte Carlo ─────────────────────────────────────────
  async mcPlan(taskType) {
    return this._fetch('/api/monte-carlo/plan', {
      method: 'POST',
      body: JSON.stringify({ taskType }),
    });
  }

  async mcResult(taskType, result) {
    return this._fetch('/api/monte-carlo/result', {
      method: 'POST',
      body: JSON.stringify({ taskType, ...result }),
    });
  }

  async mcMetrics(taskType) {
    const path = taskType ? `/api/monte-carlo/metrics?taskType=${taskType}` : '/api/monte-carlo/metrics';
    return this._fetch(path);
  }

  // ── Patterns ────────────────────────────────────────────
  async patterns({ category, state } = {}) {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (state) params.set('state', state);
    return this._fetch(`/api/patterns?${params}`);
  }

  async observePattern(category, key, value) {
    return this._fetch('/api/patterns/observe', {
      method: 'POST',
      body: JSON.stringify({ category, key, value }),
    });
  }

  // ── Self-Critique ───────────────────────────────────────
  async selfStatus() {
    return this._fetch('/api/self/status');
  }

  async critique(data) {
    return this._fetch('/api/self/critique', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ── Layers ──────────────────────────────────────────────
  async getLayer() {
    return this._fetch('/api/layer');
  }

  async switchLayer(layer) {
    return this._fetch('/api/layer/switch', {
      method: 'POST',
      body: JSON.stringify({ layer }),
    });
  }

  // ── Browser Sync ────────────────────────────────────────
  async syncTabs(tabs, deviceId) {
    return this._fetch('/api/browser/tabs/sync', {
      method: 'POST',
      body: JSON.stringify({ tabs, deviceId, ts: Date.now() }),
    });
  }

  // ── Pricing / Billing ───────────────────────────────────
  async getPricingTiers() {
    return this._fetch('/api/pricing/tiers');
  }

  async getFairAccess() {
    return this._fetch('/api/pricing/fair-access');
  }

  // ── Webhooks ────────────────────────────────────────────
  async sendWebhook(event, payload) {
    return this._fetch('/api/webhook/inbound', {
      method: 'POST',
      body: JSON.stringify({ event, ...payload }),
    });
  }
}

// CommonJS compat
if (typeof module !== 'undefined') {
  module.exports = { HeadyClient };
}
