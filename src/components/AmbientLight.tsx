/**
 * AmbientLight — global ambient cabin-light atmosphere layer.
 *
 * Fixed, full-viewport SVG overlay.
 * mix-blend-mode: screen → only adds light, never obscures content.
 * All points are statically positioned (no Math.random = no SSR mismatch).
 *
 * Three layers:
 *   far   — micro points, very low opacity, warm white
 *   mid   — slightly larger, occasional dim gold
 *   near  — haze zones (radial gradient ellipses), zone diffusion
 */

// Coordinate space: 1440 × 900 (maps proportionally to any viewport via preserveAspectRatio="none")
// r in same px-equivalent units. At 1440px wide: r=2 → 2px, r=5 → 5px.

type Pt = {
  x: number; y: number; r: number;
  fill: string;
  dur: number; delay: number;
  anim: "al-a" | "al-b" | "al-c";
};

// Warm white: rgba(245,242,234,α)   — dominant, cabin overhead LED feel
// Dim gold:   rgba(212,175,55,α)    — rare, instrument status indicator feel
// Neutral:    rgba(228,225,215,α)   — mid-tone, architectural ambient

const LIGHTS: Pt[] = [
  /* ── Far layer — scattered micro points ─────────────────── */
  { x:  58,  y:  42,  r: 2.0, fill: "rgba(245,242,234,0.11)", dur: 16, delay:  0.0, anim: "al-a" },
  { x: 248,  y:  18,  r: 1.6, fill: "rgba(245,242,234,0.09)", dur: 19, delay:  4.3, anim: "al-b" },
  { x: 412,  y:  61,  r: 1.8, fill: "rgba(212,175,55,0.09)",  dur: 14, delay:  7.8, anim: "al-a" },
  { x: 631,  y:  28,  r: 1.4, fill: "rgba(245,242,234,0.10)", dur: 22, delay:  2.1, anim: "al-c" },
  { x: 847,  y:  55,  r: 2.0, fill: "rgba(228,225,215,0.09)", dur: 17, delay:  9.4, anim: "al-b" },
  { x:1028,  y:  22,  r: 1.6, fill: "rgba(245,242,234,0.11)", dur: 15, delay:  1.7, anim: "al-a" },
  { x:1198,  y:  47,  r: 1.8, fill: "rgba(212,175,55,0.08)",  dur: 20, delay:  5.9, anim: "al-c" },
  { x:1364,  y:  31,  r: 1.4, fill: "rgba(245,242,234,0.09)", dur: 18, delay: 13.2, anim: "al-b" },

  { x: 112,  y: 162,  r: 1.6, fill: "rgba(228,225,215,0.08)", dur: 21, delay:  3.5, anim: "al-c" },
  { x: 322,  y: 188,  r: 2.0, fill: "rgba(245,242,234,0.10)", dur: 16, delay: 11.1, anim: "al-a" },
  { x: 558,  y: 141,  r: 1.4, fill: "rgba(212,175,55,0.07)",  dur: 13, delay:  6.8, anim: "al-b" },
  { x: 788,  y: 174,  r: 1.8, fill: "rgba(245,242,234,0.11)", dur: 18, delay:  0.8, anim: "al-c" },
  { x:1022,  y: 155,  r: 1.6, fill: "rgba(228,225,215,0.09)", dur: 25, delay:  8.6, anim: "al-a" },
  { x:1244,  y: 168,  r: 1.4, fill: "rgba(245,242,234,0.08)", dur: 17, delay:  4.1, anim: "al-b" },
  { x:1418,  y: 148,  r: 2.0, fill: "rgba(212,175,55,0.08)",  dur: 23, delay: 12.4, anim: "al-c" },

  { x:  34,  y: 318,  r: 1.8, fill: "rgba(245,242,234,0.10)", dur: 14, delay:  7.2, anim: "al-b" },
  { x: 214,  y: 342,  r: 1.4, fill: "rgba(212,175,55,0.07)",  dur: 19, delay:  2.9, anim: "al-a" },
  { x: 468,  y: 298,  r: 2.0, fill: "rgba(245,242,234,0.11)", dur: 17, delay: 10.5, anim: "al-c" },
  { x: 694,  y: 328,  r: 1.6, fill: "rgba(228,225,215,0.08)", dur: 22, delay:  5.6, anim: "al-b" },
  { x: 918,  y: 311,  r: 1.4, fill: "rgba(245,242,234,0.09)", dur: 16, delay:  0.3, anim: "al-a" },
  { x:1152,  y: 335,  r: 1.8, fill: "rgba(212,175,55,0.08)",  dur: 20, delay: 13.8, anim: "al-c" },
  { x:1392,  y: 302,  r: 1.6, fill: "rgba(245,242,234,0.10)", dur: 15, delay:  6.3, anim: "al-b" },

  { x:  88,  y: 488,  r: 1.4, fill: "rgba(212,175,55,0.07)",  dur: 18, delay:  9.9, anim: "al-a" },
  { x: 286,  y: 512,  r: 2.0, fill: "rgba(245,242,234,0.10)", dur: 13, delay:  3.6, anim: "al-c" },
  { x: 524,  y: 472,  r: 1.6, fill: "rgba(228,225,215,0.08)", dur: 21, delay:  7.0, anim: "al-b" },
  { x: 758,  y: 496,  r: 1.8, fill: "rgba(245,242,234,0.09)", dur: 24, delay:  1.4, anim: "al-a" },
  { x: 982,  y: 518,  r: 1.4, fill: "rgba(212,175,55,0.08)",  dur: 16, delay: 11.9, anim: "al-c" },
  { x:1218,  y: 478,  r: 2.0, fill: "rgba(245,242,234,0.11)", dur: 19, delay:  4.8, anim: "al-b" },
  { x:1408,  y: 502,  r: 1.6, fill: "rgba(228,225,215,0.09)", dur: 14, delay:  8.2, anim: "al-a" },

  { x:  52,  y: 652,  r: 1.8, fill: "rgba(245,242,234,0.10)", dur: 22, delay:  2.3, anim: "al-c" },
  { x: 244,  y: 678,  r: 1.4, fill: "rgba(212,175,55,0.07)",  dur: 17, delay:  6.5, anim: "al-b" },
  { x: 488,  y: 638,  r: 2.0, fill: "rgba(245,242,234,0.09)", dur: 15, delay:  0.1, anim: "al-a" },
  { x: 724,  y: 661,  r: 1.6, fill: "rgba(228,225,215,0.08)", dur: 20, delay: 10.3, anim: "al-c" },
  { x: 958,  y: 644,  r: 1.8, fill: "rgba(245,242,234,0.11)", dur: 18, delay:  5.1, anim: "al-b" },
  { x:1184,  y: 672,  r: 1.4, fill: "rgba(212,175,55,0.08)",  dur: 23, delay:  9.7, anim: "al-a" },
  { x:1378,  y: 658,  r: 2.0, fill: "rgba(245,242,234,0.09)", dur: 16, delay:  3.8, anim: "al-c" },

  { x: 148,  y: 802,  r: 1.6, fill: "rgba(228,225,215,0.09)", dur: 19, delay:  7.6, anim: "al-b" },
  { x: 366,  y: 832,  r: 1.8, fill: "rgba(245,242,234,0.10)", dur: 14, delay:  2.0, anim: "al-a" },
  { x: 608,  y: 818,  r: 1.4, fill: "rgba(212,175,55,0.07)",  dur: 25, delay: 14.3, anim: "al-c" },
  { x: 862,  y: 848,  r: 2.0, fill: "rgba(245,242,234,0.09)", dur: 17, delay:  0.6, anim: "al-b" },
  { x:1088,  y: 826,  r: 1.8, fill: "rgba(228,225,215,0.10)", dur: 21, delay:  5.4, anim: "al-a" },
  { x:1312,  y: 858,  r: 1.4, fill: "rgba(245,242,234,0.08)", dur: 16, delay:  8.8, anim: "al-c" },

  /* ── Mid layer — slightly larger, occasional gold ────────── */
  { x: 148,  y:  78,  r: 3.2, fill: "rgba(212,175,55,0.10)",  dur: 26, delay:  5.8, anim: "al-b" },
  { x: 484,  y: 248,  r: 3.5, fill: "rgba(245,242,234,0.12)", dur: 22, delay:  1.2, anim: "al-a" },
  { x: 828,  y:  88,  r: 2.8, fill: "rgba(212,175,55,0.09)",  dur: 28, delay:  8.8, anim: "al-c" },
  { x:1188,  y: 228,  r: 3.2, fill: "rgba(245,242,234,0.11)", dur: 20, delay:  4.0, anim: "al-b" },
  { x: 344,  y: 548,  r: 3.0, fill: "rgba(212,175,55,0.09)",  dur: 24, delay: 11.7, anim: "al-a" },
  { x: 668,  y: 428,  r: 3.5, fill: "rgba(245,242,234,0.10)", dur: 18, delay:  0.5, anim: "al-c" },
  { x:1068,  y: 388,  r: 2.8, fill: "rgba(228,225,215,0.11)", dur: 22, delay:  6.4, anim: "al-b" },
  { x: 334,  y: 748,  r: 3.2, fill: "rgba(212,175,55,0.09)",  dur: 26, delay:  9.2, anim: "al-a" },
  { x: 988,  y: 768,  r: 3.0, fill: "rgba(245,242,234,0.11)", dur: 21, delay:  3.1, anim: "al-c" },
  { x:1344,  y: 448,  r: 2.8, fill: "rgba(212,175,55,0.08)",  dur: 30, delay:  7.5, anim: "al-b" },
];

