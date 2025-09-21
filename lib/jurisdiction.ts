// lib/jurisdiction.ts - Single source of truth for all 50 states + DC
export type CourtContext = {
  state?: string;            // e.g., "CA"
  county?: string;           // e.g., "Los Angeles"
  parish?: string;           // e.g., "Orleans" (Louisiana)
  city?: string;             // e.g., "New York City"
  judicialDistrict?: string; // e.g., "19th" (Louisiana)
  circuit?: string;          // e.g., "11th" (Florida)
  division?: string;         // e.g., "Law" (New Jersey)
  unit?: string;             // e.g., "Civil" (Vermont)
  courtName?: string;        // Override if already known
  caseNumber?: string;
  petitioner?: string;
  respondent?: string;
  judge?: string;
  charges?: string;
  convictionDate?: string;
  sentencingDate?: string;
};

// Jurisdiction conflict detection
export function detectJurisdictionConflict(input: {
  statuteRefs?: string[]; 
  forumHints?: string[];
}): string[] {
  const issues: string[] = [];
  const hasPC1473 = input.statuteRefs?.some(s => /1473\b/.test(s)) ?? false;
  const saysFederal = input.forumHints?.some(h => /federal|habeas.*(§\s*2254|2255)|ninth circuit/i.test(h)) ?? false;
  if (hasPC1473 && saysFederal) issues.push("California Penal Code §1473 (state) conflicts with federal habeas indicators.");
  return issues;
}

