/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HC Cloudflare — Token Management & API Client                   ║
 * ║  Auto-refresh OAuth, zone management, worker deployment          ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 *
 * Reads the wrangler OAuth config, auto-refreshes before expiry,
 * persists new tokens back to the config file, and provides a
 * ready-to-use API client for all Cloudflare operations.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const CF_ACCOUNT_ID = "8b1fa38f282c691423c6399247d53323";
const CF_CLIENT_ID = "54d11594-84e4-41aa-b438-e81b8fa78ee7";
const CF_API_BASE = "https://api.cloudflare.com/client/v4";
const CF_TOKEN_URL = "https://dash.cloudflare.com/oauth2/token";

// Wrangler config paths (cross-platform)
function getWranglerConfigPath() {
  const appdata = process.env.APPDATA || process.env.HOME;
  const paths = [
    path.join(appdata, "xdg.config", ".wrangler", "config", "default.toml"),
    path.join(appdata, ".wrangler", "config", "default.toml"),
    path.join(process.env.HOME || "", ".wrangler", "config", "default.toml"),
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

class CloudflareManager {
  constructor(secretsManager) {
    this.secretsManager = secretsManager;
    this.accountId = CF_ACCOUNT_ID;
    this.token = null;
    this.refreshToken = null;
    this.expiresAt = null;
    this.scopes = [];
    this.configPath = null;
    this.zones = [];
    this.lastZoneFetch = null;
    this._loadFromWrangler();
    this._registerWithSecretsManager();
  }

  // ─── Load credentials from wrangler config ──────────────────────
  _loadFromWrangler() {
    this.configPath = getWranglerConfigPath();
    if (!this.configPath) {
      console.warn("  ⚠ Cloudflare: wrangler config not found");
      return;
    }

    try {
      const content = fs.readFileSync(this.configPath, "utf8");
      this.token = this._extractToml(content, "oauth_token");
      this.refreshToken = this._extractToml(content, "refresh_token");
      this.expiresAt = this._extractToml(content, "expiration_time");

      const scopesLine = content.match(/scopes\s*=\s*\[(.*?)\]/s);
      if (scopesLine) {
        this.scopes = scopesLine[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, "")) || [];
      }
    } catch (err) {
      console.warn(`  ⚠ Cloudflare: Failed to read wrangler config: ${err.message}`);
    }
  }

  _extractToml(content, key) {
    const match = content.match(new RegExp(`^${key}\\s*=\\s*"(.+?)"`, "m"));
    return match ? match[1] : null;
  }

  // ─── Register with Secrets Manager ──────────────────────────────
  _registerWithSecretsManager() {
    if (!this.secretsManager) return;

    this.secretsManager.register({
      id: "cloudflare_oauth",
      name: "Cloudflare OAuth Token",
      source: "file",
      filePath: this.configPath,
      fileKey: "oauth_token",
      expiresAt: this.expiresAt,
      refreshable: true,
      refreshFn: async () => this.refreshAccessToken(),
      dependents: ["cloudflare-worker", "dns-management", "domain-routing"],
      tags: ["cloudflare", "oauth", "auto-refresh"],
      meta: { accountId: this.accountId, scopes: this.scopes },
    });

    this.secretsManager.register({
      id: "cloudflare_refresh_token",
      name: "Cloudflare Refresh Token",
      source: "file",
      filePath: this.configPath,
      fileKey: "refresh_token",
      expiresAt: null, // refresh tokens don't have a fixed expiry but are single-use
      refreshable: false,
      dependents: ["cloudflare_oauth"],
      tags: ["cloudflare", "oauth"],
      meta: { note: "Single-use. Replaced each time OAuth token is refreshed." },
    });
  }

  // ─── Token Validity Check ──────────────────────────────────────
  isTokenValid() {
    if (!this.token) return false;
    if (!this.expiresAt) return true;
    const exp = new Date(this.expiresAt).getTime();
    const now = Date.now();
    return now < exp - 60_000; // 1 minute buffer
  }

  isTokenExpiringSoon() {
    if (!this.expiresAt) return false;
    const exp = new Date(this.expiresAt).getTime();
    const now = Date.now();
    return now >= exp - 5 * 60_000 && now < exp; // within 5 minutes
  }

  // ─── Get Valid Token (auto-refresh if needed) ───────────────────
  async getToken() {
    if (this.isTokenValid() && !this.isTokenExpiringSoon()) {
      return this.token;
    }

    // Try refresh
    const result = await this.refreshAccessToken();
    if (result && result.token) {
      return result.token;
    }

    // Return current even if expired (caller will get a 401)
    return this.token;
  }

  // ─── Refresh OAuth Token ────────────────────────────────────────
  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error("No refresh token available. Run 'wrangler login' to re-authenticate.");
    }

    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: this.refreshToken,
      client_id: CF_CLIENT_ID,
    }).toString();

    return new Promise((resolve, reject) => {
      const url = new URL(CF_TOKEN_URL);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(`OAuth refresh failed: ${json.error_description || json.error}`));
              return;
            }

            // Update in-memory state
            this.token = json.access_token;
            if (json.refresh_token) this.refreshToken = json.refresh_token;
            this.expiresAt = new Date(Date.now() + (json.expires_in * 1000)).toISOString();

            // Persist to wrangler config
            this._saveToWrangler();

            // Update secrets manager
            if (this.secretsManager) {
              this.secretsManager.markRefreshed("cloudflare_oauth", this.expiresAt);
            }

            resolve({
              token: this.token,
              expiresAt: this.expiresAt,
              expiresIn: json.expires_in,
            });
          } catch (err) {
            reject(new Error(`Failed to parse refresh response: ${err.message}`));
          }
        });
      });

      req.on("error", reject);
      req.write(body);
      req.end();
    });
  }

  // ─── Persist tokens back to wrangler config ─────────────────────
  _saveToWrangler() {
    if (!this.configPath) return;
    try {
      let content = fs.readFileSync(this.configPath, "utf8");
      content = content.replace(
        /oauth_token\s*=\s*".*?"/,
        `oauth_token = "${this.token}"`
      );
      content = content.replace(
        /expiration_time\s*=\s*".*?"/,
        `expiration_time = "${this.expiresAt}"`
      );
      if (this.refreshToken) {
        content = content.replace(
          /refresh_token\s*=\s*".*?"/,
          `refresh_token = "${this.refreshToken}"`
        );
      }
      fs.writeFileSync(this.configPath, content, "utf8");
    } catch (err) {
      console.warn(`  ⚠ Cloudflare: Failed to save wrangler config: ${err.message}`);
    }
  }

  // ─── API Request Helper ─────────────────────────────────────────
  async apiRequest(method, endpoint, body = null) {
    const token = await this.getToken();
    const url = endpoint.startsWith("http") ? endpoint : `${CF_API_BASE}${endpoint}`;
    const parsed = new URL(url);

    return new Promise((resolve, reject) => {
      const options = {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (body) {
        const bodyStr = JSON.stringify(body);
        options.headers["Content-Length"] = Buffer.byteLength(bodyStr);
      }

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            if (!json.success && json.errors && json.errors.length > 0) {
              reject(new Error(json.errors.map(e => e.message).join("; ")));
              return;
            }
            resolve(json);
          } catch {
            resolve({ raw: data, statusCode: res.statusCode });
          }
        });
      });

      req.on("error", reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  // ─── Zone Operations ────────────────────────────────────────────
  async listZones() {
    const result = await this.apiRequest("GET", "/zones?per_page=50&account.id=" + this.accountId);
    this.zones = (result.result || []).map(z => ({
      id: z.id,
      name: z.name,
      status: z.status,
      nameServers: z.name_servers,
      plan: z.plan?.name,
    }));
    this.lastZoneFetch = new Date().toISOString();
    return this.zones;
  }

  // ─── Worker Custom Domains ──────────────────────────────────────
  async addWorkerDomain(hostname, service = "heady-domains", environment = "production") {
    return this.apiRequest("PUT", `/accounts/${this.accountId}/workers/domains`, {
      hostname, service, environment,
    });
  }

  async listWorkerDomains() {
    return this.apiRequest("GET", `/accounts/${this.accountId}/workers/domains`);
  }

  // ─── Token Info ─────────────────────────────────────────────────
  getStatus() {
    return {
      accountId: this.accountId,
      tokenPresent: !!this.token,
      tokenValid: this.isTokenValid(),
      tokenExpiringSoon: this.isTokenExpiringSoon(),
      expiresAt: this.expiresAt,
      expiresIn: this.expiresAt ? this._timeUntil(this.expiresAt) : null,
      refreshTokenPresent: !!this.refreshToken,
      configPath: this.configPath,
      scopes: this.scopes,
      zonesLoaded: this.zones.length,
      lastZoneFetch: this.lastZoneFetch,
    };
  }

  _timeUntil(isoStr) {
    const diff = new Date(isoStr).getTime() - Date.now();
    if (diff <= 0) return "expired";
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    return `${hrs}h ${mins % 60}m`;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Express Route Registration
// ═══════════════════════════════════════════════════════════════════
function registerCloudflareRoutes(app, cfManager) {
  // Token & account status
  app.get("/api/cloudflare/status", (req, res) => {
    res.json({ ok: true, ...cfManager.getStatus() });
  });

  // Force refresh token
  app.post("/api/cloudflare/refresh", async (req, res) => {
    try {
      const result = await cfManager.refreshAccessToken();
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(400).json({ ok: false, error: err.message });
    }
  });

  // List zones
  app.get("/api/cloudflare/zones", async (req, res) => {
    try {
      const zones = await cfManager.listZones();
      res.json({ ok: true, total: zones.length, zones });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // List worker custom domains
  app.get("/api/cloudflare/domains", async (req, res) => {
    try {
      const result = await cfManager.listWorkerDomains();
      res.json({ ok: true, domains: result.result || [] });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Add worker custom domain
  app.post("/api/cloudflare/domains", async (req, res) => {
    const { hostname, service, environment } = req.body;
    if (!hostname) return res.status(400).json({ error: "hostname required" });
    try {
      const result = await cfManager.addWorkerDomain(hostname, service, environment);
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });

  // Verify token is working
  app.get("/api/cloudflare/verify", async (req, res) => {
    try {
      const result = await cfManager.apiRequest("GET", "/user/tokens/verify");
      res.json({ ok: true, tokenStatus: result.result?.status, ...cfManager.getStatus() });
    } catch (err) {
      res.status(401).json({ ok: false, error: err.message, hint: "Run 'wrangler login' to re-authenticate" });
    }
  });
}

module.exports = { CloudflareManager, registerCloudflareRoutes };
