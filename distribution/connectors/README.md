# Heady Connectors

Pre-built integrations for messaging platforms, email, calendars, CRMs, and document stores.

## Available Connectors

| Connector | Type | Auth | Status |
|-----------|------|------|--------|
| **Slack Bot** | Messaging | OAuth | Planned |
| **Discord Bot** | Messaging | Bot Token | Planned |
| **MS Teams Bot** | Messaging | Azure AD | Planned |
| **Email Agent** | IMAP/SMTP | OAuth / App Password | Planned |
| **Calendar Agent** | Google / Outlook | OAuth | Planned |
| **CRM Connector** | Salesforce / HubSpot | OAuth | Planned |
| **Document Stores** | Drive / Dropbox / Notion | OAuth / Token | Planned |

## How Connectors Work

Each connector:
1. Authenticates with the external service
2. Listens for events (messages, emails, calendar changes)
3. Routes to the appropriate Heady agent via `heady-api`
4. Returns responses through the same channel

## Folder Structure

```
connectors/
  slack-bot/          # Slack app manifest + bot code
  discord-bot/        # Discord bot + slash commands
  teams-bot/          # MS Teams bot framework app
  email-agent/        # IMAP listener + SMTP sender
  calendar-agent/     # Google/Outlook calendar sync
  crm-connector/      # Salesforce/HubSpot integration
  document-stores/    # Drive, Dropbox, Notion adapters
```

## Deployment

Each connector can run as:
- A standalone service (Docker container)
- Part of the full-suite Docker Compose
- A serverless function (AWS Lambda, Cloudflare Workers)

---
*HeadySystems / HeadyConnection — Sacred Geometry Architecture*
