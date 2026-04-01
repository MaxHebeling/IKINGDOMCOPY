"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { LangProvider } from "@/context/Lang";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";
import Cursor from "@/components/Cursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnnaChatWidget from "@/components/AnnaChatWidget";
import SpaceShipPass from "@/components/SpaceShipPass";
import LightningPass from "@/components/LightningPass";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelBrain from "@/components/PixelBrain";
import AmbientLight from "@/components/AmbientLight";
import {
  ClarityStrip, WhatWeDo, Capabilities, Marquee, Process,
  Proof, Clients, Engagement, Contact, DisqualificationSection, Footer,
} from "@/components/Sections";

export default function LocalePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  if (!locales.includes(lang as Locale)) notFound();

  return (
    <LangProvider initialLang={lang as Locale}>
      {/* ── Cinematic scroll intro — sits before all other content ── */}
      {/* Remove <SpaceIntroShell /> here to disable the intro entirely. */}
      <SpaceIntroShell />
      <Cursor />
      <WhatsAppButton />
      <AnnaChatWidget origin_page={`/${lang}`} />
      <SpaceShipPass />
      <LightningPass />
      <AmbientLight />
      <PixelBrain />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed inset-0 z-[100] bg-bg pointer-events-none"
      />
      <Navbar />
      <main className="relative z-[2]">
        <Hero />
        <ClarityStrip />
        <WhatWeDo />
        <Capabilities />
        <Marquee />
        <Process />
        <Proof />
        <Clients />
        <Engagement />
        <Contact />
        <DisqualificationSection />
        <Footer />
      </main>
    </LangProvider>
  );
}
