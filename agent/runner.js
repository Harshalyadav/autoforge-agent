// agent/runner.js
const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs-extra");

const app = express();

/* 🔥 HARD CORS FIX */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());

const ROOT = path.resolve(__dirname, "..");
const AGENT_DIR = path.join(ROOT, "agent");

function runScript(scriptName) {
  return new Promise((resolve) => {
    const scriptPath = path.join(AGENT_DIR, scriptName);
    const proc = spawn("node", [scriptPath], { env: process.env });

    let logs = "";
    proc.stdout.on("data", (d) => {
      logs += d.toString();
      console.log(`[${scriptName}]`, d.toString().trim());
    });
    proc.stderr.on("data", (d) => {
      logs += d.toString();
      console.error(`[${scriptName}] ERR`, d.toString().trim());
    });

    proc.on("close", (code) => resolve({ code, logs }));
  });
}

/* ---------- ROUTES ---------- */

app.post("/run", async (req, res) => {
  const step = (req.query.step || req.body.step || "research").toLowerCase();
  console.log("Runner received:", step);

  try {
    if (step === "research") {
      const r = await runScript("research.js");
      return res.json({ ok: true, step, ...r });
    }
    if (step === "plan") {
      const r = await runScript("planner.js");
      return res.json({ ok: true, step, ...r });
    }
    if (step === "generate") {
      const r = await runScript("generate.js");
      return res.json({ ok: true, step, ...r });
    }
    return res.status(400).json({ error: "Unknown step" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

app.get("/status", (req, res) => {
  const statusPath = path.join(AGENT_DIR, "status.json");
  if (!fs.existsSync(statusPath)) {
    return res.json({ step: "queued", logs: [], done: false, stepIndex: 0 });
  }
  res.json(JSON.parse(fs.readFileSync(statusPath, "utf8")));
});

app.get("/result", (req, res) => {
  const resultPath = path.join(AGENT_DIR, "result.json");
  if (!fs.existsSync(resultPath)) {
    return res.status(404).json({ error: "no result" });
  }
  res.json(JSON.parse(fs.readFileSync(resultPath, "utf8")));
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`✅ agent-runner listening on port ${PORT}`)
);
