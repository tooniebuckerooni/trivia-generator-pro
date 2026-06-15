import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ListingCopy — AI Captions for Real Estate',
  description: 'Generate professional, conversational, and hype social media captions for any listing in seconds.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen antialiased">{children}</body>
    </html>
  )
}
