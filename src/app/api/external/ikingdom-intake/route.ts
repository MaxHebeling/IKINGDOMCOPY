import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { createLead } from "@/lib/leads/helpers";

// External intake — authenticated with INTAKE_API_KEY (shared secret in header x-ikingdom-secret)
// Accepts lead payloads from Zapier, webhooks, partner forms.
// Pattern mirrors hebeling-imperium-hub/app/api/leads/briefs/route.ts

export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const configuredSecret = process.env.INTAKE_API_KEY?.trim();
  if (!configuredSecret) return true; // unconfigured = open (dev mode)
  const provided = request.headers.get("x-ikingdom-secret")?.trim();
  if (!provided) return false;
  const a = Buffer.from(configuredSecret, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 50_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const email = body.email ? String(body.email).trim() : undefined;
  const fullName = body.name ?? body.full_name ?? body.companyName ?? email ?? "Desconocido";

  if (!fullName) {
    return NextResponse.json({ error: "name or email is required" }, { status: 400 });
  }

  try {
    const lead = await createLead({
      full_name:           String(fullName).slice(0, 200),
      company_name:        body.company    ? String(body.company).slice(0, 200)    : undefined,
      email:               email,
      whatsapp:            body.phone      ? String(body.phone).slice(0, 50)       : undefined,
      website_url:         body.website    ? String(body.website).slice(0, 300)    : undefined,
      main_service:        body.service    ? String(body.service).slice(0, 200)    : undefined,
      budget_range:        body.budget     ? String(body.budget).slice(0, 200)     : undefined,
      timeline:            body.timeline   ? String(body.timeline).slice(0, 200)   : undefined,
      project_description: body.challenge  ? String(body.challenge).slice(0, 2000) : undefined,
      additional_notes:    body.notes      ? String(body.notes).slice(0, 2000)     : undefined,
      source:              "external",
      brand:               "ikingdom",
      form_type:           "external_intake",
    });

    console.log("[iKingdom/external] Lead created", { id: lead.id, lead_code: lead.lead_code });
    return NextResponse.json({ success: true, id: lead.id, leadCode: lead.lead_code }, { status: 201 });
  } catch (err) {
    console.error("[iKingdom/external] createLead failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
