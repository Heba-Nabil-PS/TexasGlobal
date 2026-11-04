"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { LinesReveal } from "@/components/ui/TextReveal";
import CTABand from "@/components/sections/CTABand";
import { storyPage, leadershipPage } from "@/lib/content";
import { StoryHeroV2, KeywordStripV2, HeritageV2 } from "@/components/v2/story/StorySections";
import Timeline from "@/components/v2/story/Timeline";
import { staggerContainer, fadeUp, inView, ease } from "@/lib/motion";

export default function StoryPage() {
  return (
    <>
      <StoryHeroV2 />

      {/* Animated words — right under the hero */}
      <KeywordStripV2 />

      {/* 1 — Heritage & founding */}
      <HeritageV2 />

      {/* Story in motion — the brand film */}
      <StoryFilm />

      {/* Mission & vision */}
      <MissionVision />

      {/* Timeline */}
      <Timeline />

      {/* Leadership team (sub-page) */}
      <LeadershipTeaser />

      <CTABand
        eyebrow="Be part of the story"
        heading="70 years in."
        accent="Just getting warmed up."
        body="Taste the recipe that started it all — or help us write the next chapter in your market."
        primary={{ label: "Explore the menu", href: "/menu" }}
        secondary={{ label: "Franchise with us", href: "/franchising" }}
        tone="ink"
        video="/assets/home/hero-reference.mp4"
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Story in motion — full-width brand film                             */
/* ------------------------------------------------------------------ */
function StoryFilm() {
  return (
    <section className="bg-cream pb-12 md:pb-16">
      <div className="container-tx">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: ease.out }}
        >
          <video
            className="block aspect-[1536/530] w-full object-cover mix-blend-multiply"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/assets/story/heritage-chicken.jpg"
          >
            <source src="/assets/story/story-film.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mission & vision — reference story-page layout                       */
/* Structure mirrors the reference MissionVisionSection: two-column      */
/* grid, rounded blocks, the OUR MISSION / OUR VISION title graphic,     */
/* then a text-xl body paragraph.                                        */
/* ------------------------------------------------------------------ */
function MissionVision() {
  const { missionVision } = storyPage;
  return (
    <section className="relative bg-cream px-4 py-12 md:py-16">
      <div className="container-tx md:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {missionVision.items.map((item) => (
            <motion.div
              key={item.alt}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              className="relative rounded-2xl"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.titleImage} alt={item.alt} className="mb-5 h-24 w-auto sm:h-28 md:h-32" />
              <p className="text-xl leading-relaxed text-ink-600">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4 — Leadership team teaser (links to the sub-page)                  */
/* ------------------------------------------------------------------ */
function LeadershipTeaser() {
  const { leadership } = storyPage;
  return (
    <section id="leadership" className="scroll-mt-24 bg-ink py-24 text-cream md:py-32">
      <div className="container-tx grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <span className="eyebrow text-tex-yellow">
            <span aria-hidden>★</span> {leadership.eyebrow}
          </span>
          <h2 className="display mt-5 uppercase leading-[0.92]" style={{ fontSize: "clamp(32px, 5vw, 66px)" }}>
            <LinesReveal lines={["Operators first.", "Brand-builders always."]} lineClassName="block" />
          </h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-6 max-w-lg leading-relaxed text-cream/70 md:text-lg">
            {leadership.body}
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-8">
            <Button href={leadership.ctaHref} variant="yellow">
              {leadership.cta}
            </Button>
          </motion.div>
        </div>

        {/* Monogram avatar preview */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {leadershipPage.execs.slice(0, 6).map((e) => (
            <motion.div
              key={e.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-cream/10 bg-cream/[0.03] p-5 text-center"
            >
              <span className="relative size-20 overflow-hidden rounded-full ring-2 ring-cream/10 transition-all duration-300 group-hover:ring-tex-yellow">
                <Image
                  src={e.image}
                  alt={e.name}
                  fill
                  sizes="80px"
                  className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
              </span>
              <div>
                <p className="font-texas text-sm font-bold text-cream">{e.name}</p>
                <p className="text-[11px] font-bold uppercase tracking-caps text-cream/60">{e.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
