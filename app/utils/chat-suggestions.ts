// Chat suggestions utility

// Define document type determination questions
const documentTypeQuestions = [
  "Are you responding to a letter or notice you received, or do you need to file something with the court?",
  "Have you already received any formal legal documents that require a response?",
  "Is there an existing court case, or would this be starting a new case?",
  "Are there any immediate deadlines you need to meet?"
];

// Response letter specific questions
const responseLetter = [
  "What type of letter or notice did you receive?",
  "When did you receive this letter/notice?",
  "Who sent the letter/notice?",
  "What specific claims or demands are made in the letter?",
  "Do you have any documentation to support your response?",
  "What outcome are you seeking with your response?",
  "Are there any deadlines mentioned in the letter?",
  "Have there been any previous communications about this matter?",
  "Are you willing to negotiate or seek alternative resolution?",
  "What specific points do you want to address in your response?"
];

// Court document specific questions
const courtDocument = [
  "What type of court document do you need to file?",
  "Is this an initial filing or a response to something filed?",
  "What court will this be filed in?",
  "Do you have a case number? If so, what is it?",
  "Who are the parties involved in the case?",
  "What is the main relief or action you're requesting from the court?",
  "Are there any supporting documents you need to attach?",
  "Are there specific court rules or deadlines that apply?",
  "Have you reviewed the court's local filing requirements?",
  "Will this need to be served on other parties?"
];

// Define category-specific intake questions
const familyLawIntake = [
  "What type of family law issue are you dealing with? (divorce, custody, etc.)",
  "Has anything been filed in court yet? If so, what?",
  "Who is the opposing party? (name + relationship)",
  "Are there children involved? If so, what are their ages?",
  "Is there a current custody or visitation arrangement in place?",
  "Have there been any allegations of domestic violence or substance abuse?",
  "What specific outcomes are you hoping for regarding custody, support, or property?",
  "Are there any immediate deadlines or hearings scheduled?",
  "Have you attempted mediation or other dispute resolution methods?",
  "Do you have any financial concerns that might impact your case?",
];

const wageDisputeIntake = [
  "Who is your employer and what is your position?",
  "What specific wages or overtime are you claiming are owed?",
  "How long have you worked there and do you still work there?",
  "Have you documented your hours worked? If so, how?",
  "Have you contacted HR or management about this issue?",
  "Have you filed any complaints with government agencies?",
  "Are there other employees experiencing similar issues?",
  "Do you have copies of pay stubs, employment contracts, or relevant communications?",
  "Have you received any explanation for why the wages weren't paid?",
  "What steps have you taken so far to resolve this?",
];

const housingLawIntake = [
  "Are you a tenant or landlord in this situation?",
  "What is the specific housing issue you're facing?",
  "Is there a written lease agreement in place? When does it expire?",
  "Has any formal notice been given by either party?",
  "Are there any habitability or repair issues involved?",
  "Have you documented the conditions with photos or written communications?",
  "Are there any local rent control or tenant protection ordinances that apply?",
  "Have you withheld rent or has rent gone unpaid? If so, why?",
  "Have you communicated with the other party about resolving this issue?",
  "What specific outcome are you hoping to achieve?",
];

// Function to get initial document type determination
export function getDocumentTypeQuestions(): string[] {
  return documentTypeQuestions;
}

// Function to get document-specific questions
export function getDocumentSpecificQuestions(documentType: 'response_letter' | 'court_document'): string[] {
  return documentType === 'response_letter' ? responseLetter : courtDocument;
}

// Get category-specific questions
export function getCategoryIntakeQuestions(category: string): string[] {
  switch (category?.toLowerCase()) {
    case "family law":
      return familyLawIntake;
    case "wage dispute":
    case "employment":
      return wageDisputeIntake;
    case "housing":
    case "landlord tenant":
      return housingLawIntake;
    default:
      return [
        "Can you briefly describe your situation?",
        "What specific outcome are you seeking?",
        "Have you received any legal documents or notices?",
        "Are there any immediate deadlines you need to meet?",
        "Do you have any supporting documentation?",
      ];
  }
}

// Get initial question based on category
export function getCategoryFirstQuestion(category: string): string {
  const questions: { [key: string]: string } = {
    "Criminal": "What type of criminal matter are you dealing with?",
    "Family": "What type of family law issue are you facing?",
    "Housing": "Are you dealing with an eviction, lease dispute, or other housing matter?",
    "Employment": "What type of employment issue are you experiencing?",
    "Civil": "What type of civil matter brings you here today?",
  };

  return questions[category] || "Could you tell me about your legal situation?";
}

// Get suggested replies based on the current question
export function getSuggestedReplies(currentQuestion: string): string[] {
  const replySuggestions: { [key: string]: string[] } = {
    "What state are you located in?": [
      "I'm in California",
      "I'm in New York",
      "I'm in Texas",
      "I'm in Florida",
    ],
    "Have you received any court documents or notices?": [
      "Yes, I received a summons",
      "Yes, I got an eviction notice",
      "No, not yet",
      "I'm not sure",
    ],
    "Is there an existing case number?": [
      "Yes, let me find it",
      "No case number yet",
      "I need to check",
      "Not sure",
    ],
  };

  // Return suggestions for the current question or default suggestions
  return replySuggestions[currentQuestion] || [
    "Let me explain my situation",
    "I need help understanding my options",
    "I have documentation to share",
    "I'm not sure how to proceed",
  ];
}

// Export new helper function to determine document type
export function determineDocumentType(response: string): 'response_letter' | 'court_document' | null {
  const response_keywords = ['letter', 'notice', 'respond', 'reply', 'demand letter', 'cease and desist'];
  const court_keywords = ['court', 'file', 'motion', 'complaint', 'summons', 'petition'];
  
  response = response.toLowerCase();
  
  if (response_keywords.some(keyword => response.includes(keyword))) {
    return 'response_letter';
  }
  if (court_keywords.some(keyword => response.includes(keyword))) {
    return 'court_document';
  }
  return null;
} 
 