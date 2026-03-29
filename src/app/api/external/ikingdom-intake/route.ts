import { NextRequest, NextResponse } from "next/server";
import { insertLead } from "@/lib/db";
import { scoreLead, isQualified } from "@/lib/ikingdom/market-rules";
import { hashIp } from "@/lib/leads/helpers";
import type { InsertLeadInput } from "@/lib/db";

// External intake — authenticated with INTAKE_API_KEY
// Accepts lead payloads from Zapier, webhooks, partner forms, etc.

export async function POST(req: NextRequest) {
  // Auth: Bearer INTAKE_API_KEY
  const INTAKE_API_KEY = process.env.INTAKE_API_KEY;
  if (!INTAKE_API_KEY) {
    return NextResponse.json({ error: "Intake not configured" }, { status: 503 });
  }
  const auth = req.headers.get("authorization") ?? "";
  if (auth !== `Bearer ${INTAKE_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 50_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  const data: InsertLeadInput = {
    source:               "external",
    company_id:           String(body.company_id ?? "ikingdom").slice(0, 50),
    name:                 body.name    ? String(body.name).slice(0, 200)    : undefined,
    email:                email.slice(0, 200),
    company:              body.company ? String(body.company).slice(0, 200) : undefined,
    phone:                body.phone   ? String(body.phone).slice(0, 50)    : undefined,
    website:              body.website ? String(body.website).slice(0, 300) : undefined,
    service_interest:     body.service_interest ? String(body.service_interest).slice(0, 200) : undefined,
    budget:               body.budget    ? String(body.budget).slice(0, 200)    : undefined,
    timeline:             body.timeline  ? String(body.timeline).slice(0, 200)  : undefined,
    main_challenge:       body.challenge ? String(body.challenge).slice(0, 2000) : undefined,
    notes:                body.notes     ? String(body.notes).slice(0, 2000)     : undefined,
    utm_source:           body.utm_source   ? String(body.utm_source).slice(0, 200)   : undefined,
    utm_medium:           body.utm_medium   ? String(body.utm_medium).slice(0, 200)   : undefined,
    utm_campaign:         body.utm_campaign ? String(body.utm_campaign).slice(0, 200) : undefined,
    utm_term:             body.utm_term     ? String(body.utm_term).slice(0, 200)     : undefined,
    utm_content:          body.utm_content  ? String(body.utm_content).slice(0, 200)  : undefined,
    gclid:                body.gclid  ? String(body.gclid).slice(0, 500)  : undefined,
    fbclid:               body.fbclid ? String(body.fbclid).slice(0, 500) : undefined,
    ip_hash:              hashIp(ip),
    raw_payload:          body,
  };

  data.score     = scoreLead(data);
  data.qualified = isQualified(data.score);

  try {
    const id = await insertLead(data);
    console.log("[iKingdom/external] Lead inserted", { id, email, score: data.score });
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err) {
    console.error("[iKingdom/external] DB insert failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
