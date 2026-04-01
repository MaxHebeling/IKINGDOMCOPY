"use client";

import { useRef, useMemo, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  progress: MutableRefObject<number>;
  /** Total number of star particles. Reduce on lower-end devices. */
  count?: number;
}

/**
 * Procedural starfield that rushes toward the camera as scroll progress rises.
 *
 * TUNING:
 *  - count: more stars = denser field, higher GPU cost (default 2 500)
 *  - BASE_SPEED: minimum rush speed (increase for faster baseline)
 *  - ACCEL: how much extra speed scroll progress adds (higher = warp-like end)
 *  - SPREAD: XY radius of the star cloud (wider = more cinematic periphery)
 *  - DEPTH: Z-depth behind camera at spawn (longer tail = more stars visible)
 */
const BASE_SPEED = 0.04;
const ACCEL = 2.0;
const SPREAD = 100;
const DEPTH = 180;

export default function Starfield({ progress, count = 2500 }: StarfieldProps) {
  const meshRef = useRef<THREE.Points>(null!);

  // Generate positions + per-star speed multipliers once
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD;
      positions[i * 3 + 2] = -Math.random() * DEPTH;
      speeds[i] = 0.4 + Math.random() * 1.6;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds };
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = progress.current;
    const arr = meshRef.current.geometry.attributes.position
      .array as Float32Array;
    const speed = BASE_SPEED + p * ACCEL;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += speed * speeds[i];
      // Wrap star back to the far end once it passes the camera
      if (arr[i * 3 + 2] > 8) arr[i * 3 + 2] = -DEPTH;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        color="#c8dcff"
        size={0.22}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
