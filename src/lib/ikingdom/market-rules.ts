// iKingdom-specific lead scoring — local enhancement, not duplicating canonical helpers.
// Operates on a simple scoring-friendly subset of lead fields.
// Score is display-only; it is NOT persisted to the canonical leads table.

export interface ScoringInput {
  source?: string;
  main_service?: string;
  budget_range?: string;
  timeline?: string;
  whatsapp?: string;
  project_description?: string;
  ideal_client?: string;
}

const SERVICE_WEIGHTS: Record<string, number> = {
  branding:     15,
  "identidad":  15,
  web:          10,
  landing:      10,
  ads:          20,
  performance:  20,
  "full":       25,
  "full-service": 25,
  consulting:   18,
  consultoria:  18,
  content:      12,
  contenido:    12,
};

const BUDGET_WEIGHTS: Record<string, number> = {
  "menos_500":  0,
  "500_1000":   5,
  "1000_2500":  10,
  "2500_5000":  18,
  "5000_10000": 28,
  "mas_10000":  40,
  // Free-text fallbacks
  "$5k":    15,
  "$10k":   25,
  "$25k":   35,
  "$50k":   45,
};

const TIMELINE_WEIGHTS: Record<string, number> = {
  "urgente":   20,
  "inmediato": 20,
  "pronto":    15,
  "1-3":       15,
  "normal":    10,
  "3-6":       10,
  "flexible":   5,
  "6-12":       5,
};

export const QUALIFIED_THRESHOLD = 35;

export function scoreLead(d: ScoringInput): number {
  let score = 0;

  // Source bonus
  if (d.source === "fit-intake" || d.source === "fit_intake") score += 10;
  else if (d.source === "contact-form" || d.source === "contact") score += 5;
  else if (d.source === "external") score += 5;

  // Service
  if (d.main_service) {
    const key = d.main_service.toLowerCase();
    for (const [pattern, pts] of Object.entries(SERVICE_WEIGHTS)) {
      if (key.includes(pattern)) { score += pts; break; }
    }
  }

  // Budget
  if (d.budget_range) {
    const key = d.budget_range.toLowerCase();
    for (const [pattern, pts] of Object.entries(BUDGET_WEIGHTS)) {
      if (key.includes(pattern)) { score += pts; break; }
    }
  }

  // Timeline
  if (d.timeline) {
    const key = d.timeline.toLowerCase();
    for (const [pattern, pts] of Object.entries(TIMELINE_WEIGHTS)) {
      if (key.includes(pattern)) { score += pts; break; }
    }
  }

  // Signal bonuses
  if (d.whatsapp)                                                    score += 5;
  if (d.project_description && d.project_description.length > 100)  score += 5;
  if (d.ideal_client && d.ideal_client.length > 30)                  score += 3;

  return Math.min(score, 100);
}

export function isQualified(score: number): boolean {
  return score >= QUALIFIED_THRESHOLD;
}
