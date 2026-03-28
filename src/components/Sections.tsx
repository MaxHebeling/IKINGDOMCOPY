"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/context/Lang";

/* ── Shared primitives ── */

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay, ease: [0.08, 0.82, 0.17, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: string }) {
  return <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-secondary">{children}</p>;
}

function Divider() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="max-w-[1280px] mx-auto px-8">
      <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.2, ease: [0.08, 0.82, 0.17, 1] }} className="h-px bg-divider origin-left" />
    </div>
  );
}

function CTA({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} data-hover className="group relative inline-flex items-center gap-3 px-8 py-[13px] text-[13px] font-semibold tracking-[0.14em] uppercase text-ink border border-ink/20 overflow-hidden transition-all duration-500 hover:text-bg hover:border-ink">
      <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <span className="relative z-10 transition-colors duration-500">{children}</span>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAPABILITIES
   ═══════════════════════════════════════════════════════════ */

export function Capabilities() {
  const { t } = useLang();
  const CAPS = [
    { metric: t("cap.1.metric"), metricLabel: t("cap.1.metricLabel"), title: t("cap.1.title"), desc: t("cap.1.desc") },
    { metric: t("cap.2.metric"), metricLabel: t("cap.2.metricLabel"), title: t("cap.2.title"), desc: t("cap.2.desc") },
    { metric: t("cap.3.metric"), metricLabel: t("cap.3.metricLabel"), title: t("cap.3.title"), desc: t("cap.3.desc") },
  ];

  return (
    <>
      <Divider />
      <section id="capabilities" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 lg:gap-24">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Reveal><Label>{t("cap.label")}</Label></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 text-ink leading-[1.08]" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700 }}>
                  {t("cap.heading")}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-secondary text-[15px] leading-[1.8] font-light text-justify">{t("cap.sub")}</p>
              </Reveal>
            </div>

            {/* Right — capability cards */}
            <div className="space-y-6">
              {CAPS.map((c, i) => (
                <Reveal key={c.title} delay={0.1 + i * 0.1}>
                  <div className="group relative p-8 md:p-10 border border-divider hover:border-ink/15 transition-colors duration-500 overflow-hidden">
                    {/* Live status indicator — goes bright on hover */}
                    <div className="absolute top-5 right-5 flex items-center gap-2">
                      <span className="text-[8px] tracking-[0.2em] uppercase text-secondary/0 group-hover:text-secondary/40 transition-all duration-700">ACTIVE</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-ink/10 group-hover:bg-ink/60 transition-all duration-500" />
                    </div>
                    {/* Scanning line on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/8 to-transparent animate-[scanDown_3s_ease-in-out_infinite]" />
                    </div>
                    {/* Outcome metric */}
                    <div className="flex items-baseline gap-3 mb-5">
                      <span className="text-ink text-[28px] font-light tracking-[-0.02em]" style={{ fontFamily: "var(--font-serif)" }}>{c.metric}</span>
                      <span className="text-[11px] tracking-[0.1em] uppercase text-secondary">{c.metricLabel}</span>
                    </div>
                    <h3 className="text-[18px] font-semibold text-ink mb-3 tracking-[-0.01em]">{c.title}</h3>
                    <p className="text-[14px] leading-[1.8] text-secondary font-light text-justify">{c.desc}</p>
                    {/* Bottom border draws on hover */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-ink/10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT WE DO — premium value proposition slide
   ═══════════════════════════════════════════════════════════ */

const WWD_CARDS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: "Posicionamiento estratégico",
    desc: "Definimos cómo te percibe tu cliente ideal",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Diseño que genera autoridad",
    desc: "Presencia visual que justifica tu ticket",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="5" rx="1" /><rect x="2" y="10" width="20" height="5" rx="1" /><rect x="2" y="17" width="20" height="5" rx="1" />
      </svg>
    ),
    title: "Arquitectura de conversión",
    desc: "Cada elemento tiene un objetivo comercial",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    title: "Elevación de marca personal",
    desc: "Construimos tu plataforma de influencia",
  },
];

/* SVG digital architecture workstation background */
function DigitalArchBg() {
  const VP = { x: 600, y: 160 }; // vanishing point
  const BOTTOM = 820;
  const GOLD = "#D4AF37";

  // Perspective converging vertical lines
  const vLineBottomXs = [0, 109, 218, 327, 436, 545, 600, 655, 764, 873, 982, 1091, 1200];
  // Horizontal lines with perspective width
  const hLineYs = [220, 290, 370, 460, 560, 670, BOTTOM];

  // Workstation panels: [x, y, w, h, label, sublabel]
  const panels: [number, number, number, number, string, string][] = [
    [490, 200, 220, 50, "MISSION CONTROL", "CORE SYSTEM v2.4"],
    [200, 360, 160, 40, "DATA LAYER", "REALTIME FEED"],
    [840, 350, 160, 40, "API GATEWAY", "REST / GRAPHQL"],
    [130, 530, 140, 36, "UI SYSTEM", "DESIGN ARCH"],
    [460, 490, 280, 52, "CONVERSION ENGINE", "PRIMARY NODE ACTIVE"],
    [930, 510, 140, 36, "ANALYTICS", "PROCESSING..."],
    [300, 660, 150, 38, "AUTH MODULE", "SECURE LAYER"],
    [750, 640, 170, 38, "CACHE LAYER", "CDN DISTRIBUTED"],
  ];

  // Connection paths between panel centers
  const connections: [number, number, number, number][] = [
    [600, 225, 280, 380],    // mission → data
    [600, 225, 920, 370],    // mission → api
    [280, 380, 200, 548],    // data → ui
    [600, 516, 280, 380],    // engine → data
    [600, 516, 920, 370],    // engine → api
    [600, 516, 375, 679],    // engine → auth
    [920, 370, 1000, 528],   // api → analytics
    [1000, 528, 835, 659],   // analytics → cache
    [375, 679, 600, 516],    // auth → engine
  ];

  // Nodes at key intersections
  const nodes = [
    { x: 600, y: 225 }, { x: 280, y: 380 }, { x: 920, y: 370 },
    { x: 200, y: 548 }, { x: 600, y: 516 }, { x: 1000, y: 528 },
    { x: 375, y: 679 }, { x: 835, y: 659 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Base — semi-transparent so the spine behind shows through */}
      <div className="absolute inset-0 bg-[#030302]/70" />

      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 820" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Radial vignette */}
          <radialGradient id="vignette" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="#030302" stopOpacity="0" />
            <stop offset="100%" stopColor="#030302" stopOpacity="0.92" />
          </radialGradient>
          {/* Flowing data dash animation */}
          <style>{`
            @keyframes flowDash { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
            @keyframes nodePulse { 0%,100% { opacity:0.18; r:3; } 50% { opacity:0.6; r:5; } }
            @keyframes ringExpand { 0% { r:6; opacity:0.4; } 100% { r:22; opacity:0; } }
          `}</style>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Perspective grid ── */}
        <g opacity="0.13" stroke={GOLD} strokeWidth="0.6" fill="none">
          {vLineBottomXs.map((bx, i) => (
            <line key={`v${i}`} x1={VP.x} y1={VP.y} x2={bx} y2={BOTTOM} />
          ))}
          {hLineYs.map((y) => {
            const t = (y - VP.y) / (BOTTOM - VP.y);
            const hw = t * 600;
            return <line key={`h${y}`} x1={VP.x - hw} y1={y} x2={VP.x + hw} y2={y} />;
          })}
        </g>

        {/* ── Connection lines ── */}
        {connections.map(([x1, y1, x2, y2], i) => (
          <g key={`conn${i}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="0.7" strokeOpacity="0.1" />
            <line
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={GOLD} strokeWidth="1.2" strokeOpacity="0.22" fill="none"
              strokeDasharray="6 14"
              style={{ animation: `flowDash ${2.8 + i * 0.4}s linear infinite`, animationDelay: `${i * 0.35}s` }}
            />
          </g>
        ))}

        {/* ── Workstation panels ── */}
        {panels.map(([x, y, w, h, label, sublabel], i) => (
          <g key={`panel${i}`} opacity="0.38">
            {/* Panel body */}
            <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="2" fill="none" stroke={GOLD} strokeWidth="0.8" />
            {/* Inner thin line */}
            <line x1={x - w / 2 + 4} y1={y - h / 2 + 8} x2={x + w / 2 - 4} y2={y - h / 2 + 8} stroke={GOLD} strokeWidth="0.5" />
            {/* Corner accents */}
            <rect x={x - w / 2} y={y - h / 2} width={6} height={6} fill={GOLD} opacity="0.6" rx="0.5" />
            <rect x={x + w / 2 - 6} y={y - h / 2} width={6} height={6} fill={GOLD} opacity="0.6" rx="0.5" />
            {/* Label */}
            <text x={x} y={y - 4} textAnchor="middle" fill={GOLD} fontSize="7" fontFamily="monospace" letterSpacing="2" opacity="0.9">{label}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={GOLD} fontSize="5.5" fontFamily="monospace" letterSpacing="1" opacity="0.5">{sublabel}</text>
            {/* Status bar fill */}
            <rect x={x - w / 2 + 4} y={y + h / 2 - 7} width={(w - 8) * (0.4 + i * 0.1)} height="3" rx="1" fill={GOLD} opacity="0.25" />
          </g>
        ))}

        {/* ── Central command ring ── */}
        <g opacity="0.28" fill="none" stroke={GOLD}>
          <circle cx={600} cy={225} r={50} strokeWidth="0.6" />
          <circle cx={600} cy={225} r={36} strokeWidth="0.4" />
          <circle cx={600} cy={225} r={22} strokeWidth="0.8" />
          <line x1={550} y1={225} x2={650} y2={225} strokeWidth="0.4" />
          <line x1={600} y1={175} x2={600} y2={275} strokeWidth="0.4" />
        </g>

        {/* ── Nodes ── */}
        {nodes.map((n, i) => (
          <g key={`node${i}`} filter="url(#glow)">
            <circle cx={n.x} cy={n.y} r={3} fill={GOLD}
              style={{ animation: `nodePulse ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }} />
            <circle cx={n.x} cy={n.y} r={6} fill="none" stroke={GOLD} strokeWidth="0.6"
              style={{ animation: `ringExpand ${3 + i * 0.4}s ease-out infinite`, animationDelay: `${i * 0.5}s` }} />
          </g>
        ))}

        {/* ── Technical annotation lines ── */}
        <g opacity="0.18" stroke={GOLD} strokeWidth="0.5" fill="none">
          <line x1="80" y1="280" x2="80" y2="680" /><line x1="75" y1="280" x2="85" y2="280" /><line x1="75" y1="680" x2="85" y2="680" />
          <line x1="1120" y1="310" x2="1120" y2="650" /><line x1="1115" y1="310" x2="1125" y2="310" /><line x1="1115" y1="650" x2="1125" y2="650" />
          <text x="68" y="485" textAnchor="middle" fill={GOLD} fontSize="6" fontFamily="monospace" letterSpacing="1" transform="rotate(-90,68,485)">DEPTH AXIS Z</text>
        </g>

        {/* ── Vignette overlay ── */}
        <rect x="0" y="0" width="1200" height="820" fill="url(#vignette)" />
      </svg>

      {/* Top & bottom gradient fades */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#030302] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050504] to-transparent" />
      {/* Dark center overlay to keep text legible */}
      <div className="absolute inset-0 bg-[#030302]/30" />
    </div>
  );
}

export function WhatWeDo() {
  return (
    <>
      <Divider />
      <section className="relative py-[140px] md:py-[160px] px-8 overflow-hidden">
        <DigitalArchBg />
        <div className="relative z-10 max-w-[1280px] mx-auto">

          {/* Header */}
          <div className="text-center mb-[80px]">
            <Reveal>
              <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-secondary mb-6">
                Lo que realmente hacemos
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-white mb-5 leading-[1.06]" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700 }}>
                No solo diseñamos websites.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-secondary text-[16px] leading-[1.85] font-light max-w-[600px] mx-auto">
                Construimos plataformas digitales que posicionan tu marca, generan confianza y convierten visitantes en clientes de alto valor.
              </p>
            </Reveal>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-[80px]">
            {WWD_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={0.1 + i * 0.08}>
                <div className="group h-full p-7 md:p-8 bg-[#0A0A08] border border-[#1C1A10] rounded-sm hover:border-ink/15 transition-colors duration-500 flex flex-col gap-5">
                  {/* Icon box */}
                  <div className="w-8 h-8 flex items-center justify-center border border-[#1C1A10] rounded-sm text-secondary group-hover:text-ink group-hover:border-ink/20 transition-colors duration-500">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-white leading-[1.3] mb-2 tracking-[-0.01em]">{card.title}</h3>
                    <p className="text-[13px] leading-[1.75] text-secondary font-light">{card.desc}</p>
                  </div>
                  {/* Bottom accent on hover */}
                  <div className="mt-auto h-px bg-ink/10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal delay={0.35}>
            <div className="text-center">
              <a href="#contact" data-hover className="group relative inline-flex items-center gap-3 px-8 py-[13px] text-[12px] font-semibold tracking-[0.18em] uppercase text-ink border border-ink/25 overflow-hidden transition-all duration-500 hover:text-bg hover:border-ink">
                <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 transition-colors duration-500">Solicita tu diagnóstico →</span>
              </a>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   MARQUEE — slow scrolling statement
   ═══════════════════════════════════════════════════════════ */

export function Marquee() {
  return (
    <div className="border-y border-divider py-14 md:py-20 px-8 text-center">
      <motion.h2
        animate={{ color: ["#D4AF37", "#ffffff", "#D4AF37"] }}
        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
        className="text-[clamp(22px,3.5vw,44px)] font-light leading-[1.3] tracking-[-0.01em]"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        El problema no es tener web.<br />
        ES TENER UNA QUE NO AYUDA A VENDER.
      </motion.h2>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROOF — anonymized case-study style blocks
   ═══════════════════════════════════════════════════════════ */

export function Proof() {
  const { t } = useLang();
  const CASES = [
    { industry: t("proof.1.industry"), headline: t("proof.1.headline"), metrics: [{ value: t("proof.1.m1.value"), label: t("proof.1.m1.label") }, { value: t("proof.1.m2.value"), label: t("proof.1.m2.label") }], scope: t("proof.1.scope") },
    { industry: t("proof.2.industry"), headline: t("proof.2.headline"), metrics: [{ value: t("proof.2.m1.value"), label: t("proof.2.m1.label") }, { value: t("proof.2.m2.value"), label: t("proof.2.m2.label") }], scope: t("proof.2.scope") },
    { industry: t("proof.3.industry"), headline: t("proof.3.headline"), metrics: [{ value: t("proof.3.m1.value"), label: t("proof.3.m1.label") }, { value: t("proof.3.m2.value"), label: t("proof.3.m2.label") }], scope: t("proof.3.scope") },
  ];

  return (
    <>
      <Divider />
      <section id="proof" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <Reveal><Label>{t("proof.label")}</Label></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 mb-16 text-ink leading-[1.08]" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700 }}>
              {t("proof.heading")}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASES.map((c, i) => (
              <Reveal key={c.industry} delay={0.15 + i * 0.1}>
                <div className="h-full flex flex-col p-8 md:p-9 border border-divider hover:border-ink/15 transition-colors duration-500">
                  <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-secondary/60 mb-5">{c.industry}</p>
                  <h3 className="text-[17px] font-semibold text-ink leading-[1.35] mb-6 flex-grow-0">{c.headline}</h3>

                  <div className="flex gap-8 mb-6 pt-5 border-t border-divider">
                    {c.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="text-ink text-[24px] font-light tracking-[-0.02em]" style={{ fontFamily: "var(--font-serif)" }}>{m.value}</p>
                        <p className="text-[10px] tracking-[0.08em] uppercase text-secondary mt-1">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[13px] leading-[1.7] text-secondary font-light mt-auto text-justify">{c.scope}</p>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLIENTS — logo slider
   ═══════════════════════════════════════════════════════════ */

const CLIENTS = [
  { name: "Reino Editorial", logo: "/clients/reino-editorial.png" },
  { name: "Distinct Construction", logo: "/clients/distinct-construction.png" },
  { name: "Max Hebeling", logo: "/clients/max-hebeling.png" },
  { name: "DyT", logo: "/clients/dyt.png" },
];

// Constellation positions: [x%, y%] relative to container
const CONSTELLATION_POSITIONS = [
  { x: 12, y: 30 },
  { x: 35, y: 65 },
  { x: 58, y: 20 },
  { x: 82, y: 55 },
];

export function Clients() {
  return (
    <>
      <Divider />
      <section className="py-[100px] md:py-[130px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <Reveal className="mb-16">
            <Label>Empresas que confían en nosotros</Label>
          </Reveal>

          {/* SVG constellation lines */}
          <div className="relative w-full" style={{ height: "260px" }}>
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              {CLIENTS.map((_, i) =>
                CLIENTS.slice(i + 1).map((__, j) => {
                  const a = CONSTELLATION_POSITIONS[i];
                  const b = CONSTELLATION_POSITIONS[i + 1 + j];
                  return (
                    <motion.line
                      key={`${i}-${j}`}
                      x1={`${a.x}%`} y1={`${a.y}%`}
                      x2={`${b.x}%`} y2={`${b.y}%`}
                      stroke="#D4AF37"
                      strokeWidth="0.5"
                      strokeOpacity="0.12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 2, delay: i * 0.3 + j * 0.2 }}
                    />
                  );
                })
              )}
            </svg>

            {CLIENTS.map((c, i) => {
              const pos = CONSTELLATION_POSITIONS[i];
              return (
                <motion.div
                  key={c.name}
                  className="absolute group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.2 }}
                >
                  {/* Pulse ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-ink/20"
                    animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                    transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: "easeOut" }}
                    style={{ borderRadius: "50%" }}
                  />

                  {/* Node */}
                  <div className="w-[130px] h-[130px] rounded-full border border-ink/15 bg-[#0A0A08] group-hover:border-ink/35 transition-all duration-700 flex flex-col items-center justify-center gap-2 relative overflow-hidden cursor-default">
                    {/* Inner glow on hover */}
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)" }} />
                    {/* Scan line */}
                    <motion.div
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/20 to-transparent"
                      animate={{ top: ["-5%", "105%"] }}
                      transition={{ duration: 4, delay: i * 1.1, repeat: Infinity, ease: "linear" }}
                    />
                    <img
                      src={c.logo!}
                      alt={c.name}
                      className="max-h-[60px] max-w-[85px] w-auto object-contain opacity-35 group-hover:opacity-70 transition-opacity duration-700 filter grayscale brightness-150"
                    />
                  </div>

                  {/* Dot */}
                  <motion.div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-ink/40"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5, delay: i * 0.5, repeat: Infinity }}
                  />

                  {/* Label */}
                  <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.22em] uppercase text-secondary/25 group-hover:text-secondary/55 transition-colors duration-500">
                    {c.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROCESS — timeline with vertical line
   ═══════════════════════════════════════════════════════════ */

export function Process() {
  const { t } = useLang();
  const PHASES = [
    { n: "01", title: t("proc.1.title"), duration: t("proc.1.dur"), desc: t("proc.1.desc") },
    { n: "02", title: t("proc.2.title"), duration: t("proc.2.dur"), desc: t("proc.2.desc") },
    { n: "03", title: t("proc.3.title"), duration: t("proc.3.dur"), desc: t("proc.3.desc") },
    { n: "04", title: t("proc.4.title"), duration: t("proc.4.dur"), desc: t("proc.4.desc") },
  ];

  return (
    <>
      <Divider />
      <section id="process" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-16 lg:gap-24">
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Reveal><Label>{t("proc.label")}</Label></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 text-ink leading-[1.08]" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700 }}>
                  {t("proc.heading")}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-secondary text-[15px] leading-[1.8] font-light text-justify">{t("proc.sub")}</p>
              </Reveal>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[18px] top-4 bottom-4 w-px bg-divider hidden md:block" />

              <div className="space-y-0">
                {PHASES.map((p, i) => (
                  <Reveal key={p.n} delay={0.1 + i * 0.08}>
                    <div className="group relative grid grid-cols-1 md:grid-cols-[40px_1fr] gap-4 md:gap-8 py-10 border-b border-divider last:border-b-0">
                      {/* Timeline dot */}
                      <div className="hidden md:flex items-start justify-center pt-1.5">
                        <div className="w-[7px] h-[7px] rounded-full border border-ink/25 bg-bg group-hover:bg-ink group-hover:border-ink transition-colors duration-500 relative z-10" />
                      </div>
                      <div>
                        <div className="flex items-baseline gap-4 mb-2">
                          <span className="text-[11px] font-semibold tracking-[0.25em] text-secondary/50">{p.n}</span>
                          <h3 className="text-[17px] font-semibold text-ink">{p.title}</h3>
                          <span className="text-[11px] tracking-[0.1em] uppercase text-secondary/40 ml-auto hidden sm:block">{p.duration}</span>
                        </div>
                        <p className="text-[14px] leading-[1.8] text-secondary font-light text-justify">{p.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENGAGEMENT — two-column: narrative left, deliverables right
   ═══════════════════════════════════════════════════════════ */

export function Engagement() {
  const { t } = useLang();
  const deliverables = [t("eng.d1"), t("eng.d2"), t("eng.d3"), t("eng.d4"), t("eng.d5")];

  return (
    <>
      <Divider />
      <section id="engagement" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <Reveal><Label>{t("eng.label")}</Label></Reveal>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-ink leading-[1.08] mb-6" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700 }}>
                  {t("eng.heading")}
                </h2>
                <p className="text-secondary text-[15px] leading-[1.8] font-light mb-6 text-justify">{t("eng.left.p1")}</p>
                <p className="text-secondary text-[15px] leading-[1.8] font-light text-justify">{t("eng.left.p2")}</p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="p-8 md:p-10 border border-divider">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-secondary/50 mb-3">Investment</p>
                <p className="text-ink text-[clamp(28px,3.5vw,42px)] font-light tracking-[-0.02em] mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  {t("eng.price")}
                </p>
                <p className="text-[13px] text-secondary/50 font-light mb-8">{t("eng.scope")}</p>

                <div className="space-y-4 pt-6 border-t border-divider">
                  <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-secondary/50 mb-2">{t("eng.what")}</p>
                  {deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-[14px] text-ink/70 font-light leading-[1.6]">
                      <span className="w-1 h-1 rounded-full bg-ink/20 flex-shrink-0 mt-[9px]" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-divider">
                  <CTA href="#contact">{t("eng.cta")}</CTA>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT — qualification application
   ═══════════════════════════════════════════════════════════ */

export function Contact() {
  const { t } = useLang();
  const fields = [
    { n: "01", label: t("contact.f1"), type: "text" as const },
    { n: "02", label: t("contact.f2"), type: "text" as const },
    { n: "03", label: t("contact.f3"), type: "text" as const },
    { n: "04", label: t("contact.f4"), type: "select" as const },
    { n: "05", label: t("contact.f5"), type: "textarea" as const },
  ];

  const ic = "w-full bg-transparent border-b border-divider py-3 text-[15px] text-ink font-light focus:outline-none focus:border-ink/30 transition-colors duration-300 placeholder:text-secondary/20";

  return (
    <>
      <Divider />
      <section id="contact" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 lg:gap-24">
            {/* Left — context */}
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Reveal><Label>{t("contact.label")}</Label></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 text-ink leading-[1.08]" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700 }}>
                  {t("contact.heading")}
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-secondary text-[15px] leading-[1.8] font-light text-justify">{t("contact.sub")}</p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-4 text-[12px] text-secondary/40 font-light tracking-[0.05em]">{t("contact.fine")}</p>
              </Reveal>
            </div>

            {/* Right — form */}
            <Reveal delay={0.2}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-10">
                {fields.map((f) => (
                  <div key={f.n} className="grid grid-cols-[32px_1fr] gap-4 items-start">
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-secondary/30 pt-3">{f.n}</span>
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.2em] uppercase text-secondary mb-2">{f.label}</label>
                      {f.type === "select" ? (
                        <select data-hover className={ic + " appearance-none bg-transparent"}>
                          <option value="" className="bg-bg">—</option>
                          <option value="under-1m" className="bg-bg">{t("contact.rev.1")}</option>
                          <option value="1-5m" className="bg-bg">{t("contact.rev.2")}</option>
                          <option value="5-20m" className="bg-bg">{t("contact.rev.3")}</option>
                          <option value="20-100m" className="bg-bg">{t("contact.rev.4")}</option>
                          <option value="100m+" className="bg-bg">{t("contact.rev.5")}</option>
                        </select>
                      ) : f.type === "textarea" ? (
                        <textarea data-hover rows={3} className={ic + " resize-none"} placeholder="—" />
                      ) : (
                        <input data-hover type="text" className={ic} placeholder="—" />
                      )}
                    </div>
                  </div>
                ))}
                <div className="pl-[48px]">
                  <button type="submit" data-hover className="group relative inline-flex items-center gap-3 px-8 py-[14px] text-[13px] font-semibold tracking-[0.14em] uppercase text-bg bg-ink overflow-hidden transition-all duration-500">
                    <div className="absolute inset-0 bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    <span className="relative z-10">{t("contact.cta")}</span>
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

export function Footer() {
  return (
    <>
      <Divider />
      <footer className="py-14 px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/logo.png" alt="iKingdom" className="h-8 w-auto" />
          <div className="flex items-center gap-6">
            {["Privacy", "Terms"].map((l) => (
              <a key={l} href="#" data-hover className="text-[11px] tracking-[0.15em] uppercase text-secondary/40 hover:text-secondary transition-colors duration-300">{l}</a>
            ))}
          </div>
          <span className="text-[11px] tracking-[0.15em] uppercase text-secondary/30">&copy; {new Date().getFullYear()}</span>
        </div>
      </footer>
    </>
  );
}
