// src/lib/local-rules.ts
// One-file "local rules switch": caption format + required sections + guidance, per court.
// Add more courts by copying an entry. Everything else reads from this single map.

export type CourtKey =
  // Federal Appellate + District (generic)
  | "USCA-9"
  | "USDC-generic"
  // WA
  | "WA-King-Superior"
  // Pre-seeded high-volume states (generic trial courts)
  | "NY-Supreme-generic"
  | "TX-District-generic"
  | "FL-Circuit-generic"
  | "IL-Circuit-Cook"
  | "PA-CCP-Philadelphia"
  | "OH-CCP-Cuyahoga"
  | "GA-Superior-Fulton"
  | "MI-Circuit-Wayne"
  | "NC-Superior-Mecklenburg"
  | "NJ-Superior-Law-generic";

type Rule = {
  caption: (p: {
    courtName: string;
    division?: string;         // county or division label when applicable
    caseNumber: string;
    partyA: string;            // e.g., Plaintiff/Petitioner/Appellant name
    partyB: string;            // e.g., Defendant/Respondent/Appellee name
    roleA: string;             // "Plaintiff", "Petitioner", "Appellant", etc.
    roleB: string;             // "Defendant", "Respondent", "Appellee", etc.
    documentTitle: string;     // e.g., "Petition for Rehearing"
  }) => string;

  requiredSections: string[];  // enforce presence & order
  guidance: string;            // jurisdiction-specific tips to the model
  includeVerification?: boolean;
  includeProofOfService?: boolean;
};

const line = (s: string) => s.trim().replace(/[ \t]+/g, " ");

