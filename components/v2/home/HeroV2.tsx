"use client";

import BrandStar from "@/components/ui/BrandStar";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/lib/content";

/** Hero without the "Scroll to explore" cue (client: remove it). */
export default function HeroV2() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Layered scroll motion: video scales
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] w-full overflow-hidden bg-ink text-cream">
      {/* Background video */}
      <motion.div className="absolute inset-0" style={{ scale: videoScale }}>
        <video
          className="h-full w-full object-cover"
          src={hero.video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </motion.div>

      {/* Floating decorative elements */}
      <FloatingStars />

    </section>
  );
}

function FloatingStars() {
  const stars = [
    { top: "18%", left: "82%", size: 46, dur: 7, delay: 0 },
    { top: "70%", left: "12%", size: 30, dur: 9, delay: 1 },
    { top: "34%", left: "68%", size: 20, dur: 6, delay: 0.5 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-[5]">
      {stars.map((s, i) => (
        <motion.span
          key={i}
          className="absolute text-tex-yellow/70"
          style={{ top: s.top, left: s.left, fontSize: s.size }}
          animate={{ y: [0, -18, 0], rotate: [0, 12, 0] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
        >
          <BrandStar />
        </motion.span>
      ))}
    </div>
  );
}
