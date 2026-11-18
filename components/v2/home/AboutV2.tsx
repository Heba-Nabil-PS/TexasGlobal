"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Counter from "@/components/ui/Counter";
import Reveal from "@/components/ui/Reveal";
import { WordsReveal } from "@/components/ui/TextReveal";
import { Eyebrow, Title } from "@/components/v2/kit";
import { about } from "@/lib/content";
import { aboutV2 } from "@/lib/content-v2/home";
import { staggerContainer, fadeUp, inView } from "@/lib/motion";

/** Home "Our story": global-leadership headline, white canvas, stat cards, tray video. */
export default function AboutV2() {
  return (
    <section id="about" className="relative overflow-hidden bg-white pb-0 pt-10 md:pb-12 md:pt-14">
      <div className="container-tx relative">
        <div className="grid items-center gap-2 md:gap-14 lg:grid-cols-[1fr_1.05fr]">
          <div>
            <Eyebrow>{aboutV2.eyebrow}</Eyebrow>
            <Title lines={aboutV2.titleLines} size="md" className="md:!text-[3.6vw]" />

            <p className="mt-5 max-w-xl text-base leading-relaxed text-third/70 md:mt-7 md:text-lg">
              <WordsReveal text={aboutV2.body} />
            </p>

            <StatCards />

            <Reveal delay={0.15} className="btn-row mt-7 flex flex-wrap items-center justify-center gap-4 md:mt-10">
              <Button href={about.cta.primary.href} variant="yellow">
                {about.cta.primary.label}
              </Button>
            </Reveal>
          </div>

          {/* Phones/tablets: box = the video's own 1080x800 ratio, so no letterbox
              space above/below the tray. Desktop keeps the tall column. */}
          <div className="relative mx-auto -mb-[6%] aspect-[1080/800] w-full max-w-xl lg:mb-0 lg:aspect-auto lg:h-[620px] lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-full"
            >
              <video
                className="h-full w-full object-contain object-center mix-blend-multiply"
                src="/assets/home/food-gif.webm"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="Texas Chicken tray"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Punchier counters: tilted black cards, big yellow numbers, 1–3 word labels. */
function StatCards() {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={inView}
      className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 md:mt-10"
    >
      {aboutV2.stats.map((s, i) => {
        return (
          <motion.div
            key={s.label}
            variants={fadeUp}
            whileHover={{ y: -6, rotate: 0 }}
            style={{ rotate: i % 2 ? 1.5 : -1.5 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-third p-4 text-white shadow-soft3 md:p-5"
          >
            <div className="display text-[2.6rem] leading-none text-secondary md:text-5xl">
              <Counter value={s.value} suffix={s.suffix} grouping={!("year" in s && s.year)} />
            </div>
            <div className="mt-3 text-sm font-extrabold uppercase leading-tight tracking-wide">{s.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
