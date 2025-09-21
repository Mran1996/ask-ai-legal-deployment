/**
 * User-related Type Definitions
 * 
 * This file contains all type definitions related to user data,
 * authentication, and user-related functionality throughout the application.
 */

/**
 * Core user interface representing a user in the system
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** User's full name */
  fullName: string;
  /** User's email address */
  email: string;
  /** User's chosen username */
  username: string;
  /** Optional avatar URL */
  avatarUrl?: string;
  /** User's subscription status */
  subscriptionStatus?: 'active' | 'inactive' | 'cancelled';
  /** Date when user was created */
  createdAt?: Date;
  /** Date when user was last updated */
  updatedAt?: Date;
}

/**
 * User profile information for display and editing
 */
export interface UserProfile {
  /** User's display name */
  displayName: string;
  /** User's bio or description */
  bio?: string;
  /** User's location */
  location?: string;
  /** User's website URL */
  website?: string;
  /** User's phone number */
  phone?: string;
}

/**
 * User authentication state
 */
export interface AuthState {
  /** Whether user is currently authenticated */
  isAuthenticated: boolean;
  /** Current user data if authenticated */
  user: User | null;
  /** Loading state for authentication */
  isLoading: boolean;
  /** Any authentication error */
  error: string | null;
}

/**
 * User preferences and settings
 */
export interface UserPreferences {
  /** User's preferred language */
  language: string;
  /** User's preferred theme */
  theme: 'light' | 'dark' | 'system';
  /** Email notification preferences */
  emailNotifications: {
    marketing: boolean;
    updates: boolean;
    legalAlerts: boolean;
  };
  /** Privacy settings */
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
  };
}

/**
 * User subscription information
 */
export interface UserSubscription {
  /** Subscription plan type */
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  /** Subscription status */
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  /** Current period start date */
  currentPeriodStart: Date;
  /** Current period end date */
  currentPeriodEnd: Date;
  /** Whether subscription will auto-renew */
  autoRenew: boolean;
  /** Subscription ID from payment provider */
  subscriptionId?: string;
} 