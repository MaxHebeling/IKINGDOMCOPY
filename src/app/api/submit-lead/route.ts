import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";
import { buildFromSubmit } from "@/lib/leads/helpers";

// ── Lead payload ─────────────────────────────────────────────────────────────
// Attribution fields are pre-wired and ready to populate once ads are running.
interface LeadPayload {
  // Form fields
  name: string;
  organization: string;
  website: string;
  revenue: string;
  challenge: string;
  // Attribution — populated automatically from URL params when ads are live
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

export async function POST(req: NextRequest) {
  let body: LeadPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // ── Validation ────────────────────────────────────────────────────────────
  if (!body.name?.trim() || !body.organization?.trim()) {
    return NextResponse.json({ error: "Name and organization are required" }, { status: 400 });
  }

  // ── Destination integration ───────────────────────────────────────────────
  // Replace this block with your preferred CRM / email service:
  //
  // Resend (email notification):
  //   import { Resend } from "resend";
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({ from: "...", to: "...", subject: "New Lead", ... });
  //
  // HubSpot CRM:
  //   await fetch("https://api.hubapi.com/crm/v3/objects/contacts", { method: "POST", ... });
  //
  // Notion database:
  //   await notion.pages.create({ parent: { database_id: "..." }, properties: { ... } });
  //
  // Google Sheets (via Apps Script webhook):
  //   await fetch(process.env.SHEETS_WEBHOOK_URL, { method: "POST", body: JSON.stringify(body) });
  // ─────────────────────────────────────────────────────────────────────────

  // Structured log — visible in Vercel Function logs immediately
  console.log("[iKingdom] New lead submission", {
    timestamp: new Date().toISOString(),
    name: body.name,
    organization: body.organization,
    website: body.website,
    revenue: body.revenue,
    challenge: body.challenge,
    attribution: {
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
      utm_content: body.utm_content,
      utm_term: body.utm_term,
      gclid: body.gclid,
      fbclid: body.fbclid,
    },
  });

  // Non-blocking DB insert — never fails the response
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  (async () => {
    try {
      const leadData = buildFromSubmit(body, ip);
      await insertLead(leadData);
    } catch (err) {
      console.error("[iKingdom] DB insert failed (submit-lead):", err);
    }
  })();

  return NextResponse.json({ success: true }, { status: 200 });
}
