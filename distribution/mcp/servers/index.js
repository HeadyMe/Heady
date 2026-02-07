/**
 * Heady MCP Server Registry
 * Central entry point for all Heady MCP tool servers.
 * Each tool is a module that exposes { name, description, schema, handler }.
 */

const tools = {
  github: require('./github'),
  slack: require('./slack'),
  notion: require('./notion'),
  drive: require('./drive'),
  docker: require('./docker'),
  calendar: require('./calendar'),
  filesystem: require('./filesystem'),
  terminal: require('./terminal'),
  browser: require('./browser'),
  duckduckgo: require('./duckduckgo'),
};

function listTools() {
  return Object.entries(tools).map(([id, t]) => ({
    id,
    name: t.name,
    description: t.description,
    inputSchema: t.schema,
  }));
}

async function callTool(toolId, params) {
  const tool = tools[toolId];
  if (!tool) throw new Error(`Unknown tool: ${toolId}`);
  return tool.handler(params);
}

module.exports = { listTools, callTool, tools };
