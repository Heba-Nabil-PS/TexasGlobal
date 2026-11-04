"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Stamp } from "@/components/v2/kit";
import { HeroV2 } from "./shared";

/**
 * White V2 hero for the simpler inner pages (leadership, community, sitemap,
 * legal). Same layout and type as the other inner pages; each page passes its
 * own dish + stamp so they don't read as copies. The last title line is
 * painted brand red.
 */
export default function PageHeroV2({
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  stamp,
  children,
}: {
  eyebrow: string;
  title: string[];
  subtitle?: string;
  /** a transparent cut-out, e.g. /assets/v2/signatures/sig-0X.png */
  image: string;
  imageAlt: string;
  stamp: string;
  children?: ReactNode;
}) {
  const lines = title.map((l, i) => (i === title.length - 1 && !l.includes("[") ? `[${l}]` : l));

  return (
    <HeroV2
      eyebrow={eyebrow}
      title={lines}
      body={subtitle ?? ""}
      decor={<div aria-hidden className="pointer-events-none absolute -right-[16vw] top-20 size-[58vw] max-w-[940px] rounded-full bg-secondary/15" />}
      visual={
        <div className="relative mx-auto aspect-square w-full max-w-[500px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-[10%] rounded-full bg-secondary"
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-[4%]"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
              <Image src={image} alt={imageAlt} fill priority sizes="(max-width:1024px) 90vw, 40vw" className="object-contain drop-shadow-[0_28px_36px_rgba(45,41,38,0.3)]" />
            </motion.div>
          </motion.div>
          <Stamp text={stamp} size={120} className="absolute -left-2 bottom-4 md:-left-6" />
        </div>
      }
    >
      {children}
    </HeroV2>
  );
}
