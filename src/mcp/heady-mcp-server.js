#!/usr/bin/env node
/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║  HEADY MCP SERVER — stdio transport for IDE integration            ║
 * ║  Exposes all Heady Services via Model Context Protocol v1.26.0     ║
 * ║  Routes 100% of AI requests through Heady Brain / headyio.com      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// ── Configuration ────────────────────────────────────────────────────────────
const HEADY_MANAGER_URL = process.env.HEADY_MANAGER_URL || 'https://manager.headysystems.com';
const HEADY_API_KEY     = process.env.HEADY_API_KEY || '';
const HEADY_BRAIN_URL   = process.env.HEADY_BRAIN_URL || 'https://headyio.com';
const NODE_ENV          = process.env.NODE_ENV || 'production';

const headers = {
  'Content-Type': 'application/json',
  ...(HEADY_API_KEY ? { 'Authorization': `Bearer ${HEADY_API_KEY}` } : {}),
  'X-Heady-Source': 'google-antigravity-mcp',
  'X-Heady-Version': '1.0.0',
};

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function headyPost(path, body) {
  const base = path.startsWith('/api/brain') ? HEADY_BRAIN_URL : HEADY_MANAGER_URL;
  const res = await fetch(`${base}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`Heady API ${res.status}: ${text}`);
  }
  return res.json();
}

async function headyGet(path) {
  const base = path.startsWith('/api/brain') ? HEADY_BRAIN_URL : HEADY_MANAGER_URL;
  const res = await fetch(`${base}${path}`, {
    method: 'GET',
    headers,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Heady API ${res.status}: ${res.statusText}`);
  return res.json();
}

// ── Server ────────────────────────────────────────────────────────────────────
const server = new Server(
  {
    name: 'heady-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  }
);

// ── Tool definitions ──────────────────────────────────────────────────────────
const HEADY_TOOLS = [
  {
    name: 'heady_chat',
    description: 'Send a chat message to Heady Brain. Routes 100% through Heady AI services.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'The user message or prompt' },
        system: { type: 'string', description: 'Optional system prompt' },
        model: { type: 'string', description: 'Model override (default: heady-brain)', default: 'heady-brain' },
        temperature: { type: 'number', description: 'Sampling temperature 0-2', default: 0.7 },
        max_tokens: { type: 'integer', description: 'Maximum tokens to generate', default: 4096 },
        context: { type: 'object', description: 'Additional context object' },
      },
      required: ['message'],
    },
  },
  {
    name: 'heady_complete',
    description: 'Generate a code or text completion via Heady Brain.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The completion prompt' },
        language: { type: 'string', description: 'Programming language for code completions' },
        max_tokens: { type: 'integer', default: 2048 },
        temperature: { type: 'number', default: 0.3 },
        stop: { type: 'array', items: { type: 'string' }, description: 'Stop sequences' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'heady_analyze',
    description: 'Analyze code, text, or data using Heady Brain intelligence.',
    inputSchema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'Content to analyze' },
        type: {
          type: 'string',
          enum: ['code', 'text', 'security', 'performance', 'architecture', 'general'],
          default: 'general',
        },
        language: { type: 'string', description: 'Language for code analysis' },
        focus: { type: 'string', description: 'Specific aspect to focus on' },
      },
      required: ['content'],
    },
  },
  {
    name: 'heady_embed',
    description: 'Generate vector embeddings for text using Heady embedding service.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Text to embed' },
        model: { type: 'string', default: 'nomic-embed-text', description: 'Embedding model' },
      },
      required: ['text'],
    },
  },
  {
    name: 'heady_health',
    description: 'Check the health and status of all Heady services.',
    inputSchema: {
      type: 'object',
      properties: {
        service: {
          type: 'string',
          enum: ['all', 'brain', 'manager', 'hcfp', 'mcp'],
          default: 'all',
          description: 'Which service to check',
        },
      },
    },
  },
  {
    name: 'heady_deploy',
    description: 'Trigger a deployment or service action via Heady Manager.',
    inputSchema: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['deploy', 'restart', 'status', 'logs', 'scale'],
          description: 'Deployment action',
        },
        service: { type: 'string', description: 'Service name' },
        config: { type: 'object', description: 'Additional configuration' },
      },
      required: ['action'],
    },
  },
  {
    name: 'heady_search',
    description: 'Search Heady knowledge base, registry, and service catalog.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' },
        scope: {
          type: 'string',
          enum: ['all', 'registry', 'docs', 'services', 'knowledge'],
          default: 'all',
        },
        limit: { type: 'integer', default: 10 },
      },
      required: ['query'],
    },
  },
  {
    name: 'heady_refactor',
    description: 'Request code refactoring suggestions from Heady Brain.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Code to refactor' },
        language: { type: 'string', description: 'Programming language' },
        goals: {
          type: 'array',
          items: { type: 'string' },
          description: 'Refactoring goals e.g. ["readability", "performance", "security"]',
        },
        context: { type: 'string', description: 'Additional context about the codebase' },
      },
      required: ['code'],
    },
  },
];

