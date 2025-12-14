# 🚀 AutoForge – Autonomous App Builder

AutoForge is an AI-powered autonomous agent system that converts a plain English idea into a fully functional web application.

## ✨ Features
- Natural language → Working app
- Multi-step agent execution (Research → Plan → Generate → Deploy)
- Real-time progress tracking
- Auto-generated Next.js applications
- Zero manual coding required

## 🏗 Architecture
- Frontend: Next.js (App Router)
- Agent Runner: Node.js
- Workflow Orchestration: Kestra
- Code Generation: Agent-based execution
- Deployment: Local / Vercel-ready

## 🔄 Build Pipeline
1. Research agent analyzes idea
2. Planning agent creates architecture & API plan
3. Generation agent scaffolds full codebase
4. Deployment agent prepares runnable app

## 🧪 Run Locally

```bash
# Agent
cd agent
npm install
node runner.js

# Frontend
cd frontend
npm install
npm run dev

# Generated App
cd output/generated-app
npm install
npm run dev
