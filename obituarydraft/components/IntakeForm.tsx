"use client";

import { useState } from "react";
import type { IntakeData, Tone } from "@/types";
import ToneSelector from "./ToneSelector";

const MAX_MEMORIES = 5;
const MIN_MEMORIES = 3;

const MEMORY_PROMPTS = [
  "What is a favorite memory or story about them?",
  "What did they love most — passions, hobbies, places?",
  "How would they want to be remembered?",
  "What made them laugh, or made them uniquely themselves?",
  "Is there a value or lesson they passed on?",
];

const EMPTY: IntakeData = {
  fullName: "",
  nickname: "",
  birthDate: "",
  birthPlace: "",
  deathDate: "",
  deathPlace: "",
  occupation: "",
  survivingFamily: "",
  predeceasedFamily: "",
  memories: ["", "", ""],
  tone: "Traditional",
  military: "",
  community: "",
};

export default function IntakeForm({
  onGenerate,
  loading,
}: {
  onGenerate: (data: IntakeData) => void;
  loading: boolean;
}) {
  const [data, setData] = useState<IntakeData>(EMPTY);

  function set<K extends keyof IntakeData>(key: K, value: IntakeData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function setMemory(index: number, value: string) {
    setData((prev) => {
      const memories = [...prev.memories];
      memories[index] = value;
      return { ...prev, memories };
    });
  }

  function addMemory() {
    setData((prev) =>
      prev.memories.length >= MAX_MEMORIES
        ? prev
        : { ...prev, memories: [...prev.memories, ""] },
    );
  }

  function removeMemory(index: number) {
    setData((prev) =>
      prev.memories.length <= MIN_MEMORIES
        ? prev
        : { ...prev, memories: prev.memories.filter((_, i) => i !== index) },
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    onGenerate(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Identity */}
      <Section title="About the person">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" required>
            <input
              className="field-input"
              value={data.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Margaret Eleanor Whitfield"
              required
            />
          </Field>
          <Field label="Nickname / known as">
            <input
              className="field-input"
              value={data.nickname}
              onChange={(e) => set("nickname", e.target.value)}
              placeholder="Peggy"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date of birth">
            <input
              className="field-input"
              value={data.birthDate}
              onChange={(e) => set("birthDate", e.target.value)}
              placeholder="March 4, 1942"
            />
          </Field>
          <Field label="Place of birth">
            <input
              className="field-input"
              value={data.birthPlace}
              onChange={(e) => set("birthPlace", e.target.value)}
              placeholder="Asheville, North Carolina"
            />
          </Field>
          <Field label="Date of death">
            <input
              className="field-input"
              value={data.deathDate}
              onChange={(e) => set("deathDate", e.target.value)}
              placeholder="January 12, 2026"
            />
          </Field>
          <Field label="Place of death">
            <input
              className="field-input"
              value={data.deathPlace}
              onChange={(e) => set("deathPlace", e.target.value)}
              placeholder="Raleigh, North Carolina"
            />
          </Field>
        </div>
        <Field label="Occupation / life's work">
          <input
            className="field-input"
            value={data.occupation}
            onChange={(e) => set("occupation", e.target.value)}
            placeholder="Schoolteacher for 33 years"
          />
        </Field>
      </Section>

      {/* Family */}
      <Section title="Family">
        <Field label="Surviving family members">
          <textarea
            className="field-input"
            rows={3}
            value={data.survivingFamily}
            onChange={(e) => set("survivingFamily", e.target.value)}
            placeholder="Husband, Robert; daughters Anne (James) and Clare; four grandchildren"
          />
        </Field>
        <Field label="Preceded in death by">
          <textarea
            className="field-input"
            rows={2}
            value={data.predeceasedFamily}
            onChange={(e) => set("predeceasedFamily", e.target.value)}
            placeholder="Her parents, and her brother Thomas"
          />
        </Field>
      </Section>

      {/* Memories */}
      <Section
        title="Memories & reflections"
        subtitle="A few details from the family help the most. Answer 3–5."
      >
        <div className="space-y-4">
          {data.memories.map((memory, i) => (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  {MEMORY_PROMPTS[i] ?? `Another memory (${i + 1})`}
                </label>
                {data.memories.length > MIN_MEMORIES && (
                  <button
                    type="button"
                    onClick={() => removeMemory(i)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Remove
                  </button>
                )}
              </div>
              <textarea
                className="field-input"
                rows={2}
                value={memory}
                onChange={(e) => setMemory(i, e.target.value)}
                placeholder="Share a memory in the family's own words…"
              />
            </div>
          ))}
          {data.memories.length < MAX_MEMORIES && (
            <button
              type="button"
              onClick={addMemory}
              className="text-sm font-medium text-sage-600 hover:text-sage-700"
            >
              + Add another memory
            </button>
          )}
        </div>
      </Section>

      {/* Optional */}
      <Section title="Optional details">
        <Field label="Military service">
          <input
            className="field-input"
            value={data.military}
            onChange={(e) => set("military", e.target.value)}
            placeholder="U.S. Navy, 1961–1965"
          />
        </Field>
        <Field label="Community / civic involvement">
          <input
            className="field-input"
            value={data.community}
            onChange={(e) => set("community", e.target.value)}
            placeholder="Volunteer at First Methodist; garden club president"
          />
        </Field>
      </Section>

      {/* Tone */}
      <Section title="">
        <ToneSelector value={data.tone} onChange={(t: Tone) => set("tone", t)} />
      </Section>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-sage-600 px-5 py-3 text-base font-semibold text-white shadow-soft transition hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Writing the draft…" : "Generate obituary draft"}
      </button>
    </form>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      {title && (
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-sage-700">
            {title}
          </h3>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {required && <span className="text-sage-600"> *</span>}
      </label>
      {children}
    </div>
  );
}
