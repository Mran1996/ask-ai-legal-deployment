# Step 4 - Chat/Intake System

This directory contains the Step 4 chat and intake system components for the AI legal assistant.

## Files

### `prompts/system.step4.ts`
Contains the main system prompt for Step 4 chat interactions. This prompt:
- Focuses on civil or criminal matters for incarcerated individuals
- Prioritizes California criminal post-conviction cases
- Uses a professional, compassionate, attorney-style persona
- Includes specific disclaimer text
- Handles document explanation and intake flow

### `flows/explain-then-intake.ts`
Helper function that builds follow-up messages after document explanation. This:
- Takes extracted case data as context
- Generates a structured response with case summary
- Provides clear next steps for the user
- Handles missing data gracefully with defaults

### `flows/step4-integration-example.ts`
Example implementation showing how to integrate the system prompt and follow-up helper into your chat flow.

## Usage

1. Import the system prompt:
```typescript
import { SYSTEM_STEP4 } from "@/app/ai-assistant/step-4/prompts/system.step4";
```

2. Import the follow-up helper:
```typescript
import { buildExplainThenIntakeMessage } from "@/app/ai-assistant/step-4/flows/explain-then-intake";
```

3. Use in your chat implementation:
```typescript
const system = { role: "system", content: SYSTEM_STEP4 };
const followup = buildExplainThenIntakeMessage({
  county: extractedData.county,
  caseNumber: extractedData.caseNumber,
  // ... other extracted data
});
```

## Key Features

- **One-question-at-a-time approach**: Ensures focused, productive conversations
- **Document-aware**: Automatically extracts and uses case information from uploaded documents
- **California-focused**: Optimized for California criminal post-conviction cases
- **Professional tone**: Maintains attorney-style communication while being compassionate
- **Clear disclaimers**: Includes appropriate legal disclaimers when needed

## Integration Notes

- Replace `streamAssistantMessageToUI` with your app's existing chat streaming function
- Adjust API endpoints to match your backend structure
- The system prompt can be integrated into existing centralized prompt files if preferred






