import "../config/env.js";

const OLLAMA_URL =
  process.env.OLLAMA_URL ?? "http://localhost:11434";

const MODEL =
  process.env.OLLAMA_MODEL ?? "mistral:latest";

export type AnalysisResult = {
  rootCause: string;
  suggestedFix: string[];
  confidence: number;
};

export async function analyzeLogs(
  logs: string
): Promise<AnalysisResult> {
  const prompt = `
You are a senior DevOps engineer specializing in GitHub Actions, CI/CD pipelines, Docker, Node.js, TypeScript, pnpm, Prisma and PostgreSQL.

Your task is to analyze GitHub Actions logs and identify the REAL failure.

Return ONLY valid JSON.

{
  "rootCause": "One concise sentence describing the actual failure.",
  "suggestedFix": [
    "Step 1",
    "Step 2",
    "Step 3"
  ],
  "confidence": 95
}

Rules:

- Ignore warnings unless they directly caused the failure.
- Focus on the FIRST actual error that caused the workflow to fail.
- If multiple errors appear, identify the root cause rather than downstream errors.
- Mention filenames, commands, packages, or services when they appear.
- If the failure is caused by missing environment variables, secrets, permissions, dependencies, Docker, pnpm, Prisma, TypeScript, or GitHub Actions configuration, explicitly mention it.
- suggestedFix should be practical, short, and ordered.
- confidence must be an integer between 0 and 100.
- Do not wrap the JSON in markdown.
- Do not include any explanation outside the JSON.

GitHub Actions Logs:
${logs.slice(0, 15000)}
`;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const data = await response.json();

  try {
    return JSON.parse(data.response);
  } catch {
    return {
      rootCause: "Unable to parse Ollama response.",
      suggestedFix: [data.response],
      confidence: 0,
    };
  }
}
