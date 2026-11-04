"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Title, OutlineStar } from "@/components/v2/kit";
import { ceoV2 } from "@/lib/content-v2/home";
import { staggerContainer, fadeUp, inView, ease } from "@/lib/motion";

/**
 * CEO message — rebuilt to the client reference: white canvas, ink/red display
 * title, red rule beside the copy, yellow name, and the branded portrait frame
 * ("TEXAS . FLAVOR . BOLD." border + "OUR CEO" stamp) instead of the dark,
 * glow-heavy panel. Balanced two-column spacing.
 */
export default function CeoV2() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <OutlineStar className="absolute -left-32 bottom-0 hidden size-[380px] opacity-50 lg:block" />
      <div className="container-tx relative grid items-center gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div className="max-w-xl lg:justify-self-end">
          <Title lines={ceoV2.titleLines} size="lg" className="!mt-0" />

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-8 space-y-4 border-l-[3px] border-primary pl-6"
          >
            {ceoV2.body.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className={`leading-relaxed text-third/80 ${i === 0 ? "text-xl font-bold uppercase text-third" : "text-base md:text-lg"}`}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-8 pl-6">
            <div className="display text-3xl text-secondary md:text-4xl">{ceoV2.name}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-caps text-third/50">{ceoV2.role}</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, rotate: 4, y: 40 }}
          whileInView={{ opacity: 1, rotate: 0, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.9, ease: ease.out }}
          whileHover={{ rotate: -1.5, scale: 1.01 }}
          className="relative mx-auto w-full max-w-[460px] lg:mx-0"
        >
          <Image
            src={ceoV2.image}
            alt={`${ceoV2.name}, ${ceoV2.role}`}
            width={1545}
            height={1721}
            sizes="(max-width: 1024px) 90vw, 460px"
            className="h-auto w-full select-none drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
