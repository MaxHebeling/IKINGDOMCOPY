import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL   = "executive@ikingdom.org";
const FROM_EMAIL = "iKingdom Sistema <onboarding@resend.dev>";

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

function buildHtml(b: ContactPayload): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;color:rgba(212,175,55,0.45);font-size:11px;
                 letter-spacing:0.2em;text-transform:uppercase;width:150px;
                 vertical-align:top;border-bottom:1px solid rgba(212,175,55,0.1);">
        ${label}
      </td>
      <td style="padding:10px 0;color:#D4AF37;font-size:13px;font-weight:300;
                 vertical-align:top;border-bottom:1px solid rgba(212,175,55,0.1);
                 white-space:pre-wrap;">
        ${value || "—"}
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
      <!-- Header -->
      <div style="border-bottom:1px solid rgba(212,175,55,0.2);padding-bottom:20px;margin-bottom:28px;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.4em;
                  text-transform:uppercase;color:rgba(212,175,55,0.4);">
          DATA.INTAKE / NUEVA SOLICITUD
        </p>
        <h1 style="margin:0;font-size:18px;font-weight:600;letter-spacing:-0.02em;">
          ${b.name || "Sin nombre"} — ${b.company || "Sin empresa"}
        </h1>
      </div>

      <!-- Fields table -->
      <table style="width:100%;border-collapse:collapse;">
        ${row("Nombre",      b.name)}
        ${row("Empresa",     b.company)}
        ${row("Email",       b.email)}
        ${row("Necesidad",   b.needs)}
        ${row("Presupuesto", b.budget)}
      </table>

      ${attrRows ? `
      <!-- Attribution -->
      <div style="margin-top:28px;padding-top:20px;border-top:1px solid rgba(212,175,55,0.12);">
        <p style="margin:0 0 12px;font-size:9px;letter-spacing:0.35em;
                  text-transform:uppercase;color:rgba(212,175,55,0.3);">
          ATRIBUCIÓN
        </p>
        <table style="width:100%;border-collapse:collapse;">${attrRows}</table>
      </div>` : ""}

      <!-- Footer -->
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(212,175,55,0.1);">
        <p style="margin:0;font-size:10px;color:rgba(212,175,55,0.25);letter-spacing:0.1em;">
          iKingdom · ikingdom.agency · ${new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Nombre y email requeridos" }, { status: 400 });
  }

  // Always log — visible in Vercel Function logs immediately
  console.log("[iKingdom] Nueva solicitud", {
    timestamp: new Date().toISOString(),
    name:    body.name,
    company: body.company,
    email:   body.email,
    needs:   body.needs,
    budget:  body.budget,
  });

  // Send via Resend when API key is present
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
          subject:  `Nueva solicitud: ${body.name} — ${body.company || "Sin empresa"}`,
          html:     buildHtml(body),
        }),
      });
      if (!res.ok) console.error("[iKingdom] Resend error:", await res.text());
    } catch (err) {
      console.error("[iKingdom] Email send failed:", err);
      // Non-fatal — log is the fallback
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
