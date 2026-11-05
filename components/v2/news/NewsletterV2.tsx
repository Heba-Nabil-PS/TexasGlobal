"use client";

import BrandArrow from "@/components/ui/BrandArrow";
import BrandStar from "@/components/ui/BrandStar";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { newsV2 } from "@/lib/content-v2/news";
import { ease } from "@/lib/motion";
import { Eyebrow, OutlineStar, ShootingStar, Title } from "@/components/v2/kit";

/**
 * Newsletter sign-up: replaces the plain dark CTA band ("Contact the newsroom").
 * Brand-yellow block with the rooster "Bold Texas Flavor" stamp, a cut-out of
 * the signature chicken on an outline star and a real email field.
 */
export default function NewsletterV2() {
  const n = newsV2.newsletter;
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: hook up to the mailing-list provider once chosen.
    setSent(true);
  };

  return (
    <section className="relative overflow-hidden bg-white px-4 py-16 md:py-24">
      <div className="relative mx-auto max-w-[1300px] overflow-hidden rounded-[2.5rem] bg-secondary text-third">
        {/* Rooster stamp, oversized + slowly turning, as a watermark */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute -left-24 -top-24 size-[22rem] opacity-[0.18] mix-blend-multiply"
        >
          <Image src="/assets/v2/stamp-bold-texas-flavor.png" alt="" fill className="object-contain brightness-0" />
        </motion.div>
        <OutlineStar color="#2d2926" className="absolute right-[38%] top-6 size-16 opacity-40" />
        <OutlineStar color="#9a3324" className="absolute bottom-8 left-[45%] size-10 opacity-60" />

        <div className="relative grid items-center gap-6 px-7 py-14 md:px-14 md:py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow>{n.eyebrow}</Eyebrow>
            <Title lines={n.heading} size="md" />
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-third/80">{n.body}</p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {n.perks.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm font-bold uppercase tracking-caps">
                  <ShootingStar className="size-4 text-primary" /> {p}
                </li>
              ))}
            </ul>

            {sent ? (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-third px-6 py-4 font-texas text-lg font-bold uppercase text-white"
                role="status"
              >
                <span className="text-secondary"><BrandStar /></span> {n.thanks}
              </motion.p>
            ) : (
              <form onSubmit={submit} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <label htmlFor="news-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="news-email"
                  type="email"
                  required
                  placeholder={n.placeholder}
                  className="h-14 flex-1 rounded-full border-2 border-third bg-white px-6 text-base text-third outline-none placeholder:text-third/40 focus:border-primary"
                />
                <button
                  type="submit"
                  data-cursor="link"
                  className="h-14 rounded-full bg-primary px-8 text-sm font-extrabold uppercase tracking-caps text-white transition-colors hover:bg-third"
                >
                  {n.cta} <BrandArrow />
                </button>
              </form>
            )}

            <p className="mt-5 text-sm text-third/70">
              {n.note}{" "}
              <Link href={n.noteLink.href} className="font-bold text-primary underline-offset-4 hover:underline">
                {n.noteLink.label}
              </Link>
            </p>
          </div>

          {/* Product hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: ease.pop }}
            className="relative mx-auto w-full max-w-[460px]"
          >
            <Image
              src="/assets/v2/signatures/sig-01.png"
              alt="Texas Chicken bone-in chicken"
              width={915}
              height={874}
              className="relative h-auto w-full drop-shadow-[0_30px_40px_rgba(45,41,38,0.25)]"
            />
            <div className="absolute -bottom-2 right-2 flex size-28 items-center justify-center rounded-full bg-primary p-3 shadow-lg md:size-32">
              <Image src="/assets/v2/stamp-bold-texas-flavor.png" alt="Bold Texas Flavor" width={1076} height={1071} className="h-auto w-full" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
