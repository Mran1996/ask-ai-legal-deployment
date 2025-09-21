export type PartyInfo = {
  plaintiff?: string;
  defendant?: string;
  appellant?: string;
  appellee?: string;
  petitioner?: string;
  respondent?: string;
  inmateName?: string;        // user name if pro se
  inmateNumber?: string;      // optional DOC number
  facilityAddress?: string;   // for service block
};

export type CourtInfo = {
  courtName: string;          // e.g., "Superior Court of California, County of Los Angeles"
  county?: string;
  state: string;              // Full state name
  caseNumber?: string;
  judgeName?: string;
  division?: string;          // appellate district, civil/criminal division etc.
};

export type DocumentConfig = {
  docType: 
    | "State Direct Appeal Brief"
    | "State Post-Conviction Petition"
    | "State Motion for New Trial"
    | "State Motion to Vacate/Modify"
    | "State Motion to Reconsider"
    | "Federal Habeas 2254"
    | "Federal Habeas 2255"
    | "Writ Petition (specify)"
    | "Civil Notice of Appeal"
    | "Civil Appellate Brief"
    | "Rule 60(b) Motion"
    | "State Equivalent of Rule 60(b)"
    | "Section 1983 Complaint"
    | "Preliminary Injunction / TRO"
    | "Public Records / FOIA Request"
    | "Administrative Grievance Appeal";

  targetLength?: "short" | "medium" | "long";  // affects depth of argument
  includeTableOfAuthorities?: boolean;
  includeCaseLaw?: boolean; // if true, you MUST provide authorities list; otherwise draft without citations
  styleLabel?: string;      // e.g., "Bluebook", "California Style", "Texas Style"
};

export type Authorities = {
  statutes?: Array<{ cite: string; text?: string }>;
  rules?: Array<{ cite: string; text?: string }>;
  cases?: Array<{ cite: string; holding?: string; parenthetical?: string }>;
};

export type FactsBundle = {
  issuesPresented?: string[];
  proceduralHistory?: string[];  // dated bullets
  facts?: string[];              // granular facts; no PII beyond user-provided
  grounds?: string[];            // e.g., "IAC—failure to investigate alibi", "Brady—suppressed phone records"
  requestedRelief?: string[];    // e.g., "Vacate conviction", "New trial", "Evidentiary hearing"
  deadlinesOrTiming?: string[];  // e.g., "PCR deadline 90 days from judgment"
};

export type BuildGenPromptInput = {
  court: CourtInfo;
  parties: PartyInfo;
  config: DocumentConfig;
  authorities?: Authorities;   // provide if includeCaseLaw=true
  data: FactsBundle;
};

export function buildGenerationPrompt(input: BuildGenPromptInput) {
  const { court, parties, config, authorities, data } = input;

  // Safety: If includeCaseLaw is requested but no authorities provided, disable to avoid fabrication.
  const willCite = Boolean(config.includeCaseLaw && authorities && (
    (authorities.cases && authorities.cases.length) ||
    (authorities.statutes && authorities.statutes.length) ||
    (authorities.rules && authorities.rules.length)
  ));

  const header = `
[JURISDICTION]
Court: ${court.courtName}${court.division ? `, ${court.division}` : ``}
State: ${court.state}${court.county ? ` | County: ${court.county}` : ``}
Case No.: ${court.caseNumber ?? "N/A"}
Judge: ${court.judgeName ?? "N/A"}

[CRITICAL: PROPER COURT DOCUMENT FORMAT REQUIRED]
START THE DOCUMENT IMMEDIATELY WITH THE PROPER COURT HEADER FORMAT:
- For federal appeals: "UNITED STATES COURT OF APPEALS"
- For federal district: "UNITED STATES DISTRICT COURT" 
- For state courts: "[STATE] COURT OF APPEALS" or "[STATE] DISTRICT COURT"
- Center the court name at the top
- Include circuit/division information below
- Format case caption with parties on left, case numbers on right
- Use professional legal document structure throughout

[PARTIES]
${parties.plaintiff ? `Plaintiff: ${parties.plaintiff}\n` : ``}${parties.defendant ? `Defendant: ${parties.defendant}\n` : ``}${parties.appellant ? `Appellant: ${parties.appellant}\n` : ``}${parties.appellee ? `Appellee: ${parties.appellee}\n` : ``}${parties.petitioner ? `Petitioner: ${parties.petitioner}\n` : ``}${parties.respondent ? `Respondent: ${parties.respondent}\n` : ``}${parties.inmateName ? `Pro Se Incarcerated Filer: ${parties.inmateName} ${parties.inmateNumber ? `(ID ${parties.inmateNumber})` : ``}\n` : ``}
`.trim();

  const configBlock = `
[DOCUMENT CONFIG]
Document Type: ${config.docType}
Target Length: ${config.targetLength ?? "medium"}
Style: ${config.styleLabel ?? "Bluebook (default)"}
Include Table of Authorities: ${config.includeTableOfAuthorities ? "Yes" : "No"}
Include Case Law: ${willCite ? "Yes" : "No"}
`.trim();

  const issues = (data.issuesPresented ?? []).map((s, i) => `${i + 1}. ${s}`).join("\n");
  const hist = (data.proceduralHistory ?? []).map((s) => `- ${s}`).join("\n");
  const facts = (data.facts ?? []).map((s) => `- ${s}`).join("\n");
  const grounds = (data.grounds ?? []).map((s, i) => `${i + 1}. ${s}`).join("\n");
  const relief = (data.requestedRelief ?? []).map((s, i) => `${i + 1}. ${s}`).join("\n");
  const timing = (data.deadlinesOrTiming ?? []).map((s) => `- ${s}`).join("\n");

  const authBlock = willCite ? `
[AUTHORITIES — USE EXACTLY AS PROVIDED, DO NOT INVENT]
${(authorities?.statutes ?? []).map(a => `Statute: ${a.cite}${a.text ? ` — ${a.text}` : ``}`).join("\n")}
${(authorities?.rules ?? []).map(r => `Rule: ${r.cite}${r.text ? ` — ${r.text}` : ``}`).join("\n")}
${(authorities?.cases ?? []).map(c => `Case: ${c.cite}${c.holding ? ` — ${c.holding}` : ``}${c.parenthetical ? ` (${c.parenthetical})` : ``}`).join("\n")}
`.trim() : `
[AUTHORITIES]
None provided. Draft argument without citations; rely on facts and statutes only if supplied.
`.trim();

  const payload = `
${header}

${configBlock}

[ISSUES PRESENTED]
${issues || "None provided."}

[PROCEDURAL HISTORY]
${hist || "None provided."}

[FACTS]
${facts || "None provided."}

[GROUNDS / THEORIES]
${grounds || "None provided."}

[REQUESTED RELIEF]
${relief || "Specify relief clearly (e.g., vacate, new trial, evidentiary hearing, injunction)."}

[TIMING / DEADLINES]
${timing || "None provided."}

${authBlock}

[FORMAT]
Use the Structure Template from SYSTEM to produce a finished, court-formatted filing for ${court.state}.
Include a Proof of Service suitable for an incarcerated filer (prison mailbox rule if applicable).
Do NOT include any disclaimers.
`.trim();

  return payload;
}


