// Chat suggestions utility

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
]

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
]

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
]

const personalInjuryIntake = [
  "When and where exactly did the injury occur?",
  "Can you describe in detail how the injury happened?",
  "What specific injuries did you sustain?",
  "What medical treatment have you received so far?",
  "Are you still receiving treatment? What is your prognosis?",
  "Have you missed work or other activities due to your injuries?",
  "Have you spoken with insurance companies? What was discussed?",
  "Have you received any settlement offers?",
  "Do you have documentation of your medical expenses and lost wages?",
  "Were there any witnesses to the incident?",
  "Do you have photos of your injuries or the accident scene?",
  "What specific damages are you seeking compensation for?",
]

const criminalDefenseIntake = [
  "What specific charges are you facing?",
  "When and where were you arrested or cited?",
  "When is your next court date and what type of hearing is it?",
  "Have you been assigned a public defender or hired private counsel?",
  "What is your prior criminal history, if any?",
  "Were you read your Miranda rights?",
  "Did law enforcement conduct any searches? Did you consent?",
  "Were there any witnesses to the alleged offense?",
  "Is there any physical evidence or surveillance footage involved?",
  "Have you given any statements to law enforcement?",
  "What is your side of the story regarding what happened?",
  "Are there any potential alibi witnesses or exculpatory evidence?",
  "What are your primary concerns about this case?",
]

// Function to get category-specific intake questions
export function getCategoryIntakeQuestions(category: string): string[] {
  switch (category?.toLowerCase()) {
    case "family law":
      return familyLawIntake
    case "wage dispute":
    case "employment":
      return wageDisputeIntake
    case "housing":
    case "landlord tenant":
      return housingLawIntake
    case "personal injury":
      return personalInjuryIntake
    case "criminal defense":
    case "criminal":
      return criminalDefenseIntake
    default:
      // Default questions for any category
      return [
        "Can you briefly tell me what happened?",
        "Has anything been filed in court yet?",
        "Who is the opposing party in your case?",
        "Do you happen to know your case number?",
        "Do you know the name of the court handling your case?",
        "What outcome are you hoping for?",
      ]
  }
}

// Dynamic suggested replies based on the current question
export function getSuggestedReplies(currentQuestion: string): string[] {
  // Map of questions to suggested replies
  const replySuggestions: Record<string, string[]> = {
    "What state are you located in?": [
      "I am in California",
      "I reside in Texas",
      "I'm located in New York",
      "I live in Florida"
    ],
    "Have you received any court documents or notices?": [
      "Yes, I received a summons from the Superior Court",
      "I got a notice from the County Court",
      "No court documents received yet",
      "I have documents but need help understanding them"
    ],
    "Is there an existing case number assigned to this matter?": [
      "Yes, it's on the court documents",
      "No case has been filed yet",
      "I need to check the paperwork",
      "The case number is [Case Number]"
    ],
    "Please describe the specific situation that brings you here today.": [
      "I received an eviction notice from my landlord",
      "My employer terminated me without cause",
      "I'm having a dispute with a contractor",
      "I need to respond to a legal complaint"
    ],
    "Who is taking legal action against you, or who are you taking legal action against?": [
      "My former employer [Company Name]",
      "My landlord [Name]",
      "A business partner [Name]",
      "A contractor [Name/Company]"
    ],
    "What has the opposing party done that you believe requires legal intervention?": [
      "They breached our contract by...",
      "They failed to pay me for...",
      "They are threatening to...",
      "They have taken possession of..."
    ],
    "Have you received any deadlines, court dates, or time-sensitive notices?": [
      "Yes, I have 30 days to respond",
      "There's a hearing scheduled for...",
      "The deadline to file is...",
      "No deadlines mentioned in the documents"
    ]
  }

  // Check if we have suggestions for this exact question
  if (currentQuestion in replySuggestions) {
    return replySuggestions[currentQuestion]
  }

  // Check for partial matches
  for (const question in replySuggestions) {
    if (currentQuestion.toLowerCase().includes(question.toLowerCase())) {
      return replySuggestions[question]
    }
  }

  // Default suggestions based on keywords
  if (currentQuestion.toLowerCase().includes("court")) {
    return [
      "Yes, I have the court documents",
      "The court is located in [County]",
      "No court proceedings yet",
      "I need to verify the court information"
    ]
  } else if (currentQuestion.toLowerCase().includes("deadline")) {
    return [
      "The deadline is next week",
      "I have 30 days to respond",
      "No deadlines mentioned",
      "I need to check the exact date"
    ]
  } else if (currentQuestion.toLowerCase().includes("situation") || currentQuestion.toLowerCase().includes("issue")) {
    return [
      "The issue started when...",
      "The problem began after...",
      "This has been ongoing since...",
      "The situation arose when..."
    ]
  }

  // Fallback suggestions
  return [
    "Let me explain the situation",
    "I have documentation to support this",
    "I can provide more details",
    "I need guidance on this matter"
  ]
}

export function getCategoryFirstQuestion(category: string): string {
  const questions: { [key: string]: string } = {
    "Criminal": "To begin, can you tell me what charges you were convicted of, and the year the conviction took place?",
    "Family": "To begin, can you tell me what kind of family law issue you're dealing with — for example: custody, divorce, child support, or something else?",
    "Housing": "To begin, are you facing eviction, unsafe conditions, a rent dispute, or something else?",
    "Employment": "Can you tell me what kind of employment issue you're dealing with — such as unpaid wages, harassment, or wrongful termination?",
    "Civil": "What's the nature of the dispute — for example, is it small claims, contract-related, or something else?",
    "Immigration": "To begin, are you seeking help with a removal defense, visa application, green card, or something else?",
    "Consumer": "Are you dealing with a dispute related to debt, fraud, contracts, or something else?"
  };

  return questions[category] || "To begin, can you tell me about the specific legal issue you're dealing with?";
}
