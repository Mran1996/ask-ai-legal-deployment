/**
 * Legal Analysis Prompt Patches
 * 
 * These patches enhance the AI system prompts with specific legal analysis requirements
 * for comprehensive, citation-rich, and advocacy-focused legal document generation.
 */

export const LEGAL_PROMPT_PATCHES = {
  LENGTH_ENFORCEMENT: `
📏 LENGTH ENFORCEMENT
- For uploadedPages ≈ 30–40, produce 8–15 pages of analysis.
- If the first pass is <60% of target, expand with additional record cites and authority until the target is met.
- Always include a "Standard of Review" section and argue why the result must change even under that standard.`,

  CASE_LAW_CITATIONS: `
📚 CASE LAW CITATION REQUIREMENTS
If includeCaseLaw=true, cite controlling authority with short parentheticals and apply it:
- People v. Gentile (SB 1437 context)
- People v. Clements (post-SB 1437 resentencing / substantial evidence)
- People v. Powell, People v. Valenzuela, People v. Vizcarra (implied malice / aider & abettor analysis as relevant)
Use targeted, not boilerplate, applications.`,

  RECORD_CITATIONS: `
📄 RECORD CITATION REQUIREMENTS
Tie every key factual assertion to a record cite (PDF p. __ / Ex. __ / CT __ / ER __). If unknown, insert [Record cite: p. __].`,

  ADVOCACY_APPROACH: `
🎯 ADVOCACY APPROACH
Do not adopt adverse characterizations. Reframe facts for the movant. Avoid praising the trial court or "affirming."`,

  EXPANSION_INSTRUCTIONS: `
"Expand Sections II–IV with additional record citations and controlling authority; add a Standard of Review; maintain structure and tone."`
};

/**
 * Get all prompt patches as a single string
 */
export function getAllPromptPatches(): string {
  return Object.values(LEGAL_PROMPT_PATCHES).join('\n\n');
}

/**
 * Get specific prompt patches by key
 */
export function getPromptPatches(keys: (keyof typeof LEGAL_PROMPT_PATCHES)[]): string {
  return keys.map(key => LEGAL_PROMPT_PATCHES[key]).join('\n\n');
}

/**
 * Enhanced system prompt builder
 */
export function buildEnhancedSystemPrompt(basePrompt: string, includePatches: boolean = true): string {
  if (!includePatches) {
    return basePrompt;
  }
  
  return `${basePrompt}\n\n${getAllPromptPatches()}`;
}

/**
 * California-specific case law citations
 */
export const CALIFORNIA_CASE_LAW = {
  SB_1437_CONTEXT: "People v. Gentile (SB 1437 context)",
  POST_SB_1437_RESENTENCING: "People v. Clements (post-SB 1437 resentencing / substantial evidence)",
  IMPLIED_MALICE: "People v. Powell, People v. Valenzuela, People v. Vizcarra (implied malice / aider & abettor analysis as relevant)"
};

/**
 * Record citation templates
 */
export const RECORD_CITATION_TEMPLATES = {
  PDF_PAGE: "PDF p. __",
  EXHIBIT: "Ex. __",
  CLERK_TRANSCRIPT: "CT __",
  EXHIBIT_RECORD: "ER __",
  UNKNOWN: "[Record cite: p. __]"
};

/**
 * Standard of Review section template
 */
export const STANDARD_OF_REVIEW_TEMPLATE = `
STANDARD OF REVIEW

[Insert appropriate standard of review for the jurisdiction and case type]

[Argue why the result must change even under this standard, focusing on:
- Legal errors that require reversal/remand
- Factual findings not supported by substantial evidence
- Procedural errors that affected the outcome
- Constitutional violations that require relief]`;



