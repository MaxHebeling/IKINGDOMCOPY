"use client";

import { useRef, useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useLang } from "@/context/Lang";
import { trackCTAClick, trackLeadIntent } from "@/lib/tracking";

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
  return (
    <div className="inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.38em] text-[#C9A85C]">
      <span className="h-px w-6 bg-[#C9A85C]/50" />
      {children}
      <span className="h-px w-6 bg-[#C9A85C]/50" />
    </div>
  );
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

function CTA({ href, children, onClick }: { href: string; children: string; onClick?: () => void }) {
  return (
    <a href={href} data-hover onClick={onClick} className="group relative inline-flex items-center gap-3 px-8 py-[13px] text-[13px] font-semibold tracking-[0.14em] uppercase text-ink border border-ink/20 overflow-hidden transition-all duration-500 hover:text-bg hover:border-ink">
      <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
      <span className="relative z-10 transition-colors duration-500">{children}</span>
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLARITY STRIP — value proposition bridge after hero
   ═══════════════════════════════════════════════════════════ */

export function ClarityStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });

  return (
    <div ref={ref} className="px-8 py-14 md:py-18">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="relative px-8 md:px-14 py-10 md:py-12 text-center"
          style={{
            background: "rgba(212,175,55,0.016)",
            border: "1px solid rgba(212,175,55,0.07)",
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, ease: [0.08, 0.82, 0.17, 1] }}
        >
          {/* Corner marks */}
          <span className="absolute top-0 left-0 w-3 h-3 pointer-events-none" style={{ borderTop: "1px solid rgba(212,175,55,0.20)", borderLeft: "1px solid rgba(212,175,55,0.20)" }} />
          <span className="absolute top-0 right-0 w-3 h-3 pointer-events-none" style={{ borderTop: "1px solid rgba(212,175,55,0.20)", borderRight: "1px solid rgba(212,175,55,0.20)" }} />
          <span className="absolute bottom-0 left-0 w-3 h-3 pointer-events-none" style={{ borderBottom: "1px solid rgba(212,175,55,0.20)", borderLeft: "1px solid rgba(212,175,55,0.20)" }} />
          <span className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none" style={{ borderBottom: "1px solid rgba(212,175,55,0.20)", borderRight: "1px solid rgba(212,175,55,0.20)" }} />

          <motion.p
            className="text-ink font-light leading-[1.45] tracking-[-0.025em] mb-4"
            style={{ fontSize: "clamp(18px, 2.2vw, 26px)" }}
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.08, 0.82, 0.17, 1] }}
          >
            Tener visibilidad no es lo mismo que tener conversión.
          </motion.p>

          <motion.p
            className="text-secondary font-light leading-[1.75] mb-7"
            style={{ fontSize: "clamp(13px, 1.2vw, 15px)" }}
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.22, ease: [0.08, 0.82, 0.17, 1] }}
          >
            Diseñamos la infraestructura que transforma atención en oportunidad comercial.
          </motion.p>

          <motion.p
            className="text-[10px] tracking-[0.36em] uppercase"
            style={{ color: "rgba(212,175,55,0.55)" }}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.36 }}
          >
            Estrategia · Arquitectura · Implementación
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CAPABILITIES
   ═══════════════════════════════════════════════════════════ */

const plans = [
  {
    name: "Web Estratégica",
    price: "$3,500",
    currency: "USD",
    description: "Tu presencia digital lista para posicionar tu marca y convertir desde el primer día.",
    features: [
      "Diagnóstico estratégico",
      "Arquitectura de mensaje y copy",
      "Diseño premium alineado a tu marca",
      "Desarrollo responsive optimizado",
      "Analítica y métricas base",
    ],
    note: "Para proyectos que necesitan claridad estructural con ejecución rápida.",
    highlighted: false,
  },
  {
    name: "Sistema de Captación",
    price: "$7,500",
    currency: "USD",
    description: "Tu sistema de venta operando. Capta, filtra y convierte clientes sin intervención manual.",
    features: [
      "Todo lo de Web Estratégica",
      "Páginas de conversión adicionales",
      "Integraciones CRM y automatización",
      "Flujos de captación automatizados",
      "Formularios avanzados + calificación",
      "Seguimiento y nurturing de leads",
    ],
    note: "Para negocios que ya venden y necesitan un sistema que escale sus resultados.",
    highlighted: true,
    badge: "RECOMENDADO",
  },
  {
    name: "Ecosistema Completo",
    price: "$25,000",
    currency: "USD",
    description: "Arquitectura digital completa para operar, escalar y crecer sin límite de estructura.",
    features: [
      "Arquitectura digital end-to-end",
      "CRM y procesos conectados",
      "Automatizaciones avanzadas",
      "Flujos operativos internos",
      "Integraciones a medida",
      "Infraestructura pensada para escalar",
    ],
    note: "Para empresas que necesitan infraestructura sólida, no soluciones temporales.",
    highlighted: false,
  },
];

const plansContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.1 } },
};

