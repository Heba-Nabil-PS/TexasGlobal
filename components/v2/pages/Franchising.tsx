"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { PRELOADER_DONE } from "@/components/ui/Preloader";
import { Eyebrow, Lead, Section, Title } from "@/components/v2/kit";
import { ClosingCta, HeroV2 } from "./shared";
import { franchiseV2 } from "@/lib/content-v2/pages";
import { fadeUp, inView, staggerContainer } from "@/lib/motion";

/** The preloader curtain is still clearing the hero for this long after it starts to lift. */
const PRELOADER_LIFT_MS = 500;

/* Cut-out plates, placed as % of the final 1667×874 composition. Back to front. */
const PLATES = [
  {
    src: "/assets/v2/franchising/tender.png",
    box: { left: "0%", top: "-5.15%", width: "56.02%" },
    from: { x: "-55%", rotate: -7 },
    delay: 0.25,
  },
  {
    src: "/assets/v2/franchising/biscuits.png",
    box: { left: "59.03%", top: "12.7%", width: "39.1%" },
    from: { x: "55%", rotate: 7 },
    delay: 0.45,
  },
  {
    src: "/assets/v2/franchising/bic.png",
    box: { left: "21.54%", top: "8.81%", width: "57.08%" },
    from: { y: "-55%", scale: 1.12 },
    delay: 0.75,
  },
];

/** The side plates slide in, then the bone-in plate drops onto them to complete the spread. */
function PlatesBuild() {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  // On a full page load, hold the build until the preloader lifts so it isn't played behind it.
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

  return (
    <div
      role="img"
      aria-label="Plates of Texas Chicken tenders, bone-in fried chicken and honey-butter biscuits"
      className="relative mx-auto aspect-[1667/874] w-full"
    >
      {PLATES.map((p) => (
        <motion.div
          key={p.src}
          initial={reduced ? false : { opacity: 0, ...p.from }}
          animate={ready ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 } : undefined}
          transition={{
            opacity: { duration: 0.35, delay: p.delay },
            default: { type: "spring", stiffness: 120, damping: 15, delay: p.delay },
          }}
          className="absolute aspect-[881/780]"
          style={p.box}
        >
          <Image src={p.src} alt="" fill priority sizes="(max-width:1024px) 55vw, 28vw" className="object-contain" />
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- hero + proof */
export function FranchiseHeroV2() {
  const h = franchiseV2.hero;
  return (
    <>
      <HeroV2
        eyebrow={h.eyebrow}
        title={h.title}
        body={h.body}
        decor={
          <div aria-hidden className="pointer-events-none absolute -right-[18vw] top-24 size-[62vw] max-w-[1000px] rounded-full bg-secondary/15" />
        }
        visual={<PlatesBuild />}
      >
        <Button href={h.primary.href} variant="red" pulse>
          {h.primary.label}
        </Button>
      </HeroV2>
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

          {/* awards: equal-height cards */}
          <motion.div
            variants={staggerContainer(0.12)}
            initial="hidden"
            whileInView="show"
            viewport={inView}
            className="grid gap-4 sm:grid-cols-3"
          >
            {c.items.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="flex h-full flex-col items-center rounded-[1.75rem] bg-white px-5 py-6 text-center shadow-soft3 ring-1 ring-third/5"
              >
                <div className="relative h-20 w-full md:h-24">
                  <Image src={b.badge} alt={b.title} fill sizes="200px" className="object-contain" />
                </div>
                <p className="display mt-5 text-xl uppercase leading-tight text-primary md:text-2xl">{b.title}</p>
                <p className="mt-1.5 text-sm leading-snug text-third/60">{b.note}</p>
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
