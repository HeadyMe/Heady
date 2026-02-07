/**
 * HC Billing & User Management
 * Handles beta signups, user authorization, Stripe checkout, and usage tracking.
 * STRIPE_SECRET_KEY is loaded from environment variables ONLY.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const USERS_PATH = path.join(__dirname, "..", ".heady", "users.json");
const PLANS = {
  explorer: { name: "Explorer", price: 0, dailyLimit: 100, stripePriceId: null },
  starter: { name: "Starter", price: 2900, dailyLimit: 2000, stripePriceId: process.env.STRIPE_PRICE_STARTER || null },
  pro: { name: "Pro", price: 9900, dailyLimit: Infinity, stripePriceId: process.env.STRIPE_PRICE_PRO || null },
};

function generateApiKey() {
  return "hdy_" + crypto.randomBytes(24).toString("hex");
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_PATH)) {
      return JSON.parse(fs.readFileSync(USERS_PATH, "utf8"));
    }
  } catch (e) {
    console.error("[hc_billing] Failed to load users:", e.message);
  }
  return { users: [], metadata: { createdAt: new Date().toISOString() } };
}

function saveUsers(data) {
  data.metadata = data.metadata || {};
  data.metadata.updatedAt = new Date().toISOString();
  const dir = path.dirname(USERS_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(USERS_PATH, JSON.stringify(data, null, 2), "utf8");
}

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    return require("stripe")(key);
  } catch (e) {
    console.warn("[hc_billing] Stripe not available:", e.message);
    return null;
  }
}

function registerBillingRoutes(app) {
  // Admin auth middleware
  function requireAdmin(req, res, next) {
    const token = req.headers["x-admin-token"];
    const expected = process.env.ADMIN_TOKEN || "heady-admin-2026";
    if (!token || token !== expected) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  }

  // API key auth middleware
  function requireApiKey(req, res, next) {
    const key = req.headers["x-api-key"];
    if (!key) return next(); // Allow unauthenticated for public endpoints
    const db = loadUsers();
    const user = db.users.find(u => u.apiKey === key && u.status === "active");
    if (user) {
      req.apiUser = user;
      // Track usage
      user.usage = (user.usage || 0) + 1;
      user.lastActive = new Date().toISOString();
      saveUsers(db);
    }
    next();
  }

  // Apply API key tracking globally
  app.use(requireApiKey);

  // ─── BETA SIGNUP ─────────────────────────────────────────────────
  app.post("/api/beta/signup", (req, res) => {
    const { name, email, plan } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }
    if (!PLANS[plan || "explorer"]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const db = loadUsers();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "Email already registered", apiKey: existing.apiKey });
    }

    const apiKey = generateApiKey();
    const user = {
      id: crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex"),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      plan: plan || "explorer",
      status: "pending",
      apiKey,
      usage: 0,
      dailyUsage: 0,
      dailyUsageDate: new Date().toISOString().split("T")[0],
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      createdAt: new Date().toISOString(),
      lastActive: null,
    };

    db.users.push(user);
    saveUsers(db);

    res.json({
      success: true,
      message: "Beta signup received! Your account is pending admin approval.",
      apiKey,
      status: "pending",
      plan: user.plan,
    });
  });

  // ─── ADMIN: LIST USERS ───────────────────────────────────────────
  app.get("/api/admin/users", requireAdmin, (req, res) => {
    const db = loadUsers();
    res.json({ users: db.users, total: db.users.length });
  });

  // ─── ADMIN: AUTHORIZE USER ──────────────────────────────────────
  app.post("/api/admin/users/:id/authorize", requireAdmin, (req, res) => {
    const db = loadUsers();
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = "active";
    user.authorizedAt = new Date().toISOString();
    saveUsers(db);

    res.json({ success: true, user: { id: user.id, name: user.name, status: user.status } });
  });

  // ─── ADMIN: REVOKE USER ─────────────────────────────────────────
  app.post("/api/admin/users/:id/revoke", requireAdmin, (req, res) => {
    const db = loadUsers();
    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = "revoked";
    user.revokedAt = new Date().toISOString();
    saveUsers(db);

    res.json({ success: true, user: { id: user.id, name: user.name, status: user.status } });
  });

  // ─── BILLING: GET PLANS ──────────────────────────────────────────
  app.get("/api/billing/plans", (req, res) => {
    const plans = Object.entries(PLANS).map(([id, p]) => ({
      id,
      name: p.name,
      price: p.price / 100,
      dailyLimit: p.dailyLimit === Infinity ? "Unlimited" : p.dailyLimit,
    }));
    res.json({ plans });
  });

  // ─── BILLING: USAGE ──────────────────────────────────────────────
  app.get("/api/billing/usage", (req, res) => {
    if (!req.apiUser) {
      return res.status(401).json({ error: "API key required" });
    }
    const plan = PLANS[req.apiUser.plan] || PLANS.explorer;
    res.json({
      user: req.apiUser.name,
      plan: req.apiUser.plan,
      totalUsage: req.apiUser.usage || 0,
      dailyLimit: plan.dailyLimit === Infinity ? "Unlimited" : plan.dailyLimit,
    });
  });

  // ─── BILLING: CREATE STRIPE CHECKOUT ─────────────────────────────
  app.post("/api/billing/checkout", async (req, res) => {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ error: "Billing system not configured. Set STRIPE_SECRET_KEY env var." });
    }

    if (!req.apiUser) {
      return res.status(401).json({ error: "API key required" });
    }

    const { plan } = req.body;
    const planConfig = PLANS[plan];
    if (!planConfig || !planConfig.stripePriceId) {
      return res.status(400).json({ error: "Invalid plan or plan not available for checkout" });
    }

    try {
      // Create or reuse Stripe customer
      let customerId = req.apiUser.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: req.apiUser.email,
          name: req.apiUser.name,
          metadata: { headyUserId: req.apiUser.id },
        });
        customerId = customer.id;
        // Save customer ID
        const db = loadUsers();
        const user = db.users.find(u => u.id === req.apiUser.id);
        if (user) {
          user.stripeCustomerId = customerId;
          saveUsers(db);
        }
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
        success_url: `${baseUrl}/connect.html?checkout=success`,
        cancel_url: `${baseUrl}/#pricing`,
        metadata: { headyUserId: req.apiUser.id, plan },
      });

      res.json({ success: true, checkoutUrl: session.url, sessionId: session.id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ─── BILLING: STRIPE WEBHOOK ─────────────────────────────────────
  app.post("/api/billing/webhook", require("express").raw({ type: "application/json" }), async (req, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ error: "Stripe not configured" });

    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      if (endpointSecret && sig) {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } else {
        event = JSON.parse(req.body);
      }
    } catch (err) {
      return res.status(400).json({ error: `Webhook error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.headyUserId;
      const plan = session.metadata?.plan;

      if (userId && plan) {
        const db = loadUsers();
        const user = db.users.find(u => u.id === userId);
        if (user) {
          user.plan = plan;
          user.status = "active";
          user.stripeSubscriptionId = session.subscription;
          user.paidAt = new Date().toISOString();
          saveUsers(db);
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object;
      const db = loadUsers();
      const user = db.users.find(u => u.stripeSubscriptionId === sub.id);
      if (user) {
        user.plan = "explorer";
        user.stripeSubscriptionId = null;
        saveUsers(db);
      }
    }

    res.json({ received: true });
  });
}

module.exports = { registerBillingRoutes, PLANS, loadUsers, saveUsers };
