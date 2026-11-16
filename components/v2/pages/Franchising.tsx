"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import { PRELOADER_DONE } from "@/components/ui/Preloader";
import { Eyebrow, Lead, Section, Title } from "@/components/v2/kit";
import { ClosingCta, HeroV2 } from "./shared";
import BurgerScrub, { BURGER } from "./BurgerScrub";
import { franchiseV2 } from "@/lib/content-v2/pages";
import { fadeUp, inView, staggerContainer } from "@/lib/motion";

/** The preloader curtain is still clearing the hero for this long after it starts to lift. */
const PRELOADER_LIFT_MS = 500;

/** true once the preloader has lifted (immediately on client-side navigation) */
function usePreloaderReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (document.documentElement.dataset.preloaded) {
      setReady(true);
      return;
    }
    let timer = 0;
    const onDone = () => {
      timer = window.setTimeout(() => setReady(true), PRELOADER_LIFT_MS);
    };
    window.addEventListener(PRELOADER_DONE, onDone, { once: true });
    return () => {
      window.removeEventListener(PRELOADER_DONE, onDone);
      window.clearTimeout(timer);
    };
  }, []);
  return ready;
}

function useWide() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return wide;
}

/** share of the pinned scroll that drives the explosion; the rest is a short hold */
const EXPLODE_END = 0.85;

/* ------------------------------------------------------------- hero + proof */
/**
 * Franchising hero: the Mexicana bursts apart layer by layer as you scroll
 * (BurgerScrub), and stacks back together as you scroll up.
 *  - desktop: the hero pins for one extra screen while the burger explodes
 *  - mobile/tablet: no pin; the burger explodes as it travels up the screen
 */
export function FranchiseHeroV2() {
  const h = franchiseV2.hero;
  const reduced = useReducedMotion();
  const ready = usePreloaderReady();
  const wide = useWide();
  const pinRef = useRef<HTMLDivElement>(null);
  const visRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: pinP } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const { scrollYProgress: visP } = useScroll({ target: visRef, offset: ["start 0.55", "end 0.3"] });
  const pinned = useTransform(pinP, (p) => Math.min(1, p / EXPLODE_END));
  const still = useMotionValue(0);
  const progress = reduced ? still : wide ? pinned : visP;

  return (
    <>
      <div ref={pinRef} className="relative lg:h-[200svh]">
        <div className="lg:sticky lg:top-0 lg:h-svh">
          <HeroV2
            eyebrow={h.eyebrow}
            title={h.title}
            body={h.body}
            className="pb-12 pt-32 lg:flex lg:h-full lg:items-center lg:pb-4 lg:pt-28"
            visual={
              <motion.div
                ref={visRef}
                initial={reduced ? false : { opacity: 0, y: 40, scale: 0.94 }}
                animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
                transition={{ type: "spring", stiffness: 110, damping: 18 }}
                className="mx-auto w-[min(88vw,520px)] lg:-my-6 lg:w-[min(120%,calc((100svh-104px)*var(--burger-ar)))] lg:max-w-none xl:-mr-8"
                style={{ ["--burger-ar" as string]: BURGER.width / BURGER.height }}
              >
                <BurgerScrub key={wide ? "pin" : "flow"} progress={progress} />
              </motion.div>
            }
          >
            <Button href={h.primary.href} variant="red" pulse>
              {h.primary.label}
            </Button>
          </HeroV2>
        </div>
      </div>
      {/* Proof stat tiles removed per client (data still in franchiseV2.proof). */}
    </>
  );
}

