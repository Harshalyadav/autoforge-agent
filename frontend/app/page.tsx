"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const startBuild = async () => {
    if (!idea.trim()) {
      alert("Write an idea first.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/progress");
    } else {
      const txt = await res.text();
      alert("Start failed: " + txt);
    }
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: "880px", textAlign: "center" }}>
        <h1 style={{ fontSize: 48 }}>
          Describe what you want to build.
        </h1>

        <p>
          AutoForge will research, plan, generate code, and deploy your app
          automatically.
        </p>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder='e.g. "Build a todo app with tags and auth"'
          style={{
            width: "100%",
            height: 180,
            marginTop: 24,
            padding: 16,
            borderRadius: 12,
            background: "#0b0b0e",
            color: "#fff",
            border: "1px solid #222",
          }}
        />

        <button
          onClick={startBuild}
          disabled={loading}
          style={{
            marginTop: 18,
            padding: "14px 28px",
            fontSize: 18,
            borderRadius: 12,
            background:
              "linear-gradient(90deg,#10b981,#3b82f6)",
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Starting..." : "🚀 Build My App"}
        </button>
      </div>
    </main>
  );
}
