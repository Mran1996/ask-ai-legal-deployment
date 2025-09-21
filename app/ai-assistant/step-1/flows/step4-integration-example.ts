import { SYSTEM_STEP4 } from "@/app/ai-assistant/step-4/prompts/system.step4";
import { buildExplainThenIntakeMessage } from "@/app/ai-assistant/step-4/flows/explain-then-intake";

// Pseudocode: adjust names to your app's structures
export async function sendStep4Chat({
  messages,
  extracted, // your silent extraction result from the uploaded PDF
  mode,      // e.g., "explain_uploaded_doc" | "normal"
}: {
  messages: { role: "user" | "assistant" | "system"; content: string }[];
  extracted?: {
    county?: string; caseNumber?: string; topCharge?: string;
    enhancements?: string; appealOutcome?: string; appealDate?: string;
  };
  mode?: string;
}) {
  const system = { role: "system", content: SYSTEM_STEP4 };

  const requestMessages = [system, ...messages];

  const response = await fetch("/api/step4-chat", {
    method: "POST",
    body: JSON.stringify({ messages: requestMessages }),
    headers: { "Content-Type": "application/json" },
  });

  // stream/display assistant's explanation as usual...

  // If this turn was "Explain my document", immediately append the follow-up:
  if (mode === "explain_uploaded_doc") {
    const followup = buildExplainThenIntakeMessage({
      county: extracted?.county,
      caseNumber: extracted?.caseNumber,
      topCharge: extracted?.topCharge,
      enhancements: extracted?.enhancements,
      appealOutcome: extracted?.appealOutcome,
      appealDate: extracted?.appealDate,
    });

    // After the explanation finishes streaming, push this as a new assistant turn:
    // (use your existing chat stream function)
    await streamAssistantMessageToUI(followup);
  }

  return response;
}

// Replace streamAssistantMessageToUI with your app's existing function that posts an assistant message into the chat window.
// If you already have a centralized prompt file, you can paste the SYSTEM_STEP4 content into that file instead and just import it.






