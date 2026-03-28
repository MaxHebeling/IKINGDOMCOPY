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
        Es tener una que no ayuda a vender.
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
  { name: "Empresa 1", logo: null },
  { name: "Empresa 2", logo: null },
  { name: "Empresa 3", logo: null },
  { name: "Empresa 4", logo: null },
  { name: "Empresa 5", logo: null },
  { name: "Empresa 6", logo: null },
];

export function Clients() {
  return (
    <>
      <Divider />
      <section className="py-[80px] md:py-[100px] px-8 overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <Reveal>
            <Label>Empresas que confían en nosotros</Label>
          </Reveal>
        </div>

        <div className="relative mt-12 overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-bg to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-bg to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-6 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...CLIENTS, ...CLIENTS].map((c, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[200px] h-[110px] border border-divider hover:border-ink/20 transition-colors duration-500 flex items-center justify-center group"
              >
                {c.logo ? (
                  <img src={c.logo} alt={c.name} className="max-h-[50px] max-w-[140px] w-auto object-contain opacity-50 group-hover:opacity-80 transition-opacity duration-500 filter grayscale group-hover:grayscale-0" />
                ) : (
                  <span className="text-[11px] tracking-[0.2em] uppercase text-secondary/30 group-hover:text-secondary/60 transition-colors duration-500">{c.name}</span>
                )}
              </div>
            ))}
          </motion.div>
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
