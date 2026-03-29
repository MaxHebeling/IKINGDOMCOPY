import type { LeadRow } from "@/lib/db";

export interface LeadInsight {
  priority: "hot" | "warm" | "cold";
  priorityLabel: string;
  nextAction: string;
  summary: string;
}

export function getLeadInsight(lead: LeadRow): LeadInsight {
  const score = lead.score ?? 0;

  let priority: LeadInsight["priority"];
  let priorityLabel: string;
  let nextAction: string;

  if (score >= 60) {
    priority      = "hot";
    priorityLabel = "HOT";
    nextAction    = "Llamar en menos de 24 h — alta intención de compra detectada";
  } else if (score >= 35) {
    priority      = "warm";
    priorityLabel = "WARM";
    nextAction    = "Enviar propuesta de descubrimiento en los próximos 3 días";
  } else {
    priority      = "cold";
    priorityLabel = "COLD";
    nextAction    = "Añadir a secuencia de nurturing por email";
  }

  const parts: string[] = [];
  if (lead.service_interest) parts.push(`Interés: ${lead.service_interest}`);
  if (lead.budget)           parts.push(`Budget: ${lead.budget}`);
  if (lead.timeline)         parts.push(`Timeline: ${lead.timeline}`);
  if (lead.main_challenge)   parts.push(`Reto: ${lead.main_challenge.slice(0, 80)}${lead.main_challenge.length > 80 ? "…" : ""}`);

  return {
    priority,
    priorityLabel,
    nextAction,
    summary: parts.join(" · ") || "Sin información adicional",
  };
}
