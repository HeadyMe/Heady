/**
 * ╔═══════════════════════════════════════════════════════════════════╗
 * ║  HEADY SYSTEMS                                                    ║
 * ║  ━━━━━━━━━━━━━━                                                   ║
 * ║  ∞ Sacred Geometry Architecture ∞                                 ║
 * ║                                                                   ║
 * ║  hc_integration_fabric.js - Secure Integration & Connector Mgmt   ║
 * ║  Zero-trust defaults, connector catalog, health monitoring        ║
 * ╚═══════════════════════════════════════════════════════════════════╝
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const CONNECTORS_PATH = path.join(__dirname, "..", ".heady-memory", "connectors.json");

const VALID_AUTH_METHODS = ["oauth2", "api_key", "mTLS", "jwt", "basic", "none"];
const VALID_API_TYPES = ["REST", "GraphQL", "gRPC", "WebSocket", "MCP", "stdio"];

function loadConnectors() {
  try { return JSON.parse(fs.readFileSync(CONNECTORS_PATH, "utf8")); }
  catch { return { connectors: [], policies: getDefaultPolicies(), metadata: { created: new Date().toISOString() } }; }
}

function saveConnectors(data) {
  fs.mkdirSync(path.dirname(CONNECTORS_PATH), { recursive: true });
  fs.writeFileSync(CONNECTORS_PATH, JSON.stringify(data, null, 2), "utf8");
}

function getDefaultPolicies() {
  return {
    zero_trust: {
      description: "All connections authenticated and authorized by default",
      verify_explicitly: true,
      least_privilege: true,
      assume_breach: true,
    },
    gateway: {
      tls: "required",
      auth: "oauth2_oidc",
      rate_limiting: true,
      waf: true,
    },
    mesh: {
      mtls: "strict",
      authorization: "policy_based",
      telemetry: true,
    },
    secrets: {
      storage: "environment_variables",
      rotation_policy: "90_days",
      never_hardcode: true,
    },
  };
}

function registerConnector({ name, description, api_type, auth_method, endpoint, scopes, rate_limit, capabilities, owner }) {
  const store = loadConnectors();
  const connector = {
    id: uuidv4(),
    name: name || "unnamed-connector",
    description: description || "",
    api_type: VALID_API_TYPES.includes(api_type) ? api_type : "REST",
    auth_method: VALID_AUTH_METHODS.includes(auth_method) ? auth_method : "api_key",
    endpoint: endpoint || null,
    scopes: Array.isArray(scopes) ? scopes : [],
    rate_limit: rate_limit || null,
    capabilities: Array.isArray(capabilities) ? capabilities : [],
    owner: owner || null,
    status: "registered",
    health: {
      status: "unknown",
      last_check: null,
      consecutive_failures: 0,
      avg_latency_ms: null,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  store.connectors.push(connector);
  saveConnectors(store);
  return connector;
}

function updateConnectorHealth(connectorId, { status, latency_ms }) {
  const store = loadConnectors();
  const connector = store.connectors.find(c => c.id === connectorId);
  if (!connector) return { error: `Connector '${connectorId}' not found` };

  connector.health.last_check = new Date().toISOString();
  if (status === "healthy") {
    connector.health.status = "healthy";
    connector.health.consecutive_failures = 0;
    connector.status = "active";
  } else {
    connector.health.consecutive_failures += 1;
    connector.health.status = connector.health.consecutive_failures >= 3 ? "degraded" : "warning";
    if (connector.health.consecutive_failures >= 5) {
      connector.status = "circuit_broken";
    }
  }

  if (latency_ms !== undefined) {
    const prev = connector.health.avg_latency_ms || latency_ms;
    connector.health.avg_latency_ms = Math.round((prev + latency_ms) / 2);
  }

  connector.updated_at = new Date().toISOString();
  saveConnectors(store);
  return connector;
}

function registerIntegrationRoutes(app) {
  // List connectors
  app.get("/api/integration/connectors", (req, res) => {
    const store = loadConnectors();
    let connectors = store.connectors;
    if (req.query.status) connectors = connectors.filter(c => c.status === req.query.status);
    if (req.query.api_type) connectors = connectors.filter(c => c.api_type === req.query.api_type);
    res.json({ total: connectors.length, connectors, ts: new Date().toISOString() });
  });

  // Get single connector
  app.get("/api/integration/connectors/:id", (req, res) => {
    const store = loadConnectors();
    const connector = store.connectors.find(c => c.id === req.params.id);
    if (!connector) return res.status(404).json({ error: `Connector '${req.params.id}' not found` });
    res.json(connector);
  });

  // Register new connector
  app.post("/api/integration/connectors", (req, res) => {
    const connector = registerConnector(req.body);
    res.status(201).json(connector);
  });

  // Update health
  app.post("/api/integration/connectors/:id/health", (req, res) => {
    const result = updateConnectorHealth(req.params.id, req.body);
    if (result.error) return res.status(400).json(result);
    res.json(result);
  });

  // Deactivate connector
  app.post("/api/integration/connectors/:id/deactivate", (req, res) => {
    const store = loadConnectors();
    const connector = store.connectors.find(c => c.id === req.params.id);
    if (!connector) return res.status(404).json({ error: `Connector '${req.params.id}' not found` });
    connector.status = "deactivated";
    connector.updated_at = new Date().toISOString();
    saveConnectors(store);
    res.json(connector);
  });

  // Get security policies
  app.get("/api/integration/policies", (req, res) => {
    const store = loadConnectors();
    res.json({ policies: store.policies || getDefaultPolicies(), ts: new Date().toISOString() });
  });

  // Integration health dashboard
  app.get("/api/integration/health", (req, res) => {
    const store = loadConnectors();
    const connectors = store.connectors;
    const healthy = connectors.filter(c => c.health.status === "healthy").length;
    const degraded = connectors.filter(c => c.health.status === "degraded").length;
    const broken = connectors.filter(c => c.status === "circuit_broken").length;

    res.json({
      total: connectors.length,
      healthy,
      degraded,
      circuit_broken: broken,
      unknown: connectors.length - healthy - degraded - broken,
      fabric_status: broken > 0 ? "degraded" : healthy === connectors.length ? "optimal" : "partial",
      policies: store.policies || getDefaultPolicies(),
      ts: new Date().toISOString(),
    });
  });
}

module.exports = { registerIntegrationRoutes, registerConnector, updateConnectorHealth, getDefaultPolicies };