const planItem = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function Capabilities() {
  const { t, lang } = useLang();
  return (
    <>
      <Divider />
      <section id="capabilities" className="relative overflow-hidden px-6 py-24 text-white md:px-10 lg:px-16 lg:py-32">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,168,92,0.1)_0%,rgba(201,168,92,0.03)_35%,transparent_70%)] blur-3xl" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-5 inline-flex items-center justify-center gap-3 text-[11px] font-medium uppercase tracking-[0.38em] text-[#C9A85C]">
              <span className="h-px w-8 bg-[#C9A85C]/50" />
              Soluciones
              <span className="h-px w-8 bg-[#C9A85C]/50" />
            </div>
            <h2 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-white md:text-5xl lg:text-6xl">
              Arquitecturas diseñadas para escalar tu negocio.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/60 md:text-lg">
              No vendemos páginas web. Construimos sistemas que convierten, posicionan y sostienen crecimiento real.
            </p>
            <p className="mt-5 text-[11px] tracking-[0.32em] uppercase" style={{ color: "rgba(201,168,92,0.55)" }}>
              Seleccionamos el nivel según tu estructura actual y objetivos.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div
            variants={plansContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-3 xl:gap-6"
          >
            {plans.map((plan, index) => (
              <motion.article
                key={plan.name}
                variants={planItem}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={[
                  "group relative flex h-full flex-col overflow-hidden rounded-[4px] border backdrop-blur-xl",
                  "bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.015)_100%)]",
                  plan.highlighted
                    ? "border-[#C9A85C]/35 shadow-[0_0_0_1px_rgba(201,168,92,0.08),0_30px_80px_rgba(0,0,0,0.45),0_0_80px_rgba(201,168,92,0.08)]"
                    : "border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
                  index === 1 ? "lg:-translate-y-4" : "",
                ].join(" ")}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div className={[
                    "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    plan.highlighted
                      ? "bg-[radial-gradient(circle_at_top,rgba(201,168,92,0.16),transparent_42%)]"
                      : "bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_42%)]",
                  ].join(" ")} />
                  <div className="absolute inset-x-0 top-0 h-px bg-white/[0.08]" />
                </div>

                <div className="relative flex h-full flex-col p-7 md:p-8">
                  <div className="mb-8 min-h-[64px]">
                    {plan.badge ? (
                      <div className="mb-5 inline-flex rounded-full border border-[#C9A85C]/20 bg-[#C9A85C]/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#D6B56A]">
                        {plan.badge}
                      </div>
                    ) : (
                      <div className="mb-5 h-[30px]" />
                    )}
                    <h3 className="text-3xl font-semibold tracking-[-0.04em] text-white">{plan.name}</h3>
                  </div>

                  <div className="flex items-end gap-2 border-b border-white/[0.08] pb-6">
                    <span className={["text-5xl font-semibold leading-none tracking-[-0.06em]", plan.highlighted ? "text-[#D5B368]" : "text-[#C9A85C]"].join(" ")}>
                      {plan.price}
                    </span>
                    <span className="pb-1 text-sm uppercase tracking-[0.18em] text-white/45">{plan.currency}</span>
                  </div>

                  <p className="mt-7 text-base leading-8 text-white/64">{plan.description}</p>

                  <ul className="mt-8 space-y-4 text-[15px] leading-7 text-white/78">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#C9A85C]/25 bg-[#C9A85C]/10 text-[#D6B56A]">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <div className="mb-7 border-t border-white/[0.08] pt-6 text-sm italic leading-6 text-white/35">
                      {plan.note}
                    </div>
                    <motion.a
                      href="/fit"
                      whileTap={{ scale: 0.985 }}
                      onClick={() => trackCTAClick("capabilities-plan")}
                      className={[
                        "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-medium uppercase tracking-[0.16em] transition-all duration-300",
                        plan.highlighted
                          ? "bg-[#D1B168] text-black shadow-[0_10px_35px_rgba(209,177,104,0.22)] hover:shadow-[0_18px_45px_rgba(209,177,104,0.32)]"
                          : "border border-[#C9A85C]/30 bg-transparent text-[#D1B168] hover:border-[#D1B168]/60 hover:bg-[#C9A85C]/8",
                      ].join(" ")}
                    >
                      Solicitar diagnóstico
                      <ArrowRight className="h-4 w-4" />
                    </motion.a>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
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
    desc: "Definimos el mensaje exacto que mueve a tu cliente ideal a tomar acción.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "Autoridad visual premium",
    desc: "Diseño que justifica tu precio antes de que el cliente lea una palabra.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="5" rx="1" /><rect x="2" y="10" width="20" height="5" rx="1" /><rect x="2" y="17" width="20" height="5" rx="1" />
      </svg>
    ),
    title: "Arquitectura de conversión",
    desc: "Cada elemento tiene un propósito comercial. Nada es decorativo.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    title: "Sistemas de captación activa",
    desc: "Infraestructura que genera y califica prospectos de forma continua.",
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
      {/* Base — fully transparent, spine shows through */}
      <div className="absolute inset-0 bg-[#030302]/10" />

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
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#030302]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050504]/60 to-transparent" />
      {/* Dark center overlay to keep text legible */}
      <div className="absolute inset-0 bg-[#030302]/08" />
    </div>
  );
}

export function WhatWeDo() {
  return (
    <>
      <Divider />
      <section className="relative py-[90px] md:py-[160px] px-8 overflow-hidden">
        <DigitalArchBg />
        <div className="relative z-10 max-w-[1280px] mx-auto">

          {/* Header */}
          <div className="text-center mb-[80px]">
            <Reveal>
              <p className="text-[10px] font-semibold tracking-[0.4em] uppercase text-secondary mb-6">
                Nuestra diferencia
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-white mb-5 leading-[1.06]" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
                No somos una agencia.<br className="hidden md:block" /> Diseñamos la infraestructura que hace que tu negocio venda.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-secondary text-[16px] leading-[1.85] font-light max-w-[600px] mx-auto">
                Cada decisión apunta a un resultado comercial medible. No ejecutamos tareas — construimos sistemas que operan.
              </p>
            </Reveal>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-[80px]">
            {WWD_CARDS.map((card, i) => (
              <Reveal key={card.title} delay={0.1 + i * 0.08}>
                <div className="group h-full p-7 md:p-8 bg-[#06162A] border border-white/5 rounded-sm hover:border-ink/20 transition-colors duration-500 flex flex-col gap-5">
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
              <a href="/fit" data-hover onClick={() => trackCTAClick("whatwedo")} className="group relative inline-flex items-center gap-3 px-8 py-[13px] text-[12px] font-semibold tracking-[0.18em] uppercase text-ink border border-ink/25 overflow-hidden transition-all duration-500 hover:text-bg hover:border-ink">
                <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 transition-colors duration-500">Aplicar para diagnóstico estratégico →</span>
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
        style={{}}
      >
        El problema no es tener presencia digital.<br />
        Es no tener un sistema que venda.
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
            <h2 className="mt-5 mb-16 text-ink leading-[1.08]" style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>
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
                        <p className="text-ink text-[24px] font-light tracking-[-0.02em]" style={{}}>{m.value}</p>
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
   CLIENTS — Velocity Control Dashboard
   ═══════════════════════════════════════════════════════════ */

const CLIENTS = [
  { name: "Reino Editorial",            logo: "/clients/Reino%20Editorial.png" },
  { name: "Distinct Construction",      logo: "/clients/Dcs.png" },
  { name: "Max Hebeling",               logo: "/clients/Max_Hebeling.png" },
  { name: "DyT Comunicaciones",         logo: "/clients/DyT_%20Comunicaciones.png" },
  { name: "Imperium Group",             logo: "/clients/Imperium_group.png" },
  { name: "RAF Conference",             logo: "/clients/RAF%20Conference.png" },
  { name: "Fuente de Vida",             logo: "/clients/Ministerio%20Internacional%20Fuente%20de%20Vida.png" },
  { name: "Inversionistas del Reino",   logo: "/clients/Inversionistas_del_Reino.png" },
  { name: "Hebeling OS",                logo: "/clients/Hebeling_OS.png" },
  { name: "Pérgolas Zolutions",         logo: "/clients/P%C3%A9rgolas_zolutions.png" },
];

// ── Velocity Dashboard geometry ───────────────────────────────────────────────
const VD_SIZE     = 660;
const VD_CX       = VD_SIZE / 2;   // 330
const VD_CY       = VD_SIZE / 2;   // 330
const VD_INNER_R  = 130;           // inner orbit radius (4 nodes)
const VD_OUTER_R  = 255;           // outer orbit radius (6 nodes)
const VD_NODE     = 96;            // node diameter (px)
const VD_ARC_R    = VD_NODE / 2 - 7; // velocity arc radius = 41px

// Node precision tick marks — 16 marks at 22.5° intervals
const VD_NODE_TICKS = Array.from({ length: 16 }, (_, k) => {
  const θ     = (k / 16) * 2 * Math.PI - Math.PI / 2;
  const R_out = VD_NODE / 2 - 3;   // 45
  const isC   = k % 4 === 0;
  const isM   = !isC && k % 2 === 0;
  const len   = isC ? 5.5 : isM ? 3.5 : 2.0;
  const R_in  = R_out - len;
  const cx    = VD_NODE / 2;
  const cy    = VD_NODE / 2;
  return {
    x1: parseFloat((cx + R_out * Math.cos(θ)).toFixed(2)),
    y1: parseFloat((cy + R_out * Math.sin(θ)).toFixed(2)),
    x2: parseFloat((cx + R_in  * Math.cos(θ)).toFixed(2)),
    y2: parseFloat((cy + R_in  * Math.sin(θ)).toFixed(2)),
    sw: isC ? 0.65 : 0.28,
    so: isC ? 0.18 : isM ? 0.09 : 0.04,
  };
});

// Velocity arc path (68° arc at 12-o'clock, leading edge dot)
const VD_ARC_PATH = (() => {
  const cx = VD_NODE / 2;
  const cy = VD_NODE / 2;
  const R  = VD_ARC_R;
  const a1 = -Math.PI / 2;
  const a2 = a1 + (68 * Math.PI / 180);
  return `M ${(cx + R * Math.cos(a1)).toFixed(2)} ${(cy + R * Math.sin(a1)).toFixed(2)} A ${R} ${R} 0 0 1 ${(cx + R * Math.cos(a2)).toFixed(2)} ${(cy + R * Math.sin(a2)).toFixed(2)}`;
})();

const VD_ARC_DOT = (() => {
  const a = -Math.PI / 2 + (68 * Math.PI / 180);
  return {
    x: parseFloat((VD_NODE / 2 + VD_ARC_R * Math.cos(a)).toFixed(2)),
    y: parseFloat((VD_NODE / 2 + VD_ARC_R * Math.sin(a)).toFixed(2)),
  };
})();

// Orbital positions
const VD_INNER_POS = Array.from({ length: 4 }, (_, i) => {
  const θ  = -Math.PI / 2 + i * (Math.PI * 2 / 4) + 0.22;
  const cx = VD_CX + VD_INNER_R * Math.cos(θ);
  const cy = VD_CY + VD_INNER_R * Math.sin(θ);
  return { cx, cy, left: cx - VD_NODE / 2, top: cy - VD_NODE / 2 };
});

const VD_OUTER_POS = Array.from({ length: 6 }, (_, i) => {
  const θ  = -Math.PI / 2 + i * (Math.PI * 2 / 6) - 0.18;
  const cx = VD_CX + VD_OUTER_R * Math.cos(θ);
  const cy = VD_CY + VD_OUTER_R * Math.sin(θ);
  return { cx, cy, left: cx - VD_NODE / 2, top: cy - VD_NODE / 2 };
});

// Velocity calibration arcs (between orbits, r=192, 8 × 35° segments)
const VD_VEL_SEGS = Array.from({ length: 8 }, (_, i) => {
  const a1 = (-90 + i * 45) * Math.PI / 180;
  const a2 = (-90 + i * 45 + 35) * Math.PI / 180;
  const R  = 192;
  return `M ${(VD_CX + R * Math.cos(a1)).toFixed(2)} ${(VD_CY + R * Math.sin(a1)).toFixed(2)} A ${R} ${R} 0 0 1 ${(VD_CX + R * Math.cos(a2)).toFixed(2)} ${(VD_CY + R * Math.sin(a2)).toFixed(2)}`;
});

// Axis crosshair lines (from r=26 outward to r=284)
const VD_AXIS = [0, 90, 180, 270].map(deg => {
  const θ = deg * Math.PI / 180;
  return {
    x1: parseFloat((VD_CX + 26 * Math.cos(θ)).toFixed(2)),
    y1: parseFloat((VD_CY + 26 * Math.sin(θ)).toFixed(2)),
    x2: parseFloat((VD_CX + 284 * Math.cos(θ)).toFixed(2)),
    y2: parseFloat((VD_CY + 284 * Math.sin(θ)).toFixed(2)),
  };
});

// ── Velocity Node component ────────────────────────────────────────────────────
function VelocityNode({
  client,
  index,
  inView,
  entranceDelay,
}: {
  client: { name: string; logo: string };
  index: number;
  inView: boolean;
  entranceDelay: number;
}) {
  const [isHov, setIsHov] = useState(false);
  const arcDir = index % 2 === 0 ? 360 : -360;
  const arcDur = 28 + index * 3.8;

  return (
    <motion.div
      className="relative cursor-default"
      style={{ width: VD_NODE, height: VD_NODE }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, delay: entranceDelay, ease: [0.08, 0.82, 0.17, 1] }}
      onMouseEnter={() => setIsHov(true)}
      onMouseLeave={() => setIsHov(false)}
    >
      {/* Precision SVG instrument layer */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${VD_NODE} ${VD_NODE}`}
        style={{ overflow: "visible" }}
      >
        {/* Outer hover aura */}
        <motion.circle
          cx={VD_NODE / 2} cy={VD_NODE / 2} r={VD_NODE / 2 + 6}
          fill="#D4AF37"
          animate={{ opacity: isHov ? 0.055 : 0 }}
          transition={{ duration: 0.7 }}
        />

        {/* Outer precision ring */}
        <motion.circle
          cx={VD_NODE / 2} cy={VD_NODE / 2} r={VD_NODE / 2 - 3}
          fill="none" stroke="#D4AF37"
          animate={{
            strokeWidth:   isHov ? 0.75 : 0.40,
            strokeOpacity: isHov ? 0.32 : 0.13,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Tick marks — calibration ring */}
        {VD_NODE_TICKS.map((t, k) => (
          <line
            key={k}
            x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#D4AF37"
            strokeWidth={t.sw}
            strokeOpacity={t.so}
          />
        ))}

        {/* Velocity arc — slow rotation, direction alternates per node */}
        <motion.g
          style={{ transformOrigin: "50% 50%" }}
          animate={{ rotate: arcDir }}
          transition={{ duration: arcDur, repeat: Infinity, ease: "linear" }}
        >
          <path
            d={VD_ARC_PATH}
            fill="none"
            stroke="#D4AF37"
            strokeWidth={isHov ? 0.95 : 0.65}
            strokeOpacity={isHov ? 0.38 : 0.18}
            strokeLinecap="round"
          />
          {/* Leading edge indicator dot */}
          <circle
            cx={VD_ARC_DOT.x} cy={VD_ARC_DOT.y} r={1.4}
            fill="#D4AF37"
            fillOpacity={isHov ? 0.60 : 0.28}
          />
        </motion.g>

        {/* Inner measurement ring */}
        <circle
          cx={VD_NODE / 2} cy={VD_NODE / 2} r={VD_NODE / 2 - 14}
          fill="none" stroke="#D4AF37"
          strokeWidth={0.28} strokeOpacity={0.07}
        />
      </svg>

      {/* Node housing — logo zone */}
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center"
        style={{ inset: "14px", background: "#0A0A08" }}
      >
        {/* Hover inner glow */}
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(212,175,55,0.11) 0%, transparent 68%)" }}
          animate={{ opacity: isHov ? 1 : 0 }}
          transition={{ duration: 0.65 }}
        />
        {/* Slow telemetry scan */}
        <motion.div
          className="absolute left-0 right-0 h-px pointer-events-none"
          style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.14), transparent)" }}
          animate={{ top: ["-5%", "105%"] }}
          transition={{ duration: 7.5 + index * 0.55, delay: index * 1.9, repeat: Infinity, ease: "linear" }}
        />
        <img
          src={client.logo}
          alt={client.name}
          className="relative z-10 w-auto object-contain grayscale brightness-150"
          style={{
            maxHeight: "46px",
            maxWidth: "58px",
            opacity: isHov ? 0.62 : 0.33,
            transition: "opacity 0.65s ease",
          }}
        />
      </div>

      {/* Status indicator dot — upper-right quadrant */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ top: "15px", right: "15px", width: "3px", height: "3px", background: "#D4AF37" }}
        animate={{ opacity: [0.18, 0.80, 0.18] }}
        transition={{ duration: 3.2 + index * 0.45, delay: index * 0.85, repeat: Infinity }}
      />

      {/* Name label */}
      <p
        className="absolute pointer-events-none whitespace-nowrap text-center"
        style={{
          bottom: "-22px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "7px",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: isHov ? "rgba(212,175,55,0.48)" : "rgba(212,175,55,0.16)",
          transition: "color 0.5s ease",
        }}
      >
        {client.name}
      </p>
    </motion.div>
  );
}

export function Clients() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-12%" });

  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - r.left) / r.width  - 0.5) * 12);
    mouseY.set(((e.clientY - r.top)  / r.height - 0.5) * 12);
  }
  function onMouseLeave() { mouseX.set(0); mouseY.set(0); }

  // Different orbital velocities for depth
  const innerOrbitT = { duration: 80,  repeat: Infinity, ease: "linear" as const };
  const outerOrbitT = { duration: 115, repeat: Infinity, ease: "linear" as const };

  return (
    <>
      <Divider />
      <section ref={sectionRef} className="py-[100px] md:py-[130px] px-8 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">

          {/* Header */}
          <Reveal className="mb-8 md:mb-20">
            <Label>Confianza</Label>
            <h2 className="mt-5 text-ink leading-[1.08] max-w-[680px]" style={{ fontSize: "clamp(26px, 3.2vw, 44px)", letterSpacing: "-0.03em" }}>
              Empresas que confiaron en nosotros para crecer con estructura, no con intuición.
            </h2>
            <p className="mt-4 text-secondary text-[13px] leading-[1.85] font-light max-w-[500px]">
              No mostramos logos. Mostramos relaciones construidas sobre dirección, sistema y ejecución.
            </p>
            <motion.div
              className="mt-6 flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                className="w-[5px] h-[5px] rounded-full flex-shrink-0"
                style={{ background: "#D4AF37" }}
                animate={{ opacity: [0.25, 0.90, 0.25] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
              <span className="text-[9px] tracking-[0.36em] uppercase" style={{ color: "rgba(212,175,55,0.32)" }}>
                10 unidades conectadas
              </span>
              <span className="h-px flex-1 max-w-[60px]" style={{ background: "rgba(212,175,55,0.10)" }} />
              <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.18)" }}>
                sys: activo
              </span>
            </motion.div>
          </Reveal>

          {/* ── Desktop: Velocity Dashboard ──────────────────────────────── */}
          <div
            className="relative hidden md:flex items-center justify-center"
            style={{ height: VD_SIZE }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <motion.div
              style={{ width: VD_SIZE, height: VD_SIZE, position: "relative", x: springX, y: springY }}
            >

              {/* ── Background instrument SVG ────────────────────────── */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox={`0 0 ${VD_SIZE} ${VD_SIZE}`}
              >
                {/* Axis crosshair lines */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 0.6 }}
                >
                  {VD_AXIS.map((a, i) => (
                    <line
                      key={i}
                      x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2}
                      stroke="#D4AF37"
                      strokeWidth={0.4}
                      strokeOpacity={0.045}
                      strokeDasharray="1.5 7"
                    />
                  ))}
                </motion.g>

                {/* Inner reference ring (r=90) */}
                <motion.circle
                  cx={VD_CX} cy={VD_CY} r={90}
                  fill="none" stroke="#D4AF37"
                  strokeWidth={0.35} strokeOpacity={0.05}
                  strokeDasharray="1 8"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.0, delay: 0.8 }}
                />

                {/* Inner orbit ring (r=130) — draws in */}
                <motion.circle
                  cx={VD_CX} cy={VD_CY} r={VD_INNER_R}
                  fill="none" stroke="#D4AF37"
                  strokeWidth={0.45} strokeOpacity={0.09}
                  strokeDasharray="1 7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 1.8, delay: 0.5, ease: [0.08, 0.82, 0.17, 1] }}
                />

                {/* Velocity calibration segments (r=192) */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.0, delay: 1.4 }}
                >
                  {VD_VEL_SEGS.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth={0.5}
                      strokeOpacity={0.07}
                      strokeLinecap="round"
                    />
                  ))}
                </motion.g>

                {/* Outer orbit ring (r=255) — draws in */}
                <motion.circle
                  cx={VD_CX} cy={VD_CY} r={VD_OUTER_R}
                  fill="none" stroke="#D4AF37"
                  strokeWidth={0.45} strokeOpacity={0.10}
                  strokeDasharray="1 7"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                  transition={{ duration: 2.2, delay: 0.3, ease: [0.08, 0.82, 0.17, 1] }}
                />

                {/* Outer boundary ring (r=282) */}
                <motion.circle
                  cx={VD_CX} cy={VD_CY} r={282}
                  fill="none" stroke="#D4AF37"
                  strokeWidth={0.3} strokeOpacity={0.04}
                  strokeDasharray="2 12"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 1.2, delay: 1.8 }}
                />
              </svg>

              {/* ── Center hub ───────────────────────────────────────── */}
              <motion.div
                className="absolute pointer-events-none"
                style={{ left: VD_CX - 32, top: VD_CY - 32, width: 64, height: 64 }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1.0, delay: 2.2, ease: [0.08, 0.82, 0.17, 1] }}
              >
                <svg viewBox="0 0 64 64" className="absolute inset-0 w-full h-full">
                  {/* Rings */}
                  <circle cx="32" cy="32" r="22" fill="none" stroke="#D4AF37" strokeWidth="0.45" strokeOpacity="0.16"/>
                  <circle cx="32" cy="32" r="15" fill="none" stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.11"/>
                  <circle cx="32" cy="32" r="8"  fill="none" stroke="#D4AF37" strokeWidth="0.30" strokeOpacity="0.18"/>
                  {/* Cardinal arms */}
                  <line x1="32" y1="10" x2="32" y2="24" stroke="#D4AF37" strokeWidth="0.45" strokeOpacity="0.18"/>
                  <line x1="32" y1="40" x2="32" y2="54" stroke="#D4AF37" strokeWidth="0.45" strokeOpacity="0.18"/>
                  <line x1="10" y1="32" x2="24" y2="32" stroke="#D4AF37" strokeWidth="0.45" strokeOpacity="0.18"/>
                  <line x1="40" y1="32" x2="54" y2="32" stroke="#D4AF37" strokeWidth="0.45" strokeOpacity="0.18"/>
                  {/* Diagonal micro-marks */}
                  <line x1="21" y1="21" x2="25.5" y2="25.5" stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.09"/>
                  <line x1="43" y1="21" x2="38.5" y2="25.5" stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.09"/>
                  <line x1="21" y1="43" x2="25.5" y2="38.5" stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.09"/>
                  <line x1="43" y1="43" x2="38.5" y2="38.5" stroke="#D4AF37" strokeWidth="0.35" strokeOpacity="0.09"/>
                </svg>
                {/* Pulsing center dot */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    left: "50%", top: "50%",
                    width: "5px", height: "5px",
                    transform: "translate(-50%, -50%)",
                    background: "#D4AF37",
                  }}
                  animate={{ opacity: [0.30, 0.80, 0.30], scale: [1, 1.3, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* ── Inner orbit — 4 nodes, 80s ───────────────────────── */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={innerOrbitT}
              >
                {CLIENTS.slice(0, 4).map((c, i) => {
                  const pos = VD_INNER_POS[i];
                  return (
                    <motion.div
                      key={c.name}
                      className="absolute"
                      style={{ left: pos.left, top: pos.top, width: VD_NODE, height: VD_NODE }}
                      animate={{ rotate: -360 }}
                      transition={innerOrbitT}
                    >
                      <VelocityNode
                        client={c}
                        index={i}
                        inView={inView}
                        entranceDelay={2.6 + i * 0.12}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* ── Outer orbit — 6 nodes, 115s ─────────────────────── */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={outerOrbitT}
              >
                {CLIENTS.slice(4).map((c, i) => {
                  const pos = VD_OUTER_POS[i];
                  return (
                    <motion.div
                      key={c.name}
                      className="absolute"
                      style={{ left: pos.left, top: pos.top, width: VD_NODE, height: VD_NODE }}
                      animate={{ rotate: -360 }}
                      transition={outerOrbitT}
                    >
                      <VelocityNode
                        client={c}
                        index={i + 4}
                        inView={inView}
                        entranceDelay={2.7 + (i + 4) * 0.10}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

            </motion.div>
          </div>

          {/* ── Mobile: 3-col velocity grid ──────────────────────────────── */}
          <div className="grid grid-cols-3 gap-8 md:hidden place-items-center">
            {CLIENTS.map((c, i) => (
              <VelocityNode
                key={c.name}
                client={c}
                index={i}
                inView={inView}
                entranceDelay={0.1 + i * 0.07}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROCESS — Galactic Architecture
   ═══════════════════════════════════════════════════════════ */

const GC_W = 580;
const GC_H = 500;
const GCX = GC_W / 2;  // 290
const GCY = GC_H / 2;  // 250

const GALAXY_NODES = [
  { n: "01", week: "Semana 1",   title: "Diagnóstico estratégico",   desc: "Evitamos que tomes decisiones costosas sin claridad estratégica.", r: 72,  angle: 325 },
  { n: "02", week: "Semana 2",   title: "Definición narrativa",       desc: "Definimos el mensaje que realmente conecta y posiciona tu marca.",  r: 140, angle: 58  },
  { n: "03", week: "Semana 3–4", title: "Arquitectura de conversión", desc: "Construimos una estructura que guía al usuario hacia la acción.",    r: 200, angle: 212 },
  { n: "04", week: "Semana 5–6", title: "Implementación digital",     desc: "Implementamos un sistema listo para operar y escalar.",              r: 252, angle: 128 },
];

// Fixed stars — no Math.random to avoid SSR hydration mismatch
const GALAXY_STARS = [
  { cx: 42,  cy: 18,  r: 0.8, o: 0.35 }, { cx: 510, cy: 44,  r: 0.6, o: 0.25 },
  { cx: 78,  cy: 380, r: 0.7, o: 0.30 }, { cx: 520, cy: 420, r: 0.9, o: 0.40 },
  { cx: 145, cy: 60,  r: 0.5, o: 0.20 }, { cx: 440, cy: 80,  r: 0.6, o: 0.28 },
  { cx: 30,  cy: 220, r: 0.7, o: 0.22 }, { cx: 555, cy: 185, r: 0.5, o: 0.18 },
  { cx: 200, cy: 470, r: 0.8, o: 0.32 }, { cx: 385, cy: 462, r: 0.6, o: 0.24 },
  { cx: 95,  cy: 140, r: 0.4, o: 0.16 }, { cx: 490, cy: 330, r: 0.7, o: 0.30 },
  { cx: 162, cy: 320, r: 0.5, o: 0.20 }, { cx: 422, cy: 148, r: 0.6, o: 0.26 },
  { cx: 312, cy: 32,  r: 0.4, o: 0.18 }, { cx: 58,  cy: 462, r: 0.8, o: 0.34 },
  { cx: 540, cy: 262, r: 0.5, o: 0.22 }, { cx: 252, cy: 490, r: 0.7, o: 0.28 },
];

function gToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function gCurvePath(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number) {
  const qx = (x1 + x2) / 2 + (cx - (x1 + x2) / 2) * 0.40;
  const qy = (y1 + y2) / 2 + (cy - (y1 + y2) / 2) * 0.40;
  return `M ${x1} ${y1} Q ${qx} ${qy} ${x2} ${y2}`;
}

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState<string | null>(null);

  const nodePositions = GALAXY_NODES.map((node) => {
    const pos = gToXY(GCX, GCY, node.r, node.angle);
    const rightSide = pos.x > GCX;
    return {
      ...node,
      ...pos,
      tipAnchor: rightSide ? ("start" as const) : ("end" as const),
      tipX: rightSide ? pos.x + 16 : pos.x - 16,
    };
  });

  return (
    <>
      <Divider />
      <section
        ref={ref}
        id="process"
        className="relative py-[120px] md:py-[160px] px-8 overflow-hidden"
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(212,175,55,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.015) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="max-w-[1280px] mx-auto relative z-10">

          {/* ── Desktop: two-column galactic layout ─────────────── */}
          <div className="hidden md:grid md:grid-cols-[400px_1fr] gap-16 lg:gap-24 items-start">

            {/* Left: sticky header + stage list */}
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Reveal><Label>Metodología</Label></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 text-ink leading-[1.06]" style={{ fontSize: "clamp(32px, 4vw, 56px)", letterSpacing: "-0.03em" }}>
                  Un método.<br />Sin improvisación.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-secondary text-[14px] leading-[1.9] font-light max-w-[340px]">
                  Cuatro fases estructuradas. Cada semana tiene un entregable. Cada decisión tiene un impacto medible en tu negocio.
                </p>
              </Reveal>

              {/* Stage list */}
              <div className="mt-14">
                {nodePositions.map((node, i) => (
                  <motion.div
                    key={node.n}
                    className="relative py-5 cursor-default"
                    style={{ borderTop: "1px solid rgba(212,175,55,0.07)" }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: [0.08, 0.82, 0.17, 1] }}
                    onMouseEnter={() => setHovered(node.n)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Active indicator line */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{ background: "#D4AF37" }}
                      animate={{ opacity: hovered === node.n ? 0.85 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                    <div className="pl-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-[9px] tracking-[0.32em] uppercase font-medium transition-colors duration-300"
                          style={{ color: hovered === node.n ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.28)" }}
                        >
                          {node.n} · {node.week}
                        </span>
                      </div>
                      <h3
                        className="font-medium leading-[1.3] transition-colors duration-300"
                        style={{
                          fontSize: "15px",
                          letterSpacing: "-0.02em",
                          color: hovered === node.n ? "#D4AF37" : "rgba(255,255,255,0.52)",
                        }}
                      >
                        {node.title}
                      </h3>
                      <motion.div
                        style={{ overflow: "hidden" }}
                        animate={{
                          height: hovered === node.n ? "auto" : 0,
                          opacity: hovered === node.n ? 1 : 0,
                          marginTop: hovered === node.n ? "10px" : "0px",
                        }}
                        transition={{ duration: 0.32, ease: [0.08, 0.82, 0.17, 1] }}
                      >
                        <p className="text-secondary text-[12px] leading-[1.85] font-light">
                          {node.desc}
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
                <div style={{ borderTop: "1px solid rgba(212,175,55,0.07)" }} />
              </div>
            </div>

            {/* Right: Galactic SVG */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1.3, delay: 0.12, ease: [0.08, 0.82, 0.17, 1] }}
            >
              <svg
                viewBox={`0 0 ${GC_W} ${GC_H}`}
                className="w-full max-w-[560px]"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <radialGradient id="gcCoreGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.20" />
                    <stop offset="45%"  stopColor="#D4AF37" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"    />
                  </radialGradient>
                </defs>

                {/* Star field */}
                {GALAXY_STARS.map((s, i) => (
                  <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#D4AF37" opacity={s.o} />
                ))}

                {/* Orbital rings */}
                {nodePositions.map((node) => (
                  <motion.circle
                    key={`ring-${node.n}`}
                    cx={GCX}
                    cy={GCY}
                    r={node.r}
                    fill="none"
                    stroke="#D4AF37"
                    strokeDasharray="3 14"
                    animate={{
                      strokeOpacity: hovered === node.n ? 0.28 : 0.07,
                      strokeWidth:   hovered === node.n ? 0.7  : 0.35,
                    }}
                    transition={{ duration: 0.4 }}
                  />
                ))}

                {/* Connection curves: center → node */}
                {nodePositions.map((node, i) => {
                  const pathD = gCurvePath(GCX, GCY, node.x, node.y, GCX, GCY);
                  const isActive = hovered === node.n;
                  return (
                    <g key={`conn-${node.n}`}>
                      {/* Base path — entrance draw */}
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth={isActive ? 0.8 : 0.45}
                        strokeOpacity={isActive ? 0.35 : 0.10}
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 1.5, delay: 0.45 + i * 0.18, ease: [0.08, 0.82, 0.17, 1] }}
                      />
                      {/* Energy flow particle */}
                      <motion.path
                        d={pathD}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth={isActive ? 1.4 : 0.9}
                        strokeOpacity={isActive ? 0.70 : 0.28}
                        strokeDasharray="5 110"
                        animate={{ strokeDashoffset: [0, -115] }}
                        transition={{
                          strokeDashoffset: { duration: 3.2 + i * 0.8, repeat: Infinity, ease: "linear", delay: i * 0.9 },
                        }}
                      />
                    </g>
                  );
                })}

                {/* Central glow halo */}
                <circle cx={GCX} cy={GCY} r={60} fill="url(#gcCoreGlow)" />

                {/* Central core */}
                <circle cx={GCX} cy={GCY} r={16} fill="none" stroke="#D4AF37" strokeWidth={0.3} strokeOpacity={0.10} strokeDasharray="2 8" />
                <circle cx={GCX} cy={GCY} r={9}  fill="none" stroke="#D4AF37" strokeWidth={0.5} strokeOpacity={0.20} />
                <circle cx={GCX} cy={GCY} r={4}  fill="#D4AF37" fillOpacity={0.80} />

                {/* Nodes */}
                {nodePositions.map((node, i) => {
                  const isActive = hovered === node.n;
                  return (
                    <motion.g
                      key={`node-${node.n}`}
                      onMouseEnter={() => setHovered(node.n)}
                      onMouseLeave={() => setHovered(null)}
                      style={{ cursor: "default" }}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ duration: 0.9, delay: 0.65 + i * 0.2 }}
                    >
                      {/* Glow halo */}
                      <motion.circle
                        cx={node.x} cy={node.y} r={24}
                        fill="#D4AF37"
                        animate={{ opacity: isActive ? 0.09 : 0 }}
                        transition={{ duration: 0.4 }}
                      />
                      {/* Breathing pulse ring */}
                      <motion.circle
                        cx={node.x} cy={node.y}
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth={0.5}
                        animate={{ r: [10, 15, 10], opacity: [0.18, 0.04, 0.18] }}
                        transition={{ duration: 4.5 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 1.2 }}
                      />
                      {/* Node circle */}
                      <motion.circle
                        cx={node.x} cy={node.y}
                        fill="#000000"
                        stroke="#D4AF37"
                        animate={{
                          r:            isActive ? 8 : 6,
                          strokeWidth:  isActive ? 1.0 : 0.55,
                          strokeOpacity: isActive ? 0.80 : 0.32,
                        }}
                        initial={{ r: 6, strokeWidth: 0.55, strokeOpacity: 0.32 }}
                        transition={{ duration: 0.3 }}
                      />
                      {/* Node number */}
                      <motion.text
                        x={node.x} y={node.y + 0.5}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={5.5}
                        fontFamily="Space Grotesk, Inter, sans-serif"
                        letterSpacing="0.08em"
                        animate={{
                          fill: isActive ? "#D4AF37" : "rgba(212,175,55,0.55)",
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {node.n}
                      </motion.text>

                      {/* Tooltip — always in DOM, animated opacity */}
                      <motion.g
                        pointerEvents="none"
                        animate={{ opacity: isActive ? 1 : 0 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <text
                          x={node.tipX} y={node.y - 6}
                          textAnchor={node.tipAnchor}
                          fontSize={5.5}
                          fontFamily="Space Grotesk, Inter, sans-serif"
                          letterSpacing="0.22em"
                          fill="rgba(212,175,55,0.50)"
                        >
                          {node.week.toUpperCase()}
                        </text>
                        <text
                          x={node.tipX} y={node.y + 7}
                          textAnchor={node.tipAnchor}
                          fontSize={7}
                          fontFamily="Space Grotesk, Inter, sans-serif"
                          letterSpacing="-0.01em"
                          fill="#D4AF37"
                          fontWeight="500"
                        >
                          {node.title}
                        </text>
                      </motion.g>
                    </motion.g>
                  );
                })}
              </svg>
            </motion.div>
          </div>

          {/* ── Mobile: vertical stack ───────────────────────────── */}
          <div className="md:hidden">
            <Reveal><Label>Metodología</Label></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 text-ink leading-[1.06]" style={{ fontSize: "clamp(32px, 6vw, 48px)", letterSpacing: "-0.03em" }}>
                Un método. Sin improvisación.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-secondary text-[14px] leading-[1.9] font-light">
                Cuatro fases. Cada entregable, en tiempo.
              </p>
            </Reveal>

            <div className="mt-12">
              {GALAXY_NODES.map((node, i) => (
                <Reveal key={node.n} delay={0.08 + i * 0.1}>
                  <div className="relative flex gap-6 py-8" style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}>
                    <div className="flex flex-col items-center flex-shrink-0 pt-1">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ border: "1px solid rgba(212,175,55,0.25)", background: "rgba(212,175,55,0.03)" }}
                      >
                        <span className="text-[9px] font-light" style={{ color: "rgba(212,175,55,0.60)" }}>{node.n}</span>
                      </div>
                      {i < GALAXY_NODES.length - 1 && (
                        <div
                          className="mt-3 w-px flex-1"
                          style={{
                            background: "repeating-linear-gradient(to bottom, rgba(212,175,55,0.12) 0, rgba(212,175,55,0.12) 3px, transparent 3px, transparent 9px)",
                            minHeight: "40px",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[9px] tracking-[0.30em] uppercase mb-2" style={{ color: "rgba(212,175,55,0.35)" }}>{node.week}</p>
                      <h3 className="text-ink font-semibold leading-[1.25] mb-3" style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>{node.title}</h3>
                      <div className="w-5 h-px mb-3" style={{ background: "rgba(212,175,55,0.20)" }} />
                      <p className="text-secondary text-[13px] leading-[1.85] font-light">{node.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }} />
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

/* ── FIT DEL PROYECTO — data ────────────────────────────────────────────────*/
const FIT_IDEAL = [
  { n: "01", text: "Negocios que venden servicios o tickets altos y necesitan un sistema que los soporte." },
  { n: "02", text: "Marcas que ya invierten en marketing pero no ven los resultados que esperaban." },
  { n: "03", text: "Equipos que necesitan claridad de mensaje, más autoridad y mejores leads." },
  { n: "04", text: "Empresas que valoran la estrategia, el diseño y la ejecución como una sola cosa." },
];

const FIT_NOT = [
  { n: "01", text: "Negocios en etapa inicial sin modelo de negocio validado." },
  { n: "02", text: "Quienes buscan soluciones rápidas, económicas o de bajo compromiso." },
  { n: "03", text: "Quienes necesitan presencia sin objetivo comercial definido." },
  { n: "04", text: "Quienes no están listos para invertir en arquitectura seria." },
];

// Precomputed ring tick marks — deterministic trig, SSR-safe
const FIT_CX = 720; const FIT_CY = 400;
function mkFitTicks(r: number, count: number, len: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i * 2 * Math.PI) / count;
    return { x1: FIT_CX + Math.cos(a) * r, y1: FIT_CY + Math.sin(a) * r, x2: FIT_CX + Math.cos(a) * (r + len), y2: FIT_CY + Math.sin(a) * (r + len) };
  });
}
const FIT_TICKS_1 = mkFitTicks(220, 32, 4);
const FIT_TICKS_2 = mkFitTicks(342, 24, 6);
const FIT_TICKS_3 = mkFitTicks(464, 16, 9);

// Fixed scattered micro-dots
const FIT_DOTS = [
  { x:145, y:92,  r:1.0, a:"al-a", o:0.55 }, { x:310, y:178, r:0.7, a:"al-b", o:0.40 },
  { x:578, y:52,  r:1.2, a:"al-c", o:0.50 }, { x:722, y:126, r:0.8, a:"al-a", o:0.28 },
  { x:894, y:70,  r:1.0, a:"al-b", o:0.45 }, { x:1104,y:156, r:0.6, a:"al-c", o:0.38 },
  { x:1282,y:86,  r:1.1, a:"al-a", o:0.55 }, { x:198, y:646, r:0.9, a:"al-b", o:0.38 },
  { x:464, y:704, r:0.7, a:"al-c", o:0.30 }, { x:684, y:716, r:1.0, a:"al-a", o:0.45 },
  { x:952, y:684, r:0.8, a:"al-b", o:0.38 }, { x:1184,y:706, r:0.6, a:"al-c", o:0.28 },
  { x:1354,y:636, r:1.2, a:"al-a", o:0.48 }, { x:58,  y:320, r:0.8, a:"al-b", o:0.35 },
  { x:76,  y:482, r:1.0, a:"al-c", o:0.28 }, { x:1384,y:346, r:0.7, a:"al-a", o:0.38 },
  { x:1364,y:526, r:0.9, a:"al-b", o:0.28 }, { x:400, y:400, r:0.6, a:"al-c", o:0.18 },
  { x:1040,y:390, r:0.6, a:"al-a", o:0.18 }, { x:720, y:248, r:0.8, a:"al-b", o:0.22 },
  { x:720, y:552, r:0.8, a:"al-c", o:0.22 },
];

function FitBG() {
  return (
    <svg
      width="100%" height="100%"
      viewBox="0 0 1440 800"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0"
      aria-hidden="true"
    >
      <defs>
        <pattern id="fit-grid-sm" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(212,175,55,0.04)" strokeWidth="0.5" />
        </pattern>
        <pattern id="fit-grid-lg" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M200 0L0 0 0 200" fill="none" stroke="rgba(212,175,55,0.075)" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="fit-center-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(212,175,55,0.09)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        <radialGradient id="fit-vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.92)" />
        </radialGradient>
        <linearGradient id="fit-scan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="rgba(212,175,55,0)" />
          <stop offset="50%"  stopColor="rgba(212,175,55,0.13)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </linearGradient>
      </defs>

      {/* Fine grid — slow drift */}
      <motion.g animate={{ x: [0, 40], y: [0, 40] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
        <rect x="-40" y="-40" width="1520" height="880" fill="url(#fit-grid-sm)" />
      </motion.g>

      {/* Major grid — very slow drift */}
      <motion.g animate={{ x: [0, 200], y: [0, 200] }} transition={{ duration: 48, repeat: Infinity, ease: "linear" }}>
        <rect x="-200" y="-200" width="1840" height="1200" fill="url(#fit-grid-lg)" />
      </motion.g>

      {/* Central ambient glow */}
      <ellipse cx={FIT_CX} cy={FIT_CY} rx="500" ry="340" fill="url(#fit-center-glow)" />

      {/* Orbital ring 1 — r=220, CW, 108s */}
      <motion.g
        style={{ transformOrigin: `${FIT_CX}px ${FIT_CY}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 108, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={FIT_CX} cy={FIT_CY} r="220" fill="none" stroke="rgba(212,175,55,0.07)" strokeWidth="0.5" strokeDasharray="3 12" />
        {FIT_TICKS_1.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(212,175,55,0.13)" strokeWidth="0.5" />
        ))}
        <circle cx={FIT_CX + 220} cy={FIT_CY} r="4" fill="none" stroke="rgba(212,175,55,0.55)" strokeWidth="0.8" />
        <circle cx={FIT_CX + 220} cy={FIT_CY} r="1.5" fill="rgba(212,175,55,0.75)" />
      </motion.g>

      {/* Orbital ring 2 — r=342, CCW, 162s */}
      <motion.g
        style={{ transformOrigin: `${FIT_CX}px ${FIT_CY}px` }}
        animate={{ rotate: -360 }}
        transition={{ duration: 162, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={FIT_CX} cy={FIT_CY} r="342" fill="none" stroke="rgba(212,175,55,0.055)" strokeWidth="0.5" strokeDasharray="1 18" />
        {FIT_TICKS_2.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(212,175,55,0.09)" strokeWidth="0.5" />
        ))}
        <circle cx={FIT_CX + 342} cy={FIT_CY} r="5" fill="none" stroke="rgba(212,175,55,0.42)" strokeWidth="0.8" />
        <circle cx={FIT_CX + 342} cy={FIT_CY} r="2" fill="rgba(212,175,55,0.62)" />
      </motion.g>

      {/* Orbital ring 3 — r=464, CW, 225s */}
      <motion.g
        style={{ transformOrigin: `${FIT_CX}px ${FIT_CY}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 225, repeat: Infinity, ease: "linear" }}
      >
        <circle cx={FIT_CX} cy={FIT_CY} r="464" fill="none" stroke="rgba(212,175,55,0.038)" strokeWidth="0.5" strokeDasharray="6 28" />
        {FIT_TICKS_3.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgba(212,175,55,0.07)" strokeWidth="0.5" />
        ))}
        <circle cx={FIT_CX + 464} cy={FIT_CY} r="5.5" fill="none" stroke="rgba(212,175,55,0.30)" strokeWidth="0.8" />
        <circle cx={FIT_CX + 464} cy={FIT_CY} r="2.2" fill="rgba(212,175,55,0.50)" />
      </motion.g>

      {/* Central precision reticle */}
      <g stroke="rgba(212,175,55,0.22)" strokeWidth="0.7" fill="none">
        <circle cx={FIT_CX} cy={FIT_CY} r="14" />
        <circle cx={FIT_CX} cy={FIT_CY} r="4.5" fill="rgba(212,175,55,0.28)" strokeWidth="0" />
        <line x1={FIT_CX - 32} y1={FIT_CY} x2={FIT_CX - 16} y2={FIT_CY} />
        <line x1={FIT_CX + 16} y1={FIT_CY} x2={FIT_CX + 32} y2={FIT_CY} />
        <line x1={FIT_CX} y1={FIT_CY - 32} x2={FIT_CX} y2={FIT_CY - 16} />
        <line x1={FIT_CX} y1={FIT_CY + 16} x2={FIT_CX} y2={FIT_CY + 32} />
      </g>

      {/* Scan line — sweeps full height with glowing trail */}
      <motion.g
        animate={{ y: [-80, 880] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 10 }}
      >
        <rect x="0" y="-40" width="1440" height="80" fill="url(#fit-scan)" />
        <line x1="0" y1="0" x2="1440" y2="0" stroke="rgba(212,175,55,0.2)" strokeWidth="0.8" />
      </motion.g>

      {/* Corner precision brackets */}
      <g stroke="rgba(212,175,55,0.28)" strokeWidth="0.9" fill="none">
        <path d="M 60 16 L 16 16 L 16 60" />
        <path d="M 1380 16 L 1424 16 L 1424 60" />
        <path d="M 60 784 L 16 784 L 16 740" />
        <path d="M 1380 784 L 1424 784 L 1424 740" />
      </g>

      {/* Technical readout labels */}
      <g fill="rgba(212,175,55,0.28)" fontSize="7.5" fontFamily="'Space Grotesk', monospace" letterSpacing="0.18em">
        <text x="28" y="12">SYS.REF / 00°N</text>
        <text x="28" y="793">FIT.MATRIX / v2.4</text>
        <text x="1092" y="12">CAL.ΔSYS / 0.97</text>
        <text x="1058" y="793">EXEC.LAYER / ACTIVE</text>
      </g>

      {/* Scattered precision micro-dots */}
      {FIT_DOTS.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={`rgba(212,175,55,${d.o})`} className={d.a} />
      ))}

      {/* Edge vignette */}
      <rect width="1440" height="800" fill="url(#fit-vignette)" />
    </svg>
  );
}

export function Engagement() {
  return (
    <>
      <Divider />
      <section
        id="engagement"
        className="relative py-[100px] md:py-[180px] px-8 overflow-hidden"
        style={{ background: "#041E39" }}
      >
        {/* Animated blueprint background */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <FitBG />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto">
          <Reveal><Label>Fit del proyecto</Label></Reveal>

          <Reveal delay={0.1}>
            <h2
              className="mt-6 text-ink leading-[1.06]"
              style={{ fontSize: "clamp(38px, 5vw, 66px)" }}
            >
              Para quién sí<br className="hidden md:block" /> tiene sentido.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 border border-divider">
            {/* IDEAL PARA */}
            <Reveal delay={0.15}>
              <div
                className="p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-divider relative"
                style={{ backdropFilter: "blur(4px)", background: "rgba(4,30,57,0.72)" }}
              >
                <div className="absolute top-0 left-0 w-2/3 h-[1px]" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0) 100%)" }} />
                <p className="text-[10px] font-semibold tracking-[0.42em] uppercase mb-10" style={{ color: "rgba(212,175,55,0.5)" }}>
                  Ideal para
                </p>
                <div className="space-y-9">
                  {FIT_IDEAL.map((item) => (
                    <div key={item.n} className="flex gap-6 items-start">
                      <span className="text-[11px] font-semibold tracking-[0.22em] flex-shrink-0 mt-[4px]" style={{ color: "rgba(212,175,55,0.42)" }}>
                        {item.n}
                      </span>
                      <p className="text-[15px] font-light leading-[1.82]" style={{ color: "rgba(248,246,241,0.88)" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* NO ES PARA */}
            <Reveal delay={0.25}>
              <div
                className="p-10 md:p-14 relative"
                style={{ backdropFilter: "blur(4px)", background: "rgba(6,22,42,0.78)" }}
              >
                <div className="absolute top-0 left-1/4 right-1/4 h-[1px]" style={{ background: "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.22) 50%, rgba(212,175,55,0) 100%)" }} />
                <p className="text-[10px] font-semibold tracking-[0.42em] uppercase mb-10" style={{ color: "rgba(212,175,55,0.55)" }}>
                  No es para
                </p>
                <div className="space-y-9">
                  {FIT_NOT.map((item) => (
                    <div key={item.n} className="flex gap-6 items-start">
                      <span className="text-[11px] font-semibold tracking-[0.22em] flex-shrink-0 mt-[4px]" style={{ color: "rgba(212,175,55,0.50)" }}>
                        {item.n}
                      </span>
                      <p className="text-[15px] font-light leading-[1.82]" style={{ color: "rgba(201,209,217,0.78)" }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.35}>
            <div className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <CTA href="/fit" onClick={() => trackCTAClick("engagement")}>Aplicar para diagnóstico estratégico</CTA>
              <p className="text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
                Solo aceptamos 4–6 proyectos por trimestre.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTACT — qualification application
   ═══════════════════════════════════════════════════════════ */

// ── Web Audio sound engine — lazy init, SSR-safe ────────────────────────────
let _audioCtx: AudioContext | null = null;
function playKeySound() {
  try {
    if (typeof window === "undefined") return;
    if (!_audioCtx) _audioCtx = new AudioContext();
    const ctx = _audioCtx;
    const t   = ctx.currentTime;
    // Oscillator sweep
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1300, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.042);
    gain.gain.setValueAtTime(0.052, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.062);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.08);
    // Noise burst
    const bufLen = Math.floor(ctx.sampleRate * 0.038);
    const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data   = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() - 0.5) * 0.22;
    const ns  = ctx.createBufferSource();
    const ng  = ctx.createGain();
    ns.buffer = buf;
    ng.gain.setValueAtTime(0.028, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.038);
    ns.connect(ng); ng.connect(ctx.destination);
    ns.start(t); ns.stop(t + 0.04);
  } catch {}
}

const CONTACT_FIELDS = [
  { id: "name",    n: "01", label: "Nombre completo",          type: "text"     as const },
  { id: "email",   n: "02", label: "Email corporativo",        type: "email"    as const },
  { id: "company", n: "03", label: "Empresa",                  type: "text"     as const },
  { id: "budget",  n: "04", label: "Revenue anual aproximado", type: "select"   as const },
  { id: "needs",   n: "05", label: "¿Qué quieres resolver?",   type: "textarea" as const },
] as const;

const BUDGET_OPTS = [
  "Menos de $500K USD",
  "$500K – $2M USD",
  "$2M – $10M USD",
  "$10M – $50M USD",
  "$50M+ USD",
];

type ContactKey = "name" | "company" | "email" | "needs" | "budget";

export function Contact() {
  const [formData, setFormData] = useState<Record<ContactKey, string>>({
    name: "", company: "", email: "", needs: "", budget: "",
  });
  const [active,      setActive]      = useState<string | null>(null);
  const [status,      setStatus]      = useState<"idle" | "loading" | "success" | "error">("idle");
  const [attribution, setAttribution] = useState<Record<string, string>>({});

  useEffect(() => {
    const p    = new URLSearchParams(window.location.search);
    const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
    const attrs: Record<string, string> = {};
    keys.forEach((k) => { const v = p.get(k); if (v) attrs[k] = v; });
    if (Object.keys(attrs).length) setAttribution(attrs);
  }, []);

  function handleChange(key: ContactKey, value: string) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    trackLeadIntent("contact-form");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...formData, ...attribution }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputCls = "w-full bg-transparent text-[14px] font-light focus:outline-none placeholder:opacity-20";
  const inputStyle = { color: "rgba(212,175,55,0.88)", caretColor: "rgba(212,175,55,1)" } as React.CSSProperties;

  return (
    <>
      <Divider />
      <section id="contact" className="py-[120px] md:py-[140px] px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16 lg:gap-20">

            {/* ── Left — context ── */}
            <div className="lg:sticky lg:top-[120px] lg:self-start">
              <Reveal><Label>Evaluación Estratégica</Label></Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-5 text-ink leading-[1.08]" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                  Aplicación para evaluación estratégica.
                </h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 text-[15px] font-light leading-[1.85] text-justify" style={{ color: "rgba(201,209,217,0.75)" }}>
                  Nuestro equipo revisará tu caso y te contactará si hay ajuste estratégico.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-10 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-ink" style={{ animation: "pulseGlow 2.2s ease-in-out infinite" }} />
                    <span className="text-[9px] tracking-[0.32em] uppercase" style={{ color: "rgba(212,175,55,0.35)" }}>Canal seguro activo</span>
                  </div>
                  <p className="text-[11px] font-light pl-[18px]" style={{ color: "rgba(212,175,55,0.25)" }}>executive@ikingdom.org</p>
                  <p className="text-[11px] font-light pl-[18px]" style={{ color: "rgba(212,175,55,0.25)" }}>San Diego, California · EE.UU.</p>
                </div>
              </Reveal>
            </div>

            {/* ── Right — table interface ── */}
            <Reveal delay={0.15}>
              {status === "success" ? (
                /* ── Success — system terminal response ── */
                <div style={{ border: "1px solid rgba(212,175,55,0.18)" }}>
                  <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.012)" }}>
                    <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(212,175,55,0.35)" }}>DATA.INTAKE / RESPUESTA.SISTEMA</span>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink" style={{ animation: "pulseGlow 1.8s ease-in-out infinite" }} />
                      <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.4)" }}>PROCESANDO</span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-ink flex-shrink-0" />
                      <p className="text-[12px] tracking-[0.28em] uppercase font-semibold text-ink">DATOS RECIBIDOS</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "rgba(212,175,55,0.5)" }} />
                      <p className="text-[12px] tracking-[0.25em] uppercase font-light" style={{ color: "rgba(212,175,55,0.6)" }}>PROCESANDO DIAGNÓSTICO...</p>
                    </div>
                    {/* Progress bar */}
                    <div className="relative h-px w-full overflow-hidden" style={{ background: "rgba(212,175,55,0.1)" }}>
                      <motion.div
                        className="absolute left-0 top-0 h-full"
                        style={{ background: "rgba(212,175,55,0.65)" }}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: [0.08, 0.82, 0.17, 1] }}
                      />
                    </div>
                    <p className="text-[13px] font-light leading-[1.75]" style={{ color: "rgba(212,175,55,0.45)" }}>
                      Responderemos dentro de las próximas 24 horas{formData.email ? <> a <span style={{ color: "rgba(212,175,55,0.75)" }}>{formData.email}</span></> : ""}.
                    </p>
                  </div>
                </div>
              ) : (
                /* ── Form — digital table ── */
                <form onSubmit={handleSubmit} noValidate>
                  {/* Table header */}
                  <div
                    className="flex items-center justify-between px-5 py-3 border-t border-b"
                    style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.012)" }}
                  >
                    <span className="text-[9px] tracking-[0.35em] uppercase" style={{ color: "rgba(212,175,55,0.32)" }}>DATA.INTAKE / CANAL.ENTRADA</span>
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-ink" style={{ animation: "pulseGlow 2s ease-in-out infinite" }} />
                      <span className="text-[9px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.28)" }}>CONEXIÓN SEGURA</span>
                    </div>
                  </div>

                  {/* Rows */}
                  {CONTACT_FIELDS.map((field) => {
                    const isActive = active === field.id;
                    return (
                      <div
                        key={field.id}
                        className="relative flex border-b transition-colors duration-150"
                        style={{
                          borderColor: "rgba(212,175,55,0.10)",
                          background: isActive ? "rgba(212,175,55,0.018)" : "transparent",
                        }}
                      >
                        {/* Active left accent */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-[2px] transition-opacity duration-150"
                          style={{ background: "rgba(212,175,55,0.55)", opacity: isActive ? 1 : 0 }}
                        />
                        {/* Row index */}
                        <div className="w-[52px] flex-shrink-0 flex items-start justify-center pt-5">
                          <span className="text-[9px] tracking-[0.18em] font-semibold" style={{ color: isActive ? "rgba(212,175,55,0.55)" : "rgba(212,175,55,0.18)" }}>
                            {field.n}
                          </span>
                        </div>
                        {/* Label + input */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5 py-4 pr-5">
                          <label
                            htmlFor={`cf-${field.id}`}
                            className="text-[10px] tracking-[0.35em] uppercase font-semibold flex-shrink-0 sm:w-[148px] pt-[1px] transition-colors duration-150"
                            style={{ color: isActive ? "rgba(212,175,55,0.65)" : "rgba(212,175,55,0.35)", cursor: "default" }}
                          >
                            {field.label}
                          </label>
                          <div className="flex-1">
                            {field.type === "textarea" ? (
                              <textarea
                                id={`cf-${field.id}`}
                                rows={3}
                                value={formData[field.id]}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                onKeyDown={() => playKeySound()}
                                onFocus={() => setActive(field.id)}
                                onBlur={() => setActive(null)}
                                className={inputCls + " resize-none"}
                                style={inputStyle}
                                placeholder="—"
                              />
                            ) : field.type === "select" ? (
                              <select
                                id={`cf-${field.id}`}
                                value={formData[field.id]}
                                onChange={(e) => { handleChange(field.id, e.target.value); playKeySound(); }}
                                onFocus={() => setActive(field.id)}
                                onBlur={() => setActive(null)}
                                className={inputCls + " appearance-none"}
                                style={{ ...inputStyle, color: formData[field.id] ? "rgba(212,175,55,0.88)" : "rgba(212,175,55,0.2)" }}
                              >
                                <option value="" className="bg-black">—</option>
                                {BUDGET_OPTS.map((o) => (
                                  <option key={o} value={o} className="bg-black">{o}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                id={`cf-${field.id}`}
                                type={field.type}
                                value={formData[field.id]}
                                onChange={(e) => handleChange(field.id, e.target.value)}
                                onKeyDown={() => playKeySound()}
                                onFocus={() => setActive(field.id)}
                                onBlur={() => setActive(null)}
                                className={inputCls}
                                style={inputStyle}
                                placeholder="—"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* CTA row */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-5 py-5 border-b"
                    style={{ borderColor: "rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.008)" }}
                  >
                    <div className="min-h-[20px]">
                      {status === "error" && (
                        <p className="text-[11px] font-light" style={{ color: "rgba(220,80,80,0.75)" }}>
                          Error al enviar. Intenta de nuevo.
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-3">
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="flex items-center gap-3 px-6 py-3 text-[11px] font-semibold tracking-[0.32em] uppercase transition-all duration-300 disabled:opacity-40"
                        style={{ border: "1px solid rgba(212,175,55,0.38)", color: "rgba(212,175,55,0.85)", background: "transparent" }}
                        onMouseEnter={(e) => { const el = e.currentTarget; el.style.background = "rgba(212,175,55,0.08)"; el.style.borderColor = "rgba(212,175,55,0.65)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget; el.style.background = "transparent"; el.style.borderColor = "rgba(212,175,55,0.38)"; }}
                      >
                        {status === "loading" ? (
                          <>
                            <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }} />
                            PROCESANDO
                          </>
                        ) : (
                          <>
                            SOLICITAR DIAGNÓSTICO ESTRATÉGICO
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                              <path d="M2 6.5h9M8 3l3.5 3.5L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </>
                        )}
                      </button>
                      <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>
                        Solo aceptamos 4–6 proyectos por trimestre.
                      </p>
                    </div>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   DISQUALIFICATION — selective / exclusive positioning
   ═══════════════════════════════════════════════════════════ */

export function DisqualificationSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const lines = [
    "No ejecutamos proyectos sin estrategia clara.",
    "No vendemos diseño decorativo ni presencia vacía.",
    "Trabajamos con empresas que quieren construir algo que funciona — no algo que solo se ve bien.",
  ];

  return (
    <>
      <Divider />
      <section ref={ref} className="py-[100px] md:py-[120px] px-8">
        <div className="max-w-[760px] mx-auto">

          <Reveal><Label>Selección</Label></Reveal>

          <Reveal delay={0.1}>
            <h2
              className="mt-5 text-ink leading-[1.06]"
              style={{ fontSize: "clamp(36px, 4.5vw, 58px)", letterSpacing: "-0.03em" }}
            >
              Si estás listo para operar a otro nivel.
            </h2>
          </Reveal>

          <div className="mt-12 pt-10" style={{ borderTop: "1px solid rgba(212,175,55,0.07)" }}>
            {lines.map((line, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-5 mb-7 last:mb-0"
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.2 + i * 0.12, ease: [0.08, 0.82, 0.17, 1] }}
              >
                <span
                  className="flex-shrink-0 mt-[10px]"
                  style={{ width: "20px", height: "1px", background: "rgba(212,175,55,0.22)" }}
                />
                <p
                  className="text-secondary font-light leading-[1.85]"
                  style={{ fontSize: "clamp(15px, 1.3vw, 17px)" }}
                >
                  {line}
                </p>
              </motion.div>
            ))}
          </div>

          <Reveal delay={0.58}>
            <div className="mt-14">
              <a
                href="/fit"
                data-hover
                onClick={() => trackCTAClick("disqualification")}
                className="group relative inline-flex items-center gap-3 px-8 py-[13px] text-[12px] font-semibold tracking-[0.18em] uppercase text-ink border border-ink/20 overflow-hidden transition-all duration-500 hover:text-bg hover:border-ink"
              >
                <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10 transition-colors duration-500">Aplicar para diagnóstico estratégico →</span>
              </a>
              <p className="mt-5 text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(212,175,55,0.28)" }}>
                Solo aceptamos 4–6 proyectos por trimestre.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */

/* ── FOOTER data ─────────────────────────────────────────────────────────────*/
const FOOTER_NAV = [
  { label: "Capacidades",  href: "#capabilities" },
  { label: "Proceso",      href: "#process" },
  { label: "Clientes",     href: "#clients" },
  { label: "Fit",          href: "#engagement" },
  { label: "Contacto",     href: "#contact" },
];

const FOOTER_SERVICES = [
  "Ecosistemas digitales con IA",
  "Arquitectura de conversión",
  "Automatización de operaciones",
  "Estrategia y narrativa de marca",
  "Implementación y escalamiento",
  "Diseño web Premium",
];

const FOOTER_LEGAL = [
  { label: "Privacidad",  href: "/privacy-policy" },
  { label: "Términos",    href: "/terms-of-service" },
  { label: "Cookies",     href: "/cookie-policy" },
];

export function Footer() {
  return (
    <>
      <Divider />
      <footer className="relative overflow-hidden" style={{ background: "#06162A" }}>

        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(212,175,55,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.025) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        {/* Top accent line — gold shimmer */}
        <div className="relative h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.25) 20%, rgba(212,175,55,0.75) 50%, rgba(212,175,55,0.25) 80%, transparent 100%)" }} />

        {/* Corner marks — top */}
        <div className="absolute top-[1px] left-8 w-10 h-10 pointer-events-none" style={{ borderLeft: "1px solid rgba(212,175,55,0.3)", borderBottom: "1px solid rgba(212,175,55,0.3)" }} />
        <div className="absolute top-[1px] right-8 w-10 h-10 pointer-events-none" style={{ borderRight: "1px solid rgba(212,175,55,0.3)", borderBottom: "1px solid rgba(212,175,55,0.3)" }} />

        {/* ── Main grid ── */}
        <div className="relative z-10 max-w-[1280px] mx-auto px-8 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1.2fr_1.2fr] gap-12 pb-16 border-b border-divider">

            {/* ── Col 1 · Brand ── */}
            <div>
              <img src="/logo.png" alt="iKingdom" className="h-14 w-auto mb-7" />
              <p className="text-[13px] leading-[1.78] font-light max-w-[280px] mb-9" style={{ color: "rgba(201,209,217,0.65)" }}>
                Sistemas de captación, conversión y escalamiento para empresas que operan a alto nivel. No ejecutamos tareas — construimos infraestructura que vende.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-3 mb-9">
                {/* LinkedIn */}
                <a href="https://www.linkedin.com/in/maxhebeling" target="_blank" rel="noopener noreferrer" data-hover aria-label="LinkedIn"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.5)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.6)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.5)"; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="https://www.instagram.com/ikingdomok" target="_blank" rel="noopener noreferrer" data-hover aria-label="Instagram"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.5)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.6)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.5)"; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="https://wa.me/19565095558" target="_blank" rel="noopener noreferrer" data-hover aria-label="WhatsApp"
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300"
                  style={{ border: "1px solid rgba(212,175,55,0.2)", color: "rgba(212,175,55,0.5)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.6)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,55,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.5)"; }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>

              {/* System status */}
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-ink" style={{ animation: "pulseGlow 2.4s ease-in-out infinite" }} />
                <span className="text-[9px] tracking-[0.34em] uppercase" style={{ color: "rgba(212,175,55,0.55)" }}>Sistema operativo</span>
              </div>
            </div>

            {/* ── Col 2 · Navegación ── */}
            <div>
              <p className="text-[9px] tracking-[0.38em] uppercase mb-7" style={{ color: "rgba(212,175,55,0.55)" }}>Navegación</p>
              <ul className="space-y-3.5">
                {FOOTER_NAV.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} data-hover
                      className="text-[13px] font-light transition-colors duration-300"
                      style={{ color: "rgba(212,175,55,0.50)" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.50)"; }}
                    >{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Col 3 · Servicios ── */}
            <div>
              <p className="text-[9px] tracking-[0.38em] uppercase mb-7" style={{ color: "rgba(212,175,55,0.55)" }}>Servicios</p>
              <ul className="space-y-3.5">
                {FOOTER_SERVICES.map((s) => (
                  <li key={s} className="text-[13px] font-light leading-[1.55]" style={{ color: "rgba(212,175,55,0.62)" }}>{s}</li>
                ))}
              </ul>
            </div>

            {/* ── Col 4 · Contacto ── */}
            <div>
              <p className="text-[9px] tracking-[0.38em] uppercase mb-7" style={{ color: "rgba(212,175,55,0.55)" }}>Contacto</p>
              <ul className="space-y-4">
                <li>
                  <a href="mailto:executive@ikingdom.org" data-hover
                    className="text-[13px] font-light block transition-colors duration-300"
                    style={{ color: "rgba(212,175,55,0.52)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.52)"; }}
                  >executive@ikingdom.org</a>
                </li>
                <li>
                  <a href="https://wa.me/19565095558" target="_blank" rel="noopener noreferrer" data-hover
                    className="text-[13px] font-light block transition-colors duration-300"
                    style={{ color: "rgba(212,175,55,0.52)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.52)"; }}
                  >+1 956 509 5558</a>
                </li>

                <li className="text-[13px] font-light" style={{ color: "rgba(212,175,55,0.55)" }}>San Diego, California · EE.UU.</li>
              </ul>

              {/* CTA micro */}
              <div className="mt-9">
                <a href="#contact" data-hover
                  className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
                  style={{ color: "rgba(212,175,55,0.55)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.55)"; }}
                >
                  Agendar estrategia
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <p className="text-[11px] tracking-[0.05em] font-light" style={{ color: "rgba(212,175,55,0.50)" }}>
                © 2026 iKingdom. Todos los derechos reservados.
              </p>
              <span className="hidden sm:block w-px h-3" style={{ background: "rgba(212,175,55,0.25)" }} />
              <p className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "rgba(212,175,55,0.40)" }}>
                IKD.SYS / v2.6.0
              </p>
            </div>
            <div className="flex items-center gap-5">
              {FOOTER_LEGAL.map((l) => (
                <a key={l.href} href={l.href} data-hover
                  className="text-[10px] tracking-[0.22em] uppercase font-light transition-colors duration-300"
                  style={{ color: "rgba(212,175,55,0.52)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,1)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(212,175,55,0.52)"; }}
                >{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Corner marks — bottom */}
        <div className="absolute bottom-0 left-8 w-10 h-10 pointer-events-none" style={{ borderLeft: "1px solid rgba(212,175,55,0.15)", borderTop: "1px solid rgba(212,175,55,0.15)" }} />
        <div className="absolute bottom-0 right-8 w-10 h-10 pointer-events-none" style={{ borderRight: "1px solid rgba(212,175,55,0.15)", borderTop: "1px solid rgba(212,175,55,0.15)" }} />
      </footer>
    </>
  );
}
