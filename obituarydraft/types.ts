export type Tone = "Traditional" | "Warm & Personal" | "Faith-Based";

export const TONES: Tone[] = ["Traditional", "Warm & Personal", "Faith-Based"];

export interface IntakeData {
  fullName: string;
  nickname: string;
  birthDate: string;
  birthPlace: string;
  deathDate: string;
  deathPlace: string;
  occupation: string;
  survivingFamily: string;
  predeceasedFamily: string;
  /** 3–5 free-text answers to memory prompts. */
  memories: string[];
  tone: Tone;
  military: string;
  community: string;
}

export interface GeneratedOutput {
  /** 200–350 word dignified obituary draft. */
  obituary: string;
  /** ~80 word funeral program version. */
  program: string;
}
