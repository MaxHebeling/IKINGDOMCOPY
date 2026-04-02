import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";
import { storeLeadBrief, type LeadBriefPayload } from "@/lib/leads/briefs";

export const dynamic = "force-dynamic";

function str(v: unknown, max: number): string {
  return String(v ?? "").slice(0, max);
}

function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { ok } = rateLimit(ip, 5, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429 }
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 80_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyName = str(body.companyName, 300).trim();
  const email = str(body.email, 200).trim();
  const phone = str(body.phone, 50).trim();

  if (!companyName || !email || !phone) {
    return NextResponse.json(
      { error: "Empresa / razón social, email y teléfono son obligatorios." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  let trafficStrategy: string[] | string | undefined;
  if (Array.isArray(body.trafficStrategy)) {
    trafficStrategy = body.trafficStrategy.map((x) => str(x, 80)).filter(Boolean);
  } else if (typeof body.trafficStrategy === "string") {
    trafficStrategy = str(body.trafficStrategy, 500);
  }

  const payload: LeadBriefPayload = {
    companyName,
    tagline: str(body.tagline, 400) || undefined,
    cityCountry: str(body.cityCountry, 200) || undefined,
    website: str(body.website, 300) || undefined,
    socialMedia: str(body.socialMedia, 500) || undefined,
    problemSolved: str(body.problemSolved, 2000) || undefined,
    differentiator: str(body.differentiator, 2000) || undefined,
    whyChooseYou: str(body.whyChooseYou, 2000) || undefined,
    mainServices: str(body.mainServices, 2000) || undefined,
    keyService: str(body.keyService, 400) || undefined,
    idealClient: str(body.idealClient, 2000) || undefined,
    notIdealClient: str(body.notIdealClient, 2000) || undefined,
    yearsExperience: str(body.yearsExperience, 100) || undefined,
    clientsServed: str(body.clientsServed, 200) || undefined,
    testimonials: str(body.testimonials, 4000) || undefined,
    landingObjective: str(body.landingObjective, 2000) || undefined,
    trafficStrategy,
    designStyle: str(body.designStyle, 2000) || undefined,
    phone,
    email,
    address: str(body.address, 500) || undefined,
    mainOffer: str(body.mainOffer, 2000) || undefined,
    generatedPrompt: str(body.generatedPrompt, 8000) || undefined,
    origen: "Brief CJA Oficial",
    fecha: typeof body.fecha === "string" ? body.fecha : undefined,
    originPage: "/cjaoficial",
  };

  try {
    await storeLeadBrief(payload);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("[cjaoficial-brief]", err);
    const message = err instanceof Error ? err.message : "Error interno";
    if (message.includes("missing") || message.includes("configuration")) {
      return NextResponse.json({ error: "Servicio no configurado" }, { status: 503 });
    }
    return NextResponse.json({ error: "No se pudo guardar el brief" }, { status: 500 });
  }
}
