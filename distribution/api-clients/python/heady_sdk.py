"""
Heady SDK — Python Client
Communicates with heady-manager API from any Python environment

Usage:
    from heady_sdk import HeadyClient
    heady = HeadyClient(api_url="http://localhost:3300")
    reply = heady.chat("Hello")

Install:
    pip install heady-sdk
    # or copy this file into your project
"""

import json
import urllib.request
import urllib.error
from typing import Any, Dict, List, Optional


class HeadyClient:
    def __init__(self, api_url: str = "http://localhost:3300", api_key: str = "", timeout: int = 30):
        self.api_url = api_url.rstrip("/")
        self.api_key = api_key
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["Authorization"] = f"Bearer {self.api_key}"
        return h

    def _request(self, method: str, path: str, body: Optional[Dict] = None) -> Any:
        url = f"{self.api_url}{path}"
        data = json.dumps(body).encode("utf-8") if body else None
        req = urllib.request.Request(url, data=data, headers=self._headers(), method=method)
        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            raise Exception(f"Heady API {e.code}: {e.reason}")
        except urllib.error.URLError as e:
            raise Exception(f"Cannot reach Heady at {self.api_url}: {e.reason}")

    def _get(self, path: str) -> Any:
        return self._request("GET", path)

    def _post(self, path: str, body: Dict) -> Any:
        return self._request("POST", path, body)

    # ── Health ──────────────────────────────────────────────
    def health(self) -> Dict:
        return self._get("/api/health")

    def pulse(self) -> Dict:
        return self._get("/api/pulse")

    # ── Chat / Buddy ────────────────────────────────────────
    def chat(self, message: str, context: str = "", history: List = None, source: str = "python-sdk") -> str:
        data = self._post("/api/buddy/chat", {
            "message": message,
            "context": context,
            "history": history or [],
            "source": source,
        })
        return data.get("reply") or data.get("message") or ""

    def suggestions(self) -> List[str]:
        data = self._get("/api/buddy/suggestions")
        return data.get("suggestions", [])

    # ── Monte Carlo ─────────────────────────────────────────
    def mc_plan(self, task_type: str) -> Dict:
        return self._post("/api/monte-carlo/plan", {"taskType": task_type})

    def mc_result(self, task_type: str, **kwargs) -> Dict:
        return self._post("/api/monte-carlo/result", {"taskType": task_type, **kwargs})

    def mc_metrics(self, task_type: str = "") -> Dict:
        path = f"/api/monte-carlo/metrics?taskType={task_type}" if task_type else "/api/monte-carlo/metrics"
        return self._get(path)

    # ── Patterns ────────────────────────────────────────────
    def patterns(self, category: str = "", state: str = "") -> Dict:
        params = []
        if category:
            params.append(f"category={category}")
        if state:
            params.append(f"state={state}")
        qs = "&".join(params)
        return self._get(f"/api/patterns?{qs}" if qs else "/api/patterns")

    def observe_pattern(self, category: str, key: str, value: Any) -> Dict:
        return self._post("/api/patterns/observe", {"category": category, "key": key, "value": value})

    # ── Self-Critique ───────────────────────────────────────
    def self_status(self) -> Dict:
        return self._get("/api/self/status")

    def critique(self, **kwargs) -> Dict:
        return self._post("/api/self/critique", kwargs)

    # ── Layers ──────────────────────────────────────────────
    def get_layer(self) -> Dict:
        return self._get("/api/layer")

    def switch_layer(self, layer: str) -> Dict:
        return self._post("/api/layer/switch", {"layer": layer})

    # ── Pricing ─────────────────────────────────────────────
    def pricing_tiers(self) -> Dict:
        return self._get("/api/pricing/tiers")

    def fair_access(self) -> Dict:
        return self._get("/api/pricing/fair-access")

    # ── Webhooks ────────────────────────────────────────────
    def send_webhook(self, event: str, **payload) -> Dict:
        return self._post("/api/webhook/inbound", {"event": event, **payload})


# ── CLI Usage ───────────────────────────────────────────────
if __name__ == "__main__":
    import sys
    client = HeadyClient()

    if len(sys.argv) < 2:
        print("Usage: python heady_sdk.py <command> [args]")
        print("Commands: health, chat <message>, pulse, layers, switch <layer>")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "health":
        print(json.dumps(client.health(), indent=2))
    elif cmd == "pulse":
        print(json.dumps(client.pulse(), indent=2))
    elif cmd == "chat" and len(sys.argv) > 2:
        reply = client.chat(" ".join(sys.argv[2:]))
        print(reply)
    elif cmd == "layers":
        print(json.dumps(client.get_layer(), indent=2))
    elif cmd == "switch" and len(sys.argv) > 2:
        print(json.dumps(client.switch_layer(sys.argv[2]), indent=2))
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
