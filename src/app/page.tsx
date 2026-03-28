"use client";

import { motion } from "framer-motion";
import { LangProvider } from "@/context/Lang";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PixelBrain from "@/components/PixelBrain";
import { Capabilities, WhatWeDo, Marquee, Proof, Clients, Process, Engagement, Contact, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <LangProvider>
      <Cursor />
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
        <Capabilities />
        <Marquee />
        <Proof />
        <Clients />
        <Process />
        <Engagement />
        <Contact />
        <Footer />
      </main>
    </LangProvider>
  );
}
