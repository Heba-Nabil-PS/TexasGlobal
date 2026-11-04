"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Stamp } from "@/components/v2/kit";
import { HeroV2 } from "./shared";

/** Brand map pins dropping onto the meal — "find the one near you". */
const PINS = [
  { src: "/assets/pin-chicken.png", className: "left-[6%] top-[14%]", delay: 0.5 },
  { src: "/assets/pin-star.png", className: "right-[10%] top-[6%]", delay: 0.7 },
  { src: "/assets/pin-chili.png", className: "right-[2%] bottom-[30%]", delay: 0.9 },
  { src: "/assets/pin-star.png", className: "left-[34%] bottom-[6%]", delay: 1.1 },
];

/**
 * Find your market hero — same white V2 hero as the other inner pages, with its
 * own signature visual: the combo on a yellow plate, map pins dropping in.
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
            className="absolute inset-x-[2%] top-[24%] aspect-[1680/1096]"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
              <Image
                src="/assets/v2/menu/explore-combo.png"
                alt="Texas Chicken bone-in box, fries and drink"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 40vw"
                className="object-contain drop-shadow-[0_28px_36px_rgba(45,41,38,0.3)]"
              />
            </motion.div>
          </motion.div>

          {PINS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 14, delay: p.delay }}
              className={`absolute w-[11%] ${p.className}`}
            >
              <Image src={p.src} alt="" width={60} height={91} className="h-auto w-full drop-shadow-lg" />
            </motion.div>
          ))}

          <Stamp text="25+ markets" size={124} className="absolute -left-2 bottom-2 md:-left-6" />
        </div>
      }
    >
      {children}
    </HeroV2>
  );
}
