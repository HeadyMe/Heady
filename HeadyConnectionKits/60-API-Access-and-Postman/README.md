# 60 — API Access & Postman

> Direct API access with OpenAPI spec and importable collections.

## What's Here

- **OpenAPI/Swagger spec** (JSON/YAML)
- **Postman collection** to import and run
- **Authentication guide**

## Authentication

All API requests require an API key in the header:

```
Authorization: Bearer YOUR_HEADY_API_KEY
```

Or via query parameter (for quick testing only):

```
GET /api/health?key=YOUR_HEADY_API_KEY
```

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health check |
| `GET` | `/api/pulse` | Full system pulse (all subsystems) |
| `GET` | `/api/registry` | Full registry dump |
| `GET` | `/api/registry/:id` | Single component |
| `POST` | `/api/monte-carlo/plan` | Generate MC plan |
| `POST` | `/api/monte-carlo/result` | Record execution result |
| `GET` | `/api/monte-carlo/metrics` | Speed metrics |
| `GET` | `/api/patterns` | All detected patterns |
| `POST` | `/api/patterns/observe` | Ingest data point |
| `GET` | `/api/self/status` | Self-critique status |
| `POST` | `/api/self/critique` | Record critique |
| `GET` | `/api/layer` | Active layer info |
| `POST` | `/api/layer/switch` | Switch layer |
| `GET` | `/api/pricing/tiers` | Pricing tiers |
| `GET` | `/api/pricing/fair-access` | Fair access programs |

## Postman Collection

Import `heady-api.postman_collection.json` into Postman:

1. Open Postman → Import → Upload File.
2. Set environment variable `HEADY_ENDPOINT` to your instance URL.
3. Set environment variable `HEADY_API_KEY` to your key.
4. Run the "Health Check" request to verify.

## Email Template

**Subject:** HeadySystems API Access — Postman Collection Included

**Body:**

> Hi [Name],
>
> Attached is a Postman collection for the HeadySystems API.
>
> **Base URL:** [your instance URL]
> **Auth:** Bearer token (API key provided separately)
>
> Import the collection, set your endpoint and key, and hit "Health Check" to verify.
>
> Full API docs: [link to OpenAPI spec]
>
> — Heady Team
