// lib/jurisdiction-mcp.js - JavaScript version for MCP server

// Jurisdiction conflict detection
function detectJurisdictionConflict(input) {
  const issues = [];
  const hasPC1473 = input.statuteRefs?.some(s => /1473\b/.test(s)) ?? false;
  const saysFederal = input.forumHints?.some(h => /federal|habeas.*(§\s*2254|2255)|ninth circuit/i.test(h)) ?? false;
  if (hasPC1473 && saysFederal) issues.push("California Penal Code §1473 (state) conflicts with federal habeas indicators.");
  return issues;
}

// Enhanced state-to-court mapping with all special cases
function stateToDefaultCourt(ctx) {
  const { state, county, parish, city, judicialDistrict, circuit, division, unit } = ctx;
  
  if (!state) return "STATE COURT";

  switch (state.toUpperCase()) {
    case "CA":
      return county
        ? `SUPERIOR COURT OF THE STATE OF CALIFORNIA
IN AND FOR THE COUNTY OF ${county.toUpperCase()}`
        : `SUPERIOR COURT OF THE STATE OF CALIFORNIA`;
    case "NY":
      return county
        ? `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF ${county.toUpperCase()}`
        : `SUPREME COURT OF THE STATE OF NEW YORK`;
    case "TX":
      return county
        ? `IN THE DISTRICT COURT OF ${county.toUpperCase()} COUNTY, TEXAS`
        : `DISTRICT COURT OF TEXAS`;
    case "WA":
      return county
        ? `SUPERIOR COURT OF WASHINGTON
IN AND FOR THE COUNTY OF ${county.toUpperCase()}`
        : `SUPERIOR COURT OF WASHINGTON`;
    case "PA":
      return county
        ? `COMMONWEALTH OF PENNSYLVANIA
COURT OF COMMON PLEAS OF ${county.toUpperCase()} COUNTY`
        : `COMMONWEALTH OF PENNSYLVANIA
COURT OF COMMON PLEAS`;
    case "OH":
      return county
        ? `STATE OF OHIO
COURT OF COMMON PLEAS
${county.toUpperCase()} COUNTY`
        : `STATE OF OHIO
COURT OF COMMON PLEAS`;
    case "SC":
      return county
        ? `STATE OF SOUTH CAROLINA
COURT OF COMMON PLEAS
${county.toUpperCase()} COUNTY`
        : `STATE OF SOUTH CAROLINA
COURT OF COMMON PLEAS`;
    case "LA":
      if (parish && judicialDistrict) {
        return `STATE OF LOUISIANA
${judicialDistrict.toUpperCase()} JUDICIAL DISTRICT COURT
PARISH OF ${parish.toUpperCase()}`;
      }
      if (parish) {
        return `STATE OF LOUISIANA
DISTRICT COURT FOR THE PARISH OF ${parish.toUpperCase()}`;
      }
      return `STATE OF LOUISIANA
DISTRICT COURT`;
    case "VT":
      if (county && unit) {
        return `STATE OF VERMONT
SUPERIOR COURT
${county.toUpperCase()} COUNTY
${unit.toUpperCase()} UNIT`;
      }
      return county
        ? `STATE OF VERMONT
SUPERIOR COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF VERMONT
SUPERIOR COURT`;
    case "NJ":
      if (county && division) {
        return `STATE OF NEW JERSEY
SUPERIOR COURT OF NEW JERSEY
${division.toUpperCase()} DIVISION, ${county.toUpperCase()} COUNTY`;
      }
      return county
        ? `STATE OF NEW JERSEY
SUPERIOR COURT OF NEW JERSEY
LAW DIVISION, ${county.toUpperCase()} COUNTY`
        : `STATE OF NEW JERSEY
SUPERIOR COURT OF NEW JERSEY
LAW DIVISION`;
    case "FL":
      if (circuit && county) {
        return `STATE OF FLORIDA
CIRCUIT COURT OF THE ${circuit.toUpperCase()} JUDICIAL CIRCUIT
IN AND FOR ${county.toUpperCase()} COUNTY`;
      }
      return county
        ? `STATE OF FLORIDA
CIRCUIT COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF FLORIDA
CIRCUIT COURT`;
    default:
      return county
        ? `STATE OF ${state.toUpperCase()}
COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF ${state.toUpperCase()}
COURT`;
  }
}

