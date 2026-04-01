"use client";

import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import Cockpit from "./Cockpit";
import Starfield from "./Starfield";

// ─── Camera Rig ───────────────────────────────────────────────────────────────

/**
 * Reads the shared progress ref and moves the camera forward each frame.
 *
 * TUNING:
 *  - START_Z / END_Z  — total camera travel distance in world units
 *  - The easing split at 0.8 creates an acceleration into the portal
 *    (linear up to 80 %, quadratic ease-in for the last 20 %).
 *  - Increase the vertical bob amplitude (0.09) for more turbulence.
 */
const START_Z = 0;
const END_Z = 80;

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = progress.current;

    // Eased progress: linear flight → warp acceleration near portal
    let ep: number;
    if (p < 0.8) {
      ep = (p / 0.8) * 0.7; // 0 – 0.8 → 0 – 0.7
    } else {
      const t = (p - 0.8) / 0.2; // 0 – 1 in final 20 %
      ep = 0.7 + t * t * 0.3;    // quadratic ease-in for last 30 %
    }

    camera.position.z = START_Z + ep * END_Z;
    // Gentle vertical drift — feels alive without being distracting
    camera.position.y = Math.sin(p * Math.PI * 2.5) * 0.09;
  });

  return null;
}

// ─── Portal ───────────────────────────────────────────────────────────────────

/**
 * The destination portal sitting at the far end of the flight corridor.
 *
 * ── REPLACING WITH A REAL PORTAL ───────────────────────────────────────────
 * 1. Create a shader material (ShaderMaterial / custom GLSL) or use a texture.
 * 2. Replace the circleGeometry mesh below with your portal mesh.
 * 3. Keep the scale and emissiveIntensity animation logic — it drives the
 *    flash timing regardless of the geometry used.
 *
 * TUNING:
 *  - PORTAL_Z  — how far ahead the portal sits (must be < END_Z to be visible)
 *  - portalStart — scroll progress at which the portal begins appearing (0 – 1)
 *  - Scale curve — change the exponent (portalP ** 1.8) for faster/slower grow
 * ────────────────────────────────────────────────────────────────────────────
 */
const PORTAL_Z = 72;

function Portal({ progress }: { progress: MutableRefObject<number> }) {
  const innerRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    if (!innerRef.current || !haloRef.current || !lightRef.current) return;
    const p = progress.current;

    // Portal active from 60 % of scroll onward
    const portalStart = 0.6;
    const portalP = Math.max(0, (p - portalStart) / (1 - portalStart));

    const scale = 0.05 + portalP ** 1.8 * 28;
    innerRef.current.scale.setScalar(scale);
    haloRef.current.scale.setScalar(scale * 1.35);

    // Colour shifts from deep blue → pure white as portal fills screen
    const lightness = 0.3 + portalP * 0.7;
    const hue = 0.57 - portalP * 0.12;
    const emissiveColor = new THREE.Color().setHSL(hue, 0.7, lightness);

    const innerMat = innerRef.current.material as THREE.MeshStandardMaterial;
    innerMat.emissive.copy(emissiveColor);
    innerMat.emissiveIntensity = 1.5 + portalP * 10;

    lightRef.current.intensity = portalP * 8;
    lightRef.current.distance = 20 + portalP * 60;
    lightRef.current.color.setHSL(hue, 0.6, 0.8);
  });

  return (
    <group position={[0, 0, PORTAL_Z]}>
      <pointLight ref={lightRef} intensity={0} color="#aaddff" distance={20} />

      {/* Inner disc */}
      <mesh ref={innerRef}>
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial
          color="#99ccff"
          emissive="#99ccff"
          emissiveIntensity={1.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Outer glow halo ring */}
      <mesh ref={haloRef}>
        <ringGeometry args={[1, 1.18, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={4}
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Scene Lighting ───────────────────────────────────────────────────────────

function SceneLighting() {
  return (
    <>
      {/* Very dim ambient so the cockpit isn't pitch-black before glow kicks in */}
      <ambientLight intensity={0.04} />
      {/* Directional backfill — cool deep-space tint */}
      <directionalLight position={[0, 8, -15]} intensity={0.25} color="#223388" />
    </>
  );
}

// ─── Canvas ───────────────────────────────────────────────────────────────────

interface SpaceSceneProps {
  progress: MutableRefObject<number>;
}

/**
 * The main R3F canvas.
 *
 * TUNING:
 *  - camera.fov  — wider (85–90) for more immersive cockpit, narrower for calm
 *  - dpr         — cap at [1, 1.5] for performance; raise to [1, 2] for retina
 *  - fog         — adjust near/far values to control how deep the scene feels
 */
export default function SpaceScene({ progress }: SpaceSceneProps) {
  return (
    <Canvas
      camera={{ fov: 78, near: 0.05, far: 300, position: [0, 0, START_Z] }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <color attach="background" args={["#00000a"]} />
      <fog attach="fog" args={["#00000a", 90, 220]} />
      <SceneLighting />
      <CameraRig progress={progress} />
      <Cockpit progress={progress} />
      <Starfield progress={progress} count={2800} />
      <Portal progress={progress} />
    </Canvas>
  );
}
