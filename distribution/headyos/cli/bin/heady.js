#!/usr/bin/env node
/**
 * HeadyOS CLI — Terminal-based AI assistant
 * Usage:
 *   heady chat "What is the weather?"
 *   heady health
 *   heady pulse
 *   heady interactive   (REPL mode)
 */

const readline = require('readline');

const API = process.env.HEADY_API || 'http://localhost:3300';
const TOKEN = process.env.HEADY_TOKEN || '';

function headers() {
  const h = { 'Content-Type': 'application/json' };
  if (TOKEN) h['Authorization'] = `Bearer ${TOKEN}`;
  return h;
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: headers() });
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST', headers: headers(), body: JSON.stringify(body),
  });
  return res.json();
}

async function chat(message) {
  try {
    const data = await apiPost('/api/buddy/chat', {
      message, context: 'cli', source: 'heady-cli', history: [],
    });
    return data.reply || data.message || 'No response';
  } catch (e) { return `Error: ${e.message}. Is HeadyManager running at ${API}?`; }
}

async function interactive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('\x1b[35m⬡ Heady CLI\x1b[0m — Type your message. "exit" to quit.\n');

  const ask = () => {
    rl.question('\x1b[36myou>\x1b[0m ', async (input) => {
      const text = input.trim();
      if (!text || text === 'exit' || text === 'quit') { rl.close(); process.exit(0); }
      const reply = await chat(text);
      console.log(`\x1b[33mheady>\x1b[0m ${reply}\n`);
      ask();
    });
  };
  ask();
}

async function main() {
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'chat':
      if (args.length === 0) { console.log('Usage: heady chat "message"'); break; }
      console.log(await chat(args.join(' ')));
      break;
    case 'health':
      try { const d = await apiGet('/api/health'); console.log(JSON.stringify(d, null, 2)); }
      catch (e) { console.log(`Offline: ${e.message}`); }
      break;
    case 'pulse':
      try { const d = await apiGet('/api/pulse'); console.log(JSON.stringify(d, null, 2)); }
      catch (e) { console.log(`Error: ${e.message}`); }
      break;
    case 'layers':
      try { const d = await apiGet('/api/layer'); console.log(JSON.stringify(d, null, 2)); }
      catch (e) { console.log(`Error: ${e.message}`); }
      break;
    case 'switch':
      if (args.length === 0) { console.log('Usage: heady switch <layer>'); break; }
      try { const d = await apiPost('/api/layer/switch', { layer: args[0] }); console.log(JSON.stringify(d, null, 2)); }
      catch (e) { console.log(`Error: ${e.message}`); }
      break;
    case 'interactive':
    case 'repl':
    case undefined:
      await interactive();
      break;
    default:
      // Treat as chat message
      console.log(await chat([cmd, ...args].join(' ')));
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
