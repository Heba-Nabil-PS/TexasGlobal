"use client";

import { motion } from "framer-motion";
import { hero } from "@/lib/content";

/**
 * Hero: the brand video at its native aspect ratio (never cropped). Height
 * follows the video's width. Below lg the fixed header is solid-height, so the
 * video starts under it instead of the logos covering the top of the frame.
 */
export default function HeroV2() {
  return (
    <section id="top" className="relative w-full bg-white pt-[72px] lg:pt-0">
      <motion.video
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="block h-auto w-full"
        src={hero.video}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </section>
  );
}
