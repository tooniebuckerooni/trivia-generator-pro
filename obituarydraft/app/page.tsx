"use client";

import { useEffect, useState } from "react";
import type { GeneratedOutput, IntakeData } from "@/types";
import IntakeForm from "@/components/IntakeForm";
import OutputPanel from "@/components/OutputPanel";
import Paywall from "@/components/Paywall";
import {
  FREE_LIMIT,
  canGenerate,
  incrementGenerationCount,
  isSubscribed,
  remainingFree,
  setSubscribed,
} from "@/lib/usage";

export default function Home() {
  const [output, setOutput] = useState<GeneratedOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [subscribed, setSub] = useState(false);
  const [remaining, setRemaining] = useState(FREE_LIMIT);

  // On mount: honor a successful Stripe redirect (?subscribed=true) and read
  // current usage state from localStorage.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      setSubscribed(true);
      // Clean the query string so a refresh doesn't re-trigger anything.
      window.history.replaceState({}, "", window.location.pathname);
    }
    setSub(isSubscribed());
    setRemaining(remainingFree());
  }, []);

  async function handleGenerate(data: IntakeData) {
    setError(null);

    if (!canGenerate()) {
      setPaywallOpen(true);
      return;
    }

    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setOutput(json as GeneratedOutput);
      // Only count a successful generation against the free allowance.
      incrementGenerationCount();
      setRemaining(remainingFree());
    } catch {
      setError("We couldn't reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Header */}
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Logo />
            <h1 className="font-serif text-2xl text-ink sm:text-3xl">
              ObituaryDraft
            </h1>
          </div>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            A gentle assistant for funeral directors — turn a short intake into a
            dignified obituary draft and a funeral program version.
          </p>
        </div>
        <UsageBadge subscribed={subscribed} remaining={remaining} />
      </header>

      {/* Two-panel layout: form left, output right; stacked on mobile. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-soft sm:p-6">
          <IntakeForm onGenerate={handleGenerate} loading={loading} />
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <OutputPanel output={output} loading={loading} error={error} />
        </div>
      </div>

      <Paywall open={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </main>
  );
}

function UsageBadge({
  subscribed,
  remaining,
}: {
  subscribed: boolean;
  remaining: number;
}) {
  if (subscribed) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1.5 text-sm font-medium text-sage-700">
        <Check /> Unlimited Cases
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
      {remaining} of {FREE_LIMIT} free drafts left
    </span>
  );
}

function Logo() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-600 text-white">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
