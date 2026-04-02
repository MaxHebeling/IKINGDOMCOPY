"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LIGHTNING_INTERVAL_MS =  180_000; // 3 minutes
const LIGHTNING_FIRST_MS    =   45_000; // first at 45s (offset from spaceship)
const BOLT_DURATION_MS      =     1000; // visible for 1s

// ── Recursive midpoint displacement ─────────────────────────────────────────
function subdivide(
  x1: number, y1: number,
  x2: number, y2: number,
  depth: number, disp: number
): string {
  if (depth === 0) return `L${x2.toFixed(1)},${y2.toFixed(1)}`;
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp;
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp;
  return (
    subdivide(x1, y1, mx, my, depth - 1, disp * 0.58) +
    subdivide(mx, my, x2, y2, depth - 1, disp * 0.58)
  );
}

// ── Generate one bolt with two branches ─────────────────────────────────────
function makeBolt(x: number, y: number, len: number, angle: number) {
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  const main = `M${x.toFixed(1)},${y.toFixed(1)} ${subdivide(x, y, x2, y2, 6, 26)}`;

  // Branch A — ~35% along
  const bax = x + Math.cos(angle) * len * 0.35 + (Math.random() - 0.5) * 14;
  const bay = y + Math.sin(angle) * len * 0.35 + (Math.random() - 0.5) * 14;
  const angA = angle + (Math.random() - 0.5) * 1.1;
  const lenA = len * (0.28 + Math.random() * 0.22);
  const bax2 = bax + Math.cos(angA) * lenA;
  const bay2 = bay + Math.sin(angA) * lenA;
  const branchA = `M${bax.toFixed(1)},${bay.toFixed(1)} ${subdivide(bax, bay, bax2, bay2, 4, 16)}`;

  // Branch B — ~60% along
  const bbx = x + Math.cos(angle) * len * 0.60 + (Math.random() - 0.5) * 10;
  const bby = y + Math.sin(angle) * len * 0.60 + (Math.random() - 0.5) * 10;
  const angB = angle + (Math.random() * 0.7 + 0.25) * (Math.random() > 0.5 ? 1 : -1);
  const lenB = len * (0.18 + Math.random() * 0.18);
  const bbx2 = bbx + Math.cos(angB) * lenB;
  const bby2 = bby + Math.sin(angB) * lenB;
  const branchB = `M${bbx.toFixed(1)},${bby.toFixed(1)} ${subdivide(bbx, bby, bbx2, bby2, 3, 10)}`;

  return { main, branchA, branchB, sx: x, sy: y };
}

interface Bolt { id: number; main: string; branchA: string; branchB: string; sx: number; sy: number }

// ── Component ────────────────────────────────────────────────────────────────
export default function LightningPass() {
  const [bolts,  setBolts]  = useState<Bolt[]>([]);
  const [flash,  setFlash]  = useState(false);
  const [passKey, setPassKey] = useState(0);

  const trigger = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const count = 4 + Math.floor(Math.random() * 4); // 4–7 bolts
    const generated: Bolt[] = Array.from({ length: count }, (_, i) => {
      const sx  = 0.05 * vw + Math.random() * 0.90 * vw;
      const sy  = 0.05 * vh + Math.random() * 0.55 * vh; // upper 60%
      const len = 90  + Math.random() * 130;
      const ang = Math.PI / 2 + (Math.random() - 0.5) * 0.75; // roughly downward
      return { id: i, ...makeBolt(sx, sy, len, ang) };
    });

    setBolts(generated);
    setFlash(true);
    setPassKey((k) => k + 1);

    setTimeout(() => { setBolts([]); setFlash(false); }, BOLT_DURATION_MS + 400);
  }, []);

  useEffect(() => {
    const first    = setTimeout(trigger, LIGHTNING_FIRST_MS);
    const interval = setInterval(trigger, LIGHTNING_INTERVAL_MS);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [trigger]);

  return (
    <>
      {/* ── Atmospheric screen flash ── */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key={`flash-${passKey}`}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 84, background: "rgba(255,248,200,0.055)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 0.9, 0] }}
            transition={{ duration: 0.28, times: [0, 0.06, 0.25, 0.45, 1], ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* ── Lightning SVG ── */}
      <AnimatePresence>
        {bolts.length > 0 && (
          <motion.svg
            key={`bolts-${passKey}`}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 84, width: "100vw", height: "100vh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.55, 1, 0.25, 0] }}
            transition={{ duration: 0.9, times: [0, 0.04, 0.18, 0.30, 0.65, 1], ease: "easeOut" }}
            aria-hidden="true"
          >
            <defs>
              {/* 4-layer glow stack for 8K-quality electric look */}
              <filter id="lf-core" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="0.6" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="lf-inner" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2.2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="lf-mid" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="lf-outer" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              {/* Strike-point flare */}
              <filter id="lf-flare" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="10" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {bolts.map((bolt) => (
              <g key={bolt.id}>
                {/* Layer 4 — Atmospheric outer glow */}
                <path d={bolt.main}    stroke="rgba(212,175,55,0.10)" strokeWidth="14" fill="none" filter="url(#lf-outer)" />

                {/* Layer 3 — Mid corona glow */}
                <path d={bolt.main}    stroke="rgba(212,175,55,0.32)" strokeWidth="5.5" fill="none" filter="url(#lf-mid)" />
                <path d={bolt.branchA} stroke="rgba(212,175,55,0.22)" strokeWidth="3.5" fill="none" filter="url(#lf-mid)" />
                <path d={bolt.branchB} stroke="rgba(212,175,55,0.18)" strokeWidth="2.5" fill="none" filter="url(#lf-mid)" />

                {/* Layer 2 — Inner glow */}
                <path d={bolt.main}    stroke="rgba(212,175,55,0.75)" strokeWidth="2.2" fill="none" filter="url(#lf-inner)" />
                <path d={bolt.branchA} stroke="rgba(212,175,55,0.55)" strokeWidth="1.6" fill="none" filter="url(#lf-inner)" />
                <path d={bolt.branchB} stroke="rgba(212,175,55,0.42)" strokeWidth="1.2" fill="none" filter="url(#lf-inner)" />

                {/* Layer 1 — White-hot core */}
                <path d={bolt.main}    stroke="rgba(255,252,210,0.95)" strokeWidth="0.9" fill="none" filter="url(#lf-core)" />
                <path d={bolt.branchA} stroke="rgba(255,252,210,0.75)" strokeWidth="0.65" fill="none" filter="url(#lf-core)" />
                <path d={bolt.branchB} stroke="rgba(255,252,210,0.58)" strokeWidth="0.5" fill="none" filter="url(#lf-core)" />

                {/* Strike-point flare at origin */}
                <circle cx={bolt.sx} cy={bolt.sy} r="4"   fill="rgba(255,255,230,0.95)" filter="url(#lf-flare)" />
                <circle cx={bolt.sx} cy={bolt.sy} r="1.8" fill="rgba(255,255,255,1)" />
              </g>
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </>
  );
}
