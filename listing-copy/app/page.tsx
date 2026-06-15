'use client'

import { useState, useEffect } from 'react'
import CaptionForm from '@/components/CaptionForm'
import CaptionResults, { type CaptionResult } from '@/components/CaptionResults'

const FREE_LIMIT = 3
const STORAGE_KEY = 'lc_uses'

export default function Home() {
  const [uses, setUses] = useState(0)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CaptionResult | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
    setUses(isNaN(stored) ? 0 : stored)
  }, [])

  const isLocked = uses >= FREE_LIMIT

  async function handleGenerate(formData: {
    address: string
    highlights: string
    postType: string
  }) {
    if (isLocked) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error ?? 'Something went wrong.')
      }

      setResults(data as CaptionResult)

      const newUses = uses + 1
      setUses(newUses)
      localStorage.setItem(STORAGE_KEY, String(newUses))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Listing<span className="text-amber-500">Copy</span>
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">AI captions for every listing, in seconds</p>
          </div>
          {/* Usage badge */}
          <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${
            isLocked
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {isLocked ? 'Free limit reached' : `${uses} / ${FREE_LIMIT} free uses`}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Form */}
        <section className="max-w-2xl mx-auto">
          <CaptionForm onSubmit={handleGenerate} loading={loading} locked={isLocked} />
        </section>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* Stripe gate */}
        {isLocked && (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-amber-200 shadow-sm p-6 text-center space-y-3">
            <div className="text-2xl">🔒</div>
            <h2 className="font-semibold text-gray-900">You&apos;ve used your 3 free generations</h2>
            <p className="text-sm text-gray-500">
              Upgrade to keep generating captions for all your listings — no limits.
            </p>
            <button
              disabled
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 text-white font-semibold py-2.5 px-6 text-sm opacity-50 cursor-not-allowed"
            >
              Unlock Unlimited — $9/mo
            </button>
            <p className="text-xs text-gray-400">Stripe integration coming soon</p>
          </div>
        )}

        {/* Results */}
        {results && <CaptionResults results={results} />}
      </main>
    </div>
  )
}
