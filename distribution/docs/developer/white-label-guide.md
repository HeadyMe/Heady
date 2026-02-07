# White-Label Distribution Guide

## Overview

HeadyStack can be white-labeled by partners and resellers. The distribution pack is designed so you can:
1. Fork the repo
2. Change branding (name, logo, colors)
3. Plug in your own Stripe/payment keys
4. Adjust pricing in YAML
5. Ship under your own brand

## Steps to White-Label

### 1. Branding

Replace in all distribution files:
- `"Heady AI"` → your brand name
- `"HeadySystems"` → your org name
- Logo files in `icons/` directories (browser, IDE, desktop, mobile)
- Color scheme: default is `#7c3aed` (purple), `#1a1a2e` (dark background)

### 2. Pricing

Edit `distribution/billing-config/plans.yaml`:
- Adjust tier names and prices
- Enable/disable gateways
- Set your own Stripe keys

Edit `distribution/billing-config/app-combos.yaml`:
- Define which apps/bundles to offer
- Set per-app pricing

### 3. Choose Apps to Include

Select from `distribution/bundles/`:
- `personal-suite.yaml` — Browser + Mobile
- `pro-suite.yaml` — Everything
- `dev-pack.yaml` — Developer-focused
- Custom: create your own bundle YAML

### 4. Deployment

Choose your deployment mode from `distribution/docker/profiles/`:

| Profile | Use Case |
|---------|----------|
| `cloud-saas.yml` | Hosted SaaS for customers |
| `hybrid.yml` | Local + cloud for power users |
| `api-only.yml` | Headless API for custom frontends |

### 5. Domain & Auth

- Point your domain to the deployed stack
- Configure OAuth with your own client IDs
- Set up DNS, TLS, and reverse proxy

## Distribution Templates

| Template | Path | Description |
|----------|------|-------------|
| Web SaaS | `bundles/pro-suite.yaml` + `docker/profiles/cloud-saas.yml` | Full hosted product |
| Desktop App | `headyos/desktop/` + `billing-config/` | Standalone desktop product |
| API-Only | `bundles/dev-pack.yaml` + `docker/profiles/api-only.yml` | API product for developers |
| Marketplace | `billing-config/revenue-share.yaml` | Plugin/agent marketplace |

## Support

For white-label partnerships, contact HeadySystems.
