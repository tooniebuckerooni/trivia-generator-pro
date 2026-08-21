"use client";

import type { Tone } from "@/types";
import { TONES } from "@/types";

const DESCRIPTIONS: Record<Tone, string> = {
  Traditional: "Classic, formal, and timeless",
  "Warm & Personal": "Affectionate and full of character",
  "Faith-Based": "Gentle comfort and faith",
};

export default function ToneSelector({
  value,
  onChange,
}: {
  value: Tone;
  onChange: (tone: Tone) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 block text-sm font-semibold uppercase tracking-wide text-sage-700">
        Choose a tone
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {TONES.map((tone) => {
          const selected = tone === value;
          return (
            <button
              key={tone}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(tone)}
              className={[
                "flex flex-col rounded-xl border-2 px-4 py-3 text-left transition",
                selected
                  ? "border-sage-500 bg-sage-50 shadow-soft"
                  : "border-slate-200 bg-white hover:border-sage-400 hover:bg-sage-50/40",
              ].join(" ")}
            >
              <span
                className={[
                  "text-base font-semibold",
                  selected ? "text-sage-700" : "text-ink",
                ].join(" ")}
              >
                {tone}
              </span>
              <span className="mt-0.5 text-xs text-slate-500">
                {DESCRIPTIONS[tone]}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
