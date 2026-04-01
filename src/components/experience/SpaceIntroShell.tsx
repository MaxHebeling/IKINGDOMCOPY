"use client";

import { useRef, useEffect, useState, type MutableRefObject } from "react";
import dynamic from "next/dynamic";
import { prefersReducedMotion, isMobileViewport } from "@/lib/device/motion";
import TransitionOverlay from "./TransitionOverlay";

/**
 * SpaceIntroShell
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * The root wrapper for the cinematic scroll intro.
 * Renders a tall section (height = SCROLL_HEIGHT) with a sticky inner canvas.
 * As the user scrolls, GSAP drives a shared `progress` ref from 0 → 1.
 * SpaceScene reads that ref via useFrame — no React re-renders on scroll.
 *
 * ── WHERE YOUR EXISTING CONTENT CONNECTS ───────────────────────────────────
 *   Add <SpaceIntroShell /> as the FIRST child inside your page, before
 *   <Navbar /> and <main>.  When the scroll section ends, the browser
 *   naturally reveals the content that follows — no extra wiring needed.
 *
 *   To hide the Navbar during the intro, add this to Navbar.tsx:
 *     const [visible, setVisible] = useState(false);
 *     useEffect(() => {
 *       const onScroll = () => setVisible(window.scrollY > window.innerHeight * 4);
 *       window.addEventListener("scroll", onScroll, { passive: true });
 *       return () => window.removeEventListener("scroll", onScroll);
 *     }, []);
 *     if (!visible) return null;
 *
 * ── TUNING ──────────────────────────────────────────────────────────────────
 *   SCROLL_HEIGHT   → total scroll distance of the intro (default "500vh").
 *                     More vh = more time in space before site reveals.
 *   SCRUB_LAG       → cinematic scroll lag, set in scroll-intro.ts.
 *   Camera / stars  → tuned per-component in SpaceScene.tsx, Starfield.tsx.
 *   Portal timing   → tuned in scroll-intro.ts (timeline positions).
 *
 * ── ACCESSIBILITY ───────────────────────────────────────────────────────────
 *   prefers-reduced-motion → intro is skipped entirely; site shows at once.
 *   Mobile (< 768 px)      → lightweight CSS starfield replaces WebGL canvas.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ─── Lazy-load the WebGL canvas (SSR: false prevents server-render of Three.js)
const SpaceScene = dynamic(() => import("./SpaceScene"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#00000a" }} />
  ),
});

/** Total scroll distance. Change this string to adjust intro length. */
const SCROLL_HEIGHT = "500vh";

// ─────────────────────────────────────────────────────────────────────────────

export default function SpaceIntroShell() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Shared mutable number driven by GSAP, read by SpaceScene via useFrame.
  // Using object shape so GSAP can tween the `.current` property directly.
  const progress = useRef<number>(0);

  // Client-side feature detection — must run in useEffect to avoid hydration mismatch
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const rm = prefersReducedMotion();
    const mob = isMobileViewport();
    setReducedMotion(rm);
    setMobile(mob);

    // Skip GSAP setup for reduced-motion or mobile (they get alternate UIs)
    if (rm || mob) return;
    if (!wrapperRef.current || !overlayRef.current) return;

    let cleanup: (() => void) | undefined;

    // Dynamic import keeps GSAP entirely out of the server bundle
    import("@/lib/animation/scroll-intro").then(({ buildScrollTimeline }) => {
      if (!wrapperRef.current || !overlayRef.current) return;
      cleanup = buildScrollTimeline({
        wrapper: wrapperRef.current,
        progress: progress as MutableRefObject<number>,
        overlay: overlayRef.current,
      });
    });

    return () => cleanup?.();
  }, []);

  // ── Reduced-motion OR mobile: CSS-only static backdrop, no WebGL ────────
  // (was `return null` for reduced-motion — changed to static section so
  //  the intro always occupies space and the hero doesn't jump to the top)
  if (reducedMotion || mobile) {
    return (
      <section
        aria-hidden="true"
        style={{
          height: "100vh",
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(ellipse at 50% 60%, #0a1a3a 0%, #00000a 65%)",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: "2.5rem",
        }}
      >
        <MobileStarfield />
        <ScrollLabel />
      </section>
    );
  }

  // ── Full desktop experience ───────────────────────────────────────────────
  return (
    <div ref={wrapperRef} style={{ height: SCROLL_HEIGHT, position: "relative" }}>
      {/* Sticky viewport — pinned by CSS while the outer wrapper scrolls */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* 3D canvas — swap SpaceScene internals to change the scene */}
        <SpaceScene progress={progress} />

        {/* Portal flash overlay — animated by GSAP in scroll-intro.ts */}
        <TransitionOverlay ref={overlayRef} />

        {/* Scroll nudge — fades naturally as user begins scrolling */}
        <ScrollHint />
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Animated mouse-wheel icon nudging the user to scroll. */
function ScrollHint() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "2.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.45rem",
        zIndex: 5,
        animation: "spaceHintFloat 2.2s ease-in-out infinite alternate",
      }}
    >
      <style>{`
        @keyframes spaceHintFloat {
          from { opacity: 0.55; transform: translateX(-50%) translateY(0px); }
          to   { opacity: 0.15; transform: translateX(-50%) translateY(7px); }
        }
      `}</style>
      <ScrollLabel />
      {/* Mouse icon with animated scroll dot */}
      <svg width="18" height="28" viewBox="0 0 18 28" fill="none" aria-hidden="true">
        <rect x="4" y="0" width="10" height="18" rx="5" stroke="rgba(140,190,255,0.55)" strokeWidth="1.5" />
        <rect x="7.5" y="4" width="3" height="5" rx="1.5" fill="rgba(140,190,255,0.55)">
          <animate attributeName="y" from="4" to="9" dur="1.3s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.9" to="0" dur="1.3s" repeatCount="indefinite" />
        </rect>
        <path d="M5 20 L9 27 L13 20" stroke="rgba(140,190,255,0.45)" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function ScrollLabel() {
  return (
    <span
      style={{
        color: "rgba(140,190,255,0.6)",
        fontSize: "9px",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        fontFamily: "var(--font-space-grotesk, sans-serif)",
      }}
    >
      Scroll
    </span>
  );
}

/**
 * Pure-CSS starfield for mobile — no WebGL, no Three.js.
 * Stars are seeded deterministically to prevent hydration mismatches.
 */
function MobileStarfield() {
  // Deterministic seed so SSR and client produce the same layout
  const stars = Array.from({ length: 70 }, (_, i) => {
    const seed = (i * 137.508 + 42) % 360; // golden-angle distribution
    return {
      id: i,
      x: ((seed / 360) * 100).toFixed(2),
      y: (((i * 97.3) % 100)).toFixed(2),
      size: (0.6 + (i % 5) * 0.28).toFixed(2),
      opacity: (0.25 + (i % 4) * 0.12).toFixed(2),
      duration: (1.8 + (i % 7) * 0.4).toFixed(1),
      delay: ((i % 5) * 0.3).toFixed(1),
    };
  });

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    >
      <style>{`
        @keyframes mobileTwinkle {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.85; }
        }
      `}</style>
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            backgroundColor: "#c8dcff",
            animation: `mobileTwinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
