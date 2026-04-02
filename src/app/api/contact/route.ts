import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { createLead } from "@/lib/leads/helpers";

const TO_EMAIL   = "executive@ikingdom.org";
const FROM_EMAIL = "iKingdom Sistema <noreply@ikingdom.org>";

interface ContactPayload {
  name:     string;
  company:  string;
  email:    string;
  needs:    string;
  budget:   string;
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_content?:  string;
  utm_term?:     string;
  gclid?:        string;
  fbclid?:       string;
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

function buildHtml(b: ContactPayload): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;color:rgba(212,175,55,0.45);font-size:11px;
                 letter-spacing:0.2em;text-transform:uppercase;width:150px;
                 vertical-align:top;border-bottom:1px solid rgba(212,175,55,0.1);">
        ${esc(label)}
      </td>
      <td style="padding:10px 0;color:#D4AF37;font-size:13px;font-weight:300;
                 vertical-align:top;border-bottom:1px solid rgba(212,175,55,0.1);
                 white-space:pre-wrap;">
        ${value ? esc(value) : "—"}
      </td>
    </tr>`;

  const attrKeys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"] as const;
  const attrRows = attrKeys
    .filter((k) => b[k])
    .map((k) => row(k, b[k] as string))
    .join("");

  return `
    <div style="font-family:'Space Grotesk',monospace;background:#000;
                color:#D4AF37;padding:40px;max-width:620px;margin:0 auto;">
      <div style="border-bottom:1px solid rgba(212,175,55,0.2);padding-bottom:20px;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.4em;
                  text-transform:uppercase;color:rgba(212,175,55,0.4);">
          DATA.INTAKE / NUEVA SOLICITUD
        </p>
        <h1 style="margin:0;font-size:18px;font-weight:600;letter-spacing:-0.02em;">
          ${esc(b.name || "Sin nombre")} — ${esc(b.company || "Sin empresa")}
        </h1>
      </div>

      <table style="width:100%;border-collapse:collapse;">
        ${row("Nombre",      b.name)}
        ${row("Empresa",     b.company)}
        ${row("Email",       b.email)}
        ${row("Necesidad",   b.needs)}
        ${row("Presupuesto", b.budget)}
      </table>

      ${attrRows ? `
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(212,175,55,0.12);">
        <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.35em;
                  text-transform:uppercase;color:rgba(212,175,55,0.3);">
          ATRIBUCIÓN
        </p>
        <table style="width:100%;border-collapse:collapse;">${attrRows}</table>
      </div>` : ""}

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(212,175,55,0.1);">
        <p style="margin:0;font-size:10px;color:rgba(212,175,55,0.25);letter-spacing:0.1em;">
          iKingdom · ikingdom.org · ${new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

export async function POST(req: NextRequest) {
  // Rate limit: 5 requests per minute per IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { ok } = rateLimit(ip, 5, 60_000);
  if (!ok) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en un minuto." }, { status: 429 });
  }

  // Basic size guard
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 20_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: ContactPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
  }

  if (!isValidEmail(body.email.trim())) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  // Truncate fields to prevent abuse
  const safe = {
    name:    String(body.name).slice(0, 200),
    company: String(body.company ?? "").slice(0, 200),
    email:   String(body.email).slice(0, 200),
    needs:   String(body.needs ?? "").slice(0, 2000),
    budget:  String(body.budget ?? "").slice(0, 200),
    utm_source:   body.utm_source   ? String(body.utm_source).slice(0, 200)   : undefined,
    utm_medium:   body.utm_medium   ? String(body.utm_medium).slice(0, 200)   : undefined,
    utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 200) : undefined,
    utm_content:  body.utm_content  ? String(body.utm_content).slice(0, 200)  : undefined,
    utm_term:     body.utm_term     ? String(body.utm_term).slice(0, 200)     : undefined,
    gclid:        body.gclid        ? String(body.gclid).slice(0, 200)        : undefined,
    fbclid:       body.fbclid       ? String(body.fbclid).slice(0, 200)       : undefined,
  };

  console.log("[iKingdom] Nueva solicitud", {
    timestamp: new Date().toISOString(),
    name:    safe.name,
    company: safe.company,
    email:   safe.email,
    needs:   safe.needs,
    budget:  safe.budget,
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
          subject:  `Nueva solicitud: ${safe.name} — ${safe.company || "Sin empresa"}`,
          html:     buildHtml(safe),
        }),
      });
      if (!res.ok) console.error("[iKingdom] Resend error:", await res.text());
    } catch (err) {
      console.error("[iKingdom] Email send failed:", err);
    }
  }

  // Non-blocking DB insert into canonical Supabase leads table
  (async () => {
    try {
      await createLead({
        full_name:           safe.name,
        company_name:        safe.company || undefined,
        email:               safe.email,
        project_description: safe.needs || undefined,
        budget_range:        safe.budget || undefined,
        source:              "contact-form",
        brand:               "ikingdom",
        origin_page:         "/",
        form_type:           "contact",
      });
    } catch (err) {
      console.error("[iKingdom] DB insert failed (contact):", err);
    }
  })();

  return NextResponse.json({ success: true }, { status: 200 });
}
