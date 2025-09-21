/**
 * Chat and Messaging Type Definitions
 * 
 * This file contains all type definitions related to chat functionality,
 * messaging, AI interactions, and document handling throughout the application.
 */

/**
 * Message interface representing a single chat message
 */
export interface Message {
  /** Unique identifier for the message */
  id: string;
  /** Who sent the message ('user' or 'assistant') */
  sender: 'user' | 'assistant';
  /** The message content */
  text: string;
  /** Timestamp when message was sent */
  timestamp: Date;
  /** Whether the message is currently being processed */
  isProcessing?: boolean;
  /** Any error associated with the message */
  error?: string;
  /** Message metadata (file attachments, etc.) */
  metadata?: MessageMetadata;
}

/**
 * Metadata for messages (attachments, formatting, etc.)
 */
export interface MessageMetadata {
  /** File attachments */
  attachments?: FileAttachment[];
  /** Message formatting */
  formatting?: 'markdown' | 'plain' | 'html';
  /** Legal category if applicable */
  legalCategory?: string;
  /** Confidence score for AI responses */
  confidenceScore?: number;
}

/**
 * File attachment information
 */
export interface FileAttachment {
  /** Unique identifier for the attachment */
  id: string;
  /** Original filename */
  filename: string;
  /** File size in bytes */
  size: number;
  /** File MIME type */
  mimeType: string;
  /** File content as text (for documents) */
  content?: string;
  /** File URL if stored externally */
  url?: string;
  /** Processing status */
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

/**
 * Suggested response for quick replies
 */
export interface SuggestedResponse {
  /** The suggested response text */
  text: string;
  /** Category of the suggestion */
  category?: string;
  /** Confidence score for the suggestion */
  confidence?: number;
}

/**
 * Chat session information
 */
export interface ChatSession {
  /** Unique identifier for the session */
  id: string;
  /** Session title or description */
  title: string;
  /** Messages in the session */
  messages: Message[];
  /** Session creation timestamp */
  createdAt: Date;
  /** Last activity timestamp */
  lastActivity: Date;
  /** Whether session is active */
  isActive: boolean;
  /** Legal category if applicable */
  legalCategory?: string;
}

/**
 * AI Assistant response configuration
 */
export interface AIResponseConfig {
  /** Model to use for responses */
  model: string;
  /** Temperature setting for creativity */
  temperature: number;
  /** Maximum tokens for response */
  maxTokens: number;
  /** Whether to include legal citations */
  includeCitations: boolean;
  /** Whether to include case law */
  includeCaseLaw: boolean;
  /** Response format preference */
  format: 'document' | 'summary' | 'detailed';
}

/**
 * Document processing result
 */
export interface DocumentProcessResult {
  /** Extracted text content */
  content: string;
  /** Document metadata */
  metadata: {
    title?: string;
    author?: string;
    pages?: number;
    language?: string;
  };
  /** Processing errors if any */
  errors?: string[];
  /** Processing warnings if any */
  warnings?: string[];
}

/**
 * Legal category classification
 */
export interface LegalCategory {
  /** Category identifier */
  id: string;
  /** Category name */
  name: string;
  /** Category description */
  description: string;
  /** Related legal areas */
  relatedAreas: string[];
  /** Suggested responses for this category */
  suggestedResponses: string[];
}

/**
 * Chat interface props for the enhanced chat component
 */
export interface EnhancedChatInterfaceProps {
  /** Current messages in the chat */
  messages: Message[];
  /** Callback when a message is sent */
  onSendMessage: (message: string) => void;
  /** Whether waiting for AI response */
  isWaitingForResponse: boolean;
  /** Current question being processed */
  currentQuestion: string;
  /** Current user's name */
  userName?: string;
  /** Suggested responses to show */
  suggestedResponses?: SuggestedResponse[];
  /** Callback for document uploads */
  onDocumentUpload?: (documentText: string, filename: string) => void;
  /** Legal category context */
  legalCategory?: string;
  /** AI response configuration */
  aiConfig?: AIResponseConfig;
}

/**
 * Voice recognition state
 */
export interface VoiceRecognitionState {
  /** Whether voice recognition is active */
  isListening: boolean;
  /** Whether browser supports speech recognition */
  isSupported: boolean;
  /** Current transcript */
  transcript: string;
  /** Recognition error if any */
  error?: string;
}

/**
 * File upload state
 */
export interface FileUploadState {
  /** Whether file is being uploaded */
  isUploading: boolean;
  /** Upload progress percentage */
  progress: number;
  /** Upload error if any */
  error?: string;
  /** Uploaded file information */
  file?: FileAttachment;
}
