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
      "One hand-battered recipe opened for business in San Antonio in 1952. Seven decades later it leads the bold-chicken category across 25+ markets — still marinated, hand-battered and fried fresh, exactly the way it started.",
    ctaPrimary: { label: "Taste the legacy", href: "/menu" },
    ctaSecondary: { label: "Meet the team", href: "#leadership" },
  },

  /** Moving strip. Placeholder brand lines from packaging — confirm against the brand video. */
  strip: ["Blazing new trails in flavor", "Bold Texas flavor", "Hand-battered", "Honest · Welcoming · Comfortable", "Since 1952"],

  heritage: {
    eyebrow: "Heritage & founding",
    title: ["One stand.", "One recipe.", "[One standard.]"],
    body: [
      "In 1952, George W. Church opened a walk-up chicken stand across the street from the Alamo in San Antonio, Texas. No seating, no shortcuts — just chicken marinated, hand-battered to order and fried until the coating shattered.",
      "That obsession with craft is the one thing we have never changed. Today the same recipe leads the category in 25+ markets, from the Americas to the Gulf and Southeast Asia — still made by hand, still fried fresh, one restaurant at a time.",
    ],
    facts: [
      { k: "1952", v: "San Antonio, TX" },
      { k: "25+", v: "Markets worldwide" },
      { k: "100%", v: "Hand-battered" },
    ],
    photo: "/assets/story/george-sr.webp",
    photoAlt: "George W. Church, founder of Texas Chicken",
    photoCaption: "San Antonio, TX · 1952",
    stamp: "/assets/v2/stamp-jal-icon.svg",
  },

};
