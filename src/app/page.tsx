"use client";

import { motion } from "framer-motion";
import { LangProvider } from "@/context/Lang";
import Cursor from "@/components/Cursor";
import WhatsAppButton from "@/components/WhatsAppButton";
import SpaceShipPass from "@/components/SpaceShipPass";
import LightningPass from "@/components/LightningPass";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelBrain from "@/components/PixelBrain";
import AmbientLight from "@/components/AmbientLight";
import { ClarityStrip, Capabilities, WhatWeDo, Marquee, Proof, Clients, Process, Engagement, Contact, DisqualificationSection, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <LangProvider>
      <Cursor />
      <WhatsAppButton />
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
        <Capabilities />
        <WhatWeDo />
        <Marquee />
        <Proof />
        <Clients />
        <Process />
        <Engagement />
        <Contact />
        <DisqualificationSection />
        <Footer />
      </main>
    </LangProvider>
  );
}
