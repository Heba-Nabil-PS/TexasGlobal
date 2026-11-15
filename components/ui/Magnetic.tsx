"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Magnetic wrapper — the element leans gently toward the cursor while hovered,
 * then settles back on leave. Kept subtle on purpose: the pull is measured from
 * the element's resting position (not its moving one), capped at `max` px, and
 * eased with a well-damped spring so the target never "runs away" from the cursor.
 */
export default function Magnetic({
  children,
  strength = 0.15,
  max = 6,
  className,
}: {
  children: ReactNode;
  strength?: number;
  /** maximum offset in px on each axis */
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 150, damping: 22, mass: 0.6 });

  const clamp = (v: number) => Math.max(-max, Math.min(max, v));

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // subtract the current offset so we measure from the resting position
    const cx = r.left - x.get() + r.width / 2;
    const cy = r.top - y.get() + r.height / 2;
    x.set(clamp((e.clientX - cx) * strength));
    y.set(clamp((e.clientY - cy) * strength));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
}
