"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { damping: 50, stiffness: 900, mass: 0.2 });
  const dotY = useSpring(y, { damping: 50, stiffness: 900, mass: 0.2 });
  const ringX = useSpring(x, { damping: 28, stiffness: 200, mass: 0.7 });
  const ringY = useSpring(y, { damping: 28, stiffness: 200, mass: 0.7 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); if (!visible) setVisible(true); };
    const check = (e: MouseEvent) => { setHovering((e.target as HTMLElement).closest("a,button,[data-hover],input,textarea,select") !== null); };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousemove", check, { passive: true });
    window.addEventListener("mouseleave", () => setVisible(false));
    window.addEventListener("mouseenter", () => setVisible(true));
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mousemove", check); };
  }, [x, y, visible]);

  if (!visible) return null;
  return (
    <>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}>
        <div className="w-[5px] h-[5px] rounded-full bg-ink" />
      </motion.div>
      <motion.div className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}>
        <motion.div
          animate={{ width: hovering ? 44 : 26, height: hovering ? 44 : 26, borderColor: hovering ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.1)" }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-full"
          style={{ borderWidth: 1, borderStyle: "solid" }}
        />
      </motion.div>
    </>
  );
}
