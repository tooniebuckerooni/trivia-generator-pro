import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildPrompt } from '@/lib/prompts'

const client = new Anthropic()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, highlights, postType } = body as {
      address: string
      highlights: string
      postType: string
    }

    if (!address?.trim() || !highlights?.trim() || !postType?.trim()) {
      return NextResponse.json(
        { error: 'address, highlights, and postType are all required.' },
        { status: 400 }
      )
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: buildPrompt(address.trim(), highlights.trim(), postType.trim()),
        },
      ],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    const result = JSON.parse(content.text) as {
      professional: string
      conversational: string
      hype: string
      hashtags: string
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/generate]', err)
    return NextResponse.json(
      { error: 'Caption generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
