import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { topic, state } = await req.json();
    const perplexityKey = process.env.PERPLEXITY_API_KEY;

    if (!perplexityKey) {
      return NextResponse.json({ error: 'Missing Perplexity API Key' }, { status: 500 });
    }

    const prompt = `Provide the 3 most relevant court cases with citations from ${state} related to the topic: ${topic}. Include case names, citations, and 1-2 sentence summaries.`;

    const response = await fetch('https://api.perplexity.ai/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: prompt,
        model: 'llama-3-70b-instruct'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch case law');
    }

    const data = await response.json();
    return NextResponse.json({ caseLaw: data.output || data.text || '' });
  } catch (error) {
    console.error('Error fetching case law:', error);
    return NextResponse.json({ error: 'Failed to fetch case law' }, { status: 500 });
  }
} 