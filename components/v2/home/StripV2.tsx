"use client";

import Marquee from "@/components/ui/Marquee";
import { stripV2 } from "@/lib/content-v2/home";
import { ShootingStar } from "@/components/v2/kit";

/**
 * Slim single-line brand strip — replaces the two oversized red rows.
 * Yellow so it hands over to the white story section without stacking reds.
 */
export default function StripV2() {
  return (
    <section className="relative overflow-hidden bg-secondary py-3.5 text-third md:py-4">
      <Marquee duration={36}>
        {stripV2.words.map((w) => (
          <span key={w} className="flex items-center">
            <span className="display whitespace-nowrap px-5 text-xl uppercase leading-none md:text-2xl">{w}</span>
            <ShootingStar className="size-5 text-primary" />
          </span>
        ))}
      </Marquee>
    </section>
  );
}
