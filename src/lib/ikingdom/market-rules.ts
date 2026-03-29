import {
  SERVICES,
  BUDGET_WEIGHTS,
  TIMELINE_WEIGHTS,
  QUALIFIED_THRESHOLD,
} from "@/lib/leads/brand-config";
import type { InsertLeadInput } from "@/lib/db";

// ── Scoring ───────────────────────────────────────────────────────────────────

export function scoreLead(d: InsertLeadInput): number {
  let score = 0;

  // Source bonus — fit-intake signals highest intent
  if (d.source === "fit-intake")     score += 10;
  else if (d.source === "contact")   score += 5;
  else if (d.source === "external")  score += 5;

  // Service interest
  if (d.service_interest) {
    const key = d.service_interest.toLowerCase();
    const svc = SERVICES.find(
      (s) => key.includes(s.id) || key.includes(s.label.toLowerCase())
    );
    if (svc) score += svc.baseScore;
  }

  // Budget
  if (d.budget) {
    const key = d.budget.toLowerCase();
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
  if (d.phone)               score += 5;
  if (d.consent)             score += 3;
  if (d.running_ads)         score += 5;
  if (d.business_description && d.business_description.length > 100) score += 5;
  if (d.main_challenge      && d.main_challenge.length > 50)          score += 5;

  return Math.min(score, 100);
}

export function isQualified(score: number): boolean {
  return score >= QUALIFIED_THRESHOLD;
}
