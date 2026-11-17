"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PageHeroV2 from "@/components/v2/pages/PageHeroV2";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Parallax from "@/components/ui/Parallax";
import CTABand from "@/components/sections/CTABand";
import { communityPage } from "@/lib/content";
import { staggerContainer, fadeUp, inView, clipReveal } from "@/lib/motion";

export default function CommunityPage() {
  return (
    <>
      <PageHeroV2
        eyebrow={communityPage.hero.eyebrow}
        title={communityPage.hero.title}
        subtitle={communityPage.hero.subtitle}
        image="/assets/v2/signatures/sig-04.png"
        imageAlt="Honey-butter biscuits"
        stamp="Good neighbours"
      >
        <Button href="/our-story" variant="red">
          Our story
        </Button>
        <Button href="/contact-us" variant="ghost">
          Partner with us
        </Button>
      </PageHeroV2>

      {/* Pillars */}
      <section className="bg-cream py-10 md:py-14">
        <div className="container-tx">
          <SectionHeading
            eyebrow="Our commitments"
            heading="Four ways we give back."
            body="Every restaurant is a local business, run by local people, for a local community."
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 md:mt-14 lg:grid-cols-4"
          >
            {communityPage.pillars.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                className="group flex flex-col rounded-3xl bg-ink p-5 text-cream transition-transform duration-300 hover:-translate-y-1.5 sm:p-8"
              >
                <span className="display text-4xl text-tex-yellow sm:text-5xl">{p.stat}</span>
                <span className="mt-1 text-xs font-bold uppercase tracking-caps text-cream/50">
                  {p.statLabel}
                </span>
                <h3 className="display mt-4 text-lg uppercase leading-tight text-cream sm:mt-6 sm:text-xl">{p.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-snug text-cream/70 sm:text-sm sm:leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Initiatives — alternating rows */}
      <section className="bg-cream-200 py-10 md:py-14">
        <div className="container-tx">
          <SectionHeading
            eyebrow="On the ground"
            heading="Programs, not press releases."
          />
          <div className="mt-8 space-y-12 md:mt-16 md:space-y-28">
            {communityPage.initiatives.map((it, i) => (
              <div
                key={it.title}
                className="grid items-center gap-5 md:grid-cols-2 md:gap-16"
              >
                <Parallax
                  speed={30}
                  className={i % 2 === 1 ? "md:order-2" : ""}
                >
                  {/* Observe the wrapper, animate the child: see clipReveal note in lib/motion. */}
                  <motion.div initial="hidden" whileInView="show" viewport={inView}>
                  <motion.div
                    variants={clipReveal}
                    className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink shadow-pop"
                  >
                    <Image
                      src={it.image}
                      alt={it.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 45vw"
                      className="object-cover"
                    />
                  </motion.div>
                  </motion.div>
                </Parallax>

                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={inView}
                  className={i % 2 === 1 ? "md:order-1" : ""}
                >
                  <span className="display text-5xl text-tex-red/20 md:text-6xl">0{i + 1}</span>
                  <h3 className="display mt-2 text-3xl uppercase text-ink md:text-4xl">{it.title}</h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-600">{it.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-tex-red py-10 text-cream md:py-14">
        <div className="container-tx text-center">
          <span className="display mx-auto block max-w-[18ch] text-3xl uppercase leading-tight md:text-5xl">
            &ldquo;Feed people well and treat your neighbours right. Everything else follows.&rdquo;
          </span>
          <span className="mt-6 block eyebrow justify-center text-tex-yellow">
            The Texas Chicken way
          </span>
        </div>
      </section>

      <CTABand
        eyebrow="Want to help?"
        heading="Good crunch."
        accent="Greater good."
        body="Careers, partnerships or community programs: let's do something good together."
        primary={{ label: "Get in touch", href: "/contact-us" }}
        secondary={{ label: "Explore careers", href: "/careers" }}
        tone="ink"
      />
    </>
  );
}
