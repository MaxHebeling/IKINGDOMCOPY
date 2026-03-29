// Canonical lead helpers — mirrored from hebeling-imperium-hub/lib/leads/helpers.ts
// Do NOT add custom fields here. Extend in lib/ikingdom/ for iKingdom-specific logic.

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getLeadBrandProfile, normalizeLeadBrand } from "./brand-config";

// Hardcoded org_id for Hebeling Imperium Group
export const ORG_ID = "4059832a-ff39-43e6-984f-d9e866dfb8a4";

// Create admin client that bypasses RLS
export function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Generate unique lead code in format: XX-YYYYMMDD-XXXX
 */
export async function generateLeadCode(brand?: string | null): Promise<string> {
  const today = new Date();
  const dateKey = today.toISOString().slice(0, 10).replace(/-/g, '');
  const brandProfile = getLeadBrandProfile(brand);

  const timestamp = Date.now() % 10000;
  const random = Math.floor(Math.random() * 9000) + 1000;
  const uniqueSuffix = ((timestamp + random) % 10000).toString().padStart(4, '0');

  return `${brandProfile.codePrefix}-${dateKey}-${uniqueSuffix}`;
}

export interface LeadPayload {
  // Required
  full_name: string;

  // Basic info
  company_name?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  city?: string;

  // Project details
  project_description?: string;
  organization_type?: string;
  website_url?: string;
  social_links?: string;
  main_goal?: string;
  expected_result?: string;
  main_service?: string;
  ideal_client?: string;

  // Branding
  has_logo?: boolean;
  has_brand_colors?: boolean;
  visual_style?: string;
  available_content?: string;
  reference_websites?: string;
  has_current_landing?: boolean;

  // Project scope
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  preferred_contact_method?: string;
  additional_notes?: string;

  // Tracking
  source?: string;
  brand?: string;
  origin_page?: string;
  form_type?: string;
}

export interface Lead {
  id: string;
  lead_code: string;
  org_id: string;
  full_name: string;
  company_name?: string;
  email?: string;
  whatsapp?: string;
  country?: string;
  city?: string;
  project_description?: string;
  organization_type?: string;
  website_url?: string;
  social_links?: string;
  main_goal?: string;
  expected_result?: string;
  main_service?: string;
  ideal_client?: string;
  has_logo?: boolean;
  has_brand_colors?: boolean;
  visual_style?: string;
  available_content?: string;
  reference_websites?: string;
  has_current_landing?: boolean;
  project_type?: string;
  budget_range?: string;
  timeline?: string;
  preferred_contact_method?: string;
  additional_notes?: string;
  source?: string;
  brand?: string;
  origin_page?: string;
  form_type?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new lead in the database
 */
export async function createLead(payload: LeadPayload): Promise<Lead> {
  const supabase = getAdminClient();
  const normalizedBrand = normalizeLeadBrand(payload.brand);

  const leadCode = await generateLeadCode(normalizedBrand);

  const { data: lead, error } = await supabase
    .from("leads")
    .insert({
      org_id: ORG_ID,
      lead_code: leadCode,
      full_name: payload.full_name,
      company_name: payload.company_name || null,
      email: payload.email || null,
      whatsapp: payload.whatsapp || null,
      country: payload.country || null,
      city: payload.city || null,
      project_description: payload.project_description || null,
      organization_type: payload.organization_type || null,
      website_url: payload.website_url || null,
      social_links: payload.social_links || null,
      main_goal: payload.main_goal || null,
      expected_result: payload.expected_result || null,
      main_service: payload.main_service || null,
      ideal_client: payload.ideal_client || null,
      has_logo: payload.has_logo ?? null,
      has_brand_colors: payload.has_brand_colors ?? null,
      visual_style: payload.visual_style || null,
      available_content: payload.available_content || null,
      reference_websites: payload.reference_websites || null,
      has_current_landing: payload.has_current_landing ?? null,
      project_type: payload.project_type || null,
      budget_range: payload.budget_range || null,
      timeline: payload.timeline || null,
      preferred_contact_method: payload.preferred_contact_method || null,
      additional_notes: payload.additional_notes || null,
      source: payload.source || "website",
      brand: normalizedBrand,
      origin_page: payload.origin_page || null,
      form_type: payload.form_type || null,
      status: "new_lead",
    })
    .select()
    .single();

  if (error) {
    console.error("Lead creation error:", error);
    throw new Error(`Failed to create lead: ${error.message}`);
  }

  return lead;
}

function normalizePhoneCandidate(value?: string | null): string {
  return (value || "").replace(/\D/g, "");
}

/**
 * Find the most recent lead for the same brand using email or WhatsApp.
 */
export async function findLeadByContact(params: {
  brand?: string | null;
  email?: string | null;
  whatsapp?: string | null;
}): Promise<Lead | null> {
  const supabase = getAdminClient();
  const normalizedBrand = normalizeLeadBrand(params.brand);
  const email = params.email?.trim().toLowerCase();
  const whatsapp = normalizePhoneCandidate(params.whatsapp);

  if (email) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("brand", normalizedBrand)
      .ilike("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Lead email lookup error:", error);
    } else if (data) {
      return data;
    }
  }

  if (!whatsapp) return null;

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("brand", normalizedBrand)
    .not("whatsapp", "is", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Lead WhatsApp lookup error:", error);
    return null;
  }

  return (
    data?.find((lead) => normalizePhoneCandidate(lead.whatsapp) === whatsapp) || null
  );
}

