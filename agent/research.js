// Use Node 18+ fetch or axios
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const ideaFile = path.resolve(__dirname, "current_idea.json");
const statusFile = path.resolve(__dirname, "status.json");
const resultFile = path.resolve(__dirname, "result.json");

function writeStatus(step, logs = [], done=false) {
  const obj = { step, logs, done, stepIndex: ["queued","research","plan","generate","review","deploy"].indexOf(step) };
  fs.writeFileSync(statusFile, JSON.stringify(obj, null, 2));
}

async function research() {
  writeStatus("research", ["Starting research..."]);
  if (!fs.existsSync(ideaFile)) {
    writeStatus("research", ["No idea file found."], false);
    return null;
  }
  const { idea } = JSON.parse(fs.readFileSync(ideaFile, "utf8"));

  // Example: Call Together AI / LLM — replace with your client
  try {
    writeStatus("research", ["Calling Together AI for research..."]);
    const prompt = `Research the following app idea in structure:
Idea: ${idea}
Respond with: 1) use-cases, 2) required features, 3) recommended tech stack, 4) database schema suggestion.`;
    // Placeholder: use a mock response (for offline testing)
    const researchSummary = {
      idea,
      useCases: ["MVP", "demo"],
      features: ["CRUD","Search"],
      stack: { frontend: "Next.js", backend: "Next API", db: "SQLite" },
      schema: { items: ["id","title","content","createdAt"] }
    };
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));
    fs.writeFileSync(path.resolve(__dirname, "research.json"), JSON.stringify(researchSummary, null, 2));
    writeStatus("research", ["Research complete."], false);
    return researchSummary;
  } catch (e) {
    writeStatus("research", ["Research failed: " + e.message], false);
    throw e;
  }
}

if (require.main === module) {
  research().then(()=>console.log("research done")).catch(e=>console.error(e));
}
module.exports = { research };
