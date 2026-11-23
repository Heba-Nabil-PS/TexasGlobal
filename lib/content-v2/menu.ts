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
  /** 0–1, how strong that wash is (default 1); lower keeps artwork on the left visible */
  washStrength?: number;
  /** force the body paragraph to white regardless of tone */
  bodyWhite?: boolean;
};

export const menuV2 = {
  hero: {
    eyebrow: "The full line-up",
    // photos: img3/BIC.png, side.png, mexicana.png, tenders.png (2560px WebP)
    slides: [
      {
        key: "bone-in",
        image: "/assets/v2/menu/hero-bic-v3.webp",
        title: ["Bone-in", "chicken"],
        body: "Crispy fried chicken, marinated for hours, hand-battered to order and cooked fresh in small batches. The bone-in chicken crunch that started it all in 1952.",
        tone: "dark",
        wash: "#16110e",
      },
      {
        key: "sides",
        image: "/assets/v2/menu/hero-sides-v3.webp",
        title: ["Bold", "sides"],
        body: "Honey butter biscuits, jalapeño poppers, coleslaw and mashed potatoes with gravy: the sides that make every meal, with the Church's Chicken biscuits everyone loves.",
        tone: "light",
        // the new tray photo fills the left side, so a full wash keeps the copy legible
        wash: "#dc991d",
        washStrength: 1,
        bodyWhite: true,
      },
      {
        key: "mexicana",
        image: "/assets/v2/menu/hero-mexicana-v3.webp",
        title: ["The", "Mexicana"],
        body: "Our spicy chicken sandwich icon: a hand-battered fillet, melted cheese and a tortilla-chip crunch, stacked high on a toasted sesame bun. A signature choice on the Church's Chicken menu.",
        tone: "dark",
        wash: "#0b0402",
      },
      {
        key: "tenders",
        image: "/assets/v2/menu/hero-tenders-v3.webp",
        title: ["Crunchy", "tenders"],
        body: "Whole-muscle chicken tenders in our signature crispy fried chicken coating, made for dipping, sharing and coming back for more. Discover Church's Chicken crispy tenders.",
        tone: "light",
        wash: "#d6bea6",
      },
    ] as HeroSlide[],
    cta: { label: "Find a restaurant", href: "/find-your-market" },
    secondary: { label: "Browse categories", href: "#pick-your-crunch" },
  },

  crunch: {
    eyebrow: "Explore by category",
    title: ["Pick your [crunch]."],
    body: "Four ways in, one hand-battered standard, from crispy fried chicken to spicy sandwiches, wraps and sides. Slide through the line-up and pick your craving.",
    items: [
      { id: "chicken-tender", title: ["Chicken &", "Tender Combos"], blurb: "Bone-in pieces and hand-battered tenders, with sides and a drink.", image: "/assets/v2/crunch/chicken-tender-combos.webp" },
      { id: "burger-wrap", title: ["Burger &", "Wrap Combos"], blurb: "Crispy chicken sandwiches and wraps, built bold and stacked high.", image: "/assets/v2/crunch/burger-wrap-combos.webp" },
      { id: "sides", title: ["Sides"], blurb: "Fries, coleslaw, honey-butter biscuits and the rest of the crew.", image: "/assets/v2/crunch/sides.webp" },
      { id: "desserts", title: ["Desserts"], blurb: "Something sweet to finish the crunch.", image: "/assets/v2/crunch/desserts.webp" },
    ],
  },

  explore: {
    /** words exactly as in the supplied artwork (images/Explore our menu-01.png) */
    eyebrow: "Pick your crunch",
    lines: ["Explore Church's Texas", "Chicken|Menu"],
    /** "|" splits the desktop tagline into two lines */
    tagline: "Crispy fried chicken, spicy chicken sandwiches, fried chicken tenders, chicken wraps and honey butter biscuits.|Explore the flavours on the Church's Chicken menu, cooked fresh in every category, with one unmistakable crunch.",
    image: "/assets/v2/menu/explore-combo.png",
    /** the combo assembling itself; transparent WebM keyed from img/Create a premium… u82.mp4 */
    video: "/assets/v2/menu/explore-combo.webm",
    body: "Whatever you picked above, it starts the same way: marinated, hand-battered and cooked fresh in small batches, every single day. That's the taste of Texas, done right. Each market sets its own full menu and prices, so your local Texas Chicken carries the complete line-up. Start with the signatures below.",
    ctaPrimary: { label: "Find your market to order", href: "/find-your-market" },
    ctaSecondary: { label: "See the signatures", href: "#signatures" },
  },

  signatures: {
    eyebrow: "Signatures",
    title: ["The ones people", "drive across [town] for."],
    note: "A taste of the line-up. Full menus, prices and availability live on your local market site.",
    items: [
      { title: "Bone-In Chicken", stamp: "Original & Spicy", desc: "Crispy fried chicken: marinated, hand-battered, cooked fresh.", image: "/assets/v2/signatures/trimmed/sig-01.png" },
      { title: "Crunchy Tenders", stamp: "Crunchy Classic", desc: "Whole-muscle tenders in our signature crunchy coat.", image: "/assets/v2/signatures/trimmed/sig-02.png" },
      { title: "The Mexicana", stamp: "Spicy Sandwich", desc: "A spicy sandwich: hot fillet, cheese and a tortilla-chip crunch.", image: "/assets/v2/signatures/trimmed/sig-03.png" },
      { title: "Honey-Butter Biscuits", stamp: "The Famous Side", desc: "Flaky honey-butter biscuits, baked fresh and glazed with real honey.", image: "/assets/v2/signatures/trimmed/sig-04.png" },
      { title: "The Full Tray", stamp: "Combo Hero", desc: "Chicken, fries, slaw, dip and an ice-cold drink.", image: "/assets/v2/signatures/trimmed/sig-05.png" },
      { title: "Classic Sandwich", stamp: "Fan Favourite", desc: "Hand-breaded fillet, crisp lettuce, creamy mayo.", image: "/assets/v2/signatures/trimmed/sig-06.png" },
    ],
  },
};
