/**
 * MCP Tool: Google Drive
 * List, search, read, and upload files.
 */
const name = 'drive';
const description = 'Google Drive: list files, search, read content, upload';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['list', 'search', 'get_file', 'read_content'] },
    query: { type: 'string' },
    file_id: { type: 'string' },
    folder_id: { type: 'string' },
  },
  required: ['action'],
};

async function handler(params) {
  const token = process.env.GOOGLE_DRIVE_TOKEN;
  if (!token) return { error: 'GOOGLE_DRIVE_TOKEN not set. Configure OAuth2 first.' };
  const headers = { Authorization: `Bearer ${token}` };
  const base = 'https://www.googleapis.com/drive/v3';

  switch (params.action) {
    case 'list': {
      const q = params.folder_id ? `'${params.folder_id}' in parents` : '';
      const res = await fetch(`${base}/files?q=${encodeURIComponent(q)}&pageSize=50&fields=files(id,name,mimeType,modifiedTime)`, { headers });
      return await res.json();
    }
    case 'search': {
      const res = await fetch(`${base}/files?q=${encodeURIComponent(`name contains '${params.query}'`)}&pageSize=20&fields=files(id,name,mimeType)`, { headers });
      return await res.json();
    }
    case 'get_file': {
      const res = await fetch(`${base}/files/${params.file_id}?fields=id,name,mimeType,size,modifiedTime,webViewLink`, { headers });
      return await res.json();
    }
    case 'read_content': {
      const res = await fetch(`${base}/files/${params.file_id}/export?mimeType=text/plain`, { headers });
      return { content: await res.text() };
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
