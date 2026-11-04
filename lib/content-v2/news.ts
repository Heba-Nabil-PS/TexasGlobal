/**
 * NEWS page copy.
 * Releases themselves still come from lib/content.ts → newsPage.articles.
 */
export const newsV2 = {
  hero: {
    eyebrow: "Stories & press",
    pre: "What's new with",
    title: "Texas Chicken™",
    subtitle:
      "From one stand across from the Alamo to 25+ markets on four continents. Here's where the crunch is heading next: new markets, new partners and the people behind them.",
  },
  spotlight: {
    eyebrow: "Spotlight",
    heading: ["Fresh off the", "[fryer] & the press."],
    /** featured heritage story + the latest releases, shown in the carousel */
    count: 4,
  },
  archive: {
    eyebrow: "All stories",
    heading: ["Every milestone,", "[one crunch] at a time."],
    perPage: 6,
    readMore: "Read more",
    empty: "No stories in this category yet. Check back soon.",
  },
  newsletter: {
    eyebrow: "Be first to the crunch",
    heading: ["New drops.", "New markets.", "[Straight to you.]"],
    body: "Limited-time flavors, restaurant openings and global milestones, delivered before anyone else hears about them. No spam, just crunch.",
    placeholder: "Your email address",
    cta: "Count me in",
    thanks: "You're on the list. Fresh news is on its way.",
    note: "Media enquiries?",
    noteLink: { label: "Talk to our press team", href: "/contact-us" },
    perks: ["New menu drops", "Market openings", "Brand milestones"],
  },
};
