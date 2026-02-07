# 20 — Docker & On-Prem

> Run HeadySystems self-hosted using Docker. Full control, works air-gapped.

## What's Here

- **Dockerfile** and **docker-compose.yml** for self-hosted deployment
- **Environment variable list** and sample `.env` file
- **Pull and run instructions**
- **Email template** ready to send

## Quick Start

### 1. Pull the Image

```bash
docker pull ghcr.io/headysystems/heady:latest
```

### 2. Run with Docker

```bash
docker run -d \
  --name heady-manager \
  -p 3300:3300 \
  --env-file .env \
  ghcr.io/headysystems/heady:latest
```

### 3. Run with Docker Compose

```bash
docker-compose up -d
```

### 4. Verify

```bash
curl http://localhost:3300/api/health
# Expected: {"ok":true,"service":"heady-manager","ts":"..."}
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string |
| `HEADY_API_KEY` | Yes | API authentication key |
| `PORT` | No | Server port (default: 3300) |
| `NODE_ENV` | No | Environment (default: production) |

See `env/manager.env.example` for a complete sample.

## Docker Compose (Multi-Service)

```yaml
version: "3.8"
services:
  heady-manager:
    image: ghcr.io/headysystems/heady:latest
    ports:
      - "3300:3300"
    env_file: .env
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: heady
      POSTGRES_USER: heady
      POSTGRES_PASSWORD: changeme
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

## Email Template

**Subject:** Run HeadySystems in Docker — 5-Minute Setup

**Body:**

> Hi [Name],
>
> You can run HeadySystems on your own infrastructure using Docker:
>
> ```
> docker pull ghcr.io/headysystems/heady:latest
> docker run -d -p 3300:3300 --env-file .env ghcr.io/headysystems/heady:latest
> ```
>
> Attached: sample `.env` file and `docker-compose.yml` for multi-service setup.
>
> Verify with: `curl http://localhost:3300/api/health`
>
> Let me know if you need help with configuration.
>
> — Heady Team
