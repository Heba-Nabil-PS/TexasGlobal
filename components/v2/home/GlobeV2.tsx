"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { Eyebrow, Title } from "@/components/v2/kit";
import { globeV2 } from "@/lib/content-v2/home";
import type { GlobeFocus } from "./EarthGlobe";

// WebGL globe is client-only and loads its map data on demand.
const EarthGlobe = dynamic(() => import("./EarthGlobe"), {
  ssr: false,
  loading: () => <div className="absolute inset-[4%] rounded-full bg-[#ececee]" />,
});

/**
 * Global footprint — a real, interactive 3D globe (Three.js). The region menu
 * turns the same globe to each continent; visitors can also drag it and click
 * any country. Our markets are orange.
 */
export default function GlobeV2() {
  const [active, setActive] = useState<string | null>(null);
  const [focus, setFocus] = useState<GlobeFocus | null>(null);

  const go = (r: (typeof globeV2.regions)[number]) => {
    setActive(r.key);
    setFocus((f) => ({ lat: r.lat, lon: r.lon, n: (f?.n ?? 0) + 1 }));
  };

  return (
    <section className="relative overflow-hidden bg-white pb-4 pt-10 md:pb-6 md:pt-12">
      <div className="container-tx text-center">
        <Eyebrow center>{globeV2.eyebrow}</Eyebrow>
        <Title lines={globeV2.titleLines} size="lg" className="mx-auto max-w-4xl" />
      </div>

      <div className="container-tx mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-[1fr_auto_1fr]">
        {/* Region menu */}
        <nav aria-label="Explore by region" className="order-2 lg:order-1">
          <ul className="flex flex-wrap justify-center gap-2 lg:flex-col lg:gap-3">
            {globeV2.regions.map((r) => {
              const on = r.key === active;
              return (
                <li key={r.key}>
                  <button
                    type="button"
                    onClick={() => go(r)}
                    aria-pressed={on}
                    data-cursor="link"
                    className={`w-full rounded-2xl border-2 px-4 py-2.5 text-left transition-all lg:px-5 lg:py-3.5 ${
                      on ? "border-secondary bg-secondary/15 shadow-soft3" : "border-third/10 hover:border-third/30"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`size-2.5 rounded-full transition-colors ${on ? "bg-primary" : "bg-third/20"}`} />
                      <span className="display text-xl text-third lg:text-2xl">{r.label}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* The globe */}
        <div className="relative order-1 mx-auto aspect-square w-[min(88vw,540px)] lg:order-2">
          <div aria-hidden className="absolute inset-x-[18%] -bottom-2 h-8 rounded-[50%] bg-third/15 blur-xl" />
          <EarthGlobe focus={focus} onAutoplay={() => setActive(null)} className="absolute inset-0" />
        </div>

        {/* Big number */}
        <div className="order-3 text-center lg:text-left">
          <div className="display text-7xl leading-none text-secondary md:text-8xl">{globeV2.stat}</div>
          <p className="mx-auto mt-4 max-w-sm text-lg leading-relaxed text-third/75 lg:mx-0 md:text-xl">{globeV2.body}</p>
        </div>

        <div className="order-4 flex flex-wrap items-center justify-center gap-3 lg:col-span-3">
          <Button href={globeV2.ctaSecondary.href} variant="red" pulse>
            {globeV2.ctaSecondary.label}
          </Button>
          <Button href={globeV2.ctaPrimary.href} variant="ghost">
            {globeV2.ctaPrimary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
