# ╔═══════════════════════════════════════════════════════════════╗
# ║  HEADY SYSTEMS — MCP Server Dockerfile                        ║
# ║  Model Context Protocol bridge (stdio/HTTP)                   ║
# ╚═══════════════════════════════════════════════════════════════╝

FROM node:20-alpine

WORKDIR /app

# Install MCP SDK directly (since Docker context is limited to mcp-servers/)
RUN npm init -y && npm install @modelcontextprotocol/sdk express

COPY . .

EXPOSE 7000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:7000/health || exit 1

CMD ["node", "render-mcp-server.js"]
