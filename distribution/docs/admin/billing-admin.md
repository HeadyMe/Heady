# Billing Administration Guide

## Overview

Heady billing is managed through the `billing-service` container and configured via `distribution/billing-config/`.

## Configuration Files

| File | Purpose |
|------|---------|
| `billing-config/plans.yaml` | Subscription tiers, limits, pricing |
| `billing-config/usage-metrics.yaml` | Usage metering definitions |
| `billing-config/app-combos.yaml` | Single apps and bundle SKUs |
| `billing-config/revenue-share.yaml` | Marketplace revenue sharing |

## Setting Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set environment variables:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Create products/prices in Stripe matching `plans.yaml` tiers

## Usage Metering

Tracked metrics (per `usage-metrics.yaml`):
- **Tokens** — LLM input/output tokens per request
- **Voice minutes** — STT/TTS processing time
- **API calls** — Total API requests per billing period
- **Storage** — File uploads and RAG index storage
- **Agent runs** — Multi-step agent task executions

## Fair Access Programs

Configure in `plans.yaml` under `fair_access`:
- **Students** — Free Pro with .edu email verification
- **Nonprofits** — 75% off Team with 501(c)(3) verification
- **PPP pricing** — Auto-discount based on country
- **Sponsored seats** — Corporate-funded community seats

## Managing Subscriptions

All subscription management happens through Stripe Customer Portal.
Heady billing-service provides webhook handlers for:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`
