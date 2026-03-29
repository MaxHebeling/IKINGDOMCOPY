import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL   = "executive@ikingdom.org";
const FROM_EMAIL = "iKingdom Sistema <onboarding@resend.dev>";

interface FitPayload {
  // 1. Contact
  fullName: string; company: string; email: string;
  phone: string; website: string; instagram: string;
  // 2. Business
  businessDescription: string; currentOffer: string;
  avgTicket: string; targetClient: string; location: string;
  // 3. Situation
  mainChallenge: string; triedBefore: string;
  notWorking: string; runningAds: string; hasWebsite: string;
  // 4. Goals
  goals90Days: string; serviceInterest: string;
  budget: string; timeline: string;
  // 5. Brand
  brandFeeling: string; visualReferences: string;
  tonePreferences: string; inspirationLinks: string;
  // 6. Final
  notes: string; consent: boolean;
}

function row(label: string, value: string | boolean) {
  const display = typeof value === "boolean"
    ? (value ? "Sí" : "No")
    : (value || "—");
  return `
    <tr>
      <td style="padding:8px 0;color:rgba(100,160,255,0.5);font-size:10px;
                 letter-spacing:0.18em;text-transform:uppercase;width:170px;
                 vertical-align:top;border-bottom:1px solid rgba(100,160,255,0.08);">
        ${label}
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
        ${title}
      </p>
      <table style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
}

function buildHtml(b: FitPayload): string {
  return `
    <div style="font-family:'Space Grotesk',monospace;background:#080F1A;
                color:#B4D2FF;padding:40px;max-width:680px;margin:0 auto;">
      <!-- Header -->
      <div style="border-bottom:1px solid rgba(100,160,255,0.15);
                  padding-bottom:20px;margin-bottom:32px;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.4em;
                  text-transform:uppercase;color:rgba(100,160,255,0.35);">
          FIT.INTAKE / NUEVA SOLICITUD ESTRATÉGICA
        </p>
        <h1 style="margin:0;font-size:20px;font-weight:600;
                   letter-spacing:-0.02em;color:#B4D2FF;">
          ${b.fullName || "Sin nombre"} — ${b.company || "Sin empresa"}
        </h1>
        <p style="margin:6px 0 0;font-size:12px;color:rgba(100,160,255,0.5);">
          ${b.email}${b.phone ? " · " + b.phone : ""}
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
        row("Reto principal", b.mainChallenge) +
        row("Lo intentado",   b.triedBefore) +
        row("Qué no funciona",b.notWorking) +
        row("¿Corre ads?",    b.runningAds) +
        row("¿Tiene web?",    b.hasWebsite)
      )}

      ${section("04 · Objetivos",
        row("Meta 90 días",   b.goals90Days) +
        row("Servicio inter.",b.serviceInterest) +
        row("Presupuesto",    b.budget) +
        row("Timeline",       b.timeline)
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

      <!-- Footer -->
      <div style="margin-top:32px;padding-top:16px;
                  border-top:1px solid rgba(100,160,255,0.08);">
        <p style="margin:0;font-size:10px;color:rgba(100,160,255,0.2);
                  letter-spacing:0.1em;">
          iKingdom · ikingdom.agency · ${new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

export async function POST(req: NextRequest) {
  let body: FitPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.fullName?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
  }

  console.log("[iKingdom/fit] Nueva solicitud estratégica", {
    timestamp: new Date().toISOString(),
    fullName:        body.fullName,
    company:         body.company,
    email:           body.email,
    serviceInterest: body.serviceInterest,
    budget:          body.budget,
    timeline:        body.timeline,
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
          reply_to: body.email,
          subject:  `FIT Intake: ${body.fullName} — ${body.company || "Sin empresa"} · ${body.serviceInterest || ""}`,
          html:     buildHtml(body),
        }),
      });
      if (!res.ok) console.error("[iKingdom/fit] Resend error:", await res.text());
    } catch (err) {
      console.error("[iKingdom/fit] Email send failed:", err);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
