"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow, Stamp, Title } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease, fadeUp, inView, staggerContainer } from "@/lib/motion";

/**
 * Signatures — appetizing cut-outs, not blog cards. Each product floats on its
 * outline star (baked into the artwork) with a round red stamp carrying its
 * tagline; the name sits underneath. No boxes, no crops, no calories.
 */
export default function SignaturesV2() {
  const { eyebrow, title, note, items } = menuV2.signatures;

  return (
    <section id="signatures" className="relative overflow-hidden bg-white pb-20 pt-8 text-third md:pb-28 md:pt-10">
      <div className="container-tx">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title lines={title} />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-5 text-sm font-bold uppercase tracking-caps text-primary"
        >
          {note}
        </motion.p>

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          // "some" so the reveal still fires when the grid is taller than a phone screen
          viewport={{ once: true, amount: "some" }}
          className="mt-14 grid grid-cols-2 gap-x-4 gap-y-14 md:mt-20 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-20"
        >
          {items.map((item, i) => (
            <motion.article key={item.title} variants={fadeUp} className="group relative flex flex-col items-center text-center">
              <div className="relative aspect-[915/874] w-full max-w-[420px]">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.07, rotate: i % 2 ? 2 : -2 }}
                  transition={{ duration: 0.5, ease: ease.pop }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 45vw, 30vw"
                    className="object-contain drop-shadow-[0_22px_24px_rgba(45,41,38,0.18)]"
                  />
                </motion.div>
                <Stamp
                  text={item.stamp}
                  size={96}
                  spin="hover"
                  className="absolute bottom-[10%] right-[4%] aspect-square !h-auto !w-[22%] min-w-[64px] transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="display mt-2 text-2xl leading-none text-third transition-colors duration-300 group-hover:text-primary md:text-[2rem]">
                {item.title}
              </h3>
              <p className="mt-2 max-w-[28ch] text-sm leading-snug text-third/60 md:text-base">{item.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
