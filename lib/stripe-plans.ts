export const PLANS = {
  LEGAL_SERVICE: "Legal AI Service",
} as const;

export type PlanName = typeof PLANS[keyof typeof PLANS];

export const PLAN_PRICES: Record<PlanName, string> = {
  [PLANS.LEGAL_SERVICE]: process.env.STRIPE_PRICE_ID || "price_1RifhKD8ZPcBhwZRYWFEQwjd",
};

export const PLAN_DETAILS: Record<PlanName, {
  name: PlanName;
  price: number;
  features: string[];
}> = {
  [PLANS.LEGAL_SERVICE]: {
    name: PLANS.LEGAL_SERVICE,
    price: 59,
    features: [
      "AI-powered legal document generation",
      "Multiple document formats",
      "Professional legal assistance"
    ]
  }
}; 