// Cursor: create this file only. Small helper to keep prompts jurisdiction-accurate.

type Inputs = {
  jurisdiction: { level: "federal" | "state"; state?: string };
  court: { name: string; division?: string };
  document: { type: string; goal: string };
};

export function buildDocInstructions(inputs: Inputs) {
  const isFederal = inputs.jurisdiction.level === "federal";
  const doc = inputs.document.type.toLowerCase();

  // Example routing
  if (isFederal && /rehearing|en banc/.test(doc)) {
    return `
Document Vehicle: Petition for Rehearing / Rehearing En Banc
Apply: Federal Rules of Appellate Procedure 35 and 40; cite controlling Circuit and U.S. Supreme Court cases.
Include: jurisdictional statement, standard for rehearing (misapprehension of law/fact; exceptional importance), targeted arguments, and precise requested relief.
No state statutes unless relevant for underlying claim preserved in the record.`;
  }

  if (isFederal && /motion to dismiss|rule 12/.test(doc)) {
    return `
Document Vehicle: Motion to Dismiss (Federal)
Apply: Fed. R. Civ. P. 12 (as applicable).
Argue: pleading deficiencies, jurisdictional bars, or immunities. Include proper certificate(s) if required by local rules.`;
  }

  if (!isFederal && /post-?conviction|habeas|1473/.test(doc)) {
    return `
Document Vehicle: State Post-Conviction Petition
Apply: Use the correct state statute for post-conviction relief (e.g., California Penal Code § 1473, or the correct statute for the provided state).
Format the caption and relief to the state's trial court. Include verification and service consistent with state rules.`;
  }

  if (!isFederal && /motion|superior court|state court/.test(doc)) {
    return `
Document Vehicle: State Motion (Trial Court)
Apply: the state's civil/criminal rules and any local rules for the named court. Use state-specific authorities first.`;
  }

  // Default safety net:
  return `
Match the requested document vehicle to the named court and jurisdiction. Use the correct rules (FRCP/FRAP for federal; state rules/statutes for state). If ambiguous, include a one-line bracketed NOTE at top indicating the single missing parameter, then proceed.`;
}