// Radial haze zones — diffuse zone glows, no animation (too slow to notice statically)
// These simulate light bleed from hidden instrument panels or architectural zones
type Haze = { cx: number; cy: number; rx: number; ry: number; id: string; gold: boolean };
const HAZES: Haze[] = [
  { cx:  180, cy:  90, rx: 140, ry:  80, id: "hz0", gold: true  },
  { cx: 1260, cy: 180, rx: 160, ry:  90, id: "hz1", gold: false },
  { cx:  280, cy: 450, rx: 120, ry:  90, id: "hz2", gold: true  },
  { cx: 1100, cy: 520, rx: 150, ry: 100, id: "hz3", gold: false },
  { cx:  720, cy: 820, rx: 180, ry:  80, id: "hz4", gold: true  },
  { cx:  480, cy: 140, rx: 100, ry:  70, id: "hz5", gold: false },
];

export default function AmbientLight() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {HAZES.map((h) => (
            <radialGradient key={h.id} id={h.id} cx="50%" cy="50%" r="50%">
              <stop
                offset="0%"
                stopColor={h.gold ? "#D4AF37" : "#F5F2EA"}
                stopOpacity={h.gold ? "0.032" : "0.026"}
              />
              <stop offset="100%" stopColor={h.gold ? "#D4AF37" : "#F5F2EA"} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        {/* Haze zones — breathed into the architecture */}
        {HAZES.map((h) => (
          <ellipse
            key={h.id}
            cx={h.cx}
            cy={h.cy}
            rx={h.rx}
            ry={h.ry}
            fill={`url(#${h.id})`}
          />
        ))}

        {/* Light points */}
        {LIGHTS.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={p.fill}
            style={{
              animation: `${p.anim} ${p.dur}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
