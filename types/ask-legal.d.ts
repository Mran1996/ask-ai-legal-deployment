/**
 * TypeScript type definitions for the Ask AI Legal system
 * Provides comprehensive type safety for all components
 */

// Core interview types
export interface IntakeState {
  currentPhase: number;
  phaseProgress: Record<number, boolean>;
  completedQuestions: string[];
  currentQuestion: string | null;
  isComplete: boolean;
  canGenerateDocument: boolean;
  lastResponse: string | null;
  documentContext: DocumentContext | null;
}

export interface DocumentContext {
  extractedCaseNumber: string | null;
  extractedCourt: string | null;
  extractedOpposingParty: string | null;
  extractedFilingDate: string | null;
  extractedJudge: string | null;
  extractedState: string | null;
  documentType: string | null;
  parsedText: string | null;
}

export interface IntakeResponse {
  question: string;
  answer: string;
  phase: number;
  timestamp: Date;
}

export interface IntakePhase {
  id: number;
  name: string;
  description: string;
  questionCount: string;
  checklist: string[];
  exampleQuestions: string[];
  isComplete: boolean;
  questionsAsked: number;
  requiredQuestions: number;
}

// User and case information types
export interface UserInfo {
  firstName: string;
  lastName: string;
  category: string;
}

export interface CaseInfo {
  state: string;
  legalIssue: string;
  opposingParty: string;
  desiredOutcome: string;
  courtName: string | null;
  caseNumber: string | null;
  additionalInfo: string;
  county: string | null;
}

export interface UploadedData {
  file: File | null;
  extractedCaseNumber: string | null;
  extractedCourt: string | null;
  includeCaseLaw: boolean;
  parsedText: string | null;
  textPreview: string | null;
  documentType: string | null;
  documentSummary: string | null;
  opposingParty: string | null;
  filingDate: string | null;
  extractedJudge: string | null;
  extractedFinding: string | null;
  extractedResult: string | null;
  state: string | null;
}

export interface DocumentData {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: Date;
  extractedData: any;
}

// Normalized data types
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

// LLM provider types
export interface LLMProvider {
  name: string;
  generateResponse(prompt: string, options?: LLMOptions): Promise<string>;
  generateStreamingResponse(prompt: string, options?: LLMOptions): AsyncGenerator<string, void, unknown>;
  isAvailable(): boolean;
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  systemPrompt?: string;
  messages?: Array<{ role: string; content: string }>;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string;
  finishReason?: string;
}

// Prompt composition types
export interface PromptContext {
  systemPrompt: string;
  documentContext?: string;
  interviewState?: IntakeState;
  userInfo?: any;
  caseInfo?: any;
  chatHistory?: Array<{ sender: string; text: string }>;
  currentPhase?: number;
  responses?: NormalizedIntakeResponse[];
}

export interface DocumentContextData {
  extractedCaseNumber?: string | null;
  extractedCourt?: string | null;
  extractedOpposingParty?: string | null;
  extractedFilingDate?: string | null;
  extractedJudge?: string | null;
  extractedState?: string | null;
  documentType?: string | null;
  parsedText?: string | null;
  documentSummary?: string | null;
}

// Document generation types
export interface DocumentGenerationOptions {
  state: string;
  county?: string;
  documentType: string;
  parties?: {
    petitioner?: string;
    respondent?: string;
  };
  caseNumber?: string;
  facts?: string[];
  issues?: string[];
  includeCaseLaw?: boolean;
  uploadedContext?: any;
  interviewData?: any;
  userInfo?: any;
  caseInfo?: any;
}

export interface DocumentGenerationResult {
  success: boolean;
  document?: string;
  metadata?: {
    state: string;
    county?: string;
    documentType: string;
    parties?: any;
    caseNumber?: string;
    generatedAt: string;
    wordCount: number;
    pageCount: number;
  };
  error?: string;
  details?: string;
  timestamp?: string;
}

// React hook types
export interface UseIntakeOptions {
  documentContext?: any;
  userInfo?: any;
  caseInfo?: any;
  onComplete?: (data: any) => void;
  onError?: (error: Error) => void;
}

