export const PRODUCTS = {
  LEGAL_SERVICE: "Legal AI Service"
} as const;

export type ProductName = typeof PRODUCTS[keyof typeof PRODUCTS];

export const PRICE_MAP: Record<ProductName, string> = {
  [PRODUCTS.LEGAL_SERVICE]: process.env.STRIPE_PRICE_ID || "",
};

export const PRODUCT_DETAILS = {
  [PRODUCTS.LEGAL_SERVICE]: {
    name: PRODUCTS.LEGAL_SERVICE,
    price: 59,
    features: [
      "AI-powered legal document generation",
      "Multiple document formats",
      "Professional legal assistance"
    ]
  }
}; 