// ── List Tools ────────────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: HEADY_TOOLS,
}));

// ── Call Tool ─────────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'heady_chat': {
        const result = await headyPost('/api/brain/chat', {
          message: args.message,
          system: args.system,
          model: args.model || 'heady-brain',
          temperature: args.temperature ?? 0.7,
          max_tokens: args.max_tokens ?? 4096,
          context: args.context,
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: result.response || result.content || result.message || JSON.stringify(result) }],
        };
      }

      case 'heady_complete': {
        const result = await headyPost('/api/brain/generate', {
          prompt: args.prompt,
          language: args.language,
          max_tokens: args.max_tokens ?? 2048,
          temperature: args.temperature ?? 0.3,
          stop: args.stop,
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: result.completion || result.text || result.content || JSON.stringify(result) }],
        };
      }

      case 'heady_analyze': {
        const result = await headyPost('/api/brain/analyze', {
          content: args.content,
          type: args.type || 'general',
          language: args.language,
          focus: args.focus,
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }],
        };
      }

      case 'heady_embed': {
        const result = await headyPost('/api/brain/embed', {
          text: args.text,
          model: args.model || 'nomic-embed-text',
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
        };
      }

      case 'heady_health': {
        const service = args?.service || 'all';
        let result;
        if (service === 'hcfp') {
          result = await headyGet('/api/hcfp/status');
        } else if (service === 'brain') {
          result = await headyGet('/api/brain/health');
        } else {
          result = await headyGet('/api/health');
        }
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'heady_deploy': {
        const result = await headyPost('/api/deploy', {
          action: args.action,
          service: args.service,
          config: args.config,
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'heady_search': {
        const result = await headyPost('/api/registry', {
          query: args.query,
          scope: args.scope || 'all',
          limit: args.limit || 10,
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      }

      case 'heady_refactor': {
        const result = await headyPost('/api/brain/analyze', {
          content: args.code,
          type: 'code',
          language: args.language,
          focus: args.goals ? `Refactor for: ${args.goals.join(', ')}` : 'refactoring',
          context: args.context,
          task: 'refactor',
          source: 'google-antigravity',
        });
        return {
          content: [{ type: 'text', text: typeof result === 'string' ? result : JSON.stringify(result, null, 2) }],
        };
      }

      default:
        throw new Error(`Unknown Heady tool: ${name}`);
    }
  } catch (err) {
    return {
      content: [{ type: 'text', text: `Heady MCP Error: ${err.message}` }],
      isError: true,
    };
  }
});

// ── Resources: Heady service catalog ─────────────────────────────────────────
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    { uri: 'heady://services/catalog',     name: 'Heady Service Catalog',    mimeType: 'application/json', description: 'All registered Heady services' },
    { uri: 'heady://services/health',      name: 'Heady Health Status',       mimeType: 'application/json', description: 'Live health of all services' },
    { uri: 'heady://hcfp/status',          name: 'HCFP Auto-Success Status',  mimeType: 'application/json', description: 'HCFP pipeline ORS and mode' },
    { uri: 'heady://domains/list',         name: 'Heady Production Domains',  mimeType: 'application/json', description: 'All 6 production domains' },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    switch (uri) {
      case 'heady://services/catalog':
        return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify({
          services: ['heady-brain', 'heady-manager', 'heady-soul', 'heady-mcp', 'heady-buddy', 'hcfp'],
          endpoints: { manager: HEADY_MANAGER_URL, brain: HEADY_BRAIN_URL },
          version: '1.0.0',
        }, null, 2) }] };

      case 'heady://services/health': {
        const health = await headyGet('/api/health').catch(e => ({ error: e.message }));
        return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(health, null, 2) }] };
      }

      case 'heady://hcfp/status': {
        const status = await headyGet('/api/hcfp/status').catch(e => ({ error: e.message }));
        return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(status, null, 2) }] };
      }

      case 'heady://domains/list':
        return { contents: [{ uri, mimeType: 'application/json', text: JSON.stringify({
          domains: [
            { name: 'headybuddy',    domain: 'headybuddy.org',    port: 9000 },
            { name: 'headysystems',  domain: 'headysystems.com',  port: 9001 },
            { name: 'headyconnection', domain: 'headyconnection.org', port: 9002 },
            { name: 'headymcp',      domain: 'headymcp.com',      port: 9003 },
            { name: 'headyio',       domain: 'headyio.com',       port: 9004 },
            { name: 'headyme',       domain: 'headyme.com',       port: 9005 },
          ],
        }, null, 2) }] };

      default:
        throw new Error(`Unknown Heady resource: ${uri}`);
    }
  } catch (err) {
    throw new Error(`Failed to read ${uri}: ${err.message}`);
  }
});

