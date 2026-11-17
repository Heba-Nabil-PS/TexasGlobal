"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Title } from "@/components/v2/kit";
import { ceoV2 } from "@/lib/content-v2/home";
import { staggerContainer, fadeUp, inView, ease } from "@/lib/motion";

/**
 * CEO message: copy with a red rule on the left, simple square portrait on the right.
 */
export default function CeoV2() {
  return (
    <section className="relative overflow-hidden bg-white pb-10 pt-4 md:py-12">
      <div className="container-tx relative grid items-center gap-8 md:gap-14 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
        <div className="max-w-xl lg:justify-self-end">
          <Title lines={ceoV2.titleLines} size="lg" className="!mt-0" />

          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-6 space-y-4 border-l-[3px] border-primary pl-5 md:mt-8 md:pl-6"
          >
            {ceoV2.body.map((p, i) => (
              <motion.p
                key={i}
                variants={fadeUp}
                className={`leading-relaxed text-third/80 ${i === 0 ? "text-lg font-bold uppercase leading-snug text-third md:text-xl" : "text-base md:text-lg"}`}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-6 pl-5 md:mt-8 md:pl-6">
            <div className="display text-3xl text-third md:text-4xl">{ceoV2.name}</div>
            <div className="mt-1.5 text-sm font-extrabold uppercase tracking-caps text-primary md:text-base">{ceoV2.role}</div>
          </motion.div>
        </div>

        <CeoPortrait />
      </div>
    </section>
  );
}

/** Simple square portrait: rounded corners, soft shadow, gentle fade-up. */
function CeoPortrait() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inView}
      transition={{ duration: 0.8, ease: ease.out }}
      className="relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-[2rem] bg-third shadow-soft3 lg:mx-0"
    >
      <Image
        src={ceoV2.image}
        alt={`${ceoV2.name}, ${ceoV2.role}`}
        fill
        sizes="(max-width: 1024px) 90vw, 460px"
        className="select-none object-cover object-top"
      />
    </motion.div>
  );
}