/* ------------------------------------------- credentials (was yellow marquee) */
export function FranchiseCredentialsV2() {
  const c = franchiseV2.credentials;
  return (
    <Section className="!pb-8 md:!pb-10">
      <div className="container-tx">
        {/* Row 1 — headline + intro beside the awards panel (balanced heights) */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <Title lines={c.title} size="md" />
            <Lead>{c.body}</Lead>
          </div>

          {/* awards: logos only, no cards or captions */}
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid grid-cols-3 items-center gap-6 md:gap-10"
          >
            {c.items.map((b) => (
              <motion.div key={b.title} variants={fadeUp} whileHover={{ y: -6 }} className="relative h-24 w-full md:h-32">
                <Image src={b.badge} alt={`${b.title}: ${b.note}`} fill sizes="240px" className="object-contain" />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Row 2 — the three reasons, full width, divided columns */}
        <motion.ul
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={inView}
          className="mt-12 grid gap-8 border-t border-third/10 pt-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-third/10"
        >
          {c.reasons.map((r, i) => (
            <motion.li key={r.k} variants={fadeUp} className="flex gap-4 md:px-8 md:first:pl-0 md:last:pr-0">
              <span className="display grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-lg text-third">
                {i + 1}
              </span>
              <div>
                <p className="display text-2xl uppercase leading-none">{r.k}</p>
                <p className="mt-2 leading-relaxed text-third/70">{r.v}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Section>
  );
}

/* ----------------------------------------------------- steps + application */
export function FranchiseApplyV2() {
  const a = franchiseV2.apply;
  return (
    <section id="apply" className="relative overflow-x-clip bg-white pb-10 pt-10 md:pb-14 md:pt-12">
      <div className="container-tx">
        {/* application — pitch + form on the white canvas */}
        <div className="relative text-third">
          {/* The embedded form is tall, so the pitch column stays pinned beside it
              (sticky) instead of leaving an empty column; the form gets the wider track. */}
          <div className="relative grid items-start gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            {/* pitch */}
            <div className="flex flex-col lg:sticky lg:top-44">
              <Eyebrow>{a.formEyebrow}</Eyebrow>
              <Title lines={a.formTitle} size="md" />
              <p className="mt-5 max-w-sm text-lg leading-relaxed text-third/75">{a.formBody}</p>

              <p className="mt-8 text-xs font-extrabold uppercase tracking-caps text-third/50">What happens next</p>
              <motion.ul
                variants={staggerContainer(0.1)}
                initial="hidden"
                whileInView="show"
                viewport={inView}
                className="mt-3 space-y-3"
              >
                {a.next.map((n, i) => (
                  <motion.li key={n} variants={fadeUp} className="flex items-start gap-3">
                    <span className="display grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-sm text-third">
                      {i + 1}
                    </span>
                    <span className="pt-1 font-semibold leading-snug text-third/85">{n}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>

            {/* form — the official FranConnect franchise enquiry form, embedded.
                id="apply-form" is the target of the "Start your application" buttons. */}
            <motion.div
              id="apply-form"
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: "some" }}
              className="relative overflow-hidden rounded-[2rem] bg-white p-2 shadow-soft3 ring-1 ring-third/10 sm:p-4"
            >
              <iframe
                src="https://churchschicken.franconnect.net/fc/extforms/franchiseewebsite?refLoc=ifrm"
                title="Franchisee Website Form"
                width="100%"
                loading="lazy"
                // The form is cross-origin, so it can't report its height. Heights are the form's
                // measured full height at each breakpoint's narrowest iframe width (+16px), so it
                // never scrolls inside the frame. Its page background is #f0f0f0; brightness
                // ×1.0625 (255/240) turns exactly that grey to white so any space left under the
                // form blends into the card (the form itself is already white).
                className="block h-[1960px] w-full rounded-[1.5rem] border-0 [filter:brightness(1.0625)] min-[360px]:h-[1596px] min-[400px]:h-[1426px] min-[480px]:h-[1226px] sm:h-[1056px] md:h-[944px] lg:h-[1056px] xl:h-[934px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- closing */
export function FranchiseClosingV2() {
  return (
    <ClosingCta
      eyebrow="Your market is next"
      title={["Bring the crunch", "to [your market]."]}
      body="Tell us where you see Texas Chicken next. Our development team will map the opportunity with you."
      image="/assets/v2/crunch/crunch-03.png"
    >
      <Button href="#apply-form" variant="red">
        Apply now
      </Button>
      <Button href="#opportunities" variant="ghost">
        Explore open territories
      </Button>
    </ClosingCta>
  );
}
