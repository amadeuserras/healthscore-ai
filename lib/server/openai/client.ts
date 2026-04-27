import 'server-only';
import OpenAI from 'openai';

let client: OpenAI | null | undefined;

/**
 * OpenAI is optional at build time; missing key means analysis falls back to rule-based insights.
 */
export function getOpenAIClient(): OpenAI | null {
  if (client !== undefined) return client;
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    client = null;
    return null;
  }
  client = new OpenAI({ apiKey: key });
  return client;
}
