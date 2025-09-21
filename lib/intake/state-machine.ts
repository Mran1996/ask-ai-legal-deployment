/**
 * State machine for managing the legal intake interview process
 * Handles the 5-phase interview flow with proper state transitions
 */

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

export type IntakeAction = 
  | { type: 'START_INTERVIEW'; documentContext?: DocumentContext }
  | { type: 'ASK_QUESTION'; question: string; phase: number }
  | { type: 'RECEIVE_ANSWER'; answer: string; question: string }
  | { type: 'COMPLETE_PHASE'; phase: number }
  | { type: 'COMPLETE_INTERVIEW' }
  | { type: 'RESET_INTERVIEW' }
  | { type: 'SKIP_TO_GENERATION' };

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

export class IntakeStateMachine {
  private state: IntakeState;
  private phases: IntakePhase[];
  private responses: IntakeResponse[];

  constructor() {
    this.state = this.getInitialState();
    this.phases = this.getInitialPhases();
    this.responses = [];
  }

  private getInitialState(): IntakeState {
    return {
      currentPhase: 1,
      phaseProgress: { 1: false, 2: false, 3: false, 4: false, 5: false },
      completedQuestions: [],
      currentQuestion: null,
      isComplete: false,
      canGenerateDocument: false,
      lastResponse: null,
      documentContext: null,
    };
  }

  private getInitialPhases(): IntakePhase[] {
    return [
      {
        id: 1,
        name: "Basic Case Information",
        description: "Gather fundamental case details and jurisdiction information",
        questionCount: "5-8 questions",
        checklist: [
          "Case type and jurisdiction",
          "Parties involved (full names, roles, relationships)",
          "Timeline of events (chronological order)",
          "Current status of case",
          "Court or administrative body involved",
          "Case numbers and filing dates",
          "Previous legal proceedings"
        ],
        exampleQuestions: [
          "So, what brings you in today? What kind of legal situation are we looking at?",
          "I can see from your documents that this involves [specific parties/case info]. Is that right?",
          "When did all of this start happening? What was the first thing that went wrong?",
          "From what I'm reading here, it looks like this is being handled in [court/jurisdiction]. Is that correct?"
        ],
        isComplete: false,
        questionsAsked: 0,
        requiredQuestions: 5
      },
      {
        id: 2,
        name: "Factual Background",
        description: "Develop comprehensive understanding of what happened and available evidence",
        questionCount: "8-12 questions",
        checklist: [
          "Detailed narrative of what happened",
          "Key dates and events",
          "Evidence available (documents, witnesses, physical evidence)",
          "Witness statements and contact information",
          "Physical evidence and documentation",
          "Communications (emails, letters, phone calls)",
          "Financial aspects (damages, costs, payments)",
          "Previous attempts to resolve"
        ],
        exampleQuestions: [
          "Now, I need to understand exactly what happened. Can you walk me through the events as they unfolded?",
          "What evidence do you have that supports your side of the story?",
          "Were there any witnesses to what happened? Anyone who saw or heard anything?",
          "Have you tried to work this out with the other party before coming to me?",
          "How has this situation affected you financially? What kind of impact are we talking about?"
        ],
        isComplete: false,
        questionsAsked: 0,
        requiredQuestions: 8
      },
      {
        id: 3,
        name: "Legal Analysis",
        description: "Identify legal issues, applicable laws, and potential challenges",
        questionCount: "5-8 questions",
        checklist: [
          "Legal issues and claims",
          "Applicable laws and regulations",
          "Statute of limitations concerns",
          "Jurisdiction and venue",
          "Potential defenses",
          "Counterclaims or cross-claims",
          "Legal precedents or similar cases",
          "Regulatory requirements"
        ],
        exampleQuestions: [
          "What do you think the main legal issues are here? What's the core problem we need to solve?",
          "Are there any deadlines or time limits we need to be aware of?",
          "What do you think the other side's argument is going to be?",
          "Have you heard of any similar cases or situations like this?"
        ],
        isComplete: false,
        questionsAsked: 0,
        requiredQuestions: 5
      },
      {
        id: 4,
        name: "Goals and Strategy",
        description: "Understand client objectives and preferred approach",
        questionCount: "3-5 questions",
        checklist: [
          "Client's primary objectives",
          "Desired outcome",
          "Timeline expectations",
          "Budget considerations",
          "Risk tolerance",
          "Alternative dispute resolution preferences"
        ],
        exampleQuestions: [
          "What's your main goal here? What would make you feel like this was resolved successfully?",
          "What's your ideal outcome? What's the best-case scenario you're hoping for?",
          "How quickly do you need this resolved? What's your timeline like?",
          "How do you feel about different approaches? Are you open to negotiation, or do you want to fight this all the way?"
        ],
        isComplete: false,
        questionsAsked: 0,
        requiredQuestions: 3
      },
      {
        id: 5,
        name: "Document Preparation",
        description: "Determine specific document requirements and filing details",
        questionCount: "2-3 questions",
        checklist: [
          "Specific document type needed",
          "Filing requirements and deadlines",
          "Supporting documentation needed",
          "Service requirements"
        ],
        exampleQuestions: [
          "Based on everything we've discussed, what specific document do you think you need?",
          "Are there any deadlines we need to meet for filing this?",
          "What other documents or evidence will we need to support this?"
        ],
        isComplete: false,
        questionsAsked: 0,
        requiredQuestions: 2
      }
    ];
  }

