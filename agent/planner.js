const fs = require("fs");
const path = require("path");
const { research } = require("./research");

const statusFile = path.resolve(__dirname, "status.json");

function writeStatus(step, logs = [], done=false) {
  const obj = { step, logs, done, stepIndex: ["queued","research","plan","generate","review","deploy"].indexOf(step) };
  fs.writeFileSync(statusFile, JSON.stringify(obj, null, 2));
}

async function plan() {
  writeStatus("plan", ["Starting planning..."]);
  const researchPath = path.resolve(__dirname, "research.json");
  if (!fs.existsSync(researchPath)) {
    await research();
  }
  const researchSummary = JSON.parse(fs.readFileSync(researchPath, "utf8"));

  // Use Oumi or other planner model here. We'll create a simple architecture plan.
  const architecturePlan = {
    projectName: "generated-app",
    frontend: "Next.js",
    backend: "Next API routes",
    database: "SQLite",
    fileStructure: [
      "pages/index.tsx",
      "pages/api/items.ts",
      "components/ItemList.tsx"
    ],
    apiSpecs: [
      { route: "/api/items", methods: ["GET","POST"] }
    ]
  };

  fs.writeFileSync(path.resolve(__dirname, "plan.json"), JSON.stringify(architecturePlan, null, 2));
  writeStatus("plan", ["Planning complete."], false);
  return architecturePlan;
}

if (require.main === module) {
  plan().then(()=>console.log("plan done")).catch(e=>console.error(e));
}

module.exports = { plan };
