import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const resultPath = path.join(process.cwd(), "agent", "result.json");

  if (!fs.existsSync(resultPath)) {
    return NextResponse.json({ message: "No result yet" });
  }

  const data = JSON.parse(fs.readFileSync(resultPath, "utf-8"));
  return NextResponse.json(data);
}
