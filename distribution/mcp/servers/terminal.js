/**
 * MCP Tool: Terminal
 * Execute allowed shell commands with approval flow.
 */
const name = 'terminal';
const description = 'Terminal: execute allowed shell commands';

const schema = {
  type: 'object',
  properties: {
    command: { type: 'string' },
    cwd: { type: 'string' },
    timeout: { type: 'number', default: 30000 },
  },
  required: ['command'],
};

const { execSync } = require('child_process');

const ALLOWED_COMMANDS = (process.env.HEADY_ALLOWED_COMMANDS || 'git,npm,node,python,docker,ls,dir,cat,type,echo,pwd,cd').split(',');

function isCommandAllowed(cmd) {
  const base = cmd.trim().split(/\s+/)[0].toLowerCase();
  return ALLOWED_COMMANDS.some(a => base === a || base.endsWith(`/${a}`) || base.endsWith(`\\${a}`));
}

async function handler(params) {
  if (!isCommandAllowed(params.command)) {
    return { error: `Command not allowed: ${params.command}. Allowed: ${ALLOWED_COMMANDS.join(', ')}` };
  }
  try {
    const output = execSync(params.command, {
      encoding: 'utf-8',
      cwd: params.cwd || process.cwd(),
      timeout: params.timeout || 30000,
      maxBuffer: 1024 * 1024,
    });
    return { ok: true, output: output.slice(0, 50000) };
  } catch (err) {
    return { ok: false, error: err.message, stderr: err.stderr?.slice(0, 5000) };
  }
}

module.exports = { name, description, schema, handler };
