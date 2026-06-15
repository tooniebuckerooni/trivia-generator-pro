"use client";

/**
 * Lightweight, client-side usage tracking via localStorage. No auth, no
 * database — exactly what the MVP calls for. A director gets a small number of
 * free generations, after which the Stripe paywall appears.
 */

const COUNT_KEY = "obituarydraft.generations";
const SUB_KEY = "obituarydraft.subscribed";

export const FREE_LIMIT = 3;

function safeGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore (private mode, quota, etc.) */
  }
}

export function getGenerationCount(): number {
  const raw = safeGet(COUNT_KEY);
  const n = raw ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function incrementGenerationCount(): number {
  const next = getGenerationCount() + 1;
  safeSet(COUNT_KEY, String(next));
  return next;
}

export function isSubscribed(): boolean {
  return safeGet(SUB_KEY) === "true";
}

export function setSubscribed(value: boolean): void {
  safeSet(SUB_KEY, value ? "true" : "false");
}

/** Remaining free generations (0 once the limit is reached). */
export function remainingFree(): number {
  return Math.max(0, FREE_LIMIT - getGenerationCount());
}

/** Whether the director may generate another draft right now. */
export function canGenerate(): boolean {
  return isSubscribed() || getGenerationCount() < FREE_LIMIT;
}
