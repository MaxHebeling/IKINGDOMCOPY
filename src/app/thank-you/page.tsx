"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ThankYou() {
  useEffect(() => {
    // ── Conversion tracking hook ──────────────────────────────
    // Google Tag Manager dataLayer push
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_form_submit",
        page: "thank_you",
        conversion_type: "consultation_request",
      });
    }

    // Meta Pixel lead event
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        content_name: "Consultation Request",
        content_category: "Contact Form",
      });
    }
  }, []);

  return (
    <>
      {/* Page-in fade */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="fixed inset-0 z-[100] bg-[#000000] pointer-events-none"
      />

      <main
        className="min-h-screen bg-[#000000] flex flex-col items-center justify-center px-8 relative overflow-hidden"
        style={{ fontFamily: '"Space Grotesk", "Inter", system-ui, sans-serif' }}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial gold glow — centered */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[640px] w-full text-center">

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="inline-flex items-center gap-3 mb-10"
          >
            <span className="h-px w-6 bg-[#C9A85C]/50" />
            <span className="text-[11px] font-medium uppercase tracking-[0.38em] text-[#C9A85C]">
              Solicitud Recibida
            </span>
            <span className="h-px w-6 bg-[#C9A85C]/50" />
          </motion.div>

          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.08, 0.82, 0.17, 1] }}
            className="mx-auto mb-10 w-16 h-16 border border-[#D4AF37]/20 flex items-center justify-center"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65, ease: [0.08, 0.82, 0.17, 1] }}
            style={{ fontSize: "clamp(32px, 5vw, 52px)", letterSpacing: "-0.03em", lineHeight: 1.1, fontWeight: 600 }}
            className="text-[#D4AF37] mb-6"
          >
            Tu solicitud ha sido recibida.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85 }}
            className="text-[16px] leading-[1.8] font-light text-[#9A7E28] mb-3"
          >
            Revisamos cada solicitud personalmente.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.0 }}
            className="text-[16px] leading-[1.8] font-light text-[#9A7E28] mb-14"
          >
            Si hay un fuerte fit, tendrás noticias de un socio senior{" "}
            <span className="text-[#D4AF37]">dentro de 48 horas.</span>
          </motion.p>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.08, 0.82, 0.17, 1] }}
            className="h-px bg-[#1C1A10] mb-14 origin-center"
          />

          {/* Fine print */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
            className="text-[11px] tracking-[0.2em] uppercase text-[#6B5820] mb-10"
          >
            Aceptamos 4–6 nuevas alianzas por trimestre.
          </motion.p>

          {/* Back link — minimal, no nav distraction */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <Link
              href="/"
              className="text-[12px] tracking-[0.2em] uppercase text-[#6B5820] hover:text-[#D4AF37] transition-colors duration-300 font-medium"
            >
              ← Volver al inicio
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
