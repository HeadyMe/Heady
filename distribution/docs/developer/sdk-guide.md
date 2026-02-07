# SDK Guide

## JavaScript / TypeScript

```bash
npm install @heady/sdk
```

```typescript
import { HeadySDK } from '@heady/sdk';

const heady = new HeadySDK({
  endpoint: 'http://localhost:3300',
  token: 'your-token',
  mode: 'hybrid',
});

const reply = await heady.chat('Summarize this document', { agent: 'summarizer' });
console.log(reply);
```

## Python

```bash
pip install heady-sdk
# or copy distribution/api-clients/python/heady_sdk.py
```

```python
from heady_sdk import HeadyClient

heady = HeadyClient(api_url="http://localhost:3300")
reply = heady.chat("What patterns have been detected?")
print(reply)
```

## Go

```go
import "github.com/HeadySystems/Heady/distribution/api-clients/go"

client := heady.NewClient("http://localhost:3300", "")
reply, _ := client.Chat("Hello from Go")
fmt.Println(reply)
```

## CLI

```bash
# Install globally
npm install -g @heady/cli

# Or run directly
npx @heady/cli chat "What's the system status?"
npx @heady/cli interactive  # REPL mode
npx @heady/cli health
npx @heady/cli pulse
```

## Common Patterns

### With MCP Tools
```typescript
const result = await heady.mcpCall('github', {
  action: 'search_repos',
  query: 'heady ai assistant',
});
```

### Streaming (WebSocket)
```typescript
const ws = new WebSocket('ws://localhost:3300/api/ws');
ws.send(JSON.stringify({ type: 'chat', message: 'Stream this response' }));
ws.onmessage = (e) => process.stdout.write(JSON.parse(e.data).chunk);
```
