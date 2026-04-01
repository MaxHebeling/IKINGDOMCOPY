"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { prefersReducedMotion } from "@/lib/device/motion";
import TransitionOverlay from "./TransitionOverlay";

/**
 * SpaceIntroShell
 *
 * Always renders a 500vh scroll section — never returns null.
 * GSAP scroll animation is skipped silently for prefers-reduced-motion users,
 * but the section stays in the DOM so the hero never jumps to the top.
 *
 * TUNING:
 *  SCROLL_HEIGHT → total scroll distance (more vh = longer time in space)
 *  Camera speed, portal timing → SpaceScene.tsx / scroll-intro.ts
 *
 * CONNECTING YOUR CONTENT:
 *  <SpaceIntroShell /> must be the first child in the page, before <Navbar />.
 *  After the 500vh are scrolled, the browser naturally reveals whatever follows.
 */

const SpaceScene = dynamic(() => import("./SpaceScene"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#00000a" }} />
  ),
});

const SCROLL_HEIGHT = "500vh";

export default function SpaceIntroShell() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const progress = useRef<number>(0);

  useEffect(() => {
    // Respect reduced-motion: keep the visual section but skip scroll animation
    if (prefersReducedMotion()) return;
    if (!wrapperRef.current || !overlayRef.current) return;

    let cleanup: (() => void) | undefined;

    import("@/lib/animation/scroll-intro").then(({ buildScrollTimeline }) => {
      if (!wrapperRef.current || !overlayRef.current) return;
      cleanup = buildScrollTimeline({
        wrapper: wrapperRef.current,
        progress,
        overlay: overlayRef.current,
      });
    });

    return () => cleanup?.();
  }, []);

  return (
    // Outer wrapper — height controls total scroll distance of the intro
    <div ref={wrapperRef} style={{ height: SCROLL_HEIGHT, position: "relative" }}>
      {/* Sticky inner — stays pinned to viewport while outer wrapper scrolls */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#00000a",
        }}
      >
        <SpaceScene progress={progress} />
        <TransitionOverlay ref={overlayRef} />
        <ScrollHint />
      </div>
    </div>
  );
}

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
