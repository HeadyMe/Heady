/**
 * MCP Tool: GitHub
 * Provides repo search, issue management, PR operations, file browsing.
 */

const name = 'github';
const description = 'GitHub operations: search repos, manage issues/PRs, browse files';

const schema = {
  type: 'object',
  properties: {
    action: { type: 'string', enum: ['search_repos', 'list_issues', 'create_issue', 'get_file', 'list_prs', 'get_pr'] },
    owner: { type: 'string' },
    repo: { type: 'string' },
    query: { type: 'string' },
    path: { type: 'string' },
    title: { type: 'string' },
    body: { type: 'string' },
    number: { type: 'number' },
  },
  required: ['action'],
};

async function handler(params) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { error: 'GITHUB_TOKEN not set' };
  const headers = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github.v3+json', 'User-Agent': 'HeadyMCP' };
  const base = 'https://api.github.com';

  switch (params.action) {
    case 'search_repos': {
      const res = await fetch(`${base}/search/repositories?q=${encodeURIComponent(params.query)}&per_page=10`, { headers });
      const data = await res.json();
      return { repos: (data.items || []).map(r => ({ name: r.full_name, description: r.description, stars: r.stargazers_count, url: r.html_url })) };
    }
    case 'list_issues': {
      const res = await fetch(`${base}/repos/${params.owner}/${params.repo}/issues?per_page=20`, { headers });
      return { issues: await res.json() };
    }
    case 'create_issue': {
      const res = await fetch(`${base}/repos/${params.owner}/${params.repo}/issues`, {
        method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: params.title, body: params.body }),
      });
      return await res.json();
    }
    case 'get_file': {
      const res = await fetch(`${base}/repos/${params.owner}/${params.repo}/contents/${params.path}`, { headers });
      const data = await res.json();
      if (data.content) data.decoded = Buffer.from(data.content, 'base64').toString('utf-8');
      return data;
    }
    case 'list_prs': {
      const res = await fetch(`${base}/repos/${params.owner}/${params.repo}/pulls?per_page=20`, { headers });
      return { prs: await res.json() };
    }
    case 'get_pr': {
      const res = await fetch(`${base}/repos/${params.owner}/${params.repo}/pulls/${params.number}`, { headers });
      return await res.json();
    }
    default: return { error: `Unknown action: ${params.action}` };
  }
}

module.exports = { name, description, schema, handler };
