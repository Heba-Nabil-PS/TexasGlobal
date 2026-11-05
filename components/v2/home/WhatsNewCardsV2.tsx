"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Featured from "@/components/sections/Featured";
import { whatsNewV2 } from "@/lib/content-v2/home";

/**
 * What's new — the pinned horizontal gallery from Featured, carrying the LTO
 * cut-outs in the white award-style boxes used on Franchising.
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
          className="relative aspect-square w-[82vw] max-w-[440px] shrink-0 snap-center overflow-hidden rounded-[2rem] bg-white shadow-soft3 ring-1 ring-third/5 md:h-[58vh] md:w-auto md:max-w-none"
        >
          <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 82vw, 58vh" className="object-contain" />
        </motion.article>
      ))}
    />
  );
}
