# 90 — Custom Integrations

> Vertical-specific and platform-specific integration guides.

## What's Here

- **Per-vertical integration guides** with example configs
- **Platform-specific "how to plug Heady into X" guides**

## Integration Categories

### Browser-Like (Chrome-Style) Integration

Connect HeadySystems to browser-based environments:

```javascript
// Inject Heady telemetry into a browser extension
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'HEADY_LOG') {
    fetch('http://localhost:3300/api/patterns/observe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: 'usage',
        name: msg.event,
        value: msg.data
      })
    });
  }
});
```

### Comet-Like (ML Telemetry) Integration

Connect HeadySystems experiment tracking to ML pipelines:

```python
import requests
import os

HEADY_ENDPOINT = os.environ.get("HEADY_ENDPOINT", "http://localhost:3300")

def log_experiment(task_type, metrics):
    """Log ML experiment results to Heady Monte Carlo."""
    requests.post(f"{HEADY_ENDPOINT}/api/monte-carlo/result", json={
        "taskType": task_type,
        "latencyMs": metrics.get("duration_ms"),
        "quality": metrics.get("accuracy", 1.0),
        "success": metrics.get("success", True)
    })
```

### Drupal Integration

Connect HeadySystems as a backend service for Drupal:

```php
// In a custom Drupal module: call Heady health check
function heady_health_check() {
  $client = \Drupal::httpClient();
  $response = $client->get(getenv('HEADY_ENDPOINT') . '/api/health');
  return json_decode($response->getBody(), TRUE);
}
```

### Slack Integration

Send Heady alerts to Slack:

```javascript
// Post pattern alerts to Slack webhook
async function notifySlack(pattern) {
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: `Pattern Alert: ${pattern.name} (${pattern.state}) — ${pattern.category}`
    })
  });
}
```

### CI/CD Integration (GitHub Actions)

```yaml
# .github/workflows/heady-check.yml
name: Heady Health Check
on: [push]
jobs:
  health:
    runs-on: ubuntu-latest
    steps:
      - name: Check Heady Health
        run: |
          curl -sf ${{ secrets.HEADY_ENDPOINT }}/api/health || exit 1
```

## Vertical-Specific Guides

| Vertical | Integration Focus | Key Systems |
|---|---|---|
| **Education** | LMS connectors, student progress tracking | Canvas, Moodle, Google Classroom |
| **Health** | EHR integration, HIPAA-compliant data flows | Epic, Cerner, FHIR APIs |
| **Creator** | Content pipeline, royalty tracking | YouTube API, Stripe, social platforms |
| **Civic** | Open data feeds, public engagement metrics | data.gov, civic APIs |

## Email Template

**Subject:** Custom Integration Guide for HeadySystems

**Body:**

> Hi [Name],
>
> Attached are integration guides for connecting HeadySystems to your stack:
>
> - Browser extensions (Chrome-style)
> - ML pipelines (Comet-style telemetry)
> - Drupal CMS backend
> - Slack notifications
> - CI/CD (GitHub Actions)
>
> Let us know your specific platform and we'll tailor the setup.
>
> — Heady Team
