"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { hero } from "@/lib/content";

/** Hero without the "Scroll to explore" cue or floating stars (client: remove them). */
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
    </section>
  );
}
