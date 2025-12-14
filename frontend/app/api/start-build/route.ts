import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(  req: NextApiRequest,
  res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const body = JSON.parse(req.body || "{}");
    const idea = body.idea;

    if (!idea) {
      return res.status(400).send("Idea is required");
    }

    // 🔥 Trigger Kestra flow
    const kestraRes = await fetch(
      "http://localhost:8080/api/v1/main/executions/autoforge/build_app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: {
            idea
          }
        })
      }
    );

    if (!kestraRes.ok) {
      const err = await kestraRes.text();
      return res.status(500).send(err);
    }

    const data = await kestraRes.json();

    return res.status(200).json({
      executionId: data.id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err);
  }
}
