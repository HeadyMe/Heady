/**
 * MCP Tool: Filesystem
 * Read, write, list, and search files within allowed directories.
 */
const name = 'filesystem';
const description = 'File system: read, write, list, search files';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['read', 'write', 'list', 'search', 'info', 'mkdir'] },
    path: { type: 'string' },
    content: { type: 'string' },
    pattern: { type: 'string' },
    recursive: { type: 'boolean', default: false },
  },
  required: ['action', 'path'],
};

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ALLOWED_ROOTS = (process.env.HEADY_FS_ROOTS || '').split(',').filter(Boolean);

function isAllowed(p) {
  if (ALLOWED_ROOTS.length === 0) return true;
  const resolved = path.resolve(p);
  return ALLOWED_ROOTS.some(root => resolved.startsWith(path.resolve(root)));
}

async function handler(params) {
  if (!isAllowed(params.path)) return { error: `Access denied: ${params.path} not in allowed roots` };

  switch (params.action) {
    case 'read': {
      if (!fs.existsSync(params.path)) return { error: 'File not found' };
      const stat = fs.statSync(params.path);
      if (stat.size > 1024 * 1024) return { error: 'File too large (>1MB)' };
      return { content: fs.readFileSync(params.path, 'utf-8'), size: stat.size };
    }
    case 'write': {
      fs.mkdirSync(path.dirname(params.path), { recursive: true });
      fs.writeFileSync(params.path, params.content || '', 'utf-8');
      return { ok: true, path: params.path };
    }
    case 'list': {
      if (!fs.existsSync(params.path)) return { error: 'Directory not found' };
      const entries = fs.readdirSync(params.path, { withFileTypes: true });
      return { entries: entries.map(e => ({ name: e.name, type: e.isDirectory() ? 'dir' : 'file' })) };
    }
    case 'search': {
      try {
        const result = execSync(`find "${params.path}" -name "${params.pattern}" -maxdepth 5 2>/dev/null || dir /s /b "${params.path}\\${params.pattern}" 2>nul`, { encoding: 'utf-8', timeout: 10000 });
        return { matches: result.trim().split('\n').filter(Boolean).slice(0, 50) };
      } catch { return { matches: [] }; }
    }
    case 'info': {
      if (!fs.existsSync(params.path)) return { error: 'Not found' };
      const stat = fs.statSync(params.path);
      return { path: params.path, size: stat.size, isDir: stat.isDirectory(), modified: stat.mtime };
    }
    case 'mkdir': {
      fs.mkdirSync(params.path, { recursive: true });
      return { ok: true, path: params.path };
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
