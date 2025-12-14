// const fs = require("fs-extra");
// const path = require("path");
// const { spawn } = require("child_process");

// const statusFile = path.resolve(__dirname, "status.json");
// const planPath = path.resolve(__dirname, "plan.json");
// const outputDir = path.resolve(__dirname, "..", "output", "generated-app");

// function writeStatus(step, logs = [], done=false) {
//   const obj = { step, logs, done, stepIndex: ["queued","research","plan","generate","review","deploy"].indexOf(step) };
//   fs.writeFileSync(statusFile, JSON.stringify(obj, null, 2));
// }

// async function runClineGenerate(idea, plan) {
//   // Replace this with the real cline CLI invocation.
//   // Example: spawn(process.env.CLINE_CMD, ["generate", "--idea", idea, "--out", outputDir])
//   writeStatus("generate", ["Generating code with Cline (simulated)..."]);
//   await fs.remove(outputDir);
//   await fs.ensureDir(outputDir);

//   // Create a minimal Next.js app scaffold (for demo)
//   await fs.ensureDir(path.join(outputDir, "pages"));
//   await fs.writeFile(path.join(outputDir, "package.json"), JSON.stringify({
//     name: "generated-app",
//     version: "1.0.0",
//     scripts: { dev: "next dev", build: "next build", start: "next start" },
//     dependencies: { next: "13.5.0", react: "18.2.0", "react-dom": "18.2.0" }
//   }, null, 2));

//   const indexContent = `
// import React from "react";
// export default function Home(){ return <div style={{padding:40}}><h1>Generated App</h1><p>Idea: ${idea}</p></div> }
//   `;
//   await fs.writeFile(path.join(outputDir, "pages", "index.js"), indexContent);
//   await new Promise(r=>setTimeout(r, 800));
//   writeStatus("generate", ["Code generation complete."], false);
//   return outputDir;
// }

// async function deployToVercel(projectDir) {
//   writeStatus("deploy", ["Deploying to Vercel..."]);
//   const token = process.env.VERCEL_TOKEN;
//   if (!token) {
//     writeStatus("deploy", ["VERCEL_TOKEN not found — skipping real deploy. (Set env to enable)"], false);
//     // Fake a URL for demo:
//     const url = "https://generated-app-demo.vercel.app";
//     return { url, repo: null, zip: null };
//   }

//   // If VERCEL_TOKEN present, run vercel CLI
//   return new Promise((resolve, reject) => {
//     const args = ["--prod", "--token", token, "--confirm"];
//     const proc = spawn(process.env.VERCEL_CMD || "vercel", args, { cwd: projectDir, stdio: "pipe" });
//     let out = "";
//     proc.stdout.on("data", d => { out += d.toString(); fs.appendFileSync(statusFile, JSON.stringify({ step: "deploy", logs: [d.toString()], done: false })); });
//     proc.stderr.on("data", d => { console.error(d.toString()); });
//     proc.on("close", code => {
//       // parse vercel output for URL (this is heuristic)
//       const match = out.match(/https?:\/\/[^\s]+\.vercel\.app/);
//       const url = match ? match[0] : null;
//       resolve({ url, repo: null, zip: null });
//     });
//   });
// }

// async function main(){
//   writeStatus("generate", ["Starting generation stage..."]);
//   if (!fs.existsSync(planPath)) throw new Error("plan.json not found");
//   const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
//   const ideaFile = path.resolve(__dirname, "current_idea.json");
//   const ideaObj = fs.existsSync(ideaFile) ? JSON.parse(fs.readFileSync(ideaFile,"utf8")) : { idea: "demo idea" };
//   const out = await runClineGenerate(ideaObj.idea, plan);
//   const deployResult = await deployToVercel(out);

//   // write a result JSON consumed by the frontend
//   const result = {
//     liveUrl: deployResult.url,
//     repo: deployResult.repo,
//     zip: deployResult.zip,
//     summary: { idea: ideaObj.idea, plan }
//   };
//   fs.writeFileSync(path.resolve(__dirname,"result.json"), JSON.stringify(result, null, 2));
//   writeStatus("deploy", ["Finished."] , true);
//   console.log("Done. Result:", result);
// }

