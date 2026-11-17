"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-linked parallax. Translates its child on Y as the element passes
 * through the viewport. `speed` > 0 moves slower (background), negative moves
 * faster (foreground). Depth = differential speed.
 *
 * Off on phones: stacked mobile layouts have no room for the drift (it pushes
 * images into the copy below) and touch scrolling already gives momentum.
 */
export default function Parallax({
  children,
  speed = 40,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const amp = enabled ? speed : 0;
  const y = useTransform(scrollYProgress, [0, 1], [amp, -amp]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, willChange: enabled ? "transform" : undefined }}>{children}</motion.div>
    </div>
  );
}
