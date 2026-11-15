"use client";

import PageHeroV2 from "@/components/v2/pages/PageHeroV2";
import { newsV2 } from "@/lib/content-v2/news";

/**
 * News hero — the same white inner-page hero as Community, Leadership, etc.
 * (eyebrow, dark title with the last line in brand red, lead, dish on a yellow
 * disc with a stamp), with its own dish and stamp.
 */
export default function NewsHeroV2() {
  const h = newsV2.hero;
  return (
    <PageHeroV2
      eyebrow={h.eyebrow}
      title={[h.pre, h.title]}
      subtitle={h.subtitle}
      image="/assets/v2/signatures/sig-03.png"
      imageAlt="Texas Chicken crispy chicken sandwich"
      stamp="Fresh off the press"
    />
  );
}
