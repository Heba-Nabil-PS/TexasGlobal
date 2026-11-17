"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D tilt-on-hover. The child rotates toward the cursor in perspective and
 * lifts slightly. Optional moving glare sheen. Wrap cards, images, badges.
 */
export default function Tilt({
  children,
  className,
  max = 12,
  glare = true,
  scale = 1.03,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
  scale?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 18 });
  const gx = useTransform(mx, [0, 1], [0, 100]);
  const gy = useTransform(my, [0, 1], [0, 100]);
  const glareBg = useTransform(
    [gx, gy],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.35), transparent 45%)`
  );

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return; // no hover on phones: a tap would freeze the card tilted
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", transformPerspective: 900 }}
      whileHover={{ scale }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      {/* The 40px lift only reads with a pointer. On touch it just magnifies the
          card ~5% at rest (900px perspective), pushing it past the page gutter
          and softening the text, so it is applied for hover devices only. */}
      <div style={{ transformStyle: "preserve-3d" }} className="relative h-full w-full [@media(hover:hover)]:[transform:translateZ(40px)]">
        {children}
        {glare && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, mixBlendMode: "overlay" }}
          />
        )}
      </div>
    </motion.div>
  );
}
