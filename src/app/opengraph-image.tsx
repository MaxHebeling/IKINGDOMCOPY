import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "iKingdom — Arquitectura de Ecosistemas Digitales con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Center radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 400,
            background: "radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Corner bracket — top left */}
        <div style={{ position: "absolute", top: 28, left: 28, display: "flex" }}>
          <div style={{ width: 28, height: 28, borderTop: "1px solid rgba(212,175,55,0.5)", borderLeft: "1px solid rgba(212,175,55,0.5)" }} />
        </div>
        {/* Corner bracket — top right */}
        <div style={{ position: "absolute", top: 28, right: 28, display: "flex" }}>
          <div style={{ width: 28, height: 28, borderTop: "1px solid rgba(212,175,55,0.5)", borderRight: "1px solid rgba(212,175,55,0.5)" }} />
        </div>
        {/* Corner bracket — bottom left */}
        <div style={{ position: "absolute", bottom: 28, left: 28, display: "flex" }}>
          <div style={{ width: 28, height: 28, borderBottom: "1px solid rgba(212,175,55,0.5)", borderLeft: "1px solid rgba(212,175,55,0.5)" }} />
        </div>
        {/* Corner bracket — bottom right */}
        <div style={{ position: "absolute", bottom: 28, right: 28, display: "flex" }}>
          <div style={{ width: 28, height: 28, borderBottom: "1px solid rgba(212,175,55,0.5)", borderRight: "1px solid rgba(212,175,55,0.5)" }} />
        </div>

        {/* Top: logo + domain */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* iK monogram */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "#000",
                border: "1px solid rgba(212,175,55,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#C9A85C",
                letterSpacing: "-0.02em",
              }}
            >
              iK
            </div>
            <span style={{ fontSize: 18, fontWeight: 600, color: "#C9A85C", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              iKingdom
            </span>
          </div>

          {/* Domain */}
          <span style={{ fontSize: 13, color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            ikingdom.org
          </span>
        </div>

        {/* Center: main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "relative" }}>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.4)" }} />
            <span style={{ fontSize: 12, color: "rgba(212,175,55,0.5)", letterSpacing: "0.35em", textTransform: "uppercase" }}>
              AI Ecosystem Architecture
            </span>
            <div style={{ width: 32, height: 1, background: "rgba(212,175,55,0.4)" }} />
          </div>

          {/* Headline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 62, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Construimos la
            </span>
            <span style={{ fontSize: 62, fontWeight: 700, color: "#C9A85C", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Infraestructura Digital
            </span>
            <span style={{ fontSize: 62, fontWeight: 700, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              que opera tu negocio.
            </span>
          </div>
        </div>

        {/* Bottom: stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          {/* Stats */}
          <div style={{ display: "flex", gap: 48 }}>
            {[
              { value: "12+", label: "Ecosistemas desplegados" },
              { value: "3.2x", label: "Revenue lift promedio" },
              { value: "98%", label: "Retención de clientes" },
            ].map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 28, fontWeight: 700, color: "#C9A85C", letterSpacing: "-0.02em" }}>{s.value}</span>
                <span style={{ fontSize: 11, color: "rgba(212,175,55,0.45)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 24px",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "rgba(212,175,55,0.7)",
              fontSize: 13,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Solicitar Consulta →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
