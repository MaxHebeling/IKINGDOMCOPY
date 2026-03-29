import { sql } from "@vercel/postgres";

export { sql };

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LeadRow {
  id: string;
  source: string;
  company_id: string;
  name: string | null;
  email: string;
  company: string | null;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  business_description: string | null;
  current_offer: string | null;
  avg_ticket: string | null;
  target_client: string | null;
  location: string | null;
  main_challenge: string | null;
  tried_before: string | null;
  not_working: string | null;
  running_ads: boolean | null;
  has_website: boolean | null;
  goals_90_days: string | null;
  service_interest: string | null;
  budget: string | null;
  timeline: string | null;
  brand_feeling: string | null;
  visual_references: string | null;
  tone_preferences: string | null;
  inspiration_links: string | null;
  needs: string | null;
  revenue: string | null;
  notes: string | null;
  consent: boolean;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  score: number;
  qualified: boolean;
  status: string;
  ip_hash: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface InsertLeadInput {
  source: string;
  company_id?: string;
  name?: string;
  email: string;
  company?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  business_description?: string;
  current_offer?: string;
  avg_ticket?: string;
  target_client?: string;
  location?: string;
  main_challenge?: string;
  tried_before?: string;
  not_working?: string;
  running_ads?: boolean;
  has_website?: boolean;
  goals_90_days?: string;
  service_interest?: string;
  budget?: string;
  timeline?: string;
  brand_feeling?: string;
  visual_references?: string;
  tone_preferences?: string;
  inspiration_links?: string;
  needs?: string;
  revenue?: string;
  notes?: string;
  consent?: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  score?: number;
  qualified?: boolean;
  ip_hash?: string;
  raw_payload?: Record<string, unknown>;
}

// ── Insert ────────────────────────────────────────────────────────────────────

export async function insertLead(d: InsertLeadInput): Promise<string> {
  const { rows } = await sql`
    INSERT INTO leads (
      source, company_id, name, email, company, phone, website, instagram,
      business_description, current_offer, avg_ticket, target_client, location,
      main_challenge, tried_before, not_working, running_ads, has_website,
      goals_90_days, service_interest, budget, timeline,
      brand_feeling, visual_references, tone_preferences, inspiration_links,
      needs, revenue, notes, consent,
      utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, fbclid,
      score, qualified, ip_hash, raw_payload
    ) VALUES (
      ${d.source},
      ${d.company_id ?? "ikingdom"},
      ${d.name ?? null},
      ${d.email},
      ${d.company ?? null},
      ${d.phone ?? null},
      ${d.website ?? null},
      ${d.instagram ?? null},
      ${d.business_description ?? null},
      ${d.current_offer ?? null},
      ${d.avg_ticket ?? null},
      ${d.target_client ?? null},
      ${d.location ?? null},
      ${d.main_challenge ?? null},
      ${d.tried_before ?? null},
      ${d.not_working ?? null},
      ${d.running_ads ?? null},
      ${d.has_website ?? null},
      ${d.goals_90_days ?? null},
      ${d.service_interest ?? null},
      ${d.budget ?? null},
      ${d.timeline ?? null},
      ${d.brand_feeling ?? null},
      ${d.visual_references ?? null},
      ${d.tone_preferences ?? null},
      ${d.inspiration_links ?? null},
      ${d.needs ?? null},
      ${d.revenue ?? null},
      ${d.notes ?? null},
      ${d.consent ?? false},
      ${d.utm_source ?? null},
      ${d.utm_medium ?? null},
      ${d.utm_campaign ?? null},
      ${d.utm_term ?? null},
      ${d.utm_content ?? null},
      ${d.gclid ?? null},
      ${d.fbclid ?? null},
      ${d.score ?? 0},
      ${d.qualified ?? false},
      ${d.ip_hash ?? null},
      ${d.raw_payload ? JSON.stringify(d.raw_payload) : null}
    )
    RETURNING id
  `;
  return rows[0].id as string;
}
