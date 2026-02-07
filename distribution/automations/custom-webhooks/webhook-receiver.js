// Heady Webhook Receiver
// Standalone Express server that receives webhooks and forwards to Heady API
// Usage: HEADY_API_URL=http://localhost:3300 node webhook-receiver.js

import express from 'express';
import crypto from 'crypto';

const app = express();
app.use(express.json());

const HEADY_API = process.env.HEADY_API_URL || 'http://localhost:3300';
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';
const PORT = process.env.WEBHOOK_PORT || 4100;

function verifySignature(req) {
  if (!WEBHOOK_SECRET) return true;
  const sig = req.headers['x-signature'] || req.headers['x-hub-signature-256'] || '';
  const expected = 'sha256=' + crypto.createHmac('sha256', WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

async function forwardToHeady(event, payload) {
  try {
    const resp = await fetch(`${HEADY_API}/api/webhook/inbound`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload, ts: new Date().toISOString() }),
    });
    return await resp.json();
  } catch (err) {
    console.error(`Forward error: ${err.message}`);
    return { error: err.message };
  }
}

// Generic webhook endpoint
app.post('/webhook/:source', async (req, res) => {
  if (!verifySignature(req)) return res.status(401).json({ error: 'Invalid signature' });
  const result = await forwardToHeady(req.params.source, req.body);
  res.json({ received: true, source: req.params.source, result });
});

// GitHub webhook
app.post('/webhook/github', async (req, res) => {
  const event = req.headers['x-github-event'] || 'unknown';
  const result = await forwardToHeady(`github.${event}`, req.body);
  res.json({ received: true, event, result });
});

// Stripe webhook
app.post('/webhook/stripe', async (req, res) => {
  const event = req.body.type || 'unknown';
  const result = await forwardToHeady(`stripe.${event}`, req.body);
  res.json({ received: true, event, result });
});

// Health
app.get('/health', (req, res) => res.json({ ok: true, service: 'heady-webhook-receiver' }));

app.listen(PORT, () => console.log(`Heady Webhook Receiver listening on :${PORT}`));
