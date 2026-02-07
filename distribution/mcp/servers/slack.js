/**
 * MCP Tool: Slack
 * Send messages, list channels, search messages.
 */
const name = 'slack';
const description = 'Slack operations: send messages, list channels, search';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['send_message', 'list_channels', 'search'] },
    channel: { type: 'string' },
    text: { type: 'string' },
    query: { type: 'string' },
  },
  required: ['action'],
};

async function handler(params) {
  const token = process.env.SLACK_TOKEN;
  if (!token) return { error: 'SLACK_TOKEN not set' };
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const base = 'https://slack.com/api';

  switch (params.action) {
    case 'send_message': {
      const res = await fetch(`${base}/chat.postMessage`, {
        method: 'POST', headers, body: JSON.stringify({ channel: params.channel, text: params.text }),
      });
      return await res.json();
    }
    case 'list_channels': {
      const res = await fetch(`${base}/conversations.list?limit=50`, { headers });
      return await res.json();
    }
    case 'search': {
      const res = await fetch(`${base}/search.messages?query=${encodeURIComponent(params.query)}&count=20`, { headers });
      return await res.json();
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
