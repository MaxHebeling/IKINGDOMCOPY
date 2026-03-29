// iKingdom brand & service configuration

export const BRAND = {
  name: "iKingdom",
  companyId: "ikingdom",
  email: "executive@ikingdom.org",
} as const;

export const SERVICES = [
  { id: "branding",       label: "Branding & Identidad",    baseScore: 15 },
  { id: "web",            label: "Web & Digital",           baseScore: 10 },
  { id: "ads",            label: "Ads & Performance",       baseScore: 20 },
  { id: "full-service",   label: "Full Service",            baseScore: 25 },
  { id: "consulting",     label: "Consultoría Estratégica", baseScore: 18 },
  { id: "content",        label: "Contenido & Social",      baseScore: 12 },
] as const;

export type ServiceId = (typeof SERVICES)[number]["id"];

// Budget tiers → score weight
export const BUDGET_WEIGHTS: Record<string, number> = {
  "menos de $2k":   0,
  "$2k-$5k":        5,
  "$5k-$10k":      15,
  "$10k-$25k":     25,
  "$25k-$50k":     35,
  "$50k+":         45,
  "más de $50k":   45,
};

// Timeline tiers → score weight
export const TIMELINE_WEIGHTS: Record<string, number> = {
  "inmediato":      20,
  "immediate":      20,
  "1-3 meses":      15,
  "1-3 months":     15,
  "3-6 meses":      10,
  "3-6 months":     10,
  "6-12 meses":      5,
  "6-12 months":     5,
  "más de 1 año":    2,
  "más de un año":   2,
};

export const QUALIFIED_THRESHOLD = 35;
