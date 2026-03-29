import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL   = "executive@ikingdom.org";
const FROM_EMAIL = "iKingdom Sistema <noreply@ikingdom.org>";

interface FitPayload {
  fullName: string; company: string; email: string;
  phone: string; website: string; instagram: string;
  businessDescription: string; currentOffer: string;
  avgTicket: string; targetClient: string; location: string;
  mainChallenge: string; triedBefore: string;
  notWorking: string; runningAds: string; hasWebsite: string;
  goals90Days: string; serviceInterest: string;
  budget: string; timeline: string;
  brandFeeling: string; visualReferences: string;
  tonePreferences: string; inspirationLinks: string;
  notes: string; consent: boolean;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

function str(v: unknown, max = 500): string {
  return String(v ?? "").slice(0, max);
}

function row(label: string, value: string | boolean) {
  const display = typeof value === "boolean"
    ? (value ? "Sí" : "No")
    : (value ? esc(value) : "—");
  return `
    <tr>
      <td style="padding:8px 0;color:rgba(100,160,255,0.5);font-size:10px;
                 letter-spacing:0.18em;text-transform:uppercase;width:170px;
                 vertical-align:top;border-bottom:1px solid rgba(100,160,255,0.08);">
        ${esc(label)}
      </td>
      <td style="padding:8px 0;color:#B4D2FF;font-size:13px;font-weight:300;
                 vertical-align:top;border-bottom:1px solid rgba(100,160,255,0.08);
                 white-space:pre-wrap;">
        ${display}
      </td>
    </tr>`;
}

function section(title: string, rows: string) {
  return `
    <div style="margin-bottom:28px;">
      <p style="margin:0 0 10px;font-size:9px;letter-spacing:0.38em;
                text-transform:uppercase;color:rgba(100,160,255,0.35);">
        ${esc(title)}
      </p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
}

function buildHtml(b: FitPayload): string {
  return `
    <div style="font-family:'Space Grotesk',monospace;background:#080F1A;
                color:#B4D2FF;padding:40px;max-width:680px;margin:0 auto;">
      <div style="border-bottom:1px solid rgba(100,160,255,0.15);
                  padding-bottom:20px;margin-bottom:32px;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.4em;
                  text-transform:uppercase;color:rgba(100,160,255,0.35);">
          FIT.INTAKE / NUEVA SOLICITUD ESTRATÉGICA
        </p>
        <h1 style="margin:0;font-size:20px;font-weight:600;
                   letter-spacing:-0.02em;color:#B4D2FF;">
          ${esc(b.fullName || "Sin nombre")} — ${esc(b.company || "Sin empresa")}
        </h1>
        <p style="margin:6px 0 0;font-size:12px;color:rgba(100,160,255,0.5);">
          ${esc(b.email)}${b.phone ? " · " + esc(b.phone) : ""}
        </p>
      </div>

      ${section("01 · Contacto",
        row("Nombre",    b.fullName) +
        row("Empresa",   b.company) +
        row("Email",     b.email) +
        row("Teléfono",  b.phone) +
        row("Website",   b.website) +
        row("Instagram", b.instagram)
      )}

      ${section("02 · Negocio",
        row("Descripción",    b.businessDescription) +
        row("Oferta actual",  b.currentOffer) +
        row("Ticket prom.",   b.avgTicket) +
        row("Cliente ideal",  b.targetClient) +
        row("Ubicación",      b.location)
      )}

      ${section("03 · Situación",
        row("Reto principal",  b.mainChallenge) +
        row("Lo intentado",    b.triedBefore) +
        row("Qué no funciona", b.notWorking) +
        row("¿Corre ads?",     b.runningAds) +
        row("¿Tiene web?",     b.hasWebsite)
      )}

      ${section("04 · Objetivos",
        row("Meta 90 días",    b.goals90Days) +
        row("Servicio inter.", b.serviceInterest) +
        row("Presupuesto",     b.budget) +
        row("Timeline",        b.timeline)
      )}

      ${section("05 · Marca",
        row("Sensación visual",  b.brandFeeling) +
        row("Referencias vis.",  b.visualReferences) +
        row("Tono preferido",    b.tonePreferences) +
        row("Links inspiración", b.inspirationLinks)
      )}

      ${section("06 · Cierre",
        row("Notas adicionales", b.notes) +
        row("Consentimiento",    b.consent)
      )}

      <div style="margin-top:32px;padding-top:16px;
                  border-top:1px solid rgba(100,160,255,0.08);">
        <p style="margin:0;font-size:10px;color:rgba(100,160,255,0.2);
                  letter-spacing:0.1em;">
          iKingdom · ikingdom.org · ${new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

export async function POST(req: NextRequest) {
  // Basic size guard
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 50_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: FitPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.fullName?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
  }

  if (!isValidEmail(body.email.trim())) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // Sanitize and truncate all fields
  const safe: FitPayload = {
    fullName:            str(body.fullName, 200),
    company:             str(body.company, 200),
    email:               str(body.email, 200),
    phone:               str(body.phone, 50),
    website:             str(body.website, 300),
    instagram:           str(body.instagram, 200),
    businessDescription: str(body.businessDescription, 2000),
    currentOffer:        str(body.currentOffer, 1000),
    avgTicket:           str(body.avgTicket, 200),
    targetClient:        str(body.targetClient, 1000),
    location:            str(body.location, 200),
    mainChallenge:       str(body.mainChallenge, 2000),
    triedBefore:         str(body.triedBefore, 1000),
    notWorking:          str(body.notWorking, 1000),
    runningAds:          str(body.runningAds, 200),
    hasWebsite:          str(body.hasWebsite, 200),
    goals90Days:         str(body.goals90Days, 2000),
    serviceInterest:     str(body.serviceInterest, 200),
    budget:              str(body.budget, 200),
    timeline:            str(body.timeline, 200),
    brandFeeling:        str(body.brandFeeling, 1000),
    visualReferences:    str(body.visualReferences, 1000),
    tonePreferences:     str(body.tonePreferences, 1000),
    inspirationLinks:    str(body.inspirationLinks, 1000),
    notes:               str(body.notes, 2000),
    consent:             body.consent === true,
  };

  console.log("[iKingdom/fit] Nueva solicitud estratégica", {
    timestamp:       new Date().toISOString(),
    fullName:        safe.fullName,
    company:         safe.company,
    email:           safe.email,
    serviceInterest: safe.serviceInterest,
    budget:          safe.budget,
    timeline:        safe.timeline,
  });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:     FROM_EMAIL,
          to:       [TO_EMAIL],
          reply_to: safe.email,
          subject:  `FIT Intake: ${safe.fullName} — ${safe.company || "Sin empresa"} · ${safe.serviceInterest || ""}`,
          html:     buildHtml(safe),
        }),
      });
      if (!res.ok) console.error("[iKingdom/fit] Resend error:", await res.text());
    } catch (err) {
      console.error("[iKingdom/fit] Email send failed:", err);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
