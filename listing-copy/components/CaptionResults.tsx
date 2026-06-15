'use client'

import { useState } from 'react'

export interface CaptionResult {
  professional: string
  conversational: string
  hype: string
  hashtags: string
}

interface CaptionResultsProps {
  results: CaptionResult
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 shrink-0"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

interface VariantCardProps {
  label: string
  badge: string
  badgeColor: string
  text: string
}

function VariantCard({ label, badge, badgeColor, text }: VariantCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}>
            {badge}
          </span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <CopyButton text={text} />
      </div>
      <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
    </div>
  )
}

export default function CaptionResults({ results }: CaptionResultsProps) {
  const variants: VariantCardProps[] = [
    {
      label: 'Professional',
      badge: 'PRO',
      badgeColor: 'bg-blue-100 text-blue-700',
      text: results.professional,
    },
    {
      label: 'Conversational',
      badge: 'CONVO',
      badgeColor: 'bg-green-100 text-green-700',
      text: results.conversational,
    },
    {
      label: 'Hype',
      badge: 'HYPE',
      badgeColor: 'bg-pink-100 text-pink-700',
      text: results.hype,
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold text-gray-900">Your Captions</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variants.map((v) => (
          <VariantCard key={v.label} {...v} />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Hashtags</span>
          <CopyButton text={results.hashtags} />
        </div>
        <p className="text-sm text-gray-600 leading-relaxed break-words">{results.hashtags}</p>
      </div>
    </div>
  )
}
