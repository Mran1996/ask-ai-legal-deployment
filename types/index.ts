/**
 * Application Type Definitions Index
 * 
 * This file serves as the central export point for all type definitions
 * used throughout the application. It provides a single import location
 * for components and utilities that need access to these types.
 * 
 * Import all types from this file to ensure consistency and avoid
 * circular dependencies.
 */

// Re-export all user-related types
export type {
  User,
  UserProfile,
  AuthState,
  UserPreferences,
  UserSubscription,
} from './user';

// Re-export all chat-related types
export type {
  Message,
  MessageMetadata,
  FileAttachment,
  SuggestedResponse,
  ChatSession,
  AIResponseConfig,
  DocumentProcessResult,
  LegalCategory,
  EnhancedChatInterfaceProps,
  VoiceRecognitionState,
  FileUploadState,
} from './chat';

// Application-wide common types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}

// Form-related types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    custom?: (value: any) => string | null;
  };
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Navigation and routing types
export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// UI component types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Feature flag types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number;
}

// Analytics and tracking types
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
}

// Error handling types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userId?: string;
}

// Settings and configuration types
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
  };
}

// Search and filtering types
export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

// File and upload types
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
}

// Legal document types
export interface LegalDocument {
  id: string;
  title: string;
  type: 'motion' | 'petition' | 'brief' | 'letter' | 'other';
  content: string;
  status: 'draft' | 'review' | 'final' | 'filed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  metadata?: {
    court?: string;
    caseNumber?: string;
    jurisdiction?: string;
  };
}

// Subscription and billing types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits?: {
    documents?: number;
    storage?: number;
    support?: 'email' | 'phone' | 'priority';
  };
}

export interface BillingInfo {
  customerId: string;
  subscriptionId?: string;
  plan?: SubscriptionPlan;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
}

// Export commonly used React types
export type ReactComponent<P = {}> = React.ComponentType<P>;
export type ReactNode = React.ReactNode;
export type ReactElement = React.ReactElement;
