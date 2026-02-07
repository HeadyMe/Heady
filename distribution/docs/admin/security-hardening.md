# Security Hardening Guide

## Network Security

- Run behind a reverse proxy (NGINX/Caddy) with TLS
- Restrict container ports to localhost in production
- Use Docker networks to isolate services
- Enable CORS only for known origins

## Authentication & Authorization

- Rotate API keys regularly
- Enforce MFA for admin accounts
- Use short-lived JWT tokens (15 min) with refresh tokens
- Per-tool approval flow for MCP tools (filesystem, terminal, docker)

## Data Privacy

- All user data processed locally by default (private-first)
- Cloud model calls require explicit opt-in per workspace
- RAG indexes encrypted at rest
- Memory: explicit controls (pin, forget, anonymize, export)

## Container Security

- Run containers as non-root users
- Use read-only file systems where possible
- Pin image versions (no `:latest` in production)
- Scan images with Trivy/Snyk before deployment

## Secrets Management

- Never commit secrets to git
- Use `.env` files with restrictive permissions (600)
- In production: use Docker secrets, Vault, or cloud KMS
- Rotate database passwords and API keys quarterly

## Monitoring & Incident Response

- Enable audit logging for all admin operations
- Monitor for unusual API usage patterns
- Set up alerts for failed authentication attempts
- Regular security reviews per `docs/DOC_OWNERS.yaml` schedule
