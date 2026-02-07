# 50 — SDKs & Code Snippets

> Integrate HeadySystems into your own apps with language-specific SDKs.

## What's Here

- **Language subfolders** with install instructions and hello-world samples
- **API integration examples**

## Supported Languages

| Language | Subfolder | Install |
|---|---|---|
| JavaScript/Node.js | `javascript/` | `npm install heady-sdk` |
| Python | `python/` | `pip install heady-sdk` |
| Go | `go/` | `go get github.com/HeadySystems/heady-sdk-go` |

## JavaScript — Hello World

```javascript
const { HeadyClient } = require('heady-sdk');

const client = new HeadyClient({
  endpoint: 'http://localhost:3300',
  apiKey: process.env.HEADY_API_KEY
});

async function main() {
  const health = await client.health();
  console.log('Health:', health);

  const registry = await client.registry.list();
  console.log('Components:', registry.components.length);
}

main().catch(console.error);
```

## Python — Hello World

```python
from heady_sdk import HeadyClient
import os

client = HeadyClient(
    endpoint="http://localhost:3300",
    api_key=os.environ["HEADY_API_KEY"]
)

health = client.health()
print(f"Health: {health}")

registry = client.registry.list()
print(f"Components: {len(registry['components'])}")
```

## Go — Hello World

```go
package main

import (
    "fmt"
    "os"
    heady "github.com/HeadySystems/heady-sdk-go"
)

func main() {
    client := heady.NewClient(
        "http://localhost:3300",
        os.Getenv("HEADY_API_KEY"),
    )

    health, _ := client.Health()
    fmt.Printf("Health: %+v\n", health)
}
```

## Email Template

**Subject:** Integrate HeadySystems into Your App — SDK Access

**Body:**

> Hi [Name],
>
> You can integrate HeadySystems directly into your app:
>
> - **JavaScript:** `npm install heady-sdk`
> - **Python:** `pip install heady-sdk`
> - **Go:** `go get github.com/HeadySystems/heady-sdk-go`
>
> Attached: hello-world samples for each language.
>
> — Heady Team
