import OpenAI from "openai";
import { env } from "./env";

/*
  Single OpenAI client instance shared across the entire server.
  Creating one instance and reusing it is more efficient than
  creating a new one per request.

  Model used everywhere: gpt-4o
  It is the best balance of quality and speed for study pack generation.
*/
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

/* The model we use for all generation tasks */
export const GPT_MODEL = "gpt-4o" as const;

/*
  Helper to call GPT with a system prompt and user message.
  Returns the raw text response.
  Throws if the API call fails.
*/
export async function chatComplete(
  systemPrompt: string,
  userMessage:  string,
  maxTokens:    number = 2000,
): Promise<string> {
  const response = await openai.chat.completions.create({
    model:       GPT_MODEL,
    max_tokens:  maxTokens,
    temperature: 0.3, // Low temperature = more consistent, structured output
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user",   content: userMessage  },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned an empty response");
  return content.trim();
}
