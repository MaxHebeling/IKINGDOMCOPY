"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ikd_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

export function useConsent(): ConsentState {
  const [state, setState] = useState<ConsentState>(null);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null;
    setState(stored);
  }, []);
  return state;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
    // Fire GTM consent update
    if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({
        event: "consent_update",
        analytics_storage: "granted",
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
    if (typeof window !== "undefined" && Array.isArray((window as any).dataLayer)) {
      (window as any).dataLayer.push({
        event: "consent_update",
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  }

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        width: "min(620px, calc(100vw - 32px))",
        background: "#0A0A0A",
        border: "1px solid rgba(212,175,55,0.2)",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {/* Corner brackets */}
      <span style={{ position:"absolute", top:6, left:6, width:8, height:8, borderTop:"1px solid rgba(212,175,55,0.4)", borderLeft:"1px solid rgba(212,175,55,0.4)" }} />
      <span style={{ position:"absolute", top:6, right:6, width:8, height:8, borderTop:"1px solid rgba(212,175,55,0.4)", borderRight:"1px solid rgba(212,175,55,0.4)" }} />
      <span style={{ position:"absolute", bottom:6, left:6, width:8, height:8, borderBottom:"1px solid rgba(212,175,55,0.4)", borderLeft:"1px solid rgba(212,175,55,0.4)" }} />
      <span style={{ position:"absolute", bottom:6, right:6, width:8, height:8, borderBottom:"1px solid rgba(212,175,55,0.4)", borderRight:"1px solid rgba(212,175,55,0.4)" }} />

      <p style={{ flex:1, margin:0, fontSize:"12px", color:"rgba(212,175,55,0.65)", fontFamily:"'Space Grotesk',monospace", lineHeight:1.6, minWidth:"200px" }}>
        Utilizamos cookies de análisis y publicidad para mejorar tu experiencia y medir el rendimiento de nuestras campañas.{" "}
        <a href="/cookie-policy" style={{ color:"rgba(212,175,55,0.9)", textDecoration:"underline" }}>Política de cookies</a>
      </p>

      <div style={{ display:"flex", gap:"10px", flexShrink:0 }}>
        <button
          onClick={decline}
          style={{
            padding:"8px 16px",
            fontSize:"11px",
            letterSpacing:"0.15em",
            textTransform:"uppercase",
            background:"transparent",
            border:"1px solid rgba(212,175,55,0.25)",
            color:"rgba(212,175,55,0.5)",
            cursor:"pointer",
            fontFamily:"'Space Grotesk',monospace",
          }}
        >
          Rechazar
        </button>
        <button
          onClick={accept}
          style={{
            padding:"8px 20px",
            fontSize:"11px",
            letterSpacing:"0.15em",
            textTransform:"uppercase",
            background:"rgba(212,175,55,0.12)",
            border:"1px solid rgba(212,175,55,0.5)",
            color:"#D4AF37",
            cursor:"pointer",
            fontFamily:"'Space Grotesk',monospace",
          }}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
