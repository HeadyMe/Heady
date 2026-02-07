/**
 * MCP Tool: Browser
 * Navigate, extract content, take screenshots (headless Chromium).
 */
const name = 'browser';
const description = 'Browser: navigate URLs, extract content, screenshot pages';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['navigate', 'extract_text', 'screenshot', 'get_links'] },
    url: { type: 'string' },
    selector: { type: 'string' },
  },
  required: ['action', 'url'],
};

async function handler(params) {
  // Lightweight fetch-based implementation (no Puppeteer dependency required)
  switch (params.action) {
    case 'navigate':
    case 'extract_text': {
      try {
        const res = await fetch(params.url, { headers: { 'User-Agent': 'HeadyMCP/1.0' } });
        const html = await res.text();
        // Strip HTML tags for plain text extraction
        const text = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[\s\S]*?<\/style>/gi, '')
                         .replace(/<[^>]+>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim()
                         .slice(0, 20000);
        return { url: params.url, text, status: res.status };
      } catch (err) { return { error: err.message }; }
    }
    case 'get_links': {
      try {
        const res = await fetch(params.url, { headers: { 'User-Agent': 'HeadyMCP/1.0' } });
        const html = await res.text();
        const links = [];
        const regex = /href=["']([^"']+)["']/g;
        let match;
        while ((match = regex.exec(html)) && links.length < 50) {
          links.push(match[1]);
        }
        return { url: params.url, links };
      } catch (err) { return { error: err.message }; }
    }
    case 'screenshot': {
      return { error: 'Screenshot requires Puppeteer. Install puppeteer and use the full browser MCP server.' };
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
