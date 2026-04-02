"use client";

import { useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CockpitProps {
  progress: MutableRefObject<number>;
}

// ─── Material helpers ─────────────────────────────────────────────────────────

/** Dark metallic hull material — reused across frame pieces. */
function HullMat() {
  return (
    <meshStandardMaterial color="#111827" metalness={0.92} roughness={0.18} />
  );
}

/** Emissive accent strip (HUD lines, dashboard glow). */
function AccentMat({ color = "#2a6fff" }: { color?: string }) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={2.5}
      toneMapped={false}
    />
  );
}

/**
 * Cockpit interior built from primitive meshes.
 *
 * ── REPLACING WITH A REAL MODEL ────────────────────────────────────────────
 * 1. Drop your GLB into public/models/cockpit.glb
 * 2. Replace the JSX below with:
 *
 *    import { useGLTF } from "@react-three/drei";
 *    const { scene } = useGLTF("/models/cockpit.glb");
 *    return <primitive object={scene} />;
 *
 * 3. Keep the pointLight refs and glow logic — they work with any geometry.
 * ────────────────────────────────────────────────────────────────────────────
 *
 * TUNING:
 *  - glowLightRef.intensity start/end → how bright the cockpit interior gets
 *  - rimColor → hull tint (hex)
 *  - HUD accent positions → adjust to match your model silhouette
 */
export default function Cockpit({ progress }: CockpitProps) {
  const glowRef = useRef<THREE.PointLight>(null!);
  const dashStripRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (!glowRef.current || !dashStripRef.current) return;
    const p = progress.current;

    // Interior ambient glow: dim blue → bright warm white as portal nears
    glowRef.current.intensity = 0.35 + p * 4;
    glowRef.current.color.setHSL(0.58 - p * 0.18, 1, 0.45 + p * 0.45);

    // Dashboard strip brightens independently for drama
    const mat = dashStripRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 2 + p * 8;
  });

  return (
    <group>
      {/* ── Lights ─────────────────────────────────────────────────────── */}
      {/* Central interior glow — color-animated */}
      <pointLight
        ref={glowRef}
        position={[0, 0.5, -1]}
        intensity={0.35}
        distance={14}
      />
      {/* Fixed side fill lights */}
      <pointLight position={[-3.5, 1.2, -1.8]} intensity={0.2} color="#1a4adf" distance={7} />
      <pointLight position={[3.5, 1.2, -1.8]} intensity={0.2} color="#1a4adf" distance={7} />

      {/* ── Frame ──────────────────────────────────────────────────────── */}
      {/* Top bar */}
      <mesh position={[0, 3.3, -2]}>
        <boxGeometry args={[9.2, 0.2, 0.9]} />
        <HullMat />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -3.3, -2]}>
        <boxGeometry args={[9.2, 0.2, 0.9]} />
        <HullMat />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-4.5, 0, -2]}>
        <boxGeometry args={[0.2, 6.6, 0.9]} />
        <HullMat />
      </mesh>
      {/* Right pillar */}
      <mesh position={[4.5, 0, -2]}>
        <boxGeometry args={[0.2, 6.6, 0.9]} />
        <HullMat />
      </mesh>
      {/* Left diagonal strut */}
      <mesh position={[-3.4, -2.3, -2]} rotation={[0, 0, -Math.PI / 5]}>
        <boxGeometry args={[0.14, 3.8, 0.65]} />
        <HullMat />
      </mesh>
      {/* Right diagonal strut */}
      <mesh position={[3.4, -2.3, -2]} rotation={[0, 0, Math.PI / 5]}>
        <boxGeometry args={[0.14, 3.8, 0.65]} />
        <HullMat />
      </mesh>

      {/* ── Dashboard ──────────────────────────────────────────────────── */}
      <mesh position={[0, -4.8, -1.6]}>
        <boxGeometry args={[8.2, 2.8, 0.55]} />
        <meshStandardMaterial color="#080c18" metalness={0.97} roughness={0.08} />
      </mesh>
      {/* Animated glow strip along dashboard top edge */}
      <mesh ref={dashStripRef} position={[0, -3.45, -1.3]}>
        <boxGeometry args={[7.4, 0.06, 0.04]} />
        <AccentMat color="#2a6fff" />
      </mesh>

      {/* ── HUD Corner Brackets ────────────────────────────────────────── */}
      {/* These are purely decorative. REPLACE with your HUD overlay texture or shader. */}
      {/* Top-left */}
      <mesh position={[-3.85, 2.7, -1.9]}>
        <boxGeometry args={[0.85, 0.055, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      <mesh position={[-4.24, 2.28, -1.9]}>
        <boxGeometry args={[0.055, 0.88, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      {/* Top-right */}
      <mesh position={[3.85, 2.7, -1.9]}>
        <boxGeometry args={[0.85, 0.055, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      <mesh position={[4.24, 2.28, -1.9]}>
        <boxGeometry args={[0.055, 0.88, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      {/* Bottom-left */}
      <mesh position={[-3.85, -2.7, -1.9]}>
        <boxGeometry args={[0.85, 0.055, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      <mesh position={[-4.24, -2.28, -1.9]}>
        <boxGeometry args={[0.055, 0.88, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      {/* Bottom-right */}
      <mesh position={[3.85, -2.7, -1.9]}>
        <boxGeometry args={[0.85, 0.055, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
      <mesh position={[4.24, -2.28, -1.9]}>
        <boxGeometry args={[0.055, 0.88, 0.04]} />
        <AccentMat color="#4adfff" />
      </mesh>
    </group>
  );
}
