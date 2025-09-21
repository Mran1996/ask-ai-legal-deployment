export type GenerationState = {
  caseNumber?: string;
  county?: string;
  state?: string;
  opposingParty?: string;
  courtName?: string;
  includeCaseLaw?: boolean;
  uploadedDocMeta?: {
    filename?: string;
    pages?: number;
    extractedFields?: Record<string, string>;
  };
  chatHistory?: Array<{ role: "user" | "assistant"; content: string }>;
};
