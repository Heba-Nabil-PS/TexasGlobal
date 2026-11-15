"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Eyebrow, Title } from "@/components/v2/kit";
import { menuV2 } from "@/lib/content-v2/menu";
import { ease, fadeUp, inView, staggerContainer } from "@/lib/motion";

/**
 * Signatures — appetizing cut-outs, not blog cards. Plain product cut-outs
 * (outline stars and tagline stamps removed per client); the name sits
 * underneath. No boxes, no crops, no calories.
 */
export default function SignaturesV2() {
  const { eyebrow, title, note, items } = menuV2.signatures;

  return (
    <section id="signatures" className="relative overflow-hidden bg-white pb-10 pt-8 text-third md:pb-12 md:pt-10">
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
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-14 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-14"
        >
          {items.map((item, i) => (
            <motion.article key={item.title} variants={fadeUp} className="group relative flex flex-col items-center text-center">
              {/* Tightly-cropped cut-outs in a fixed-height frame, sitting on a shared baseline */}
              <div className="relative h-36 w-full max-w-[380px] sm:h-48 lg:h-56">
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
                    className="object-contain object-bottom drop-shadow-[0_22px_24px_rgba(45,41,38,0.18)]"
                  />
                </motion.div>
              </div>

              <h3 className="display mt-6 text-2xl leading-none text-third transition-colors duration-300 group-hover:text-primary md:text-[2rem]">
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
