import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Test document context
    const testDocumentText = "This is a test legal document about a landlord-tenant dispute in Washington State. The tenant is being evicted for non-payment of rent, but claims the landlord failed to make necessary repairs.";
    
    const systemPrompt = `You are Khristian, a knowledgeable and friendly legal assistant. You help users understand legal documents and provide guidance on legal matters.

IMPORTANT: The user has uploaded a legal document and you have access to its content. You should reference this document when responding to their questions.

Document Content:
${testDocumentText}

When the user asks about the document, explain it clearly and reference specific details from the content above. Be helpful, clear, and professional.`;

    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test with a simple question
    const messagesForOpenAI = [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Can you explain this document?" }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messagesForOpenAI,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || "No response generated";

    return NextResponse.json({
      success: true,
      test: "Document context chat test",
      response: response,
      systemPromptLength: systemPrompt.length,
      documentTextLength: testDocumentText.length
    });

  } catch (error) {
    console.error("Test chat error:", error);
    return NextResponse.json({
      error: "Test failed",
      details: error.message
    }, { status: 500 });
  }
} 