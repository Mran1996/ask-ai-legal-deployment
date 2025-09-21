// lib/jurisdiction-switch.ts
export type JurisdictionKey = "WA" | "CA" | "NY" | "TX" | "FL" | "IL" | "PA" | "OH" | "GA" | "MI";

export type JurisdictionRule = {
  caption: string;
  mainAuthority: string;   // statute or rule used for state post-conviction relief
  sampleRefs: string[];    // safe, minimal references; MCP remains source of truth
};

export const JURISDICTION_SWITCH: Record<JurisdictionKey, JurisdictionRule> = {
  WA: {
    caption: "IN THE SUPERIOR COURT OF THE STATE OF WASHINGTON\nIN AND FOR THE COUNTY OF [COUNTY]",
    mainAuthority: "CrR 7.8",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  CA: {
    caption: "SUPERIOR COURT OF THE STATE OF CALIFORNIA\nCOUNTY OF [COUNTY]",
    mainAuthority: "Cal. Penal Code § 1473",
    sampleRefs: ["People v. Ledesma, 43 Cal.3d 171 (1987)"]
  },
  NY: {
    caption: "SUPREME COURT OF THE STATE OF NEW YORK\nCOUNTY OF [COUNTY]",
    mainAuthority: "CPL § 440.10",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  TX: {
    caption: "IN THE [JUDICIAL DISTRICT] DISTRICT COURT OF [COUNTY] COUNTY, TEXAS",
    mainAuthority: "Tex. Code Crim. Proc. art. 11.07",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  FL: {
    caption: "IN THE CIRCUIT COURT OF THE [JUDICIAL CIRCUIT] IN AND FOR [COUNTY] COUNTY, FLORIDA",
    mainAuthority: "Fla. R. Crim. P. 3.850",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  IL: {
    caption: "IN THE CIRCUIT COURT OF [COUNTY] COUNTY, ILLINOIS",
    mainAuthority: "725 ILCS 5/122‑1 (Post‑Conviction Hearing Act)",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  PA: {
    caption: "IN THE COURT OF COMMON PLEAS OF [COUNTY] COUNTY, PENNSYLVANIA",
    mainAuthority: "42 Pa.C.S. § 9541 et seq. (PCRA)",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  OH: {
    caption: "IN THE COURT OF COMMON PLEAS, [COUNTY] COUNTY, OHIO",
    mainAuthority: "Ohio Rev. Code § 2953.21",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  GA: {
    caption: "IN THE SUPERIOR COURT OF [COUNTY] COUNTY, STATE OF GEORGIA",
    mainAuthority: "O.C.G.A. § 9‑14‑40 et seq.",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  },
  MI: {
    caption: "IN THE [JUDICIAL CIRCUIT] CIRCUIT COURT FOR THE COUNTY OF [COUNTY], STATE OF MICHIGAN",
    mainAuthority: "MCR 6.500 et seq.",
    sampleRefs: ["Strickland v. Washington, 466 U.S. 668 (1984)"]
  }
};

export function getJurisdictionRule(state: JurisdictionKey) {
  return JURISDICTION_SWITCH[state];
}
