"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import InteractiveTimeline from "@/components/ui/InteractiveTimeline";
import { storyPage } from "@/lib/content";
import { fadeUp, inView } from "@/lib/motion";

/** Story timeline — kept as the original design (redesign not approved). */
export default function Timeline() {
  return (
    <section className="relative overflow-hidden bg-cream-200 py-24 md:py-32">
      <div className="container-tx">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <SectionHeading align="center" eyebrow="The timeline" heading="From one stand to the world." className="mx-auto" />
          </div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={inView} className="mt-12">
            <InteractiveTimeline items={storyPage.timeline} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
