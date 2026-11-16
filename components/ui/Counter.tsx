"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Counts up to `value` when scrolled into view. */
export default function Counter({
  value,
  suffix = "",
  duration = 1600,
  className,
  grouping = true,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
  /** thousands separators ("40,000"); turn off for years ("1952") */
  grouping?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {grouping ? display.toLocaleString() : display}
      {suffix}
    </span>
  );
}
