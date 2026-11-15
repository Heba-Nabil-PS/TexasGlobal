"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eyebrow, Title } from "@/components/v2/kit";
import BrandArrow from "@/components/ui/BrandArrow";
import { whatsNewV2 } from "@/lib/content-v2/home";

const fm = whatsNewV2.fullMenu;

/**
 * What's new — the reference layout: LTO artwork (title lock-ups baked in) in
 * a single row on white, ending in a square "full menu" tile styled like the LTO photos.
 * Swipeable on mobile; no pinned scroll.
 */
export default function WhatsNewV2() {
  return (
    <section id="whats-new" className="relative overflow-hidden bg-white py-10 md:py-12">
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

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: whatsNewV2.items.length * 0.1, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8, rotate: 1 }}
            className="relative shrink-0 snap-center"
            style={{ width: "min(22rem, 78vw)" }}
          >
            <Link
              href="/menu"
              data-cursor="link"
              aria-label={fm.cta}
              className="group relative block aspect-square overflow-hidden drop-shadow-xl"
              style={{ background: "linear-gradient(160deg, #872c33 0%, #67161b 54%, #f48828 54%, #e8791c 100%)" }}
            >
              <div className="absolute inset-x-0 top-0 px-[8%] pt-[9%]">
                <p className="font-texas text-[clamp(0.7rem,1.1vw,0.85rem)] font-extrabold uppercase tracking-caps text-white/70">
                  {fm.kicker}
                </p>
                <p className="display mt-1 text-[clamp(2.4rem,4.2vw,3.4rem)] uppercase leading-[0.85] text-white">
                  {fm.lines[0]}
                  <br />
                  <span className="text-secondary">{fm.lines[1]}</span>
                </p>
              </div>
              <div className="absolute bottom-[7%] left-[5%] w-[70%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                <Image src={fm.image} alt="" width={1474} height={953} sizes="(max-width: 768px) 60vw, 18rem" className="h-auto w-full" />
              </div>
              <span className="absolute bottom-[7%] right-[6%] grid size-14 place-items-center rounded-full bg-third text-xl text-white transition-colors duration-300 group-hover:bg-primary md:size-16">
                <BrandArrow />
              </span>
            </Link>
          </motion.div>
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-caps text-third/40">{whatsNewV2.note}</p>
      </div>
    </section>
  );
}
