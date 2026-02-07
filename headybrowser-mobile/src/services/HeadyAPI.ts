/**
 * HeadyBrowser Mobile — Heady Manager API Client
 * Communicates with heady-manager.js backend
 */

export class HeadyAPI {
  static async chat(message: string, baseUrl: string): Promise<string> {
    const res = await fetch(`${baseUrl}/api/buddy/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history: [] }),
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    return data.reply || data.message || "I'm here to help!";
  }

  static async health(baseUrl: string): Promise<boolean> {
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  static async getSuggestions(baseUrl: string): Promise<string[]> {
    try {
      const res = await fetch(`${baseUrl}/api/buddy/suggestions`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.suggestions || [];
    } catch {
      return [];
    }
  }

  static async syncTabs(baseUrl: string, tabs: any[], deviceId: string): Promise<void> {
    await fetch(`${baseUrl}/api/browser/tabs/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tabs, deviceId, ts: Date.now() }),
    });
  }

  static async getBlocklist(baseUrl: string): Promise<string[]> {
    try {
      const res = await fetch(`${baseUrl}/api/browser/blocklist`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.rules || [];
    } catch {
      return [];
    }
  }
}
