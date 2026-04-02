/**
 * Device/motion utilities — safe to call on server (always return false there).
 */

/** Returns true if the user's OS has requested reduced motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Returns true on viewports narrower than 768 px (phones/small tablets). */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}
