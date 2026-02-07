/**
 * MCP Tool: DuckDuckGo Search
 * Web search using DuckDuckGo HTML endpoint (no API key needed).
 */
const name = 'duckduckgo';
const description = 'DuckDuckGo web search — no API key required';

const schema = {
  type: 'object',
  properties: {
    query: { type: 'string' },
    max_results: { type: 'number', default: 10 },
  },
  required: ['query'],
};

async function handler(params) {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(params.query)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'HeadyMCP/1.0' } });
    const html = await res.text();

    // Parse results from HTML
    const results = [];
    const regex = /<a rel="nofollow" class="result__a" href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    const max = params.max_results || 10;
    while ((match = regex.exec(html)) && results.length < max) {
      results.push({
        url: match[1],
        title: match[2].replace(/<[^>]+>/g, '').trim(),
        snippet: match[3].replace(/<[^>]+>/g, '').trim(),
      });
    }

    return { query: params.query, results };
  } catch (err) { return { error: err.message }; }
}

module.exports = { name, description, schema, handler };
