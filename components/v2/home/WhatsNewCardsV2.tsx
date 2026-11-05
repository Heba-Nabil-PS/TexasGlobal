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
          className="flex aspect-square w-[82vw] max-w-[440px] shrink-0 snap-center flex-col items-center rounded-[2rem] bg-white p-6 text-center shadow-soft3 ring-1 ring-third/5 md:h-[58vh] md:w-auto md:max-w-none"
        >
          <div className="relative min-h-0 w-full flex-1">
            <Image src={item.image} alt={item.title} fill sizes="(max-width: 768px) 82vw, 58vh" className="object-contain" />
          </div>
          <p className="display mt-5 text-2xl uppercase text-primary">{item.title}</p>
          <p className="mt-1 text-sm text-third/60">{item.desc}</p>
        </motion.article>
      ))}
    />
  );
}
