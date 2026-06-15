export function buildPrompt(
  address: string,
  highlights: string,
  postType: string
): string {
  return `You are an expert real estate social media copywriter. Generate exactly 3 caption variants for this listing.

Property Address: ${address}
Key Highlights: ${highlights}
Post Type: ${postType}

Write these 3 variants:

PROFESSIONAL — Polished, market-focused, authoritative. 2–3 sentences. Suitable for LinkedIn or a business Facebook page.

CONVERSATIONAL — Warm, friendly, personal. 2–3 sentences. Sounds like a real person talking, great for Instagram or personal Facebook.

HYPE — High-energy, emoji-rich (use 3–5 emojis strategically), FOMO-driven. Perfect for Instagram Stories, Reels, or TikTok.

Then add a HASHTAGS block with 15–20 relevant hashtags in a single line.

Respond ONLY with valid JSON — no markdown, no code fences, no explanation. Use exactly this shape:
{
  "professional": "caption text",
  "conversational": "caption text",
  "hype": "caption text",
  "hashtags": "#tag1 #tag2 #tag3"
}`
}
