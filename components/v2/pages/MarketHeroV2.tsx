"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Stamp } from "@/components/v2/kit";
import { HeroV2 } from "./shared";

/**
 * Find your market hero — same white V2 hero as the other inner pages, with its
 * own signature visual: a restaurant on a yellow plate.
 */
export default function MarketHeroV2({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow: string;
  title: string[];
  body: string;
  children?: ReactNode;
}) {
  return (
    <HeroV2
      eyebrow={eyebrow}
      title={title}
      body={body}
      decor={<div aria-hidden className="pointer-events-none absolute -right-[16vw] top-20 size-[58vw] max-w-[940px] rounded-full bg-secondary/15" />}
      visual={
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
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
            className="absolute -inset-x-[6%] top-[33%] aspect-[1295/508]"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
              <Image
                src="/assets/v2/market-store.png"
                alt="A Church's Texas Chicken restaurant"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 44vw"
                className="object-contain drop-shadow-[0_20px_24px_rgba(45,41,38,0.3)]"
              />
            </motion.div>
          </motion.div>


          <Stamp text="25+ markets" size={124} className="absolute -bottom-6 left-0 origin-bottom-left scale-[0.7] md:-left-6 md:bottom-2 md:scale-100" />
        </div>
      }
    >
      {children}
    </HeroV2>
  );
}
