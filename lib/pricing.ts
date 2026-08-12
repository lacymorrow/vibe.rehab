export type TierKey = "quick_fix" | "full_rescue" | "complete_rehab";

export interface Tier {
  key: TierKey;
  name: string;
  price: number;
  priceLabel: string;
  description: string;
  features: string[];
  priceId: string | null;
  preset: string;
}

const readPriceId = (envValue: string | undefined): string | null => {
  if (!envValue || typeof envValue !== "string") return null;
  if (!envValue.startsWith("price_")) return null;
  return envValue;
};

export const TIERS: Record<TierKey, Tier> = {
  quick_fix: {
    key: "quick_fix",
    name: "Quick Fix",
    price: 299,
    priceLabel: "$299",
    description:
      "Something specific broke and you need it working. Give us the issue, we'll fix it and ship it back.",
    features: [
      "Root cause diagnosis",
      "Bug fixes or error resolution",
      "Tested and deployed",
      "1-week turnaround",
    ],
    priceId: readPriceId(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_QUICK_FIX),
    preset: "Quick Fix ($299): I have a specific bug or error I need resolved.",
  },
  full_rescue: {
    key: "full_rescue",
    name: "Full Rescue",
    price: 499,
    priceLabel: "$499",
    description:
      "Your AI project is half-built or broken across multiple areas. We clean up the mess and get it production-ready.",
    features: [
      "Full codebase audit",
      "Bug fixes across all problem areas",
      "Architecture cleanup",
      "Production deployment",
    ],
    priceId: readPriceId(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_FULL_RESCUE),
    preset:
      "Full Rescue ($499): My project has multiple broken areas and needs a full cleanup.",
  },
  complete_rehab: {
    key: "complete_rehab",
    name: "Complete Rehab",
    price: 799,
    priceLabel: "$799",
    description:
      "Large broken project with a lot of AI-generated spaghetti code. We rebuild what needs rebuilding and make it something you can actually maintain.",
    features: [
      "Full architecture review",
      "Selective rewrite where needed",
      "Security audit",
      "Production deployment",
    ],
    priceId: readPriceId(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_COMPLETE_REHAB),
    preset:
      "Complete Rehab ($799): My project is heavily broken and needs major reconstruction.",
  },
};

export const getAllowedPriceIds = (): string[] =>
  Object.values(TIERS)
    .map((t) => t.priceId)
    .filter((id): id is string => Boolean(id));