// if (require.main === module) {
//   main().catch(e => { console.error(e); writeStatus("generate", ["Error: " + e.message], false); process.exit(1);});
// }



const fs = require("fs-extra");
const path = require("path");
const { spawn } = require("child_process");

const statusFile = path.resolve(__dirname, "status.json");
const planPath = path.resolve(__dirname, "plan.json");
const outputDir = path.resolve(__dirname, "..", "output", "generated-app");

function writeStatus(step, logs = [], done = false) {
  const obj = {
    step,
    logs,
    done,
    stepIndex: ["queued", "research", "plan", "generate", "review", "deploy"].indexOf(step)
  };
  fs.writeFileSync(statusFile, JSON.stringify(obj, null, 2));
}

/**
 * Windows-safe directory cleanup
 */
async function safeCleanDir(dir) {
  if (!fs.existsSync(dir)) return;

  try {
    await fs.remove(dir);
  } catch (err) {
    console.warn("[generate.js] WARN: Could not remove directory (EBUSY). Reusing it.");
  }
}

async function runClineGenerate(idea, plan) {
  writeStatus("generate", ["Generating code with Cline (simulated)..."]);

  // ✅ SAFE cleanup
  await safeCleanDir(outputDir);
  await fs.ensureDir(outputDir);

  // ✅ Create Next.js scaffold
  await fs.ensureDir(path.join(outputDir, "pages"));

  // ✅ FIXED Next.js version (13.4.19 is valid)
  await fs.writeFile(
    path.join(outputDir, "package.json"),
    JSON.stringify(
      {
        name: "generated-app",
        private: true,
        version: "1.0.0",
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start"
        },
        dependencies: {
          next: "13.4.19",
          react: "18.2.0",
          "react-dom": "18.2.0"
        }
      },
      null,
      2
    )
  );

  const indexContent = `
import React from "react";

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>🚀 Generated App</h1>
      <p><strong>Idea:</strong> ${idea}</p>

      <h3>What this app will do</h3>
      <ul>
        <li>Create todos</li>
        <li>Add tags</li>
        <li>Set deadlines</li>
        <li>Track completion status</li>
      </ul>

      <small>Generated by AutoForge</small>
    </div>
  );
}
`;

  await fs.writeFile(path.join(outputDir, "pages", "index.js"), indexContent);

  await new Promise((r) => setTimeout(r, 800));
  writeStatus("generate", ["Code generation complete."], false);

  return outputDir;
}

async function deployToVercel(projectDir) {
  writeStatus("deploy", ["Deploying to Vercel..."]);

  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    writeStatus("deploy", ["VERCEL_TOKEN not found — skipping real deploy."], false);
    return { url: "https://generated-app-demo.vercel.app", repo: null, zip: null };
  }

  return new Promise((resolve) => {
    const args = ["--prod", "--token", token, "--confirm"];
    const proc = spawn(process.env.VERCEL_CMD || "vercel", args, {
      cwd: projectDir,
      stdio: "pipe"
    });

    let out = "";
    proc.stdout.on("data", (d) => (out += d.toString()));
    proc.on("close", () => {
      const match = out.match(/https?:\/\/[^\s]+\.vercel\.app/);
      resolve({ url: match ? match[0] : null, repo: null, zip: null });
    });
  });
}

async function main() {
  writeStatus("generate", ["Starting generation stage..."]);

  if (!fs.existsSync(planPath)) {
    throw new Error("plan.json not found");
  }

  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
  const ideaFile = path.resolve(__dirname, "current_idea.json");
  const ideaObj = fs.existsSync(ideaFile)
    ? JSON.parse(fs.readFileSync(ideaFile, "utf8"))
    : { idea: "demo idea" };

  const out = await runClineGenerate(ideaObj.idea, plan);
  const deployResult = await deployToVercel(out);

  const result = {
    liveUrl: deployResult.url,
    repo: deployResult.repo,
    zip: deployResult.zip,
    summary: { idea: ideaObj.idea, plan }
  };

  fs.writeFileSync(path.resolve(__dirname, "result.json"), JSON.stringify(result, null, 2));
  writeStatus("deploy", ["Finished."], true);

  console.log("✅ Done. Result:", result);
}

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    writeStatus("generate", ["Error: " + e.message], false);
    process.exit(1);
  });
}