  public dispatch(action: IntakeAction): IntakeState {
    switch (action.type) {
      case 'START_INTERVIEW':
        this.state = this.getInitialState();
        this.phases = this.getInitialPhases();
        this.responses = [];
        if (action.documentContext) {
          this.state.documentContext = action.documentContext;
        }
        break;

      case 'ASK_QUESTION':
        this.state.currentQuestion = action.question;
        this.state.lastResponse = null;
        const phase = this.phases.find(p => p.id === action.phase);
        if (phase) {
          phase.questionsAsked++;
        }
        break;

      case 'RECEIVE_ANSWER':
        this.state.lastResponse = action.answer;
        this.state.completedQuestions.push(action.question);
        
        const response: IntakeResponse = {
          question: action.question,
          answer: action.answer,
          phase: this.state.currentPhase,
          timestamp: new Date()
        };
        this.responses.push(response);
        
        // Check if current phase is complete
        this.checkPhaseCompletion();
        break;

      case 'COMPLETE_PHASE':
        this.state.phaseProgress[action.phase] = true;
        const completedPhase = this.phases.find(p => p.id === action.phase);
        if (completedPhase) {
          completedPhase.isComplete = true;
        }
        
        // Move to next phase if not the last one
        if (action.phase < 5) {
          this.state.currentPhase = action.phase + 1;
        }
        break;

      case 'COMPLETE_INTERVIEW':
        this.state.isComplete = true;
        this.state.canGenerateDocument = true;
        break;

      case 'RESET_INTERVIEW':
        this.state = this.getInitialState();
        this.phases = this.getInitialPhases();
        this.responses = [];
        break;

      case 'SKIP_TO_GENERATION':
        this.state.canGenerateDocument = true;
        break;
    }

    return this.state;
  }

  private checkPhaseCompletion(): void {
    const currentPhase = this.phases.find(p => p.id === this.state.currentPhase);
    if (currentPhase && currentPhase.questionsAsked >= currentPhase.requiredQuestions) {
      this.dispatch({ type: 'COMPLETE_PHASE', phase: this.state.currentPhase });
      
      // Check if all phases are complete
      const allPhasesComplete = this.phases.every(p => p.isComplete);
      if (allPhasesComplete) {
        this.dispatch({ type: 'COMPLETE_INTERVIEW' });
      }
    }
  }

  public getState(): IntakeState {
    return { ...this.state };
  }

  public getPhases(): IntakePhase[] {
    return [...this.phases];
  }

  public getResponses(): IntakeResponse[] {
    return [...this.responses];
  }

  public getCurrentPhase(): IntakePhase | null {
    return this.phases.find(p => p.id === this.state.currentPhase) || null;
  }

  public getCompletionPercentage(): number {
    const totalQuestions = this.phases.reduce((sum, phase) => sum + phase.requiredQuestions, 0);
    const completedQuestions = this.responses.length;
    return Math.round((completedQuestions / totalQuestions) * 100);
  }

  public canAskNextQuestion(): boolean {
    return !this.state.isComplete && this.state.currentQuestion === null;
  }

  public shouldCompleteInterview(): boolean {
    return this.state.currentPhase === 5 && 
           this.phases[4].questionsAsked >= this.phases[4].requiredQuestions;
  }

  public getInterviewSummary(): string {
    const summary = this.responses.map(response => 
      `Phase ${response.phase}: ${response.question}\nAnswer: ${response.answer}`
    ).join('\n\n');
    
    return `Interview Summary (${this.getCompletionPercentage()}% complete):\n\n${summary}`;
  }

  public getDocumentGenerationData(): any {
    return {
      phases: this.phases,
      responses: this.responses,
      documentContext: this.state.documentContext,
      completionPercentage: this.getCompletionPercentage(),
      isComplete: this.state.isComplete
    };
  }
}

// Utility functions for state management
export function createIntakeStateMachine(): IntakeStateMachine {
  return new IntakeStateMachine();
}

export function validateIntakeState(state: IntakeState): boolean {
  return state.currentPhase >= 1 && 
         state.currentPhase <= 5 && 
         typeof state.isComplete === 'boolean' &&
         typeof state.canGenerateDocument === 'boolean';
}

export function getPhaseProgress(state: IntakeState): Record<number, number> {
  const progress: Record<number, number> = {};
  for (let i = 1; i <= 5; i++) {
    progress[i] = state.phaseProgress[i] ? 100 : 0;
  }
  return progress;
}

export function shouldShowCompletionMessage(state: IntakeState): boolean {
  return state.isComplete && state.canGenerateDocument;
}

export function getNextPhaseQuestion(state: IntakeState, phases: IntakePhase[]): string | null {
  const currentPhase = phases.find(p => p.id === state.currentPhase);
  if (!currentPhase || currentPhase.isComplete) {
    return null;
  }
  
  const availableQuestions = currentPhase.exampleQuestions.filter(
    (_, index) => index >= currentPhase.questionsAsked
  );
  
  return availableQuestions[0] || null;
}
