"use client";

import BrandStar from "@/components/ui/BrandStar";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";
import { ShootingStar } from "@/components/v2/kit";
import { partners } from "@/lib/content";
import { partnersV2 } from "@/lib/content-v2/home";

/**
 * "Backed by the industry" — explanatory intro, full-colour badges and a
 * regional strip (no country list to update every time a market opens).
 */
export default function PartnersV2() {
  return (
    <section id="partners" className="bg-white pt-14 md:pt-20">
      <div className="container-tx text-center">
        <Reveal>
          <span className="eyebrow text-tex-red">
            <ShootingStar /> {partnersV2.eyebrow}
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display mx-auto mt-4 max-w-2xl text-[8vw] leading-[0.92] text-ink md:text-[3.4vw]">{partnersV2.heading}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-third/70">{partnersV2.intro}</p>
        </Reveal>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {partners.badges.map((b, i) => (
            <Reveal key={b} delay={i * 0.08}>
              <div data-cursor="hover" className="relative h-20 w-28 transition-all duration-300 hover:-translate-y-1 hover:scale-105 md:h-24 md:w-36">
                <Image src={b} alt="Industry award" fill className="object-contain" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-16 bg-third py-6">
        <Marquee duration={24}>
          {partnersV2.regions.map((m) => (
            <span key={m} className="flex items-center" data-cursor="hover">
              <span className="display text-3xl uppercase text-white transition-colors duration-300 hover:text-secondary md:text-5xl">{m}</span>
              <span className="mx-7 text-3xl text-tex-yellow md:mx-9 md:text-5xl"><BrandStar /></span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
