import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const idea = body.idea;

    if (!idea || !idea.trim()) {
      return NextResponse.json(
        { error: "Idea is required" },
        { status: 400 }
      );
    }

    // 🔑 GO UP FROM frontend → project root
    const ROOT = path.resolve(process.cwd(), "..");
    const ideaPath = path.join(ROOT, "agent", "current_idea.json");

    fs.writeFileSync(
      ideaPath,
      JSON.stringify({ idea }, null, 2)
    );

    await fetch("http://localhost:3001/run?step=research", {
      method: "POST",
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