export interface UseIntakeReturn {
  // State
  currentState: IntakeState;
  currentPhase: number;
  currentQuestion: string | null;
  isComplete: boolean;
  canGenerateDocument: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startInterview: () => void;
  askQuestion: (question: string, phase: number) => void;
  submitAnswer: (answer: string) => Promise<void>;
  completePhase: (phase: number) => void;
  completeInterview: () => void;
  resetInterview: () => void;
  skipToGeneration: () => void;
  
  // Data
  responses: IntakeResponse[];
  completionPercentage: number;
  interviewSummary: string;
  
  // Utilities
  getNextQuestion: () => string | null;
  shouldShowCompletionMessage: boolean;
}

export interface UseGenerateDocumentReturn {
  // State
  isGenerating: boolean;
  isComplete: boolean;
  error: string | null;
  result: DocumentGenerationResult | null;
  
  // Actions
  generateDocument: (options: DocumentGenerationOptions) => Promise<void>;
  reset: () => void;
  downloadDocument: () => void;
  
  // Utilities
  canGenerate: (options: DocumentGenerationOptions) => boolean;
  validateOptions: (options: DocumentGenerationOptions) => { isValid: boolean; errors: string[] };
}

// API types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp?: Date;
}

export interface ChatHistory {
  messages: ChatMessage[];
  context?: any;
  metadata?: any;
}

// Configuration types
export interface LLMConfig {
  openaiApiKey?: string;
  defaultProvider?: string;
  customProviders?: Array<{ name: string; provider: LLMProvider }>;
}

export interface AppConfig {
  llm: LLMConfig;
  features: {
    documentGeneration: boolean;
    caseAnalysis: boolean;
    chatHistory: boolean;
    fileUpload: boolean;
  };
  ui: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
  };
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Utility types
export type IntakeAction = 
  | { type: 'START_INTERVIEW'; documentContext?: DocumentContext }
  | { type: 'ASK_QUESTION'; question: string; phase: number }
  | { type: 'RECEIVE_ANSWER'; answer: string; question: string }
  | { type: 'COMPLETE_PHASE'; phase: number }
  | { type: 'COMPLETE_INTERVIEW' }
  | { type: 'RESET_INTERVIEW' }
  | { type: 'SKIP_TO_GENERATION' };

export type DocumentType = 
  | 'Motion to Dismiss'
  | 'Petition for Habeas Corpus'
  | 'Appeal Brief'
  | 'Complaint'
  | 'Motion for Summary Judgment'
  | 'Motion for New Trial'
  | 'Post-Conviction Petition'
  | 'Civil Rights Complaint'
  | 'Injunction Request'
  | 'Other';

export type LegalCategory = 
  | 'Criminal Defense'
  | 'Family Law'
  | 'Employment'
  | 'Housing'
  | 'Personal Injury'
  | 'Civil Rights'
  | 'Prison Rights'
  | 'Post-Conviction'
  | 'Appeals'
  | 'Other';

export type USState = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY'
  | 'DC';

// Global type declarations
declare global {
  interface Window {
    askLegalConfig?: AppConfig;
  }
}

// Export all types
export type {
  IntakeState,
  DocumentContext,
  IntakeResponse,
  IntakePhase,
  UserInfo,
  CaseInfo,
  UploadedData,
  DocumentData,
  NormalizedUserInfo,
  NormalizedCaseInfo,
  NormalizedDocumentData,
  NormalizedIntakeResponse,
  ExtractedEntities,
  LLMProvider,
  LLMOptions,
  LLMResponse,
  PromptContext,
  DocumentContextData,
  DocumentGenerationOptions,
  DocumentGenerationResult,
  UseIntakeOptions,
  UseIntakeReturn,
  UseGenerateDocumentReturn,
  APIResponse,
  ChatMessage,
  ChatHistory,
  LLMConfig,
  AppConfig,
  AppError,
  ValidationError,
  ValidationResult,
  IntakeAction,
  DocumentType,
  LegalCategory,
  USState,
};
