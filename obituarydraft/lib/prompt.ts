import type { IntakeData, Tone } from "@/types";

/**
 * The system prompt establishes a careful, dignified voice. Obituary writing is
 * emotionally sensitive work — the instructions emphasise accuracy, restraint,
 * and never inventing facts that were not provided.
 */
export const SYSTEM_PROMPT = `You are an experienced, compassionate obituary writer who partners with funeral home directors. You craft dignified, accurate, and emotionally resonant tributes that honor the person who has died and bring comfort to those who grieve.

Core principles you always follow:
- Treat the deceased and their family with the utmost respect and tenderness.
- Use ONLY the facts provided. Never invent names, dates, relationships, achievements, religious beliefs, or causes of death. If a detail was not given, gracefully write around it rather than guessing.
- Cause of death is private. Never speculate about or state how the person died unless it is explicitly supplied.
- Write in warm, natural prose — never clinical, never saccharine, never clichéd filler.
- Honor the requested tone faithfully.
- Keep names, dates, and places exactly as given.
- These are drafts for a funeral director to review and refine, so produce clean, ready-to-edit text with no placeholders or bracketed notes.`;

const TONE_GUIDANCE: Record<Tone, string> = {
  Traditional:
    "Tone: TRADITIONAL. Use a classic, formal obituary structure and measured, respectful language. Lead with the announcement of passing, then life summary, family, and service details where relevant. Dignified and timeless.",
  "Warm & Personal":
    "Tone: WARM & PERSONAL. Write affectionately and conversationally, celebrating the person's character, quirks, and the love they shared. Let their personality shine through while remaining respectful.",
  "Faith-Based":
    "Tone: FAITH-BASED. Weave in gentle, comforting faith language and themes of eternal rest and reunion, but ONLY in a manner consistent with any beliefs implied by the inputs. Do not assume a specific denomination or doctrine that was not provided; keep faith references warm and inclusive.",
};

function line(label: string, value: string): string {
  const v = (value || "").trim();
  return v ? `- ${label}: ${v}` : `- ${label}: (not provided)`;
}

export function buildUserPrompt(data: IntakeData): string {
  const memories = data.memories
    .map((m) => m.trim())
    .filter(Boolean)
    .map((m, i) => `  ${i + 1}. ${m}`)
    .join("\n");

  return `Please write two pieces honoring the life below.

DECEASED DETAILS
${line("Full name", data.fullName)}
${line("Nickname / how they were known", data.nickname)}
${line("Date of birth", data.birthDate)}
${line("Place of birth", data.birthPlace)}
${line("Date of death", data.deathDate)}
${line("Place of death", data.deathPlace)}
${line("Occupation / life's work", data.occupation)}

FAMILY
${line("Surviving family members", data.survivingFamily)}
${line("Preceded in death by", data.predeceasedFamily)}

MEMORIES & REFLECTIONS (from the family)
${memories || "  (none provided)"}

ADDITIONAL DETAILS
${line("Military service", data.military)}
${line("Community / civic involvement", data.community)}

${TONE_GUIDANCE[data.tone]}

DELIVERABLES
1. "obituary": A dignified obituary draft of 200–350 words. It should read as a complete, publication-ready tribute that flows naturally and incorporates the most meaningful details above.
2. "program": A condensed version of approximately 80 words suitable for a printed funeral program — a distilled, heartfelt remembrance capturing the essence of the longer obituary.

OUTPUT FORMAT
Respond with ONLY a single valid JSON object and nothing else (no markdown, no commentary):
{"obituary": "<the 200-350 word obituary>", "program": "<the ~80 word program version>"}
Use plain text inside the strings (no markdown). Escape any double quotes and newlines properly for valid JSON.`;
}
