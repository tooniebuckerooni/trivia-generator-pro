import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL } from "@/lib/anthropic";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import type { GeneratedOutput, IntakeData, Tone } from "@/types";
import { TONES } from "@/types";

export const runtime = "nodejs";
// This route calls an external API and depends on per-request input.
export const dynamic = "force-dynamic";

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function normalizeInput(body: unknown): IntakeData {
  const b = (body ?? {}) as Record<string, unknown>;
  const tone = TONES.includes(b.tone as Tone) ? (b.tone as Tone) : "Traditional";
  const memories = Array.isArray(b.memories)
    ? (b.memories as unknown[]).map(asString)
    : [];

  return {
    fullName: asString(b.fullName),
    nickname: asString(b.nickname),
    birthDate: asString(b.birthDate),
    birthPlace: asString(b.birthPlace),
    deathDate: asString(b.deathDate),
    deathPlace: asString(b.deathPlace),
    occupation: asString(b.occupation),
    survivingFamily: asString(b.survivingFamily),
    predeceasedFamily: asString(b.predeceasedFamily),
    memories,
    tone,
    military: asString(b.military),
    community: asString(b.community),
  };
}

/**
 * Robustly extract the JSON object from Claude's reply. We instruct the model
 * to return raw JSON, but we still defend against stray code fences or
 * surrounding prose so the UI never breaks on a malformed response.
 */
function extractOutput(text: string): GeneratedOutput {
  let t = text.trim();

  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();

  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    t = t.slice(start, end + 1);
  }

  const parsed = JSON.parse(t) as Record<string, unknown>;
  const obituary = asString(parsed.obituary).trim();
  const program = asString(parsed.program).trim();

  if (!obituary || !program) {
    throw new Error("Model response missing expected fields.");
  }
  return { obituary, program };
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "The server is missing ANTHROPIC_API_KEY. Add it to .env.local." },
      { status: 500 },
    );
  }

  let data: IntakeData;
  try {
    data = normalizeInput(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!data.fullName.trim()) {
    return NextResponse.json(
      { error: "Please provide at least the full name of the deceased." },
      { status: 400 },
    );
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(data) }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

    const output = extractOutput(text);
    return NextResponse.json(output);
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      const status = err.status ?? 502;
      const message =
        status === 401
          ? "Authentication with the AI service failed. Check ANTHROPIC_API_KEY."
          : status === 429
            ? "The AI service is rate limited right now. Please try again shortly."
            : "The AI service returned an error. Please try again.";
      return NextResponse.json({ error: message }, { status });
    }

    console.error("Generation failed:", err);
    return NextResponse.json(
      { error: "We couldn't generate the draft. Please try again." },
      { status: 500 },
    );
  }
}
