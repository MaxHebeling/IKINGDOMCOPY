"use client";

import { forwardRef } from "react";

/**
 * Full-screen white overlay that GSAP brightens during the portal flash.
 * Opacity is animated directly on the DOM element — no React state, no
 * re-renders, smooth 60 fps driven by scroll scrub.
 */
const TransitionOverlay = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    style={{
      position: "absolute",
      inset: 0,
      backgroundColor: "#ffffff",
      opacity: 0,
      pointerEvents: "none",
      zIndex: 10,
    }}
  />
));

TransitionOverlay.displayName = "TransitionOverlay";

export default TransitionOverlay;