// Enhanced state-to-court mapping with all special cases
const stateToDefaultCourt = (ctx: CourtContext): string => {
  const { state, county, parish, city, judicialDistrict, circuit, division, unit } = ctx;
  
  if (!state) return "STATE COURT";

  switch (state.toUpperCase()) {
    // ALABAMA
    case "AL":
      return county
        ? `STATE OF ALABAMA
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF ALABAMA
CIRCUIT COURT`;

    // ALASKA
    case "AK":
      return county
        ? `STATE OF ALASKA
SUPERIOR COURT
${county.toUpperCase()} JUDICIAL DISTRICT`
        : `STATE OF ALASKA
SUPERIOR COURT`;

    // ARIZONA
    case "AZ":
      return county
        ? `STATE OF ARIZONA
SUPERIOR COURT OF ARIZONA
IN AND FOR THE COUNTY OF ${county.toUpperCase()}`
        : `STATE OF ARIZONA
SUPERIOR COURT OF ARIZONA`;

    // ARKANSAS
    case "AR":
      return county
        ? `STATE OF ARKANSAS
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF ARKANSAS
CIRCUIT COURT`;

    // CALIFORNIA
    case "CA":
      return county
        ? `SUPERIOR COURT OF THE STATE OF CALIFORNIA
IN AND FOR THE COUNTY OF ${county.toUpperCase()}`
        : `SUPERIOR COURT OF THE STATE OF CALIFORNIA`;

    // COLORADO
    case "CO":
      return county
        ? `STATE OF COLORADO
DISTRICT COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF COLORADO
DISTRICT COURT`;

    // CONNECTICUT
    case "CT":
      return county
        ? `STATE OF CONNECTICUT
SUPERIOR COURT
${county.toUpperCase()} JUDICIAL DISTRICT`
        : `STATE OF CONNECTICUT
SUPERIOR COURT`;

    // DELAWARE
    case "DE":
      return county
        ? `STATE OF DELAWARE
SUPERIOR COURT OF THE STATE OF DELAWARE
${county.toUpperCase()} COUNTY`
        : `STATE OF DELAWARE
SUPERIOR COURT OF THE STATE OF DELAWARE`;

    // DISTRICT OF COLUMBIA
    case "DC":
      return `DISTRICT OF COLUMBIA
SUPERIOR COURT OF THE DISTRICT OF COLUMBIA`;

    // FLORIDA
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

    // GEORGIA
    case "GA":
      return county
        ? `STATE OF GEORGIA
SUPERIOR COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF GEORGIA
SUPERIOR COURT`;

    // HAWAII
    case "HI":
      return county
        ? `STATE OF HAWAII
CIRCUIT COURT OF THE ${county.toUpperCase()} CIRCUIT`
        : `STATE OF HAWAII
CIRCUIT COURT`;

    // IDAHO
    case "ID":
      return county
        ? `STATE OF IDAHO
DISTRICT COURT OF THE ${county.toUpperCase()} JUDICIAL DISTRICT`
        : `STATE OF IDAHO
DISTRICT COURT`;

    // ILLINOIS
    case "IL":
      return county
        ? `STATE OF ILLINOIS
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF ILLINOIS
CIRCUIT COURT`;

    // INDIANA
    case "IN":
      return county
        ? `STATE OF INDIANA
SUPERIOR COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF INDIANA
SUPERIOR COURT`;

    // IOWA
    case "IA":
      return county
        ? `STATE OF IOWA
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF IOWA
DISTRICT COURT`;

    // KANSAS
    case "KS":
      return county
        ? `STATE OF KANSAS
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF KANSAS
DISTRICT COURT`;

    // KENTUCKY
    case "KY":
      return county
        ? `COMMONWEALTH OF KENTUCKY
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `COMMONWEALTH OF KENTUCKY
CIRCUIT COURT`;

    // LOUISIANA - Special handling for parishes and judicial districts
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

    // MAINE
    case "ME":
      return county
        ? `STATE OF MAINE
SUPERIOR COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF MAINE
SUPERIOR COURT`;

    // MARYLAND
    case "MD":
      return county
        ? `STATE OF MARYLAND
CIRCUIT COURT FOR ${county.toUpperCase()} COUNTY`
        : `STATE OF MARYLAND
CIRCUIT COURT`;

    // MASSACHUSETTS
    case "MA":
      return county
        ? `COMMONWEALTH OF MASSACHUSETTS
SUPERIOR COURT DEPARTMENT
${county.toUpperCase()} COUNTY`
        : `COMMONWEALTH OF MASSACHUSETTS
SUPERIOR COURT DEPARTMENT`;

    // MICHIGAN
    case "MI":
      return county
        ? `STATE OF MICHIGAN
CIRCUIT COURT FOR THE COUNTY OF ${county.toUpperCase()}`
        : `STATE OF MICHIGAN
CIRCUIT COURT`;

    // MINNESOTA
    case "MN":
      return county
        ? `STATE OF MINNESOTA
DISTRICT COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF MINNESOTA
DISTRICT COURT`;

    // MISSISSIPPI
    case "MS":
      return county
        ? `STATE OF MISSISSIPPI
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF MISSISSIPPI
CIRCUIT COURT`;

    // MISSOURI
    case "MO":
      return county
        ? `STATE OF MISSOURI
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF MISSOURI
CIRCUIT COURT`;

    // MONTANA
    case "MT":
      return county
        ? `STATE OF MONTANA
DISTRICT COURT OF THE ${county.toUpperCase()} JUDICIAL DISTRICT`
        : `STATE OF MONTANA
DISTRICT COURT`;

    // NEBRASKA
    case "NE":
      return county
        ? `STATE OF NEBRASKA
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF NEBRASKA
DISTRICT COURT`;

    // NEVADA
    case "NV":
      return county
        ? `STATE OF NEVADA
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF NEVADA
DISTRICT COURT`;

    // NEW HAMPSHIRE
    case "NH":
      return county
        ? `STATE OF NEW HAMPSHIRE
SUPERIOR COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF NEW HAMPSHIRE
SUPERIOR COURT`;

    // NEW JERSEY - Special handling for Law/Chancery divisions
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

    // NEW MEXICO
    case "NM":
      return county
        ? `STATE OF NEW MEXICO
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF NEW MEXICO
DISTRICT COURT`;

    // NEW YORK - Special handling for Supreme Court
    case "NY":
      return county
        ? `SUPREME COURT OF THE STATE OF NEW YORK
COUNTY OF ${county.toUpperCase()}`
        : `SUPREME COURT OF THE STATE OF NEW YORK`;

    // NORTH CAROLINA
    case "NC":
      return county
        ? `STATE OF NORTH CAROLINA
SUPERIOR COURT DIVISION
${county.toUpperCase()} COUNTY`
        : `STATE OF NORTH CAROLINA
SUPERIOR COURT DIVISION`;

    // NORTH DAKOTA
    case "ND":
      return county
        ? `STATE OF NORTH DAKOTA
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF NORTH DAKOTA
DISTRICT COURT`;

    // OHIO - Special handling for Court of Common Pleas
    case "OH":
      return county
        ? `STATE OF OHIO
COURT OF COMMON PLEAS
${county.toUpperCase()} COUNTY`
        : `STATE OF OHIO
COURT OF COMMON PLEAS`;

    // OKLAHOMA
    case "OK":
      return county
        ? `STATE OF OKLAHOMA
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF OKLAHOMA
DISTRICT COURT`;

    // OREGON
    case "OR":
      return county
        ? `STATE OF OREGON
CIRCUIT COURT OF THE STATE OF OREGON
FOR THE COUNTY OF ${county.toUpperCase()}`
        : `STATE OF OREGON
CIRCUIT COURT OF THE STATE OF OREGON`;

    // PENNSYLVANIA - Special handling for Court of Common Pleas
    case "PA":
      return county
        ? `COMMONWEALTH OF PENNSYLVANIA
COURT OF COMMON PLEAS OF ${county.toUpperCase()} COUNTY`
        : `COMMONWEALTH OF PENNSYLVANIA
COURT OF COMMON PLEAS`;

    // RHODE ISLAND
    case "RI":
      return county
        ? `STATE OF RHODE ISLAND
SUPERIOR COURT
${county.toUpperCase()} COUNTY`
        : `STATE OF RHODE ISLAND
SUPERIOR COURT`;

    // SOUTH CAROLINA - Special handling for Court of Common Pleas
    case "SC":
      return county
        ? `STATE OF SOUTH CAROLINA
COURT OF COMMON PLEAS
${county.toUpperCase()} COUNTY`
        : `STATE OF SOUTH CAROLINA
COURT OF COMMON PLEAS`;

    // SOUTH DAKOTA
    case "SD":
      return county
        ? `STATE OF SOUTH DAKOTA
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF SOUTH DAKOTA
CIRCUIT COURT`;

    // TENNESSEE
    case "TN":
      return county
        ? `STATE OF TENNESSEE
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF TENNESSEE
CIRCUIT COURT`;

    // TEXAS
    case "TX":
      return county
        ? `IN THE DISTRICT COURT OF ${county.toUpperCase()} COUNTY, TEXAS`
        : `DISTRICT COURT OF TEXAS`;

    // UTAH
    case "UT":
      return county
        ? `STATE OF UTAH
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF UTAH
DISTRICT COURT`;

    // VERMONT - Special handling for units/divisions
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

    // VIRGINIA
    case "VA":
      return county
        ? `COMMONWEALTH OF VIRGINIA
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `COMMONWEALTH OF VIRGINIA
CIRCUIT COURT`;

    // WASHINGTON
    case "WA":
      return county
        ? `SUPERIOR COURT OF WASHINGTON
IN AND FOR THE COUNTY OF ${county.toUpperCase()}`
        : `SUPERIOR COURT OF WASHINGTON`;

    // WEST VIRGINIA
    case "WV":
      return county
        ? `STATE OF WEST VIRGINIA
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF WEST VIRGINIA
CIRCUIT COURT`;

    // WISCONSIN
    case "WI":
      return county
        ? `STATE OF WISCONSIN
CIRCUIT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF WISCONSIN
CIRCUIT COURT`;

    // WYOMING
    case "WY":
      return county
        ? `STATE OF WYOMING
DISTRICT COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF WYOMING
DISTRICT COURT`;

    // FALLBACK
    default:
      return county
        ? `STATE OF ${state.toUpperCase()}
COURT OF ${county.toUpperCase()} COUNTY`
        : `STATE OF ${state.toUpperCase()}
COURT`;
  }
};

export function formatStateCaption(ctx: CourtContext): string {
  // If upstream provided a fully formed court name, prefer it
  if (ctx.courtName && ctx.courtName.trim().length > 0) {
    return ctx.courtName.trim();
  }

  return stateToDefaultCourt(ctx);
}

export function formatPartyCaption(ctx: CourtContext): string {
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
export function getStateLegalStandard(state: string, documentType: string): string {
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
export function getStandardRelief(documentType: string): string {
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
