"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INTERVAL_MS   = 180_000; // 3 minutes between passes
const FIRST_PASS_MS =  12_000; // first pass 12s after load
const CROSS_SECS    =     18;  // seconds to cross the screen

// ── Crown SVG path (5-point, centered at 0,0, ~18×14px) ─────────────────────
const CROWN = "M-9 0 L-7-6 L-3-2 L0-9 L3-2 L7-6 L9 0 Z";

// ── Spoke coordinates for ellipse (rx=54, ry=34, 8 spokes) ──────────────────
const SPOKES = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  return {
    x1: Math.cos(a) * 8,   y1: Math.sin(a) * 8 * (34 / 54),
    x2: Math.cos(a) * 54,  y2: Math.sin(a) * 34,
  };
});

interface ShipProps { flip: boolean }

function FlagshipSVG({ flip }: ShipProps) {
  // cx of the ring (right-side, cockpit end)
  const RX = 412; const RY = 50;

  return (
    <svg
      viewBox="0 0 540 100"
      width="540"
      height="100"
      fill="none"
      aria-hidden="true"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
        opacity: 0.46,
        filter: "drop-shadow(0 0 8px rgba(212,175,55,0.30))",
      }}
    >
      <defs>
        <radialGradient id="ss-eng-main" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(212,175,55,0.95)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        <radialGradient id="ss-eng-sm" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(212,175,55,0.70)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        <radialGradient id="ss-ring-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="rgba(212,175,55,0.12)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0)" />
        </radialGradient>
        {/* Particle trail gradient */}
        <linearGradient id="ss-trail" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(212,175,55,0)" />
          <stop offset="100%" stopColor="rgba(212,175,55,0.18)" />
        </linearGradient>
      </defs>

      {/* ── Particle trail (behind engines, left side) ── */}
      <rect x="0" y="43" width="55" height="14" fill="url(#ss-trail)" />
      <rect x="0" y="33" width="42" height="8"  fill="url(#ss-trail)" opacity="0.6" />
      <rect x="0" y="59" width="42" height="8"  fill="url(#ss-trail)" opacity="0.6" />

      {/* ── Engine glow clusters ── */}
      <ellipse cx="28" cy="50" rx="28" ry="18" fill="url(#ss-eng-main)" />
      <ellipse cx="40" cy="36" rx="16" ry="10" fill="url(#ss-eng-sm)" />
      <ellipse cx="40" cy="64" rx="16" ry="10" fill="url(#ss-eng-sm)" />

      {/* ── Engine nacelles ── */}
      <rect x="50" y="44" width="68" height="12" rx="6" fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.30)" strokeWidth="0.5" />
      <rect x="56" y="28" width="62" height="10" rx="5" fill="rgba(212,175,55,0.13)" stroke="rgba(212,175,55,0.22)" strokeWidth="0.5" />
      <rect x="56" y="62" width="62" height="10" rx="5" fill="rgba(212,175,55,0.13)" stroke="rgba(212,175,55,0.22)" strokeWidth="0.5" />
      {/* Struts connecting pods to hull */}
      <line x1="90" y1="38" x2="115" y2="44" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
      <line x1="90" y1="62" x2="115" y2="56" stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />

      {/* ── Solar wings ── */}
      {/* Upper wing */}
      <path d="M 148,44 L 156,10 L 300,10 L 310,44 Z"
        fill="rgba(212,175,55,0.055)" stroke="rgba(212,175,55,0.20)" strokeWidth="0.6" />
      {/* Solar cell grid — vertical */}
      {[162, 182, 202, 222, 242, 262, 282].map((x) => (
        <line key={x} x1={x} y1={11} x2={x - 14} y2={43} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
      ))}
      {/* Solar cell grid — horizontal */}
      <line x1={157} y1={19} x2={308} y2={19} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
      <line x1={153} y1={31} x2={309} y2={31} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />

      {/* Lower wing */}
      <path d="M 148,56 L 156,90 L 300,90 L 310,56 Z"
        fill="rgba(212,175,55,0.055)" stroke="rgba(212,175,55,0.20)" strokeWidth="0.6" />
      {[162, 182, 202, 222, 242, 262, 282].map((x) => (
        <line key={x} x1={x} y1={89} x2={x - 14} y2={57} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
      ))}
      <line x1={157} y1={81} x2={308} y2={81} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
      <line x1={153} y1={69} x2={309} y2={69} stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />

      {/* ── Main hull ── */}
      <rect x="110" y="43" width="302" height="14" rx="7"
        fill="rgba(212,175,55,0.18)" stroke="rgba(212,175,55,0.25)" strokeWidth="0.5" />
      {/* Bright highlight strip */}
      <rect x="118" y="45" width="290" height="4" rx="2"
        fill="rgba(212,175,55,0.50)" />
      {/* Panel seams */}
      {[175, 230, 285, 340].map((x) => (
        <line key={x} x1={x} y1={44} x2={x} y2={56} stroke="rgba(212,175,55,0.18)" strokeWidth="0.5" />
      ))}
      {/* Hull detail micro-marks */}
      <rect x="130" y="47" width="12" height="1.5" rx="1" fill="rgba(212,175,55,0.3)" />
      <rect x="148" y="47" width="6"  height="1.5" rx="1" fill="rgba(212,175,55,0.2)" />

      {/* iKINGDOM label */}
      <text x="250" y="54"
        fontSize="5.5"
        fill="rgba(212,175,55,0.60)"
        fontFamily="'Space Grotesk', monospace"
        letterSpacing="0.28em"
        textAnchor="middle"
      >
        iKINGDOM
      </text>

      {/* ── Ring structure (the iconic element) ── */}
      {/* Ambient ring glow */}
      <ellipse cx={RX} cy={RY} rx="68" ry="46" fill="url(#ss-ring-glow)" />
      {/* Outer structural ring */}
      <ellipse cx={RX} cy={RY} rx="54" ry="34"
        stroke="rgba(212,175,55,0.48)" strokeWidth="1.6" />
      {/* Mid ring (slowly rotating via SVG animation) */}
      <ellipse cx={RX} cy={RY} rx="40" ry="25"
        stroke="rgba(212,175,55,0.22)" strokeWidth="0.8" strokeDasharray="4 6">
        <animateTransform attributeName="transform" type="rotate"
          values={`0 ${RX} ${RY}; 360 ${RX} ${RY}`} dur="14s" repeatCount="indefinite" />
      </ellipse>
      {/* Inner detail ring (counter-rotating) */}
      <ellipse cx={RX} cy={RY} rx="24" ry="15"
        stroke="rgba(212,175,55,0.18)" strokeWidth="0.6" strokeDasharray="2 8">
        <animateTransform attributeName="transform" type="rotate"
          values={`0 ${RX} ${RY}; -360 ${RX} ${RY}`} dur="9s" repeatCount="indefinite" />
      </ellipse>
      {/* Structural spokes */}
      {SPOKES.map((s, i) => (
        <line key={i}
          x1={RX + s.x1} y1={RY + s.y1}
          x2={RX + s.x2} y2={RY + s.y2}
          stroke="rgba(212,175,55,0.10)" strokeWidth="0.5" />
      ))}
      {/* Center hub */}
      <circle cx={RX} cy={RY} r="8"  fill="rgba(212,175,55,0.22)" />
      <circle cx={RX} cy={RY} r="4"  fill="rgba(212,175,55,0.55)" />
      <circle cx={RX} cy={RY} r="1.5" fill="rgba(212,175,55,0.9)" />
      {/* Thruster nodes on ring (4 positions) */}
      {[0, 90, 180, 270].map((deg) => {
        const a = (deg * Math.PI) / 180;
        const px = RX + Math.cos(a) * 54;
        const py = RY + Math.sin(a) * 34;
        return (
          <g key={deg}>
            <circle cx={px} cy={py} r="3.5" fill="rgba(212,175,55,0.35)" />
            <circle cx={px} cy={py} r="5.5" fill="rgba(212,175,55,0.10)" />
          </g>
        );
      })}
      {/* Crown at top of ring */}
      <g transform={`translate(${RX}, ${RY - 34 - 6})`}>
        <path d={CROWN} fill="rgba(212,175,55,0.55)" stroke="rgba(212,175,55,0.3)" strokeWidth="0.5" />
        <circle cx="0" cy="-4" r="1.5" fill="rgba(212,175,55,0.9)" />
      </g>

      {/* ── Nose / cockpit probe (right of ring) ── */}
      <line x1={RX + 54} y1={RY} x2={530} y2={RY}
        stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
      <ellipse cx={530} cy={RY} rx="8" ry="5"
        fill="rgba(212,175,55,0.15)" stroke="rgba(212,175,55,0.45)" strokeWidth="0.8" />
      <circle cx={530} cy={RY} r="2.5" fill="rgba(212,175,55,0.7)" />
      {/* Antenna spines */}
      <line x1={534} y1={RY}     x2={540} y2={RY - 8} stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" />
      <line x1={534} y1={RY}     x2={540} y2={RY + 8} stroke="rgba(212,175,55,0.3)" strokeWidth="0.6" />
      <line x1={536} y1={RY - 2} x2={540} y2={RY}     stroke="rgba(212,175,55,0.2)" strokeWidth="0.5" />
    </svg>
  );
}

