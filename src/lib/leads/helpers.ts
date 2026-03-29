import { createHash } from "crypto";
import type { InsertLeadInput } from "@/lib/db";
import { scoreLead, isQualified } from "@/lib/ikingdom/market-rules";

// ── Utilities ─────────────────────────────────────────────────────────────────

export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

// ── Builders ──────────────────────────────────────────────────────────────────

interface ContactBody {
  name: string; company?: string; email: string;
  needs?: string; budget?: string;
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string;
  gclid?: string; fbclid?: string;
}

export function buildFromContact(body: ContactBody, ip: string): InsertLeadInput {
  const data: InsertLeadInput = {
    source:      "contact",
    company_id:  "ikingdom",
    name:        body.name,
    email:       body.email,
    company:     body.company,
    needs:       body.needs,
    budget:      body.budget,
    utm_source:  body.utm_source,
    utm_medium:  body.utm_medium,
    utm_campaign: body.utm_campaign,
    utm_content: body.utm_content,
    utm_term:    body.utm_term,
    gclid:       body.gclid,
    fbclid:      body.fbclid,
    ip_hash:     hashIp(ip),
    raw_payload: body as Record<string, unknown>,
  };
  data.score     = scoreLead(data);
  data.qualified = isQualified(data.score);
  return data;
}

interface FitBody {
  fullName: string; company: string; email: string;
  phone?: string; website?: string; instagram?: string;
  businessDescription?: string; currentOffer?: string;
  avgTicket?: string; targetClient?: string; location?: string;
  mainChallenge?: string; triedBefore?: string;
  notWorking?: string; runningAds?: string; hasWebsite?: string;
  goals90Days?: string; serviceInterest?: string;
  budget?: string; timeline?: string;
  brandFeeling?: string; visualReferences?: string;
  tonePreferences?: string; inspirationLinks?: string;
  notes?: string; consent?: boolean;
}

export function buildFromFit(body: FitBody, ip: string): InsertLeadInput {
  const data: InsertLeadInput = {
    source:              "fit-intake",
    company_id:          "ikingdom",
    name:                body.fullName,
    email:               body.email,
    company:             body.company,
    phone:               body.phone,
    website:             body.website,
    instagram:           body.instagram,
    business_description: body.businessDescription,
    current_offer:       body.currentOffer,
    avg_ticket:          body.avgTicket,
    target_client:       body.targetClient,
    location:            body.location,
    main_challenge:      body.mainChallenge,
    tried_before:        body.triedBefore,
    not_working:         body.notWorking,
    running_ads:         body.runningAds === "true" || body.runningAds === "yes" || undefined,
    has_website:         body.hasWebsite  === "true" || body.hasWebsite  === "yes" || undefined,
    goals_90_days:       body.goals90Days,
    service_interest:    body.serviceInterest,
    budget:              body.budget,
    timeline:            body.timeline,
    brand_feeling:       body.brandFeeling,
    visual_references:   body.visualReferences,
    tone_preferences:    body.tonePreferences,
    inspiration_links:   body.inspirationLinks,
    notes:               body.notes,
    consent:             body.consent === true,
    ip_hash:             hashIp(ip),
    raw_payload:         body as Record<string, unknown>,
  };
  data.score     = scoreLead(data);
  data.qualified = isQualified(data.score);
  return data;
}

interface SubmitBody {
  name: string; organization: string;
  website?: string; revenue?: string; challenge?: string;
  utm_source?: string; utm_medium?: string; utm_campaign?: string;
  utm_content?: string; utm_term?: string;
  gclid?: string; fbclid?: string;
}

export function buildFromSubmit(body: SubmitBody, ip: string): InsertLeadInput {
  const data: InsertLeadInput = {
    source:      "submit-lead",
    company_id:  "ikingdom",
    name:        body.name,
    email:       "", // submit-lead doesn't collect email — set placeholder
    company:     body.organization,
    website:     body.website,
    revenue:     body.revenue,
    main_challenge: body.challenge,
    utm_source:  body.utm_source,
    utm_medium:  body.utm_medium,
    utm_campaign: body.utm_campaign,
    utm_content: body.utm_content,
    utm_term:    body.utm_term,
    gclid:       body.gclid,
    fbclid:      body.fbclid,
    ip_hash:     hashIp(ip),
    raw_payload: body as Record<string, unknown>,
  };
  data.score     = scoreLead(data);
  data.qualified = isQualified(data.score);
  return data;
}
