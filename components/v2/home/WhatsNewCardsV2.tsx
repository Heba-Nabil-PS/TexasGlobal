"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Featured from "@/components/sections/Featured";
import { whatsNewV2 } from "@/lib/content-v2/home";

/** One size for every tile in the row: square, filling the pinned row (max 58vh) on desktop. */
const TILE =
  "relative aspect-square w-[82vw] max-w-[420px] shrink-0 snap-center overflow-hidden rounded-[2rem] shadow-soft3 md:h-full md:max-h-[58vh] md:w-auto md:max-w-none";

/**
 * What's new — the pinned horizontal gallery from Featured, carrying the square
 * LTO photos, ending in the solid maroon "See the full menu" square.
 */
export default function WhatsNewCardsV2() {
  return (
    <Featured
      note={whatsNewV2.note}
      cards={whatsNewV2.items.map((item, i) => (
        <motion.article
          key={item.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -8 }}
          className={`${TILE} bg-third ring-1 ring-third/5`}
        >
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 82vw, 52vh" className="object-cover" />
        </motion.article>
      ))}
    />
  );
}
