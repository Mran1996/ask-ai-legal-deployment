// lib/normalizeDoc.ts - Document post-processor for consistency
import { getStandardRelief } from './jurisdiction';

export function normalizeDocument(draft: string, documentType: string): string {
  let normalized = draft;

  // 1. Force title to ALL CAPS, bold, centered
  normalized = normalizeTitle(normalized, documentType);

  // 2. Ensure all required section headings exist
  normalized = ensureRequiredSections(normalized, documentType);

  // 3. Convert heading case to ALL CAPS
  normalized = normalizeHeadings(normalized);

  // 4. Normalize relief phrasing
  normalized = normalizeRelief(normalized, documentType);

  // 5. Remove any "Document Title:" or stray labels
  normalized = removeStrayLabels(normalized);

  // 6. Ensure proper spacing and formatting
  normalized = normalizeFormatting(normalized);

  return normalized;
}

function normalizeTitle(draft: string, documentType: string): string {
  // Find and normalize the document title
  const titlePatterns = [
    /^(.*?)(?:DOCUMENT TITLE:\s*)?([A-Z][^\\n]*?)(?:\\n|$)/im,
    /^(.*?)(?:TITLE:\s*)?([A-Z][^\\n]*?)(?:\\n|$)/im,
    /^(.*?)([A-Z][^\\n]*?)(?:\\n|$)/im
  ];

  for (const pattern of titlePatterns) {
    const match = draft.match(pattern);
    if (match) {
      const beforeTitle = match[1];
      const title = match[2].trim();
      
      // Convert to ALL CAPS and center
      const normalizedTitle = `**${title.toUpperCase()}**`;
      const centeredTitle = `\n\n${normalizedTitle}\n\n`;
      
      return beforeTitle + centeredTitle + draft.substring(match[0].length);
    }
  }

  // If no title found, add one
  const normalizedTitle = `**${documentType.toUpperCase()}**`;
  return `\n\n${normalizedTitle}\n\n${draft}`;
}

function ensureRequiredSections(draft: string, documentType: string): string {
  const requiredSections = [
    'INTRODUCTION',
    'JURISDICTION AND VENUE', 
    'STATEMENT OF FACTS',
    'PROCEDURAL HISTORY',
    'LEGAL STANDARD',
    'ARGUMENT',
    'REQUESTED RELIEF',
    'CONCLUSION',
    'CERTIFICATE OF SERVICE'
  ];

  // Special handling for post-conviction documents
  const isPostConviction = /post.?conviction|habeas|1473/i.test(documentType);
  
  let result = draft;
  const missingSections: string[] = [];

  for (const section of requiredSections) {
    if (!result.toUpperCase().includes(section)) {
      missingSections.push(section);
    }
  }

  // Add missing sections before the conclusion
  if (missingSections.length > 0) {
    const conclusionIndex = result.toUpperCase().indexOf('CONCLUSION');
    if (conclusionIndex !== -1) {
      const beforeConclusion = result.substring(0, conclusionIndex);
      const afterConclusion = result.substring(conclusionIndex);
      
      const missingSectionsText = missingSections
        .map(section => `\n\n${section}\n\n[Insert ${section.toLowerCase()} content]`)
        .join('');
      
      result = beforeConclusion + missingSectionsText + '\n\n' + afterConclusion;
    } else {
      // If no conclusion, add at the end
      const missingSectionsText = missingSections
        .map(section => `\n\n${section}\n\n[Insert ${section.toLowerCase()} content]`)
        .join('');
      
      result += missingSectionsText;
    }
  }

  return result;
}

function normalizeHeadings(draft: string): string {
  // Convert common heading patterns to ALL CAPS
  const headingPatterns = [
    { pattern: /^(Introduction|INTRODUCTION)\s*$/gim, replacement: 'INTRODUCTION' },
    { pattern: /^(Jurisdiction and Venue|JURISDICTION AND VENUE)\s*$/gim, replacement: 'JURISDICTION AND VENUE' },
    { pattern: /^(Statement of Facts|STATEMENT OF FACTS)\s*$/gim, replacement: 'STATEMENT OF FACTS' },
    { pattern: /^(Procedural History|PROCEDURAL HISTORY)\s*$/gim, replacement: 'PROCEDURAL HISTORY' },
    { pattern: /^(Legal Standard|LEGAL STANDARD)\s*$/gim, replacement: 'LEGAL STANDARD' },
    { pattern: /^(Argument|ARGUMENT)\s*$/gim, replacement: 'ARGUMENT' },
    { pattern: /^(Requested Relief|REQUESTED RELIEF)\s*$/gim, replacement: 'REQUESTED RELIEF' },
    { pattern: /^(Conclusion|CONCLUSION)\s*$/gim, replacement: 'CONCLUSION' },
    { pattern: /^(Certificate of Service|CERTIFICATE OF SERVICE)\s*$/gim, replacement: 'CERTIFICATE OF SERVICE' },
  ];

  let result = draft;
  for (const { pattern, replacement } of headingPatterns) {
    result = result.replace(pattern, replacement);
  }

  return result;
}