function formatStateCaption(ctx) {
  // If upstream provided a fully formed court name, prefer it
  if (ctx.courtName && ctx.courtName.trim().length > 0) {
    return ctx.courtName.trim();
  }

  return stateToDefaultCourt(ctx);
}

function formatPartyCaption(ctx) {
  const pet = ctx.petitioner || "[INSERT PETITIONER NAME]";
  const resp = ctx.respondent || "[INSERT RESPONDENT NAME]";
  const caseNo = ctx.caseNumber ? `Case No.: ${ctx.caseNumber}` : "Case No.: [INSERT CASE NUMBER]";

  return `${pet},
Petitioner,

v.

${resp},
Respondent.

${caseNo}`;
}

// Helper function to get state-specific legal standards
function getStateLegalStandard(state, documentType) {
  const docType = documentType.toLowerCase();
  
  switch (state.toUpperCase()) {
    case "CA":
      if (/post.?conviction|habeas|1473/.test(docType)) {
        return "California Penal Code § 1473, People v. Ledesma (2006) 39 Cal.4th 641, People v. Breverman (1998) 19 Cal.4th 142";
      }
      if (/motion to dismiss|demurrer/.test(docType)) {
        return "California Code of Civil Procedure §§ 430.10, 430.30";
      }
      return "California Code of Civil Procedure";
      
    case "NY":
      if (/post.?conviction|habeas/.test(docType)) {
        return "New York Criminal Procedure Law § 440.10";
      }
      if (/motion to dismiss/.test(docType)) {
        return "New York Civil Practice Law and Rules (CPLR) § 3211";
      }
      return "New York Civil Practice Law and Rules (CPLR)";
      
    case "TX":
      if (/post.?conviction|habeas/.test(docType)) {
        return "Texas Code of Criminal Procedure Article 11.07";
      }
      if (/motion to dismiss/.test(docType)) {
        return "Texas Rules of Civil Procedure Rule 91a";
      }
      return "Texas Rules of Civil Procedure";
      
    case "WA":
      if (/post.?conviction|habeas/.test(docType)) {
        return "Washington Criminal Rules (CrR) 7.8";
      }
      if (/motion to dismiss|summary judgment/.test(docType)) {
        return "Washington Civil Rules (CR) 12";
      }
      return "Washington Civil Rules (CR)";
      
    case "PA":
      if (/post.?conviction|habeas/.test(docType)) {
        return "Pennsylvania Post-Conviction Relief Act (PCRA)";
      }
      if (/motion to dismiss/.test(docType)) {
        return "Pennsylvania Rules of Civil Procedure Rule 1028";
      }
      return "Pennsylvania Rules of Civil Procedure";
      
    default:
      return "State Rules of Civil Procedure";
  }
}

// Helper function to get standard relief language by document type
function getStandardRelief(documentType) {
  const docType = documentType.toLowerCase();
  
  if (/post.?conviction|habeas|1473/.test(docType)) {
    return "Vacate the judgment of conviction and order a new trial, and/or grant an evidentiary hearing";
  }
  
  if (/summary judgment/.test(docType)) {
    return "Grant Defendant's Motion for Summary Judgment and dismiss the complaint with prejudice";
  }
  
  if (/motion to dismiss/.test(docType)) {
    return "Dismiss the complaint with prejudice";
  }
  
  if (/protective order/.test(docType)) {
    return "Grant the Motion for Protective Order as proposed";
  }
  
  if (/landlord.?tenant|eviction/.test(docType)) {
    return "Deny the requested eviction and grant such further relief as this Court deems just and proper";
  }
  
  return "Grant the relief requested and any other relief this Court deems just and proper";
}

module.exports = {
  detectJurisdictionConflict,
  formatStateCaption,
  formatPartyCaption,
  getStateLegalStandard,
  getStandardRelief,
  stateToDefaultCourt
};
