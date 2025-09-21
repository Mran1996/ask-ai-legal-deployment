import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages, category } = req.body;
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Missing or invalid messages" });
    return;
  }

  // Validate messages array - filter out any messages with null/undefined content
  const validMessages = messages.filter((msg: ChatMessage) => 
    msg && 
    typeof msg === 'object' && 
    msg.sender && 
    msg.text && 
    typeof msg.text === 'string' && 
    msg.text.trim().length > 0
  );

  if (validMessages.length === 0) {
    console.log("[SUGGESTED REPLIES] No valid messages found, returning default suggestions");
    return res.status(200).json({ 
      suggestions: ["I need help with my case", "Tell me more about the process", "What documents do I need?"]
    });
  }

  const selectedCategory = category || "General";
  
  // Check for API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OpenAI API key is missing");
    return res.status(500).json({ 
      error: "OpenAI API key is not configured",
      suggestions: ["I need help with my case", "Tell me more about the process", "What documents do I need?"]
    });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const systemPrompt = `You are an AI legal assistant conducting a comprehensive attorney-client interview for a ${selectedCategory} issue. 

Based on the conversation so far, suggest 3 helpful, relevant responses the user might say next. These should be natural, conversational responses that would help move the attorney interview forward through the different phases:

PHASE 1: Basic case information (parties, timeline, jurisdiction)
PHASE 2: Factual background (what happened, evidence, witnesses)
PHASE 3: Legal analysis (claims, defenses, applicable law)
PHASE 4: Goals and strategy (desired outcome, timeline, approach)
PHASE 5: Document preparation (specific document type, requirements)

IMPORTANT: 
- Always include at least one option for document generation (like "I think we have enough information to create my document now" or "Can we go ahead and generate the document with what we have?")
- Make responses sound natural and human - avoid formal or robotic language
- Include responses that confirm information from documents (like "Yes, that's correct from my documents" or "That's right, that's what happened")
- Include proactive requests (like "Can you find similar cases for me?" or "What's the legal analysis of my situation?")
- Avoid responses that just ask for instructions - focus on getting actual help

Suggestions should feel natural, conversational, and guide the legal discussion forward through these phases. Only return a JSON array of strings. Do not include any explanation or extra text.`;
    
    const messages_for_completion: ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...validMessages.map((msg: ChatMessage) => ({
        role: msg.sender,
        content: msg.text
      })) as ChatCompletionMessageParam[],
      { role: "user", content: "Suggest 3 helpful user replies to the last assistant message. Only return a JSON array." }
    ];

    console.log("[SUGGESTED REPLIES] Sending request to OpenAI:", {
      validMessagesCount: validMessages.length,
      originalMessagesCount: messages.length,
      category: selectedCategory
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages_for_completion,
      temperature: 0.5
    });

    try {
      // Try to extract the JSON array from the response
      const content = completion.choices[0]?.message?.content;
      
      if (!content) {
        console.error("[SUGGESTED REPLIES] OpenAI returned null/undefined content");
        return res.status(200).json({ 
          suggestions: ["I need help with my case", "Tell me more about the process", "What documents do I need?"]
        });
      }

      // Find the first and last brackets to extract the array
      const start = content.indexOf("[");
      const end = content.lastIndexOf("]");
      let suggestions: string[] = [];
      
      if (start !== -1 && end !== -1) {
        suggestions = JSON.parse(content.slice(start, end + 1));
      }
      
      console.log("[SUGGESTED REPLIES] Successfully generated suggestions:", suggestions);
      res.status(200).json({ suggestions });
    } catch (e) {
      console.error("[SUGGESTED REPLIES] Failed to parse suggestions:", e);
      res.status(200).json({ 
        suggestions: ["I need help with my case", "Tell me more about the process", "What documents do I need?"]
      });
    }
  } catch (error) {
    console.error("[SUGGESTED REPLIES] OpenAI API error:", error);
    res.status(200).json({ 
      suggestions: ["I need help with my case", "Tell me more about the process", "What documents do I need?"]
    });
  }
} 