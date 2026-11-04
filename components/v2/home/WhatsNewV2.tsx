"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eyebrow, Title } from "@/components/v2/kit";
import { whatsNewV2 } from "@/lib/content-v2/home";

/**
 * What's new — the reference layout: LTO artwork (title lock-ups baked in) in
 * a single row on white, ending in the round "See the full menu" badge.
 * Swipeable on mobile; no pinned scroll.
 */
export default function WhatsNewV2() {
  return (
    <section id="whats-new" className="relative overflow-hidden bg-white py-20 md:py-24">
      <div className="container-tx">
        <Eyebrow>{whatsNewV2.eyebrow}</Eyebrow>
        <Title lines={[whatsNewV2.title]} size="xl" />
      </div>

      <div className="container-tx mt-10">
        <div className="flex snap-x snap-mandatory items-end gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-10 md:overflow-visible [&::-webkit-scrollbar]:hidden">
          {whatsNewV2.items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              className="relative shrink-0 snap-center"
              style={{ width: `min(${(item.w / item.h) * 22}rem, 78vw)` }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={item.w}
                height={item.h}
                sizes="(max-width: 768px) 78vw, 30vw"
                className="h-auto w-full drop-shadow-xl"
              />
            </motion.div>
          ))}

          <Link href="/menu" data-cursor="link" aria-label="See the full menu" className="group shrink-0 snap-center self-center">
            <motion.span
              initial={{ scale: 0, rotate: -40 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.4 }}
              className="block size-32 transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110 md:size-36"
            >
              <Image src={whatsNewV2.badge} alt="" width={485} height={485} className="h-full w-full" />
            </motion.span>
          </Link>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-caps text-third/40">{whatsNewV2.note}</p>
      </div>
    </section>
  );
}
