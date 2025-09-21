import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST() {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a supportive, positive assistant. Generate a short, heartfelt message of encouragement for someone working hard on a legal matter.'
        },
        {
          role: 'user',
          content: 'Please give me a message of encouragement.'
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });
    const message = completion.choices[0].message.content?.trim() || "You are doing great! Keep moving forward—your efforts matter and you have what it takes to succeed.";
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ message: "You are doing great! Keep moving forward—your efforts matter and you have what it takes to succeed." });
  }
} 