function normalizeRelief(draft: string, documentType: string): string {
  const standardRelief = getStandardRelief(documentType);
  
  // Look for relief section and normalize
  const reliefPattern = /(REQUESTED RELIEF|Requested Relief)[\s\S]*?(?=\n\n[A-Z]|$)/gi;
  const match = draft.match(reliefPattern);
  
  if (match) {
    // Replace the relief section with standardized language
    const normalizedRelief = `REQUESTED RELIEF\n\n${standardRelief}.\n\nAny other relief this Court deems just and proper.`;
    return draft.replace(reliefPattern, normalizedRelief);
  }

  // Remove duplicate relief language
  draft = draft.replace(/(Any other relief this Court deems just and proper\.\s*)+/g, 'Any other relief this Court deems just and proper.');

  return draft;
}

function removeStrayLabels(draft: string): string {
  // Remove common stray labels
  const labelsToRemove = [
    /Document Title:\s*/gi,
    /Title:\s*/gi,
    /Document Type:\s*/gi,
    /Type:\s*/gi,
  ];

  let result = draft;
  for (const pattern of labelsToRemove) {
    result = result.replace(pattern, '');
  }

  return result;
}

function normalizeFormatting(draft: string): string {
  // Ensure proper spacing between sections
  let result = draft;
  
  // Fix common court name errors
  result = result.replace(/CALIFORNIA DISTRICT COURT/gi, 'SUPERIOR COURT OF THE STATE OF CALIFORNIA');
  result = result.replace(/CALIFOR\s*\*\*NIA DISTRICT COURT\*\*/gi, 'SUPERIOR COURT OF THE STATE OF CALIFORNIA');
  result = result.replace(/NEW YORK DISTRICT COURT/gi, 'SUPREME COURT OF THE STATE OF NEW YORK');
  result = result.replace(/TEXAS DISTRICT COURT/gi, 'DISTRICT COURT OF TEXAS');
  
  // Ensure numbered paragraphs in Facts and Argument sections
  result = result.replace(/(STATEMENT OF FACTS|ARGUMENT)\s*\n\s*([A-Z])/gi, '$1\n\n1. $2');
  result = result.replace(/(\n)([A-Z][^.!?]*[.!?])\s*\n\s*([A-Z])/g, '$1$2\n\n2. $3');
  
  // Add extra spacing around ALL CAPS headings
  result = result.replace(/(\n)([A-Z][A-Z\s]+)(\n)/g, '$1\n$2\n$3');
  
  // Ensure double spacing between major sections
  result = result.replace(/(\n\n)([A-Z][A-Z\s]+)(\n\n)/g, '$1\n$2\n\n');
  
  // Remove excessive blank lines
  result = result.replace(/\n{4,}/g, '\n\n\n');
  
  return result;
}

// Helper function to check if document meets quality standards
export function validateDocumentQuality(draft: string, documentType: string): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for required sections
  const requiredSections = [
    'INTRODUCTION',
    'STATEMENT OF FACTS', 
    'LEGAL STANDARD',
    'ARGUMENT',
    'REQUESTED RELIEF',
    'CONCLUSION',
    'CERTIFICATE OF SERVICE'
  ];

  const isPostConviction = /post.?conviction|habeas|1473/i.test(documentType);
  if (isPostConviction && !draft.toUpperCase().includes('PROCEDURAL HISTORY')) {
    issues.push('Missing PROCEDURAL HISTORY section for post-conviction document');
  }

  for (const section of requiredSections) {
    if (!draft.toUpperCase().includes(section)) {
      issues.push(`Missing required section: ${section}`);
    }
  }

  // Check for placeholder text
  if (/\[insert|\[fill in|\[add|\[provide|\[specify/i.test(draft)) {
    issues.push('Contains placeholder text - must fill in all required information');
  }

  // Check for proper title formatting
  if (!/\*\*[A-Z\s]+\*\*/g.test(draft)) {
    issues.push('Document title should be in ALL CAPS and bold');
  }

  // Check for AI disclaimers
  if (/ai generated|artificial intelligence|generated by|this is a template/i.test(draft.toLowerCase())) {
    issues.push('Document contains AI disclaimers - must be professional');
  }

  // Check for proper relief language
  if (!/any other relief this court deems just and proper/i.test(draft.toLowerCase())) {
    issues.push('Missing standard relief language');
  }

  // Check for incorrect court names
  if (/california district court/i.test(draft)) {
    issues.push('Incorrect court name: California uses "Superior Court" not "District Court"');
  }

  if (/new york district court/i.test(draft) && !/federal|united states/i.test(draft)) {
    issues.push('Incorrect court name: New York uses "Supreme Court" not "District Court"');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}