/**
 * Update an existing lead without overwriting fields with undefined.
 */
export async function updateLead(
  leadId: string,
  payload: Partial<LeadPayload> & { status?: string }
): Promise<Lead> {
  const supabase = getAdminClient();
  const updates: Record<string, string | boolean | null> = {};

  const assignString = (field: string, value?: string | null) => {
    if (value === undefined) return;
    updates[field] = value || null;
  };

  assignString("full_name", payload.full_name);
  assignString("company_name", payload.company_name);
  assignString("email", payload.email);
  assignString("whatsapp", payload.whatsapp);
  assignString("country", payload.country);
  assignString("city", payload.city);
  assignString("project_description", payload.project_description);
  assignString("organization_type", payload.organization_type);
  assignString("website_url", payload.website_url);
  assignString("social_links", payload.social_links);
  assignString("main_goal", payload.main_goal);
  assignString("expected_result", payload.expected_result);
  assignString("main_service", payload.main_service);
  assignString("ideal_client", payload.ideal_client);
  assignString("visual_style", payload.visual_style);
  assignString("available_content", payload.available_content);
  assignString("reference_websites", payload.reference_websites);
  assignString("project_type", payload.project_type);
  assignString("budget_range", payload.budget_range);
  assignString("timeline", payload.timeline);
  assignString("preferred_contact_method", payload.preferred_contact_method);
  assignString("additional_notes", payload.additional_notes);
  assignString("source", payload.source);
  assignString("brand", payload.brand ? normalizeLeadBrand(payload.brand) : undefined);
  assignString("origin_page", payload.origin_page);
  assignString("form_type", payload.form_type);
  if (payload.status !== undefined) updates.status = payload.status || null;

  const { data, error } = await supabase
    .from("leads")
    .update(updates)
    .eq("id", leadId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update lead: ${error.message}`);
  }

  return data;
}

export interface DealFromLead {
  id: string;
  lead_id: string;
  lead_code: string;
  title: string;
  pipeline: string;
  stage_id: string | null;
  status: string;
  owner: string;
}

/**
 * Create a deal linked to a lead
 */
export async function createDealFromLead(lead: Lead): Promise<DealFromLead | null> {
  const supabase = getAdminClient();
  const brandProfile = getLeadBrandProfile(lead.brand);

  const { data: stages } = await supabase
    .from("stages")
    .select("id")
    .or("name.eq.New,name.eq.Lead")
    .limit(1);

  const stageId = stages?.[0]?.id || null;

  const dealName = lead.company_name
    ? `${brandProfile.dealLabel} - ${lead.company_name}`
    : `${brandProfile.dealLabel} - ${lead.full_name}`;

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      org_id: ORG_ID,
      lead_id: lead.id,
      lead_code: lead.lead_code,
      title: dealName,
      pipeline: brandProfile.pipeline,
      stage_id: stageId,
      status: "open",
      owner: "max",
      value: 0,
      currency: "USD",
      source: lead.source || "website",
    })
    .select()
    .single();

  if (error) {
    console.error("Deal creation error:", error);
    return null;
  }

  return deal;
}

/**
 * Log activity for audit trail
 */
export async function logActivity(
  action: string,
  entity: string,
  entityId: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  const supabase = getAdminClient();

  await supabase.from("activity_logs").insert({
    org_id: ORG_ID,
    action,
    entity,
    entity_id: entityId,
    metadata: metadata || null,
  });
}
