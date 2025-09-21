/**
 * React hook for managing document generation
 * Handles API calls and state management for legal document creation
 */

import { useState, useCallback, useRef } from 'react';

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

export function useGenerateDocument(): UseGenerateDocumentReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentGenerationResult | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const generateDocument = useCallback(async (options: DocumentGenerationOptions) => {
    // Validate options
    const validation = validateOptions(options);
    if (!validation.isValid) {
      setError(`Validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    setIsGenerating(true);
    setIsComplete(false);
    setError(null);
    setResult(null);

    // Create abort controller for cancellation
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          document: data.document,
          metadata: data.metadata,
        });
        setIsComplete(true);
      } else {
        throw new Error(data.error || 'Document generation failed');
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Document generation was cancelled');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setResult({
          success: false,
          error: errorMessage,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    // Cancel any ongoing generation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsGenerating(false);
    setIsComplete(false);
    setError(null);
    setResult(null);
  }, []);

  const downloadDocument = useCallback(() => {
    if (!result?.document) return;

    const blob = new Blob([result.document], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    const filename = `legal-document-${result.metadata?.documentType?.toLowerCase().replace(/\s+/g, '-') || 'document'}-${Date.now()}.txt`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result]);

  const canGenerate = useCallback((options: DocumentGenerationOptions): boolean => {
    const validation = validateOptions(options);
    return validation.isValid && !isGenerating;
  }, [isGenerating]);

  const validateOptions = useCallback((options: DocumentGenerationOptions): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Only require basic information - if any information is provided, allow generation
    const hasAnyInfo = options.facts?.length > 0 || 
                      options.issues?.length > 0 || 
                      options.parties?.petitioner || 
                      options.parties?.respondent ||
                      options.userInfo?.firstName ||
                      options.caseInfo?.opposingParty ||
                      options.uploadedContext;

    if (!hasAnyInfo) {
      errors.push('Please provide some information about your case to generate a document');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, []);

  return {
    // State
    isGenerating,
    isComplete,
    error,
    result,
    
    // Actions
    generateDocument,
    reset,
    downloadDocument,
    
    // Utilities
    canGenerate,
    validateOptions,
  };
}

// Hook for managing document templates
export function useDocumentTemplates() {
  const [templates, setTemplates] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would load from an API or file
      const defaultTemplates = {
        'Motion to Dismiss': 'Template for motion to dismiss...',
        'Petition for Habeas Corpus': 'Template for habeas corpus petition...',
        'Appeal Brief': 'Template for appeal brief...',
        'Complaint': 'Template for complaint...',
        'Motion for Summary Judgment': 'Template for summary judgment motion...',
      };

      setTemplates(defaultTemplates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load templates';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTemplate = useCallback((documentType: string): string | null => {
    return templates[documentType] || null;
  }, [templates]);

  const addTemplate = useCallback((documentType: string, template: string) => {
    setTemplates(prev => ({
      ...prev,
      [documentType]: template,
    }));
  }, []);

  const removeTemplate = useCallback((documentType: string) => {
    setTemplates(prev => {
      const newTemplates = { ...prev };
      delete newTemplates[documentType];
      return newTemplates;
    });
  }, []);

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
    getTemplate,
    addTemplate,
    removeTemplate,
  };
}

// Hook for managing document history
export function useDocumentHistory() {
  const [history, setHistory] = useState<DocumentGenerationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToHistory = useCallback((result: DocumentGenerationResult) => {
    setHistory(prev => [result, ...prev.slice(0, 49)]); // Keep last 50 documents
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const removeFromHistory = useCallback((index: number) => {
    setHistory(prev => prev.filter((_, i) => i !== index));
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would load from localStorage or an API
      const savedHistory = localStorage.getItem('document-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load history';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveHistory = useCallback(async () => {
    try {
      localStorage.setItem('document-history', JSON.stringify(history));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save history';
      setError(errorMessage);
    }
  }, [history]);

  // Auto-save history when it changes
  React.useEffect(() => {
    if (history.length > 0) {
      saveHistory();
    }
  }, [history, saveHistory]);

  return {
    history,
    isLoading,
    error,
    addToHistory,
    clearHistory,
    removeFromHistory,
    loadHistory,
    saveHistory,
  };
}

// Utility function for formatting document metadata
export function formatDocumentMetadata(metadata: DocumentGenerationResult['metadata']): string {
  if (!metadata) return '';

  const parts = [
    `Document Type: ${metadata.documentType}`,
    `State: ${metadata.state}`,
    metadata.county ? `County: ${metadata.county}` : null,
    metadata.caseNumber ? `Case Number: ${metadata.caseNumber}` : null,
    `Generated: ${new Date(metadata.generatedAt).toLocaleDateString()}`,
    `Word Count: ${metadata.wordCount}`,
    `Pages: ${metadata.pageCount}`,
  ].filter(Boolean);

  return parts.join(' • ');
}
