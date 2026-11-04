"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/motion";

/** Plain page title (no banner) — for utility pages: Privacy, Terms, Sitemap. */
export default function PageTitle({ title }: { title: string }) {
  return (
    <section className="bg-white pb-4 pt-36 text-third md:pt-44">
      <div className="container-tx">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: ease.out }}
          className="display text-5xl leading-[0.9] md:text-7xl"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}
