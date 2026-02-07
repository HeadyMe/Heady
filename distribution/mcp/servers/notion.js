/**
 * MCP Tool: Notion
 * Search pages, read/create content, manage databases.
 */
const name = 'notion';
const description = 'Notion operations: search, read pages, create pages, query databases';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['search', 'get_page', 'create_page', 'query_database', 'append_blocks'] },
    query: { type: 'string' },
    page_id: { type: 'string' },
    database_id: { type: 'string' },
    parent_id: { type: 'string' },
    title: { type: 'string' },
    content: { type: 'string' },
  },
  required: ['action'],
};

async function handler(params) {
  const token = process.env.NOTION_TOKEN;
  if (!token) return { error: 'NOTION_TOKEN not set' };
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' };
  const base = 'https://api.notion.com/v1';

  switch (params.action) {
    case 'search': {
      const res = await fetch(`${base}/search`, { method: 'POST', headers, body: JSON.stringify({ query: params.query, page_size: 20 }) });
      return await res.json();
    }
    case 'get_page': {
      const res = await fetch(`${base}/pages/${params.page_id}`, { headers });
      return await res.json();
    }
    case 'create_page': {
      const res = await fetch(`${base}/pages`, {
        method: 'POST', headers,
        body: JSON.stringify({
          parent: { page_id: params.parent_id },
          properties: { title: { title: [{ text: { content: params.title } }] } },
        }),
      });
      return await res.json();
    }
    case 'query_database': {
      const res = await fetch(`${base}/databases/${params.database_id}/query`, { method: 'POST', headers, body: JSON.stringify({ page_size: 50 }) });
      return await res.json();
    }
    case 'append_blocks': {
      const res = await fetch(`${base}/blocks/${params.page_id}/children`, {
        method: 'PATCH', headers,
        body: JSON.stringify({ children: [{ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ type: 'text', text: { content: params.content } }] } }] }),
      });
      return await res.json();
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
