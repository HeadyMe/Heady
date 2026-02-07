import fetch from 'node-fetch';

export class HeadyClient {
  private apiUrl: string;
  private mode: string;
  private token: string = '';

  constructor(apiUrl: string, mode: string) {
    this.apiUrl = apiUrl;
    this.mode = mode;
  }

  setToken(token: string) { this.token = token; }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiUrl}/api/health`);
      return res.ok;
    } catch { return false; }
  }

  async chat(message: string, context: string = 'ide'): Promise<string> {
    try {
      const res = await fetch(`${this.apiUrl}/api/buddy/chat`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          message,
          context: `vscode_${context}`,
          source: 'ide-vscode',
          mode: this.mode,
          history: [],
        }),
      });
      if (!res.ok) return `API error: ${res.status}`;
      const data = await res.json() as { reply?: string; message?: string };
      return data.reply || data.message || 'No response';
    } catch (err: any) {
      return `Connection error: ${err.message}. Is HeadyManager running?`;
    }
  }

  async complete(codeBefore: string, language: string): Promise<string | null> {
    try {
      const res = await fetch(`${this.apiUrl}/api/complete`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ code_before: codeBefore, language, source: 'ide-vscode', mode: this.mode }),
      });
      if (!res.ok) return null;
      const data = await res.json() as { completion?: string };
      return data.completion || null;
    } catch { return null; }
  }
}
