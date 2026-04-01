/**
 * Scroll-driven intro timeline builder.
 *
 * Called once on mount from SpaceIntroShell via a dynamic import inside
 * useEffect — so GSAP is never bundled into the server render.
 *
 * ─── TUNING GUIDE ────────────────────────────────────────────────────────────
 *
 *  SCRUB_LAG  — seconds of cinematic lag behind the user's scroll wheel.
 *               0.5 = snappy, 1.5 = cinematic, 2.5+ = dreamy/sluggish.
 *
 *  Timeline positions (0 → 1 = start → end of scroll section):
 *    0.00 – 0.80  forward flight (camera + stars, set in SpaceScene.tsx)
 *    0.80 – 0.90  portal approaches, cockpit glow maxes (set in Cockpit.tsx)
 *    0.85 – 0.92  overlay brightens to white  ← adjust here
 *    0.92 – 1.00  overlay fades, site content fully visible  ← adjust here
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { MutableRefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/animation/gsap";

const SCRUB_LAG = 1.2;

export interface ScrollIntroConfig {
  /** The outer tall-height wrapper div (e.g. height: "500vh") */
  wrapper: HTMLElement;
  /**
   * Plain object ref whose `.current` goes 0 → 1.
   * SpaceScene reads this every frame via useFrame — no React re-renders.
   */
  progress: MutableRefObject<number>;
  /** The full-screen white overlay div for the portal flash. */
  overlay: HTMLElement;
}

export function buildScrollTimeline({
  wrapper,
  progress,
  overlay,
}: ScrollIntroConfig): () => void {
  const tl = gsap.timeline({ paused: true });

  // Drive the shared progress ref from 0 → 1. SpaceScene reads this in useFrame.
  tl.to(progress, { current: 1, ease: "none", duration: 1 });

  // Portal flash: overlay white-out during 85 % → 92 %
  tl.fromTo(
    overlay,
    { opacity: 0 },
    { opacity: 1, ease: "power2.in", duration: 0.07 },
    0.85
  );

  // Flash dissipates: overlay recedes 92 % → 100 %, leaving site visible
  tl.to(overlay, { opacity: 0, ease: "power2.out", duration: 0.08 }, 0.92);

  const trigger = ScrollTrigger.create({
    trigger: wrapper,
    start: "top top",
    end: "bottom bottom",
    scrub: SCRUB_LAG,
    animation: tl,
    // Ensure site content is never accidentally hidden if user jumps past intro
    onLeaveBack: () => gsap.set(overlay, { opacity: 0 }),
    onLeave: () => gsap.set(overlay, { opacity: 0 }),
  });

  return () => {
    trigger.kill();
    tl.kill();
  };
}