// ── Escort craft — smaller, simpler, trailing behind ─────────────────────────
interface EscortProps { dx: number; dy: number; scale: number; delay: number; flip: boolean }

function EscortCraft({ dx, dy, scale, delay, flip }: EscortProps) {
  return (
    <motion.div
      style={{ position: "absolute", top: `${dy}px`, left: `${dx}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <svg viewBox="0 0 70 30" width={70 * scale} height={30 * scale} fill="none" aria-hidden="true"
        style={{ transform: flip ? "scaleX(-1)" : undefined, opacity: 0.38,
          filter: "drop-shadow(0 0 4px rgba(212,175,55,0.25))" }}>
        <defs>
          <radialGradient id={`esc-glow-${dx}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(212,175,55,0.80)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
        </defs>
        {/* Engine glow */}
        <ellipse cx="8" cy="15" rx="10" ry="8" fill={`url(#esc-glow-${dx})`} />
        {/* Hull */}
        <ellipse cx="36" cy="15" rx="28" ry="6" fill="rgba(212,175,55,0.25)" stroke="rgba(212,175,55,0.35)" strokeWidth="0.5" />
        {/* Highlight */}
        <ellipse cx="36" cy="13" rx="22" ry="2.5" fill="rgba(212,175,55,0.40)" />
        {/* Cockpit */}
        <circle cx="62" cy="15" r="4" fill="rgba(212,175,55,0.20)" stroke="rgba(212,175,55,0.40)" strokeWidth="0.5" />
        <circle cx="62" cy="15" r="1.5" fill="rgba(212,175,55,0.65)" />
      </svg>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SpaceShipPass() {
  const [visible, setVisible] = useState(false);
  const [yPos,    setYPos]    = useState(0);
  const [flip,    setFlip]    = useState(false);

  const trigger = useCallback(() => {
    setYPos(Math.random() * 0.32 + 0.10);   // 10%–42% from top
    setFlip(Math.random() > 0.5);
    setVisible(true);
    setTimeout(() => setVisible(false), (CROSS_SECS + 4) * 1000);
  }, []);

  useEffect(() => {
    const first    = setTimeout(trigger, FIRST_PASS_MS);
    const interval = setInterval(trigger, INTERVAL_MS);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [trigger]);

  return (
    <AnimatePresence>
      {visible && (
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 85 }}
          aria-hidden="true"
        >
          {/* Flagship */}
          <motion.div
            style={{ position: "absolute", top: `${yPos * 100}%` }}
            initial={{ x: flip ? "calc(100vw + 580px)" : "-580px" }}
            animate={{ x: flip ? "-580px" : "calc(100vw + 580px)" }}
            transition={{ duration: CROSS_SECS, ease: "linear" }}
          >
            <FlagshipSVG flip={flip} />
          </motion.div>

          {/* Escort craft — staggered behind the flagship */}
          {[
            { dx: flip ? 560 : -90,  dy: -28, scale: 0.62, delay: 0.4  },
            { dx: flip ? 570 : -145, dy:  30, scale: 0.52, delay: 0.85 },
            { dx: flip ? 545 : -200, dy: -10, scale: 0.44, delay: 1.30 },
            { dx: flip ? 555 : -260, dy:  18, scale: 0.38, delay: 1.80 },
          ].map((e, i) => (
            <motion.div
              key={i}
              style={{ position: "absolute", top: `${yPos * 100}%` }}
              initial={{ x: flip ? "calc(100vw + 580px)" : "-580px" }}
              animate={{ x: flip ? "-580px" : "calc(100vw + 580px)" }}
              transition={{ duration: CROSS_SECS, ease: "linear", delay: e.delay }}
            >
              <EscortCraft {...e} flip={flip} />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