// ── Prompts ───────────────────────────────────────────────────────────────────
server.setRequestHandler(ListPromptsRequestSchema, async () => ({
  prompts: [
    { name: 'heady_code_review',    description: 'Review code using Heady Brain — security, performance, best practices' },
    { name: 'heady_architect',      description: 'Get architectural guidance from Heady for system design' },
    { name: 'heady_debug',          description: 'Debug an issue with Heady Brain full context analysis' },
    { name: 'heady_write_tests',    description: 'Generate comprehensive tests via Heady Brain' },
    { name: 'heady_explain',        description: 'Explain complex code or concepts via Heady Brain' },
  ],
}));

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const prompts = {
    heady_code_review: {
      description: 'Heady Brain code review',
      messages: [{ role: 'user', content: { type: 'text', text:
        `Please review this code using Heady Brain:\n\n\`\`\`${args?.language || ''}\n${args?.code || '[paste code here]'}\n\`\`\`\n\nFocus on: security, performance, readability, and best practices.`
      }}],
    },
    heady_architect: {
      description: 'Heady architectural guidance',
      messages: [{ role: 'user', content: { type: 'text', text:
        `As Heady Brain, provide architectural guidance for: ${args?.description || '[describe your system]'}\n\nConsider: scalability, maintainability, Heady ecosystem integration.`
      }}],
    },
    heady_debug: {
      description: 'Heady debug analysis',
      messages: [{ role: 'user', content: { type: 'text', text:
        `Debug this issue using Heady Brain:\n\nError: ${args?.error || '[paste error]'}\n\nCode:\n\`\`\`\n${args?.code || '[paste code]'}\n\`\`\``
      }}],
    },
    heady_write_tests: {
      description: 'Heady test generation',
      messages: [{ role: 'user', content: { type: 'text', text:
        `Generate comprehensive tests for this code using Heady Brain:\n\n\`\`\`${args?.language || ''}\n${args?.code || '[paste code]'}\n\`\`\``
      }}],
    },
    heady_explain: {
      description: 'Heady explanation',
      messages: [{ role: 'user', content: { type: 'text', text:
        `Explain this clearly using Heady Brain:\n\n${args?.content || '[paste code or concept]'}`
      }}],
    },
  };

  const prompt = prompts[name];
  if (!prompt) throw new Error(`Unknown Heady prompt: ${name}`);
  return prompt;
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('[Heady MCP] Server started — routing 100% through Heady Services\n');
}

main().catch((err) => {
  process.stderr.write(`[Heady MCP] Fatal: ${err.message}\n`);
  process.exit(1);
});
