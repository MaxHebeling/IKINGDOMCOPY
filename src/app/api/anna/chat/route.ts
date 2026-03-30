/**
 * POST /api/anna/chat
 * Proxy → hebeling-imperium-hub /api/anna/chat
 *
 * Env var required: ANNA_HUB_URL (e.g. https://hebeling-imperium-hub.vercel.app)
 */

import { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const hubUrl = process.env.ANNA_HUB_URL;
  if (!hubUrl) {
    return new Response("ANNA not configured", { status: 503 });
  }

  const body = await req.text();

  const upstream = await fetch(`${hubUrl}/api/anna/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Upstream error", { status: upstream.status });
  }

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Anna-Proxy": "ikingdom",
    },
  });
}
