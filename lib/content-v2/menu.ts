/**
 * MENU page copy.
 */

export type HeroSlide = {
  key: string;
  image: string;
  /** two-tone title: [lead word(s), accent word(s)] */
  title: [string, string];
  body: string;
  /** "light" = dark text over a bright photo, "dark" = white text over a dark photo */
  tone: "light" | "dark" | "warm";
  /** colour the left-hand legibility wash fades from (sampled from the photo) */
  wash: string;
};

export const menuV2 = {
  hero: {
    eyebrow: "The full line-up",
    slides: [
      {
        key: "bone-in",
        image: "/assets/v2/menu/banner-bone-in.png",
        title: ["Bone-in", "chicken"],
        body: "Marinated for hours, hand-battered to order and fried fresh in small batches. The crunch that started it all in 1952.",
        tone: "warm",
        wash: "#e9962a",
      },
      {
        key: "mexicana",
        image: "/assets/v2/menu/banner-mexicana.png",
        title: ["The", "Mexicana"],
        body: "A spicy hand-battered fillet, melted cheese and a tortilla-chip crunch, stacked high on a toasted sesame bun.",
        tone: "dark",
        wash: "#140f0d",
      },
      {
        key: "tenders",
        image: "/assets/v2/menu/banner-tenders.png",
        title: ["Crunchy", "tenders"],
        body: "Whole-muscle tenders in our signature crunchy coating, made for dipping, sharing and coming back for more.",
        tone: "light",
        wash: "#f3e7d6",
      },
    ] as HeroSlide[],
    cta: { label: "Find a restaurant", href: "/find-your-market" },
    secondary: { label: "Browse categories", href: "#pick-your-crunch" },
  },

  crunch: {
    eyebrow: "Explore by category",
    title: ["Pick your [crunch]."],
    body: "Seven ways in, one hand-battered standard. Slide through the line-up and pick your craving.",
    items: [
      { id: "star-box", title: ["Star Box", "Combos"], image: "/assets/v2/crunch/crunch-01.png" },
      { id: "chicken-combos", title: ["Chicken", "Combos"], image: "/assets/v2/crunch/crunch-02.png" },
      { id: "tex-deals", title: ["Tex", "Deals"], image: "/assets/v2/crunch/crunch-03.png" },
      { id: "burger-wraps", title: ["Burgers & Wraps", "Combos"], image: "/assets/v2/crunch/crunch-04.png" },
      { id: "family-friends", title: ["Family & Friends", "Combos"], image: "/assets/v2/crunch/crunch-05.png" },
      { id: "desserts", title: ["Sweet", "Desserts"], image: "/assets/v2/crunch/crunch-06.png" },
      { id: "snacks-sides", title: ["Snacks &", "Sides"], image: "/assets/v2/crunch/crunch-07.png" },
    ],
  },

  explore: {
    /** words exactly as in the supplied artwork (images/Explore our menu-01.png) */
    eyebrow: "Pick your crunch",
    lines: ["Explore our Texas", "Chicken|Menu"],
    tagline: "Hand-battered, fried fresh, built bold — every category, one unmistakable crunch.",
    image: "/assets/v2/menu/explore-combo.png",
    body: "Whatever you picked above, it starts the same way: marinated, hand-battered and fried fresh in small batches, every single day. Each market sets its own full menu and prices, so your local Texas Chicken carries the complete line-up. Start with the signatures below.",
    ctaPrimary: { label: "Find your market to order", href: "/find-your-market" },
    ctaSecondary: { label: "See the signatures", href: "#signatures" },
  },

  signatures: {
    eyebrow: "Signatures",
    title: ["The ones people", "drive across [town] for."],
    note: "A taste of the line-up. Full menus, prices and availability live on your local market site.",
    items: [
      { title: "Bone-In Chicken", stamp: "Original & Spicy", desc: "Marinated, hand-battered, fried to a golden shatter.", image: "/assets/v2/signatures/sig-01.png" },
      { title: "Crunchy Tenders", stamp: "Crunchy Classic", desc: "Whole-muscle tenders in our signature crunchy coat.", image: "/assets/v2/signatures/sig-02.png" },
      { title: "The Mexicana", stamp: "Spicy Sandwich", desc: "Spicy fillet, cheese and a tortilla-chip crunch.", image: "/assets/v2/signatures/sig-03.png" },
      { title: "Honey-Butter Biscuits", stamp: "The Famous Side", desc: "Flaky, buttery and glazed with real honey.", image: "/assets/v2/signatures/sig-04.png" },
      { title: "The Full Tray", stamp: "Combo Hero", desc: "Chicken, fries, slaw, dip and an ice-cold drink.", image: "/assets/v2/signatures/sig-05.png" },
      { title: "Classic Sandwich", stamp: "Fan Favourite", desc: "Hand-breaded fillet, crisp lettuce, creamy mayo.", image: "/assets/v2/signatures/sig-06.png" },
    ],
  },
};
