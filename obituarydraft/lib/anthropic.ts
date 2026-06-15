import Anthropic from "@anthropic-ai/sdk";

/**
 * Shared Anthropic client. The API key is read from the ANTHROPIC_API_KEY
 * environment variable and must only ever be used server-side.
 */
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// The user explicitly requested Claude Sonnet 4.6 for this project.
export const MODEL = "claude-sonnet-4-6";
