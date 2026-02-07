/**
 * MCP Tool: Docker
 * List containers, view logs, start/stop containers.
 */
const name = 'docker';
const description = 'Docker operations: list containers, logs, start, stop, inspect';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['list', 'logs', 'start', 'stop', 'inspect', 'images'] },
    container_id: { type: 'string' },
    tail: { type: 'number', default: 100 },
  },
  required: ['action'],
};

const { execSync } = require('child_process');

async function handler(params) {
  try {
    switch (params.action) {
      case 'list': return { containers: JSON.parse(execSync('docker ps --format json -a', { encoding: 'utf-8' }).split('\n').filter(Boolean).map(l => JSON.parse(l))) };
      case 'logs': {
        if (!params.container_id) return { error: 'container_id required' };
        const tail = params.tail || 100;
        return { logs: execSync(`docker logs --tail ${tail} ${params.container_id}`, { encoding: 'utf-8' }) };
      }
      case 'start': {
        if (!params.container_id) return { error: 'container_id required' };
        execSync(`docker start ${params.container_id}`);
        return { ok: true, message: `Started ${params.container_id}` };
      }
      case 'stop': {
        if (!params.container_id) return { error: 'container_id required' };
        execSync(`docker stop ${params.container_id}`);
        return { ok: true, message: `Stopped ${params.container_id}` };
      }
      case 'inspect': {
        if (!params.container_id) return { error: 'container_id required' };
        return JSON.parse(execSync(`docker inspect ${params.container_id}`, { encoding: 'utf-8' }));
      }
      case 'images': return { images: execSync('docker images --format "{{.Repository}}:{{.Tag}} {{.Size}}"', { encoding: 'utf-8' }).trim().split('\n') };
      default: return { error: `Unknown action: ${params.action}` };
    }
  } catch (err) { return { error: err.message }; }
}

module.exports = { name, description, schema, handler };
