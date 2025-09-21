/**
 * React hook for managing the legal intake interview process
 * Provides state management and API integration for the 5-phase interview
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { IntakeStateMachine, IntakeState, IntakeAction, IntakeResponse } from '@/lib/intake/state-machine';
import { IntakeNormalizer, NormalizedIntakeResponse } from '@/lib/intake/normalizers';
import { PromptComposer } from '@/lib/llm/composePrompt';
import { llmProviderManager } from '@/lib/llm/providers';

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

export function useIntake(options: UseIntakeOptions = {}): UseIntakeReturn {
  const { documentContext, userInfo, caseInfo, onComplete, onError } = options;
  
  // State machine instance
  const stateMachineRef = useRef<IntakeStateMachine | null>(null);
  
  // Local state
  const [currentState, setCurrentState] = useState<IntakeState>({
    currentPhase: 1,
    phaseProgress: { 1: false, 2: false, 3: false, 4: false, 5: false },
    completedQuestions: [],
    currentQuestion: null,
    isComplete: false,
    canGenerateDocument: false,
    lastResponse: null,
    documentContext: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<IntakeResponse[]>([]);

  // Initialize state machine
  useEffect(() => {
    if (!stateMachineRef.current) {
      stateMachineRef.current = new IntakeStateMachine();
      if (documentContext) {
        stateMachineRef.current.dispatch({ 
          type: 'START_INTERVIEW', 
          documentContext 
        });
        setCurrentState(stateMachineRef.current.getState());
      }
    }
  }, [documentContext]);

  // Actions
  const startInterview = useCallback(() => {
    if (!stateMachineRef.current) {
      stateMachineRef.current = new IntakeStateMachine();
    }
    
    stateMachineRef.current.dispatch({ 
      type: 'START_INTERVIEW', 
      documentContext 
    });
    setCurrentState(stateMachineRef.current.getState());
    setResponses([]);
    setError(null);
  }, [documentContext]);

  const askQuestion = useCallback((question: string, phase: number) => {
    if (!stateMachineRef.current) return;
    
    stateMachineRef.current.dispatch({ 
      type: 'ASK_QUESTION', 
      question, 
      phase 
    });
    setCurrentState(stateMachineRef.current.getState());
  }, []);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!stateMachineRef.current || !currentState.currentQuestion) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Normalize the response
      const normalizedResponse = IntakeNormalizer.normalizeIntakeResponse({
        question: currentState.currentQuestion,
        answer,
        phase: currentState.currentPhase,
        timestamp: new Date()
      });
      
      // Submit the answer to the state machine
      stateMachineRef.current.dispatch({ 
        type: 'RECEIVE_ANSWER', 
        answer, 
        question: currentState.currentQuestion 
      });
      
      // Update local state
      setCurrentState(stateMachineRef.current.getState());
      setResponses(stateMachineRef.current.getResponses());
      
      // Check if we should ask the next question
      if (stateMachineRef.current.canAskNextQuestion()) {
        const nextQuestion = await generateNextQuestion();
        if (nextQuestion) {
          askQuestion(nextQuestion, currentState.currentPhase);
        }
      }
      
      // Check if interview is complete
      if (stateMachineRef.current.shouldCompleteInterview()) {
        completeInterview();
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit answer';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [currentState.currentQuestion, currentState.currentPhase, askQuestion, onError]);

  const completePhase = useCallback((phase: number) => {
    if (!stateMachineRef.current) return;
    
    stateMachineRef.current.dispatch({ type: 'COMPLETE_PHASE', phase });
    setCurrentState(stateMachineRef.current.getState());
  }, []);

  const completeInterview = useCallback(() => {
    if (!stateMachineRef.current) return;
    
    stateMachineRef.current.dispatch({ type: 'COMPLETE_INTERVIEW' });
    setCurrentState(stateMachineRef.current.getState());
    
    // Call completion callback with all data
    const allData = stateMachineRef.current.getDocumentGenerationData();
    onComplete?.(allData);
  }, [onComplete]);

  const resetInterview = useCallback(() => {
    if (!stateMachineRef.current) return;
    
    stateMachineRef.current.dispatch({ type: 'RESET_INTERVIEW' });
    setCurrentState(stateMachineRef.current.getState());
    setResponses([]);
    setError(null);
  }, []);

  const skipToGeneration = useCallback(() => {
    if (!stateMachineRef.current) return;
    
    stateMachineRef.current.dispatch({ type: 'SKIP_TO_GENERATION' });
    setCurrentState(stateMachineRef.current.getState());
  }, []);

  // Generate next question using LLM
  const generateNextQuestion = useCallback(async (): Promise<string | null> => {
    if (!stateMachineRef.current) return null;
    
    try {
      const currentPhase = stateMachineRef.current.getCurrentPhase();
      if (!currentPhase) return null;
      
      // Build prompt for question generation
      const prompt = PromptComposer.composeInterviewPrompt({
        systemPrompt: 'Generate the next appropriate question for the legal intake interview.',
        documentContext: documentContext ? JSON.stringify(documentContext) : undefined,
        interviewState: currentState,
        userInfo,
        caseInfo,
        currentPhase: currentState.currentPhase
      });
      
      // Generate question using LLM
      const question = await llmProviderManager.generateResponse(prompt, {
        temperature: 0.7,
        maxTokens: 200,
        model: 'gpt-4-1106-preview'
      });
      
      return question.trim();
    } catch (error) {
      console.error('Failed to generate next question:', error);
      return null;
    }
  }, [currentState, documentContext, userInfo, caseInfo]);

  // Computed values
  const currentPhase = currentState.currentPhase;
  const currentQuestion = currentState.currentQuestion;
  const isComplete = currentState.isComplete;
  const canGenerateDocument = currentState.canGenerateDocument;
  const completionPercentage = stateMachineRef.current?.getCompletionPercentage() || 0;
  const interviewSummary = stateMachineRef.current?.getInterviewSummary() || '';
  const shouldShowCompletionMessage = isComplete && canGenerateDocument;

  const getNextQuestion = useCallback((): string | null => {
    if (!stateMachineRef.current) return null;
    return stateMachineRef.current.getCurrentPhase()?.exampleQuestions[0] || null;
  }, []);

  return {
    // State
    currentState,
    currentPhase,
    currentQuestion,
    isComplete,
    canGenerateDocument,
    isLoading,
    error,
    
    // Actions
    startInterview,
    askQuestion,
    submitAnswer,
    completePhase,
    completeInterview,
    resetInterview,
    skipToGeneration,
    
    // Data
    responses,
    completionPercentage,
    interviewSummary,
    
    // Utilities
    getNextQuestion,
    shouldShowCompletionMessage,
  };
}

// Utility hook for managing interview phases
export function useIntakePhase(phase: number) {
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);

  const activate = useCallback(() => {
    setIsActive(true);
  }, []);

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  const markComplete = useCallback(() => {
    setIsComplete(true);
    setIsActive(false);
  }, []);

  const askQuestion = useCallback(() => {
    setQuestionsAsked(prev => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setIsComplete(false);
    setQuestionsAsked(0);
  }, []);

  return {
    isActive,
    isComplete,
    questionsAsked,
    activate,
    deactivate,
    markComplete,
    askQuestion,
    reset,
  };
}

// Hook for managing document context
export function useDocumentContext() {
  const [context, setContext] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContext = useCallback((newContext: any) => {
    setContext(newContext);
  }, []);

  const clearContext = useCallback(() => {
    setContext(null);
  }, []);

  const extractFromDocument = useCallback(async (documentText: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use LLM to extract structured data from document
      const prompt = `Extract the following information from this legal document:
      
      - Case number
      - Court name
      - Opposing party
      - Filing date
      - Judge name
      - State
      - Document type
      
      Document text:
      ${documentText}
      
      Return the information in JSON format.`;
      
      const extractedData = await llmProviderManager.generateResponse(prompt, {
        temperature: 0.1,
        maxTokens: 500,
        model: 'gpt-4-1106-preview'
      });
      
      const parsedData = JSON.parse(extractedData);
      setContext(parsedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to extract document data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    context,
    isLoading,
    error,
    updateContext,
    clearContext,
    extractFromDocument,
  };
}
