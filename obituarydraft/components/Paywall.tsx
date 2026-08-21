"use client";

import { useState } from "react";

export default function Paywall({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.error ?? "Could not start checkout. Please try again.");
    } catch {
      setError("Could not reach the checkout service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sage-700">
            Free limit reached
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <h2 id="paywall-title" className="font-serif text-2xl text-ink">
          Keep helping every family
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          You've used your free drafts. Upgrade to continue creating dignified
          obituaries and program versions for every case you handle.
        </p>

        <div className="mt-5 rounded-xl border border-sage-200 bg-sage-50 px-5 py-4">
          <div className="flex items-baseline gap-1">
            <span className="font-serif text-3xl font-semibold text-ink">$49</span>
            <span className="text-sm text-slate-500">/ month</span>
          </div>
          <p className="mt-1 text-sm font-medium text-sage-700">Unlimited Cases</p>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            <li className="flex gap-2">
              <Check /> Unlimited obituary &amp; program drafts
            </li>
            <li className="flex gap-2">
              <Check /> Every tone, every case
            </li>
            <li className="flex gap-2">
              <Check /> Cancel anytime
            </li>
          </ul>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-sage-600 px-5 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-sage-700 disabled:opacity-60"
        >
          {loading ? "Starting checkout…" : "Subscribe — $49/month"}
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Secure checkout powered by Stripe.
        </p>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-0.5 shrink-0 text-sage-600"
      aria-hidden="true"
    >
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
