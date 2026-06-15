"use client";

import type { GeneratedOutput } from "@/types";
import CopyButton from "./CopyButton";

function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

export default function OutputPanel({
  output,
  loading,
  error,
}: {
  output: GeneratedOutput | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!output) return <EmptyState />;

  return (
    <div className="space-y-6">
      <ResultCard
        heading="Obituary Draft"
        meta={`${wordCount(output.obituary)} words`}
        body={output.obituary}
      />
      <ResultCard
        heading="Funeral Program Version"
        meta={`${wordCount(output.program)} words`}
        body={output.program}
      />
      <p className="text-xs leading-relaxed text-slate-400">
        These are AI-generated drafts intended for review. Please verify all
        names, dates, and details with the family before publishing.
      </p>
    </div>
  );
}

function ResultCard({
  heading,
  meta,
  body,
}: {
  heading: string;
  meta: string;
  body: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-soft">
      <header className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div>
          <h3 className="font-serif text-lg text-ink">{heading}</h3>
          <p className="text-xs text-slate-400">{meta}</p>
        </div>
        <CopyButton text={body} />
      </header>
      <div className="px-5 py-4">
        <p className="whitespace-pre-wrap font-serif text-[15px] leading-relaxed text-slate-800">
          {body}
        </p>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M14 3v6h6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="font-serif text-lg text-ink">Your drafts will appear here</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        Fill in the details on the left and we'll prepare a dignified obituary
        and a short program version.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
          <div className="mb-4 h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="space-y-2.5">
            {Array.from({ length: i === 0 ? 6 : 3 }).map((_, j) => (
              <div
                key={j}
                className="h-3.5 animate-pulse rounded bg-slate-100"
                style={{ width: `${75 + ((j * 7) % 22)}%` }}
              />
            ))}
          </div>
        </div>
      ))}
      <p className="text-center text-sm text-slate-500">
        Composing with care…
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-800">
      <p className="font-medium">We hit a snag</p>
      <p className="mt-1">{message}</p>
    </div>
  );
}
