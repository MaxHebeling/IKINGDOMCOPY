// iKingdom-specific lead insight — local enhancement, display-only.
// Uses the canonical Lead type from lib/leads/helpers.

import type { Lead } from "@/lib/leads/helpers";
import { scoreLead } from "@/lib/ikingdom/market-rules";

export interface LeadInsight {
  priority: "hot" | "warm" | "cold";
  priorityLabel: string;
  score: number;
  nextAction: string;
  summary: string;
}

export function getLeadInsight(lead: Lead): LeadInsight {
  const score = scoreLead({
    source:              lead.source,
    main_service:        lead.main_service,
    budget_range:        lead.budget_range,
    timeline:            lead.timeline,
    whatsapp:            lead.whatsapp,
    project_description: lead.project_description,
    ideal_client:        lead.ideal_client,
  });

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
  if (lead.main_service)        parts.push(`Servicio: ${lead.main_service}`);
  if (lead.budget_range)        parts.push(`Budget: ${lead.budget_range}`);
  if (lead.timeline)            parts.push(`Timeline: ${lead.timeline}`);
  if (lead.project_description) parts.push(`Proyecto: ${lead.project_description.slice(0, 80)}${lead.project_description.length > 80 ? "…" : ""}`);

  return {
    priority,
    priorityLabel,
    score,
    nextAction,
    summary: parts.join(" · ") || "Sin información adicional",
  };
}
