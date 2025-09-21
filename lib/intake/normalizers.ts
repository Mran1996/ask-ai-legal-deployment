/**
 * Data normalizers for the legal intake process
 * Handles cleaning, validation, and standardization of user input
 */

export interface NormalizedUserInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  category: string;
  normalizedCategory: string;
}

export interface NormalizedCaseInfo {
  state: string;
  normalizedState: string;
  legalIssue: string;
  opposingParty: string;
  desiredOutcome: string;
  courtName: string | null;
  caseNumber: string | null;
  additionalInfo: string;
  county: string | null;
  normalizedCounty: string | null;
}

export interface NormalizedDocumentData {
  extractedCaseNumber: string | null;
  extractedCourt: string | null;
  extractedOpposingParty: string | null;
  extractedFilingDate: string | null;
  extractedJudge: string | null;
  extractedState: string | null;
  documentType: string | null;
  parsedText: string | null;
  normalizedText: string | null;
}

export interface NormalizedIntakeResponse {
  question: string;
  answer: string;
  normalizedAnswer: string;
  phase: number;
  timestamp: Date;
  extractedEntities: ExtractedEntities;
}

export interface ExtractedEntities {
  dates: string[];
  names: string[];
  locations: string[];
  caseNumbers: string[];
  courts: string[];
  amounts: string[];
  statutes: string[];
}

export class IntakeNormalizer {
  private static readonly STATE_MAPPINGS: Record<string, string> = {
    'california': 'CA',
    'calif': 'CA',
    'ca': 'CA',
    'new york': 'NY',
    'ny': 'NY',
    'texas': 'TX',
    'tx': 'TX',
    'florida': 'FL',
    'fl': 'FL',
    'washington': 'WA',
    'wa': 'WA',
    'oregon': 'OR',
    'or': 'OR',
    'nevada': 'NV',
    'nv': 'NV',
    'arizona': 'AZ',
    'az': 'AZ',
    'colorado': 'CO',
    'co': 'CO',
    'utah': 'UT',
    'ut': 'UT',
    'idaho': 'ID',
    'id': 'ID',
    'montana': 'MT',
    'mt': 'MT',
    'wyoming': 'WY',
    'wy': 'WY',
    'north dakota': 'ND',
    'nd': 'ND',
    'south dakota': 'SD',
    'sd': 'SD',
    'nebraska': 'NE',
    'ne': 'NE',
    'kansas': 'KS',
    'ks': 'KS',
    'oklahoma': 'OK',
    'ok': 'OK',
    'new mexico': 'NM',
    'nm': 'NM',
    'alaska': 'AK',
    'ak': 'AK',
    'hawaii': 'HI',
    'hi': 'HI',
    'alabama': 'AL',
    'al': 'AL',
    'arkansas': 'AR',
    'ar': 'AR',
    'louisiana': 'LA',
    'la': 'LA',
    'mississippi': 'MS',
    'ms': 'MS',
    'tennessee': 'TN',
    'tn': 'TN',
    'kentucky': 'KY',
    'ky': 'KY',
    'west virginia': 'WV',
    'wv': 'WV',
    'virginia': 'VA',
    'va': 'VA',
    'north carolina': 'NC',
    'nc': 'NC',
    'south carolina': 'SC',
    'sc': 'SC',
    'georgia': 'GA',
    'ga': 'GA',
    'missouri': 'MO',
    'mo': 'MO',
    'illinois': 'IL',
    'il': 'IL',
    'indiana': 'IN',
    'in': 'IN',
    'ohio': 'OH',
    'oh': 'OH',
    'michigan': 'MI',
    'mi': 'MI',
    'wisconsin': 'WI',
    'wi': 'WI',
    'minnesota': 'MN',
    'mn': 'MN',
    'iowa': 'IA',
    'ia': 'IA',
    'vermont': 'VT',
    'vt': 'VT',
    'new hampshire': 'NH',
    'nh': 'NH',
    'maine': 'ME',
    'me': 'ME',
    'massachusetts': 'MA',
    'ma': 'MA',
    'rhode island': 'RI',
    'ri': 'RI',
    'connecticut': 'CT',
    'ct': 'CT',
    'new jersey': 'NJ',
    'nj': 'NJ',
    'delaware': 'DE',
    'de': 'DE',
    'maryland': 'MD',
    'md': 'MD',
    'pennsylvania': 'PA',
    'pa': 'PA'
  };

  private static readonly CATEGORY_MAPPINGS: Record<string, string> = {
    'criminal': 'Criminal Defense',
    'criminal defense': 'Criminal Defense',
    'crim': 'Criminal Defense',
    'family': 'Family Law',
    'family law': 'Family Law',
    'divorce': 'Family Law',
    'custody': 'Family Law',
    'employment': 'Employment',
    'wage': 'Employment',
    'wage dispute': 'Employment',
    'housing': 'Housing',
    'landlord': 'Housing',
    'tenant': 'Housing',
    'landlord tenant': 'Housing',
    'personal injury': 'Personal Injury',
    'injury': 'Personal Injury',
    'accident': 'Personal Injury',
    'civil': 'Civil',
    'civil rights': 'Civil Rights',
    'constitutional': 'Civil Rights',
    'prison': 'Prison Rights',
    'incarceration': 'Prison Rights',
    'habeas': 'Post-Conviction',
    'post-conviction': 'Post-Conviction',
    'appeal': 'Appeals',
    'appellate': 'Appeals'
  };

