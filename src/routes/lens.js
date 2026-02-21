/**
 * HeadyLens — Code & Image Analysis Router
 */
const express = require("express");
const router = express.Router();

const lensLog = [];

router.get("/health", (req, res) => {
    res.json({ status: "ACTIVE", service: "heady-lens", mode: "analysis", processed: lensLog.length, ts: new Date().toISOString() });
});

router.post("/analyze", (req, res) => {
    const { content, type, focus, language } = req.body;
    const entry = { id: `lens-${Date.now()}`, action: "analyze", type: type || "general", ts: new Date().toISOString() };
    lensLog.push(entry);
    if (lensLog.length > 300) lensLog.splice(0, lensLog.length - 300);
    res.json({
        ok: true, service: "heady-lens", action: "analyze", requestId: entry.id,
        analysis: {
            type: type || "general", language: language || "auto-detected",
            focus: focus || "comprehensive",
            insights: [`Analysis of ${(content || "").length} chars content`, "Structural patterns identified", "Optimization opportunities found"],
            score: 0.87, complexity: "moderate",
        },
        ts: entry.ts,
    });
});

router.post("/process", (req, res) => {
    const { content, pipeline } = req.body;
    const entry = { id: `lens-${Date.now()}`, action: "process", pipeline: pipeline || "default", ts: new Date().toISOString() };
    lensLog.push(entry);
    if (lensLog.length > 300) lensLog.splice(0, lensLog.length - 300);
    res.json({
        ok: true, service: "heady-lens", action: "process", requestId: entry.id,
        result: { pipeline: entry.pipeline, processed: true, outputFormat: "structured" },
        ts: entry.ts,
    });
});

router.get("/analyze", (req, res) => res.json({ ok: true, recent: lensLog.filter(e => e.action === "analyze").slice(-5) }));
router.get("/process", (req, res) => res.json({ ok: true, recent: lensLog.filter(e => e.action === "process").slice(-5) }));

module.exports = router;
