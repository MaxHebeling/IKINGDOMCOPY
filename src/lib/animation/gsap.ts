/**
 * GSAP singleton — registers ScrollTrigger once and re-exports both.
 *
 * ⚠ Only import this from "use client" modules (or inside useEffect / dynamic
 * imports).  It must never execute on the server.
 *
 * Usage:
 *   import { gsap, ScrollTrigger } from "@/lib/animation/gsap";
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
