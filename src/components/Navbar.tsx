"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/Lang";

export default function Navbar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LINKS = [
    { label: t("nav.capabilities"), href: "#capabilities" },
    { label: t("nav.proof"), href: "#proof" },
    { label: t("nav.process"), href: "#process" },
    { label: t("nav.engagement"), href: "#engagement" },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#000000]/95 backdrop-blur-md border-b border-divider shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-8 h-[72px] flex items-center justify-between">
          <a href="#" data-hover className="flex items-center">
            <img src="/logo.png" alt="iKingdom" className="h-10 w-auto" />
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                data-hover
                className="group relative px-5 py-2 text-[13px] font-semibold tracking-[0.14em] uppercase text-ink/50 hover:text-ink transition-colors duration-300"
              >
                {l.label}
                <span className="absolute bottom-1 left-5 right-5 h-px bg-ink/80 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="/fit"
              data-hover
              className="group relative text-[13px] font-semibold tracking-[0.14em] uppercase text-ink border border-ink/25 px-7 py-[9px] overflow-hidden transition-all duration-500 hover:text-[#000000] hover:border-ink"
            >
              <div className="absolute inset-0 bg-ink origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              <span className="relative z-10 transition-colors duration-500">{t("nav.contact")}</span>
            </a>
          </div>

          <button onClick={() => setOpen(!open)} data-hover className="lg:hidden w-9 h-9 flex items-center justify-center" aria-label="Menu">
            <div className="w-5 flex flex-col gap-[5px]">
              <motion.span animate={open ? { rotate: 45, y: 6 } : {}} className="block h-px bg-ink origin-center" />
              <motion.span animate={{ opacity: open ? 0 : 1 }} className="block h-px bg-ink" />
              <motion.span animate={open ? { rotate: -45, y: -6 } : {}} className="block h-px bg-ink origin-center" />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-[#000000] flex flex-col items-center justify-center gap-8 lg:hidden">
            {LINKS.map((l, i) => (
              <motion.a key={l.href} href={l.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => setOpen(false)} className="text-2xl tracking-[0.04em] text-ink" style={{ fontFamily: "var(--font-serif)", fontWeight: 600 }}>
                {l.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
