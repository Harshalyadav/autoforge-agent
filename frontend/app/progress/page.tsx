"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = ["QUEUED", "RESEARCH", "PLAN", "GENERATE", "DEPLOY"];

export default function ProgressPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Simulated progress (matches agent timing)
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 6000),
      setTimeout(() => setStep(4), 9000),
      setTimeout(() => {
        setDone(true);
        router.push("/result");
      }, 11000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [router]);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ width: 420 }}>
        <h2>Building your app...</h2>

        {STEPS.map((s, i) => (
          <div
            key={s}
            style={{
              marginTop: 12,
              padding: "14px 16px",
              borderRadius: 8,
              background: i <= step ? "#10b981" : "#f3f4f6",
              color: i <= step ? "#fff" : "#111",
              fontWeight: 600,
            }}
          >
            {s}
          </div>
        ))}

        {done && (
          <button
            onClick={() => router.push("/result")}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 14,
              borderRadius: 8,
              background: "#6366f1",
              color: "#fff",
              fontSize: 16,
              border: "none",
            }}
          >
            View Generated App →
          </button>
        )}
      </div>
    </main>
  );
}
