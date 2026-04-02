"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  EffectComposer, RenderPass, EffectPass,
  BloomEffect, VignetteEffect, KernelSize,
} from "postprocessing";

/*
  PIXEL BRAIN — Thousands of tiny glowing points forming a
  highly detailed 3D human brain shape. Not a blob — a precise
  anatomical brain built from a dense pointcloud.

  How: We generate the brain shape procedurally using parametric
  equations that produce actual brain-like topology — two hemispheres
  with gyri (ridges), sulci (grooves), frontal/temporal/parietal/
  occipital lobes, cerebellum, and brainstem. Then we sample
  ~15,000 points ON and INSIDE this surface.

  The points pulse, shift, and breathe — like neurons firing.
  The brain slowly rotates in 3D.

  AI tech logos orbit around it with their REAL brand colors.
*/

// Brand data with real SVG paths from simple-icons + official brand colors
const BRANDS = [
  {
    name: "Claude",
    color: "#D97757",
    // Claude sunburst mark
    svgPath: "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z",
  },
  {
    name: "OpenAI",
    color: "#10A37F",
    // OpenAI hexagonal knot
    svgPath: "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 11.708.2a6.046 6.046 0 0 0-5.77 4.254 6.056 6.056 0 0 0-4.027 2.93 6.046 6.046 0 0 0 .747 7.093 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.23 23.8a6.046 6.046 0 0 0 5.77-4.254 6.056 6.056 0 0 0 4.027-2.93 6.046 6.046 0 0 0-.745-6.795zM13.23 22.197a4.487 4.487 0 0 1-2.882-1.05l.143-.08 4.787-2.764a.777.777 0 0 0 .393-.676v-6.74l2.024 1.168a.072.072 0 0 1 .04.055v5.58a4.504 4.504 0 0 1-4.505 4.507zM3.628 18.127a4.482 4.482 0 0 1-.537-3.017l.143.085 4.787 2.764a.777.777 0 0 0 .786 0l5.843-3.373v2.335a.072.072 0 0 1-.03.062l-4.836 2.792a4.504 4.504 0 0 1-6.156-1.648zM2.326 7.896a4.485 4.485 0 0 1 2.345-1.972l-.002.165v5.528a.777.777 0 0 0 .393.676l5.843 3.373-2.024 1.168a.072.072 0 0 1-.067.006L3.978 14.05a4.504 4.504 0 0 1-1.652-6.153zm17.08 3.979-5.843-3.373L15.586 7.334a.072.072 0 0 1 .067-.006l4.836 2.792a4.504 4.504 0 0 1-.697 8.118v-5.694a.777.777 0 0 0-.386-.669zm2.012-3.023-.143-.085-4.787-2.764a.777.777 0 0 0-.786 0L9.86 9.376V7.04a.072.072 0 0 1 .03-.062l4.836-2.792a4.504 4.504 0 0 1 6.693 4.666zm-12.66 4.155-2.024-1.168a.072.072 0 0 1-.04-.055V6.2a4.504 4.504 0 0 1 7.387-3.456l-.143.08-4.787 2.764a.777.777 0 0 0-.393.676zm1.099-2.367 2.602-1.502 2.602 1.502v3.004l-2.602 1.502-2.602-1.502z",
  },
  {
    name: "Gemini",
    color: "#8E75B2",
    // Google Gemini sparkle
    svgPath: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
  {
    name: "Meta",
    color: "#0467DF",
    // Meta infinity mark
    svgPath: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z",
  },
  {
    name: "Mistral",
    color: "#F7D046",
    // Mistral AI geometric mark
    svgPath: "M17.143 3.429v3.428h-3.429v3.429h-3.428V6.857H6.857V3.43H3.43v13.714H0v3.428h10.286v-3.428H6.857v-3.429h3.429v3.429h3.429v-3.429h3.428v3.429h-3.428v3.428H24v-3.428h-3.43V3.429z",
  },
  {
    name: "Vercel",
    color: "#FFFFFF",
    // Vercel triangle
    svgPath: "m12 1.608 12 20.784H0Z",
  },
  {
    name: "Stripe",
    color: "#635BFF",
    // Stripe S mark
    svgPath: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
  },
];

export default function PixelBrain() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 });
  const scrollRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const DPR = Math.min(window.devicePixelRatio, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 1, 2000);
    camera.position.set(0, 10, 220);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new EffectPass(camera,
      new BloomEffect({ intensity: 1.3, luminanceThreshold: 0.08, luminanceSmoothing: 0.5, kernelSize: KernelSize.LARGE, mipmapBlur: true }),
      new VignetteEffect({ darkness: 0.4, offset: 0.35 }),
    ));

    // ── GENERATE BRAIN + SPINE + NERVE POINTCLOUD ──
    // All in one geometry so they share the same shader and bloom
    const BRAIN_POINTS = 18000;
    const SPINE_POINTS = 6000;  // spinal cord
    const NERVE_POINTS = 4000;  // nerve branches
    const ROOT_POINTS  = 5000;  // root system at footer
    const POINT_COUNT = BRAIN_POINTS + SPINE_POINTS + NERVE_POINTS + ROOT_POINTS;
    const positions = new Float32Array(POINT_COUNT * 3);
    const sizes = new Float32Array(POINT_COUNT);
    const phases = new Float32Array(POINT_COUNT);
    const depths = new Float32Array(POINT_COUNT); // 0=surface, 1=deep
    const fades  = new Float32Array(POINT_COUNT).fill(1.0); // 1=opaque, 0=invisible

    const brainRadius = 50;

    for (let i = 0; i < POINT_COUNT; i++) {
      // Random spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Base direction
      const dx = Math.sin(phi) * Math.cos(theta);
      const dy = Math.sin(phi) * Math.sin(theta);
      const dz = Math.cos(phi);

      // Start with base radius — some points on surface, some inside
      const surfaceOrInner = Math.random();
      let r: number;
      let depth: number;
      if (surfaceOrInner < 0.6) {
        // Surface points — concentrated on the outside
        r = brainRadius * (0.92 + Math.random() * 0.12);
        depth = 0;
      } else if (surfaceOrInner < 0.85) {
        // Mid-layer — cortex depth
        r = brainRadius * (0.7 + Math.random() * 0.22);
        depth = 0.4;
      } else {
        // Deep — core structures
        r = brainRadius * Math.random() * 0.7;
        depth = 0.8;
      }

      let x = dx * r;
      let y = dy * r;
      let z = dz * r;

      // ── ANATOMICAL DEFORMATIONS ──

      // 1. Squash into brain proportions (wider than tall, elongated front-back)
      x *= 1.15; // wider left-right
      y *= 0.88; // shorter top-bottom
      z *= 1.05; // slightly elongated front-back

      // 2. Longitudinal fissure — deep groove along top center (split hemispheres)
      const fissureDepth = Math.exp(-x * x / 18) * 8;
      if (y > brainRadius * 0.15 && surfaceOrInner < 0.6) {
        y -= fissureDepth;
      }

      // 3. Gyri (ridges) — sinusoidal bumps on surface
      if (surfaceOrInner < 0.6) {
        const gyri1 = Math.sin(theta * 6 + phi * 5) * 3.5;
        const gyri2 = Math.sin(theta * 11 + phi * 8) * 1.8;
        const gyri3 = Math.sin(theta * 18 + phi * 14) * 0.8;
        const gyriTotal = gyri1 + gyri2 + gyri3;
        x += dx * gyriTotal;
        y += dy * gyriTotal * 0.7;
        z += dz * gyriTotal;
      }

      // 4. Lateral sulcus (Sylvian fissure) — groove on each side
      const sylvianMatch = Math.exp(-Math.pow(phi - 1.4, 2) * 15) * Math.abs(dx) * 0.8;
      if (surfaceOrInner < 0.6) {
        const inward = dx > 0 ? -1 : 1;
        x += inward * sylvianMatch * 5;
      }

      // 5. Temporal lobe bulge (sides, lower)
      if (y < -brainRadius * 0.1 && Math.abs(x) > brainRadius * 0.3) {
        const bulge = Math.exp(-Math.pow(y + brainRadius * 0.3, 2) / 200) * 4;
        x += (x > 0 ? 1 : -1) * bulge;
      }

      // 6. Frontal lobe — larger, more forward
      if (z > brainRadius * 0.2 && y > -brainRadius * 0.1) {
        z += 3;
      }

      // 7. Occipital lobe — slight protrusion at back
      if (z < -brainRadius * 0.3 && y > 0) {
        z -= 2;
      }

      // 8. Cerebellum — dense cluster at back-bottom
      if (i > BRAIN_POINTS * 0.9 && i < BRAIN_POINTS * 0.95) {
        const cAngle = Math.random() * Math.PI * 2;
        const cPhi2 = Math.random() * Math.PI * 0.6;
        const cR = 15 + Math.random() * 8;
        x = Math.sin(cPhi2) * Math.cos(cAngle) * cR * 1.3;
        y = -brainRadius * 0.55 + Math.sin(cPhi2) * Math.sin(cAngle) * cR * 0.5 - Math.random() * 5;
        z = -brainRadius * 0.25 + Math.cos(cPhi2) * cR * 0.8;
        // Cerebellum has finer folds
        x += Math.sin(cAngle * 12) * 1.5;
        z += Math.cos(cAngle * 10) * 1.2;
        depth = 0.2;
      }

      // 9. Brainstem — column going down, connecting to spine
      if (i >= BRAIN_POINTS * 0.95 && i < BRAIN_POINTS) {
        const bsProgress = (i - BRAIN_POINTS * 0.95) / (BRAIN_POINTS * 0.05); // 0→1 down the stem
        const bsR = (5 - bsProgress * 1.5) * (0.3 + Math.random() * 0.7); // tapers slightly
        const bsAngle = Math.random() * Math.PI * 2;
        const bsY = -brainRadius * 0.5 - bsProgress * 25; // goes from -25 to -50
        x = Math.cos(bsAngle) * bsR;
        y = bsY;
        z = Math.sin(bsAngle) * bsR;
        depth = 0.3;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = depth > 0.5 ? 1.5 + Math.random() * 1.5 : 1.0 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
      depths[i] = depth;
    }

    // ── SPINAL CORD — extends downward from brain stem ──
    // Same point style, dense column going straight down
    const spineStartY = -brainRadius * 0.5 - 25; // aligns exactly with brainstem bottom
    const spineEndY = -2200; // extends far down (camera will scroll to reveal)
    const spineRadius = 5; // width of the cord

    for (let i = 0; i < SPINE_POINTS; i++) {
      const idx = BRAIN_POINTS + i;
      const i3 = idx * 3;

      // Progress down the spine (0 = top, 1 = bottom)
      const t2 = i / SPINE_POINTS;
      const y = spineStartY + (spineEndY - spineStartY) * t2;

      // Cross-section: cluster of points forming the cord shape
      const angle = Math.random() * Math.PI * 2;
      // Starts wide (matching brainstem ~5 radius) and tapers down
      const taperRadius = spineRadius * (1.0 - t2 * 0.4);
      const r = taperRadius * (0.3 + Math.random() * 0.7);
      const x = Math.cos(angle) * r + Math.sin(y * 0.015) * 2;
      const z = Math.sin(angle) * r + Math.cos(y * 0.012) * 1.5;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      sizes[idx] = 0.8 + Math.random() * 1.2;
      phases[idx] = Math.random() * Math.PI * 2;
      depths[idx] = 0.15; // surface-like so they render bright
    }

    // ── NERVE BRANCHES — extend sideways from spine at intervals ──
    const nerveInterval = 80; // Y-distance between nerve pairs
    let nerveIdx = BRAIN_POINTS + SPINE_POINTS;

    for (let ny = spineStartY - 40; ny > spineEndY + 400 && nerveIdx < POINT_COUNT; ny -= nerveInterval) {
      // Left and right nerve
      for (const side of [-1, 1]) {
        const branchPoints = 15 + Math.floor(Math.random() * 10);
        let bx = 0, by = ny, bz = 0;

        for (let bp = 0; bp < branchPoints && nerveIdx < POINT_COUNT; bp++) {
          // Extend outward with organic curve
          bx += (3 + Math.random() * 4) * side;
          by -= 1 + Math.random() * 3; // slight downward
          bz += (Math.random() - 0.5) * 2;

          // Organic wobble
          bx += Math.sin(bp * 0.5 + ny * 0.01) * 1.5 * side;

          const i3 = nerveIdx * 3;
          positions[i3] = bx;
          positions[i3 + 1] = by;
          positions[i3 + 2] = bz;

          // Fade with distance from spine
          const dist = Math.abs(bx);
          const distFade = Math.max(0, 1 - dist / 80);
          sizes[nerveIdx] = (0.6 + Math.random() * 0.8) * distFade;
          phases[nerveIdx] = Math.random() * Math.PI * 2;
          depths[nerveIdx] = 0.2 + (1 - distFade) * 0.4; // dimmer farther out

          nerveIdx++;

          // Sub-branch
          if (bp > 3 && Math.random() < 0.25) {
            let sx = bx, sy = by, sz = bz;
            const subLen = 3 + Math.floor(Math.random() * 4);
            for (let s = 0; s < subLen && nerveIdx < POINT_COUNT; s++) {
              sx += (2 + Math.random() * 3) * side;
              sy -= Math.random() * 2;
              sz += (Math.random() - 0.5) * 1.5;
              const si3 = nerveIdx * 3;
              positions[si3] = sx;
              positions[si3 + 1] = sy;
              positions[si3 + 2] = sz;
              const sDist = Math.abs(sx);
              const sFade = Math.max(0, 1 - sDist / 100);
              sizes[nerveIdx] = (0.4 + Math.random() * 0.5) * sFade;
              phases[nerveIdx] = Math.random() * Math.PI * 2;
              depths[nerveIdx] = 0.3 + (1 - sFade) * 0.4;
              nerveIdx++;
            }
          }
        }
      }
    }

    // ── ROOT SYSTEM — organic spreading branches at footer ──
    const rootZoneStart = spineEndY + 420; // where roots begin
    const rootZoneEnd   = spineEndY;       // bottom tip
    let rootIdx = BRAIN_POINTS + SPINE_POINTS + NERVE_POINTS;

    // Several root "trunks" spreading from spine bottom
    const ROOT_TRUNKS = 7;
    for (let t = 0; t < ROOT_TRUNKS && rootIdx < POINT_COUNT; t++) {
      const baseAngle = (t / ROOT_TRUNKS) * Math.PI * 2;
      const trunkPoints = Math.floor(ROOT_POINTS / ROOT_TRUNKS);
      let rx = 0, ry = rootZoneStart, rz = 0;

      for (let p = 0; p < trunkPoints && rootIdx < POINT_COUNT; p++) {
        const progress = p / trunkPoints; // 0=top 1=bottom
        // Roots spread wider and downward
        rx += Math.cos(baseAngle + Math.sin(p * 0.3) * 0.8) * (2 + progress * 3);
        ry -= (2 + Math.random() * 4);
        rz += Math.sin(baseAngle + Math.cos(p * 0.25) * 0.6) * (2 + progress * 3);

        // Sub-branches split off
        if (p > 0 && Math.random() < 0.15 && rootIdx < POINT_COUNT) {
          let sx = rx, sy = ry, sz = rz;
          const subLen = 4 + Math.floor(Math.random() * 8);
          for (let s = 0; s < subLen && rootIdx < POINT_COUNT; s++) {
            sx += Math.cos(baseAngle + Math.PI * 0.5) * (1.5 + Math.random() * 2.5);
            sy -= 1 + Math.random() * 3;
            sz += Math.sin(baseAngle + Math.PI * 0.5) * (1.5 + Math.random() * 2.5);
            const si3 = rootIdx * 3;
            positions[si3]     = sx;
            positions[si3 + 1] = sy;
            positions[si3 + 2] = sz;
            const subProgress = (sy - rootZoneStart) / (rootZoneEnd - rootZoneStart);
            const fade = Math.max(0, 1 - subProgress) * 0.5; // fade toward bottom
            sizes[rootIdx]  = (0.5 + Math.random() * 0.8) * fade;
            phases[rootIdx] = Math.random() * Math.PI * 2;
            depths[rootIdx] = 0.4;
            fades[rootIdx]  = Math.max(0, fade * 0.6);
            rootIdx++;
          }
        }

        const i3 = rootIdx * 3;
        positions[i3]     = rx;
        positions[i3 + 1] = ry;
        positions[i3 + 2] = rz;
        const fade = Math.max(0, 1 - progress) * 0.7; // fade out toward tips
        sizes[rootIdx]  = (0.8 + Math.random() * 1.0) * (1 - progress * 0.6);
        phases[rootIdx] = Math.random() * Math.PI * 2;
        depths[rootIdx] = 0.25 + progress * 0.4;
        fades[rootIdx]  = Math.max(0, fade);
        rootIdx++;
      }
    }

    const brainGeo = new THREE.BufferGeometry();
    brainGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    brainGeo.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));
    brainGeo.setAttribute("aPhase",   new THREE.BufferAttribute(phases, 1));
    brainGeo.setAttribute("aDepth",   new THREE.BufferAttribute(depths, 1));
    brainGeo.setAttribute("aFade",    new THREE.BufferAttribute(fades, 1));

    const brainMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aPhase;
        attribute float aDepth;
        attribute float aFade;
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vBright;
        varying float vDepth;
        varying float vFade;

        void main() {
          vec3 pos = position;

          // Neural firing waves — bright ripples across the surface
          float wave1 = sin(pos.x * 0.08 + pos.y * 0.06 - uTime * 1.8 + aPhase) * 0.5 + 0.5;
          float wave2 = sin(pos.z * 0.1 - pos.y * 0.05 + uTime * 1.2) * 0.5 + 0.5;
          float firing = pow(wave1 * wave2, 3.0);

          // Breathing — whole brain subtly expands/contracts
          float breath = 1.0 + sin(uTime * 0.2) * 0.008;
          pos *= breath;

          // Subtle jitter on surface points — alive, not static
          if (aDepth < 0.3) {
            pos += normalize(pos) * sin(uTime * 2.0 + aPhase) * 0.3;
          }

          // Brightness
          float baseBright = aDepth < 0.3 ? 0.5 : aDepth < 0.6 ? 0.3 : 0.15;
          float pulse = 0.5 + 0.5 * sin(uTime * 0.5 + aPhase);
          vBright = baseBright * (0.6 + pulse * 0.4) + firing * 0.4;

          // Mouse proximity brightening (in screen space)
          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          vec4 proj = projectionMatrix * mvPos;
          vec2 screen = proj.xy / proj.w;
          float mouseDist = length(screen - uMouse);
          vBright += max(0.0, 1.0 - mouseDist * 2.0) * 0.2;

          vDepth = aDepth;
          vFade  = aFade;

          gl_PointSize = aSize * (1.0 + firing * 0.8) * (200.0 / -mvPos.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 8.0);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        varying float vBright;
        varying float vDepth;
        varying float vFade;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          if (d > 1.0) discard;

          // Surface points: crisp. Deep points: softer.
          float sharpness = vDepth < 0.3 ? 2.5 : 1.5;
          float glow = exp(-d * d * sharpness);

          // Color: gold, slightly different hue by depth
          vec3 surfaceColor = vec3(0.831, 0.686, 0.216); // #D4AF37 gold
          vec3 deepColor = vec3(0.55, 0.48, 0.24);
          vec3 col = mix(surfaceColor, deepColor, vDepth);

          // aFade=1 → normal point; aFade<1 → root system fades out
          float alpha = glow * vBright * mix(1.0, vFade, step(0.99, 1.0 - vFade));
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const brain = new THREE.Points(brainGeo, brainMat);
    scene.add(brain);

    // ── ORBITING BRAND LOGOS with real SVG paths ──
    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    function createLogoTexture(brand: typeof BRANDS[0]): THREE.CanvasTexture {
      const sz = 256;
      const cvs = document.createElement("canvas");
      cvs.width = sz; cvs.height = sz;
      const c2 = cvs.getContext("2d")!;
      const ct = sz / 2;

      const grad = c2.createRadialGradient(ct, ct, 0, ct, ct, sz * 0.45);
      grad.addColorStop(0, brand.color + "40");
      grad.addColorStop(0.4, brand.color + "15");
      grad.addColorStop(1, "transparent");
      c2.fillStyle = grad;
      c2.fillRect(0, 0, sz, sz);

      const ls = sz * 0.35;
      const lo = (sz - ls) / 2;
      c2.save();
      c2.translate(lo, lo - sz * 0.04);
      c2.scale(ls / 24, ls / 24);
      c2.fillStyle = brand.color;
      c2.fill(new Path2D(brand.svgPath));
      c2.restore();

      c2.font = `600 ${sz * 0.065}px "Inter", sans-serif`;
      c2.fillStyle = brand.color;
      c2.globalAlpha = 0.9;
      c2.textAlign = "center";
      c2.fillText(brand.name, ct, ct + ls * 0.55 + sz * 0.07);
      c2.globalAlpha = 1;

      return new THREE.CanvasTexture(cvs);
    }

    interface LogoOrbit {
      sprite: THREE.Sprite;
      orbitR: number;
      orbitTilt: number;
      speed: number;
      phase: number;
      color: THREE.Color;
      connection: THREE.Line;
    }

    const logos: LogoOrbit[] = [];

    BRANDS.forEach((brand, i) => {
      const color = new THREE.Color(brand.color);
      const orbitR = 82 + i * 10;
      const tilt = (i / BRANDS.length) * 0.7 - 0.35;
      const speed = 0.06 + i * 0.01;
      const phase = (i / BRANDS.length) * Math.PI * 2;

      // Logo sprite from canvas texture
      const tex = createLogoTexture(brand);
      const spriteMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(22, 22, 1);
      logoGroup.add(sprite);

      // Orbit ring
      const ringGeo = new THREE.RingGeometry(orbitR - 0.15, orbitR + 0.15, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.02,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + tilt;
      ring.rotation.z = i * 0.3;
      scene.add(ring);

      // Connection line to center
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(6), 3));
      const lineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const connection = new THREE.Line(lineGeo, lineMat);
      scene.add(connection);

      logos.push({ sprite, orbitR, orbitTilt: tilt, speed, phase, color, connection });
    });

    // Mouse
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / W;
      mouseRef.current.y = e.clientY / H;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Scroll — camera follows scroll to reveal spine
    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Resize
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);
    };
    window.addEventListener("resize", onResize);

    // ── NEURAL ENERGY WAVES — glowing pulses between neurons ──
    // Each wave: a bright head sprite + trail of fading sprites along a curve
    // Looks like energy/light traveling through neural tissue

    // Reusable glow texture for energy sprites
    const energyTex = (() => {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 64;
      const ctx = c.getContext("2d")!;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(201,168,76,1.0)");
      g.addColorStop(0.15, "rgba(201,168,76,0.7)");
      g.addColorStop(0.4, "rgba(201,168,76,0.15)");
      g.addColorStop(0.7, "rgba(201,168,76,0.03)");
      g.addColorStop(1, "rgba(201,168,76,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    interface EnergyWave {
      curvePoints: THREE.Vector3[];
      head: THREE.Sprite;        // bright leading point
      trail: THREE.Sprite[];     // fading trail sprites
      birth: number;
      lifetime: number;
      progress: number;
    }
    const waves: EnergyWave[] = [];
    let lastWaveTime = 0;
    const WAVE_INTERVAL = 0.7;
    const WAVE_LIFETIME = 2.5;
    const MAX_WAVES = 10;
    const TRAIL_LENGTH = 8;

    function spawnWave(t: number) {
      if (waves.length >= MAX_WAVES) return;

      const posArr = brainGeo.attributes.position.array;
      const count = brainGeo.attributes.position.count;
      const depthArr = brainGeo.attributes.aDepth.array as Float32Array;

      // Pick a surface point
      let idx1 = 0;
      for (let a = 0; a < 50; a++) {
        idx1 = Math.floor(Math.random() * count);
        if (depthArr[idx1] < 0.3) break;
      }
      const p1 = new THREE.Vector3(posArr[idx1 * 3], posArr[idx1 * 3 + 1], posArr[idx1 * 3 + 2]);

      // Find nearby surface point
      let p2 = p1.clone();
      for (let a = 0; a < 80; a++) {
        const idx2 = Math.floor(Math.random() * count);
        if (depthArr[idx2] > 0.3) continue;
        const candidate = new THREE.Vector3(posArr[idx2 * 3], posArr[idx2 * 3 + 1], posArr[idx2 * 3 + 2]);
        const d = p1.distanceTo(candidate);
        if (d > 10 && d < 30) { p2 = candidate; break; }
      }

      // Curve that hugs the brain surface
      const mid = p1.clone().lerp(p2, 0.5);
      const normal = mid.clone().normalize();
      const lift = 2 + Math.random() * 4;
      const ctrl = mid.clone().add(normal.multiplyScalar(lift));
      const curve = new THREE.QuadraticBezierCurve3(p1, ctrl, p2);
      const curvePoints = curve.getPoints(60);

      // Head sprite — brightest
      const headMat = new THREE.SpriteMaterial({
        map: energyTex,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const head = new THREE.Sprite(headMat);
      head.scale.set(4, 4, 1);
      brain.add(head);

      // Trail sprites — progressively dimmer and smaller
      const trail: THREE.Sprite[] = [];
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const trailMat = new THREE.SpriteMaterial({
          map: energyTex,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const s = new THREE.Sprite(trailMat);
        s.scale.set(2.5 - i * 0.2, 2.5 - i * 0.2, 1);
        brain.add(s);
        trail.push(s);
      }

      waves.push({ curvePoints, head, trail, birth: t, lifetime: WAVE_LIFETIME, progress: 0 });
    }

    // ── ANIMATE ──
    let frame = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frame = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const m = mouseRef.current;
      m.sx += (m.x - m.sx) * 0.02;
      m.sy += (m.y - m.sy) * 0.02;

      // Camera — follows scroll to reveal spine/nervous system
      const scrollOffset = scrollRef.current * 0.35; // maps page scroll to 3D camera Y
      camera.position.x = (m.sx - 0.5) * 30;
      camera.position.y = 10 - (m.sy - 0.5) * 15 - scrollOffset;
      camera.lookAt(0, -scrollOffset, 0);

      // Brain rotation — very slow
      brain.rotation.y = t * 0.04;
      brain.rotation.x = Math.sin(t * 0.015) * 0.08;

      // Mouse in NDC for shader
      const mx = (m.sx - 0.5) * 2;
      const my = -(m.sy - 0.5) * 2;
      (brainMat.uniforms.uTime as any).value = t;
      (brainMat.uniforms.uMouse as any).value.set(mx, my);

      // Update orbiting logos
      for (const logo of logos) {
        const angle = t * logo.speed + logo.phase;
        const ox = Math.cos(angle) * logo.orbitR;
        const oy = Math.sin(angle) * logo.orbitTilt * 25;
        const oz = Math.sin(angle) * logo.orbitR;

        logo.sprite.position.set(ox, oy, oz);

        // Pulse
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.5 + logo.phase);
        (logo.sprite.material as THREE.SpriteMaterial).opacity = pulse;

        // Update connection line
        const linePos = logo.connection.geometry.attributes.position.array as Float32Array;
        linePos[0] = ox; linePos[1] = oy; linePos[2] = oz;
        linePos[3] = 0; linePos[4] = 0; linePos[5] = 0;
        logo.connection.geometry.attributes.position.needsUpdate = true;
        (logo.connection.material as THREE.LineBasicMaterial).opacity = 0.02 + pulse * 0.03;
      }

      // ── Update neural energy waves ──
      if (t - lastWaveTime > WAVE_INTERVAL) {
        spawnWave(t);
        lastWaveTime = t;
      }

      for (let i = waves.length - 1; i >= 0; i--) {
        const w = waves[i];
        const age = t - w.birth;
        w.progress = age / w.lifetime;

        if (w.progress > 1.1) {
          // Cleanup
          brain.remove(w.head);
          (w.head.material as THREE.Material).dispose();
          for (const s of w.trail) {
            brain.remove(s);
            (s.material as THREE.Material).dispose();
          }
          waves.splice(i, 1);
          continue;
        }

        const pts = w.curvePoints;
        const totalPts = pts.length;

        // Head position along curve (0→1, slow deliberate travel)
        const headT = Math.min(w.progress, 1);
        const headIdx = Math.floor(headT * (totalPts - 1));
        const headPos = pts[Math.min(headIdx, totalPts - 1)];
        w.head.position.copy(headPos);

        // Head brightness — ramp up, hold, fade at destination
        const headFadeIn = Math.min(1, w.progress * 4);
        const headFadeOut = w.progress > 0.8 ? (1 - w.progress) / 0.2 : 1;
        const headBright = headFadeIn * headFadeOut;
        (w.head.material as THREE.SpriteMaterial).opacity = headBright * 0.85;
        w.head.scale.setScalar(3 + headBright * 2);

        // Trail sprites — follow behind the head at evenly spaced intervals
        for (let ti = 0; ti < w.trail.length; ti++) {
          const trailT = headT - (ti + 1) * 0.02; // each trail point 2% behind
          if (trailT < 0) {
            (w.trail[ti].material as THREE.SpriteMaterial).opacity = 0;
            continue;
          }
          const trailIdx = Math.floor(trailT * (totalPts - 1));
          const trailPos = pts[Math.min(Math.max(trailIdx, 0), totalPts - 1)];
          w.trail[ti].position.copy(trailPos);

          // Trail fades progressively — first sprite is bright, last is dim
          const trailFade = (1 - (ti + 1) / w.trail.length);
          (w.trail[ti].material as THREE.SpriteMaterial).opacity = trailFade * trailFade * headBright * 0.5;
          w.trail[ti].scale.setScalar(2 + trailFade * 1.5);
        }
      }

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      composer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0" style={{ zIndex: 0 }} />;
}
