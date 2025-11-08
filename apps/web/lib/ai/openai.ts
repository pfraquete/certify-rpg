// OpenAI Configuration
// Note: In production, install 'openai' package
// For now, using fetch API directly

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIResponse {
  content: string;
  tokens: number;
  model: string;
}

/**
 * Generate content using OpenAI API
 */
export async function generateWithOpenAI(
  messages: OpenAIMessage[],
  config: Partial<OpenAIConfig> = {}
): Promise<OpenAIResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model || "gpt-4",
      messages,
      max_tokens: config.maxTokens || 1500,
      temperature: config.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || "Unknown error"}`);
  }

  const data = await response.json();

  return {
    content: data.choices[0].message.content,
    tokens: data.usage.total_tokens,
    model: data.model,
  };
}

/**
 * Parse JSON from AI response
 */
export function parseAIJSON<T>(content: string): T {
  // Remove markdown code blocks if present
  const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  return JSON.parse(cleaned);
}