  private static readonly COURT_MAPPINGS: Record<string, string> = {
    'superior court': 'Superior Court',
    'district court': 'District Court',
    'circuit court': 'Circuit Court',
    'municipal court': 'Municipal Court',
    'county court': 'County Court',
    'federal court': 'Federal Court',
    'us district court': 'U.S. District Court',
    'united states district court': 'U.S. District Court',
    'court of appeals': 'Court of Appeals',
    'supreme court': 'Supreme Court',
    'appellate court': 'Appellate Court'
  };

  public static normalizeUserInfo(userInfo: any): NormalizedUserInfo {
    return {
      firstName: this.cleanString(userInfo.firstName || ''),
      lastName: this.cleanString(userInfo.lastName || ''),
      fullName: this.buildFullName(userInfo.firstName, userInfo.lastName),
      category: userInfo.category || '',
      normalizedCategory: this.normalizeCategory(userInfo.category || '')
    };
  }

  public static normalizeCaseInfo(caseInfo: any): NormalizedCaseInfo {
    return {
      state: caseInfo.state || '',
      normalizedState: this.normalizeState(caseInfo.state || ''),
      legalIssue: this.cleanString(caseInfo.legalIssue || ''),
      opposingParty: this.cleanString(caseInfo.opposingParty || ''),
      desiredOutcome: this.cleanString(caseInfo.desiredOutcome || ''),
      courtName: caseInfo.courtName ? this.cleanString(caseInfo.courtName) : null,
      caseNumber: caseInfo.caseNumber ? this.cleanString(caseInfo.caseNumber) : null,
      additionalInfo: this.cleanString(caseInfo.additionalInfo || ''),
      county: caseInfo.county ? this.cleanString(caseInfo.county) : null,
      normalizedCounty: caseInfo.county ? this.normalizeCounty(caseInfo.county) : null
    };
  }

  public static normalizeDocumentData(documentData: any): NormalizedDocumentData {
    return {
      extractedCaseNumber: documentData.extractedCaseNumber ? this.cleanString(documentData.extractedCaseNumber) : null,
      extractedCourt: documentData.extractedCourt ? this.cleanString(documentData.extractedCourt) : null,
      extractedOpposingParty: documentData.extractedOpposingParty ? this.cleanString(documentData.extractedOpposingParty) : null,
      extractedFilingDate: documentData.extractedFilingDate ? this.cleanString(documentData.extractedFilingDate) : null,
      extractedJudge: documentData.extractedJudge ? this.cleanString(documentData.extractedJudge) : null,
      extractedState: documentData.extractedState ? this.normalizeState(documentData.extractedState) : null,
      documentType: documentData.documentType ? this.cleanString(documentData.documentType) : null,
      parsedText: documentData.parsedText || null,
      normalizedText: documentData.parsedText ? this.normalizeText(documentData.parsedText) : null
    };
  }

  public static normalizeIntakeResponse(response: any): NormalizedIntakeResponse {
    return {
      question: this.cleanString(response.question || ''),
      answer: this.cleanString(response.answer || ''),
      normalizedAnswer: this.normalizeText(response.answer || ''),
      phase: response.phase || 1,
      timestamp: response.timestamp || new Date(),
      extractedEntities: this.extractEntities(response.answer || '')
    };
  }

  private static cleanString(str: string): string {
    if (!str) return '';
    return str.trim().replace(/\s+/g, ' ');
  }

  private static buildFullName(firstName: string, lastName: string): string {
    const first = this.cleanString(firstName || '');
    const last = this.cleanString(lastName || '');
    return `${first} ${last}`.trim();
  }

  private static normalizeState(state: string): string {
    if (!state) return '';
    const normalized = this.STATE_MAPPINGS[state.toLowerCase()];
    return normalized || state.toUpperCase();
  }

  private static normalizeCategory(category: string): string {
    if (!category) return '';
    const normalized = this.CATEGORY_MAPPINGS[category.toLowerCase()];
    return normalized || category;
  }

