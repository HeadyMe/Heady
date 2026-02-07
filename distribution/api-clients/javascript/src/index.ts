/**
 * @heady/sdk — JavaScript/TypeScript client for HeadyStack API
 *
 * Usage:
 *   import { HeadySDK } from '@heady/sdk';
 *   const heady = new HeadySDK({ endpoint: 'http://localhost:3300' });
 *   const reply = await heady.chat('Hello');
 */

export interface HeadyConfig {
  endpoint?: string;
  token?: string;
  mode?: 'local' | 'hybrid' | 'cloud';
}

export interface ChatOptions {
  context?: string;
  source?: string;
  history?: { role: string; content: string }[];
  agent?: string;
}

export interface ChatResponse {
  reply: string;
  agent?: string;
  tokens_used?: number;
}

export class HeadySDK {
  private endpoint: string;
  private token: string;
  private mode: string;

  constructor(config: HeadyConfig = {}) {
    this.endpoint = config.endpoint || 'http://localhost:3300';
    this.token = config.token || '';
    this.mode = config.mode || 'hybrid';
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.token) h['Authorization'] = `Bearer ${this.token}`;
    return h;
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.endpoint}/api/health`);
      return res.ok;
    } catch { return false; }
  }

  async chat(message: string, options: ChatOptions = {}): Promise<ChatResponse> {
    const res = await fetch(`${this.endpoint}/api/buddy/chat`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        message,
        context: options.context || 'sdk',
        source: options.source || 'js-sdk',
        mode: this.mode,
        agent: options.agent,
        history: options.history || [],
      }),
    });
    if (!res.ok) throw new Error(`Heady API error: ${res.status}`);
    return res.json() as Promise<ChatResponse>;
  }

  async complete(codeBefore: string, language: string): Promise<string | null> {
    const res = await fetch(`${this.endpoint}/api/complete`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ code_before: codeBefore, language, mode: this.mode }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { completion?: string };
    return data.completion || null;
  }

  async listAgents(): Promise<any[]> {
    const res = await fetch(`${this.endpoint}/api/agents`, { headers: this.headers() });
    if (!res.ok) throw new Error(`Heady API error: ${res.status}`);
    return res.json() as Promise<any[]>;
  }

  async pulse(): Promise<any> {
    const res = await fetch(`${this.endpoint}/api/pulse`, { headers: this.headers() });
    return res.json();
  }

  async mcpCall(toolId: string, params: Record<string, any>): Promise<any> {
    const res = await fetch(`${this.endpoint}/api/mcp/call`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({ tool: toolId, params }),
    });
    return res.json();
  }
}

export default HeadySDK;
