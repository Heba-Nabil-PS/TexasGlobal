/**
 * Our Story — V2 copy (client feedback round 2).
 * Tone: legacy + global leadership. Market count rounded to "25+" site-wide.
 */
export const storyV2 = {
  hero: {
    eyebrow: "Since 1952 · 25+ markets · 4 continents",
    /** [bracketed] words render in brand red (kit Title) */
    title: ["Born in Texas.", "Leading the [world]", "in crunch."],
    subtitle:
      "One hand-battered recipe opened for business in San Antonio in 1952, marking the beginning of Church's Chicken history. Seven decades later, Church's Texas Chicken serves its signature crispy fried chicken across 25+ markets, still marinated, hand-battered and cooked fresh, exactly the way it started: the taste of Texas, done right.",
    ctaPrimary: { label: "Taste the legacy", href: "/menu" },
    ctaSecondary: { label: "Franchise with us", href: "/franchising#apply-form" },
  },

  /** Moving strip. Placeholder brand lines from packaging — confirm against the brand video. */
  strip: ["The taste of Texas, done right", "Crispy fried chicken", "Cooked fresh", "Honest · Welcoming · Comfortable", "Since 1952"],

  heritage: {
    eyebrow: "Heritage & founding",
    title: ["One stand.", "One recipe.", "[One standard.]"],
    body: [
      "In 1952, George W. Church, the founder of Church's Chicken, opened a walk-up chicken stand across the street from the Alamo in San Antonio, Texas. This marked the beginning of Church's Chicken history, with no seating, no shortcuts, just chicken marinated, hand-battered to order and fried until the coating shattered.",
      "That obsession with craft is the one thing we have never changed. Today, the Church's Texas Chicken story continues across 25+ markets, carrying the original recipe and Texas heritage from the Americas to the Gulf and Southeast Asia, still made by hand, still cooked fresh, one restaurant at a time.",
    ],
    facts: [
      { k: "1952", v: "San Antonio, TX" },
      { k: "25+", v: "Markets worldwide" },
      { k: "100%", v: "Hand-battered" },
    ],
    photo: "/assets/story/george-sr-v2.webp",
    photoAlt: "George W. Church, founder of Texas Chicken",
    photoCaption: "San Antonio, TX · 1952",
    stamp: "/assets/v2/stamp-jal-icon.svg",
  },

};