// -------------------- RULES MAP --------------------
export const LOCAL_RULES: Record<CourtKey, Rule> = {
  // FEDERAL
  "USCA-9": {
    caption: ({ courtName, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      ${courtName}

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Questions Presented",
      "Procedural History",
      "Statement of the Case",
      "Standard for Rehearing",
      "Argument",
      "Conclusion",
      "Certificate of Service",
    ],
    guidance: line(`
      Apply FRAP 35 & 40 for rehearing / rehearing en banc; cite Ninth Circuit and SCOTUS first.
      Grounds: misapprehension of law/fact or exceptional importance. Avoid state statutes unless needed for preserved claims.
    `),
    includeVerification: false,
    includeProofOfService: true,
  },

  "USDC-generic": {
    caption: ({ courtName, division, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      ${courtName}${division ? ", " + division : ""}

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Case No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Jurisdiction and Venue",
      "Statement of Facts",
      "Legal Standard",
      "Argument",
      "Requested Relief",
      "Conclusion",
      "Certificate of Service",
    ],
    guidance: line(`Use FRCP and controlling Circuit law. Bluebook citations.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // WASHINGTON – KING COUNTY SUPERIOR COURT
  "WA-King-Superior": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE SUPERIOR COURT OF WASHINGTON
      IN AND FOR THE COUNTY OF KING

      ${partyA}, ${roleA},
                    v.
      ${partyB}, ${roleB}.

      No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Relief Requested",
      "Issues",
      "Statement of Facts/Grounds",
      "Evidence",
      "Legal Authority",
      "Proposed Order",
      "Conclusion",
      "Certificate of Service",
    ],
    guidance: line(`Use Washington authority first (RCW & WA appellate cases). Include Proposed Order.`),
    includeVerification: false,
    includeProofOfService: true,
    },

  // ---------- PRE-SEEDED 10 STATES (trial court, common venues) ----------
  // NEW YORK – Supreme Court (trial court of general jurisdiction)
  "NY-Supreme-generic": {
    caption: ({ division, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      SUPREME COURT OF THE STATE OF NEW YORK
      COUNTY OF ${division || "[County]"}

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Index No.: ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Preliminary Statement",
      "Statement of Facts",
      "Questions Presented",
      "Argument",
      "Relief Requested",
      "Conclusion",
      "Affirmation of Service",
    ],
    guidance: line(`Cite NY Court of Appeals/Appellate Division. Use CPLR for civil motions; CPL for criminal.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // TEXAS – District Court (state trial court of general jurisdiction)
  "TX-District-generic": {
    caption: ({ division, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE DISTRICT COURT OF ${division || "[County]"} COUNTY, TEXAS

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Cause No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Facts",
      "Argument and Authorities",
      "Prayer",
      "Certificate of Service",
    ],
    guidance: line(`Use Texas Rules of Civil/Criminal Procedure as applicable; cite Texas Supreme Court / CCA.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // FLORIDA – Circuit Court
  "FL-Circuit-generic": {
    caption: ({ division, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE CIRCUIT COURT OF THE ${division || "[Judicial]"} JUDICIAL CIRCUIT
      IN AND FOR [County] COUNTY, FLORIDA

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Case No.: ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Statement of Facts",
      "Legal Standard",
      "Argument",
      "Wherefore Clause",
      "Certificate of Service",
    ],
    guidance: line(`Use Florida Rules; cite Florida Supreme Court & DCAs. Insert correct Circuit & County.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // ILLINOIS – Circuit Court (Cook County example)
  "IL-Circuit-Cook": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE CIRCUIT COURT OF COOK COUNTY, ILLINOIS

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Factual Background",
      "Argument",
      "Prayer for Relief",
      "Certificate of Service",
    ],
    guidance: line(`Use Illinois Supreme Court/Appellate Court precedent; Illinois Rules of Court.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // PENNSYLVANIA – Court of Common Pleas (Philadelphia example)
  "PA-CCP-Philadelphia": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      COURT OF COMMON PLEAS OF PHILADELPHIA COUNTY, PENNSYLVANIA

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Statement of Matters Involved",
      "Statement of Facts",
      "Argument",
      "Relief Requested",
      "Certificate of Service",
    ],
    guidance: line(`Use Pa.R.C.P./Pa.R.Crim.P. as applicable; cite Pa. Supreme/Superior/Commonwealth Courts.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // OHIO – Court of Common Pleas (Cuyahoga example)
  "OH-CCP-Cuyahoga": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE COURT OF COMMON PLEAS
      CUYAHOGA COUNTY, OHIO

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Case No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Statement of Facts",
      "Law and Argument",
      "Prayer for Relief",
      "Certificate of Service",
    ],
    guidance: line(`Use Ohio Rules; cite Ohio Supreme Court / District Courts of Appeal.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // GEORGIA – Superior Court (Fulton example)
  "GA-Superior-Fulton": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE SUPERIOR COURT OF FULTON COUNTY
      STATE OF GEORGIA

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Civil Action File No.: ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Facts",
      "Argument",
      "Prayer for Relief",
      "Certificate of Service",
    ],
    guidance: line(`Use Georgia law; cite Georgia Supreme Court / Court of Appeals; Uniform Superior Court Rules.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // MICHIGAN – Circuit Court (Wayne example)
  "MI-Circuit-Wayne": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      STATE OF MICHIGAN
      IN THE CIRCUIT COURT FOR THE COUNTY OF WAYNE

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Case No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Statement of Facts",
      "Argument",
      "Relief Requested",
      "Proof of Service",
    ],
    guidance: line(`Use Michigan Court Rules; cite Michigan Supreme Court / Court of Appeals.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // NORTH CAROLINA – Superior Court (Mecklenburg example)
  "NC-Superior-Mecklenburg": {
    caption: ({ caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      IN THE GENERAL COURT OF JUSTICE
      SUPERIOR COURT DIVISION
      MECKLENBURG COUNTY, NORTH CAROLINA

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      No. ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Introduction",
      "Statement of Facts",
      "Arguments and Authorities",
      "Prayer for Relief",
      "Certificate of Service",
    ],
    guidance: line(`Use North Carolina Rules; cite N.C. Supreme Court / Court of Appeals.`),
    includeVerification: false,
    includeProofOfService: true,
  },

  // NEW JERSEY – Superior Court, Law Division (generic)
  "NJ-Superior-Law-generic": {
    caption: ({ division, caseNumber, partyA, partyB, roleA, roleB, documentTitle }) => line(`
      SUPERIOR COURT OF NEW JERSEY
      LAW DIVISION, ${division || "[County]"} COUNTY

      ${partyA}, ${roleA},
              v.
      ${partyB}, ${roleB}.

      Docket No.: ${caseNumber}

      ${documentTitle}
    `),
    requiredSections: [
      "Preliminary Statement",
      "Statement of Facts",
      "Legal Argument",
      "Relief Requested",
      "Certification of Service",
    ],
    guidance: line(`Use New Jersey Court Rules; cite N.J. Supreme Court / Appellate Division.`),
    includeVerification: false,
    includeProofOfService: true,
  },
};

// ------------ Resolver: map inputs to a CourtKey ------------
export function resolveCourtKey({
  jurisdictionLevel,
  courtName,
  stateCode,
  county,
}: {
  jurisdictionLevel: "federal" | "state";
  courtName: string;
  stateCode?: string; // "WA", "CA", etc.
  county?: string;    // when you have it (from Step 3 extraction or user input)
}): CourtKey {
  const n = courtName.toLowerCase();

  // Federal routing
  if (jurisdictionLevel === "federal") {
    if (/court of appeals.*ninth|9th circuit|ninth circuit/i.test(n)) return "USCA-9";
    return "USDC-generic";
  }

  // State routing (specific)
  if ((stateCode === "WA" || /washington/i.test(n)) && /king/i.test(n)) return "WA-King-Superior";
  if (stateCode === "NY" || /new york/i.test(n)) return "NY-Supreme-generic";
  if (stateCode === "TX" || /texas/i.test(n)) return "TX-District-generic";
  if (stateCode === "FL" || /florida/i.test(n)) return "FL-Circuit-generic";
  if ((stateCode === "IL" || /illinois/i.test(n)) && /cook/i.test(n)) return "IL-Circuit-Cook";
  if ((stateCode === "PA" || /pennsylvania/i.test(n)) && /philadelphia/i.test(n)) return "PA-CCP-Philadelphia";
  if ((stateCode === "OH" || /ohio/i.test(n)) && /cuyahoga/i.test(n)) return "OH-CCP-Cuyahoga";
  if ((stateCode === "GA" || /georgia/i.test(n)) && /fulton/i.test(n)) return "GA-Superior-Fulton";
  if ((stateCode === "MI" || /michigan/i.test(n)) && /wayne/i.test(n)) return "MI-Circuit-Wayne";
  if ((stateCode === "NC" || /north carolina/i.test(n)) && /mecklenburg/i.test(n)) return "NC-Superior-Mecklenburg";
  if (stateCode === "NJ" || /new jersey/i.test(n)) return "NJ-Superior-Law-generic";

  // Fallbacks
  if (jurisdictionLevel === "state") {
    // If unknown, let caption use the literal courtName and enforce generic sections:
    return "USDC-generic"; // neutral structure; caption still prints literal courtName
  }
  return "USDC-generic";
}

function missingSections(draft: string, required: string[]): string[] {
  const h = draft.toLowerCase();
  return required.filter(s => !h.includes(s.toLowerCase()));
}
