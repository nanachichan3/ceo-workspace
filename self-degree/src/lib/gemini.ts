const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash";

export interface GeminiMessage {
  role: "user" | "model";
  content: string;
}

export interface GenerateContentOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function generateContent(
  messages: GeminiMessage[],
  options: GenerateContentOptions = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const url = `${GEMINI_API_URL}:generateContent?key=${apiKey}`;

  const parts = messages.map((m) => ({ text: m.content }));

  const requestBody: Record<string, unknown> = {
    contents: [{ parts }],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
    },
  };

  if (options.systemPrompt) {
    requestBody.systemInstruction = {
      parts: [{ text: options.systemPrompt }],
    };
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${error}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "I'm not sure how to respond to that. Can you rephrase?"
  );
}

export async function countTokens(text: string): Promise<number> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return 0;

  const url = `${GEMINI_API_URL}:countTokens?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text }] }] }),
  });

  if (!response.ok) return 0;

  const data = (await response.json()) as { totalTokens?: number };
  return data.totalTokens ?? 0;
}

export const SELF_DEGREE_TUTOR_PROMPT = `You are an AI tutor for a self-directed learner. Your role is to follow the child's curiosity — not to impose a curriculum. Ask questions. Generate challenges at the edge of their knowledge. Celebrate their discoveries. Never lecture. Never test. Never correct harshly. The child leads; you facilitate.`;
