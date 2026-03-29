"use client";

import { motion } from "framer-motion";
import { useLang } from "@/context/Lang";

function useStats() {
  const { t } = useLang();
  return [
    { value: t("stat.1.value"), label: t("stat.1.label") },
    { value: t("stat.2.value"), label: t("stat.2.label") },
    { value: t("stat.3.value"), label: t("stat.3.label") },
  ];
}

function RevealWord({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        initial={{ y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{ duration: 1.4, delay, ease: [0.08, 0.82, 0.17, 1] }}
        className="inline-block will-change-transform"
      >{children}</motion.span>
    </span>
  );
}

export default function Hero() {
  const { t } = useLang();
  const STATS = useStats();
  const headline = t("hero.headline");
  const words = headline.split(" ");

  return (
    <section className="relative min-h-screen flex items-end pb-20 md:pb-28 pt-[140px] px-8 overflow-hidden">

      <div className="relative z-10 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 lg:gap-24 items-end">
          {/* Left — headline block */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-[12px] font-semibold tracking-[0.3em] uppercase text-secondary mb-6"
            >
              {t("hero.eyebrow")}
            </motion.p>

            <h1
              className="text-ink leading-[1.02]"
              style={{
                fontSize: "clamp(38px, 6vw, 80px)",
              }}
            >
              {words.map((w, i) => (
                <span key={`${w}-${i}`}>
                  <RevealWord delay={0.8 + i * 0.05}>{w}</RevealWord>
                  {i < words.length - 1 && <span className="inline-block w-[0.26em]" />}
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1.8 }}
              className="mt-7 text-secondary text-[16px] leading-[1.8] font-light max-w-[520px] text-justify"
            >
              {t("hero.sub")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.2 }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <a
                href="#contact"
                data-hover
                className="group relative inline-flex items-center gap-3 px-8 py-[14px] text-[13px] font-semibold tracking-[0.14em] uppercase text-bg bg-ink overflow-hidden transition-all duration-500"
              >
                <div className="absolute inset-0 bg-secondary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="relative z-10">{t("hero.cta")}</span>
                <svg className="relative z-10 w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <span className="text-[11px] tracking-[0.2em] text-secondary font-semibold">
                {t("hero.fine")}
              </span>
            </motion.div>
          </div>

          {/* Right — stats sidebar as trust framing device */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.0 }}
            className="hidden lg:block border-l border-divider pl-10"
          >
            <div className="space-y-8">
              {STATS.map((s, i) => (
                <div key={s.label}>
                  <p className="text-ink text-[32px] font-light tracking-[-0.02em]" style={{ fontFamily: "var(--font-serif)" }}>
                    {s.value}
                  </p>
                  <p className="text-[11px] tracking-[0.1em] uppercase text-secondary mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 2.8, ease: [0.08, 0.82, 0.17, 1] }}
        className="absolute bottom-0 left-0 right-0 h-px bg-divider origin-left"
      />
    </section>
  );
}