  private static normalizeCounty(county: string): string {
    if (!county) return '';
    // Remove common suffixes and normalize
    return county
      .replace(/\s+county$/i, '')
      .replace(/\s+parish$/i, '')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private static normalizeText(text: string): string {
    if (!text) return '';
    
    // Remove extra whitespace and normalize line breaks
    let normalized = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    // Normalize common legal terms
    normalized = normalized
      .replace(/\bplaintiff\b/gi, 'Plaintiff')
      .replace(/\bdefendant\b/gi, 'Defendant')
      .replace(/\bpetitioner\b/gi, 'Petitioner')
      .replace(/\brespondent\b/gi, 'Respondent')
      .replace(/\bappellant\b/gi, 'Appellant')
      .replace(/\bappellee\b/gi, 'Appellee');

    return normalized;
  }

  private static extractEntities(text: string): ExtractedEntities {
    const entities: ExtractedEntities = {
      dates: [],
      names: [],
      locations: [],
      caseNumbers: [],
      courts: [],
      amounts: [],
      statutes: []
    };

    if (!text) return entities;

    // Extract dates (various formats)
    const datePatterns = [
      /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
      /\b\d{1,2}-\d{1,2}-\d{2,4}\b/g,
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
      /\b\d{4}\b/g
    ];

    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.dates.push(...matches);
      }
    });

    // Extract case numbers
    const caseNumberPatterns = [
      /\b(?:Case|No\.?|Number)\s*:?\s*([A-Z0-9\-\.]+)/gi,
      /\b[A-Z]{2,4}\d{4,}\b/g,
      /\b\d{2,4}-\d{2,4}\b/g
    ];

    caseNumberPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.caseNumbers.push(...matches);
      }
    });

    // Extract court names
    const courtPatterns = [
      /\b(?:Superior|District|Circuit|Municipal|County|Federal|Supreme|Appellate)\s+Court\b/gi,
      /\bU\.?S\.?\s+District\s+Court\b/gi,
      /\bCourt\s+of\s+Appeals\b/gi
    ];

    courtPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.courts.push(...matches);
      }
    });

    // Extract monetary amounts
    const amountPatterns = [
      /\$[\d,]+\.?\d*/g,
      /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:dollars?|USD)\b/gi
    ];

    amountPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.amounts.push(...matches);
      }
    });

    // Extract statute references
    const statutePatterns = [
      /\b\d+\s+U\.?S\.?C\.?\s*§?\s*\d+/gi,
      /\b[A-Z]{2,4}\s+Code\s+§?\s*\d+/gi,
      /\b[A-Z]{2,4}\s+Rev\.?\s+Code\s+§?\s*\d+/gi
    ];

    statutePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        entities.statutes.push(...matches);
      }
    });

    // Remove duplicates
    Object.keys(entities).forEach(key => {
      entities[key as keyof ExtractedEntities] = [...new Set(entities[key as keyof ExtractedEntities])];
    });

    return entities;
  }

  public static validateNormalizedData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.userInfo) {
      if (!data.userInfo.firstName) errors.push('First name is required');
      if (!data.userInfo.lastName) errors.push('Last name is required');
      if (!data.userInfo.normalizedCategory) errors.push('Legal category is required');
    }

    if (data.caseInfo) {
      if (!data.caseInfo.normalizedState) errors.push('State is required');
      if (!data.caseInfo.legalIssue) errors.push('Legal issue description is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  public static mergeDocumentContext(
    existingContext: NormalizedDocumentData | null,
    newContext: NormalizedDocumentData
  ): NormalizedDocumentData {
    if (!existingContext) return newContext;

    return {
      extractedCaseNumber: newContext.extractedCaseNumber || existingContext.extractedCaseNumber,
      extractedCourt: newContext.extractedCourt || existingContext.extractedCourt,
      extractedOpposingParty: newContext.extractedOpposingParty || existingContext.extractedOpposingParty,
      extractedFilingDate: newContext.extractedFilingDate || existingContext.extractedFilingDate,
      extractedJudge: newContext.extractedJudge || existingContext.extractedJudge,
      extractedState: newContext.extractedState || existingContext.extractedState,
      documentType: newContext.documentType || existingContext.documentType,
      parsedText: newContext.parsedText || existingContext.parsedText,
      normalizedText: newContext.normalizedText || existingContext.normalizedText
    };
  }
}

// Utility functions for common normalization tasks
export function normalizeUserInput(input: string): string {
  return IntakeNormalizer.cleanString(input);
}

export function extractCaseNumber(text: string): string | null {
  const patterns = [
    /\b(?:Case|No\.?|Number)\s*:?\s*([A-Z0-9\-\.]+)/i,
    /\b([A-Z]{2,4}\d{4,})/,
    /\b(\d{2,4}-\d{2,4})/
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1] || match[0];
    }
  }

  return null;
}

export function extractCourtName(text: string): string | null {
  const patterns = [
    /\b(?:Superior|District|Circuit|Municipal|County|Federal|Supreme|Appellate)\s+Court\b/i,
    /\bU\.?S\.?\s+District\s+Court\b/i,
    /\bCourt\s+of\s+Appeals\b/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

export function extractState(text: string): string | null {
  const stateMatch = text.match(/\b(?:State\s+of\s+)?([A-Za-z\s]+)\b/);
  if (stateMatch) {
    const state = stateMatch[1].trim();
    return IntakeNormalizer.normalizeState(state);
  }
  return null;
}
