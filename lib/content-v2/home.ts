/** Homepage copy. */

export const MARKETS_LABEL = "25+";

/** One line, brand keywords (packaging + brand line), no menu items. */
export const stripV2 = {
  words: ["Crispy fried chicken", "Cooked fresh", "Spicy sandwiches", "Honey-butter biscuits", "The taste of Texas, done right", "Since 1952"],
};

export const aboutV2 = {
  eyebrow: "Our story",
  titleLines: ["From one Texas stand", "to [25+ markets] worldwide."],
  body: "In 1952 one San Antonio stand served crispy fried chicken, hand-battered and cooked fresh to order. Seven decades on, Church's Texas Chicken brings that same taste of Texas, done right, to 25+ markets across the Americas, the Middle East, Africa and Asia, still made by hand, in small batches, in every restaurant.",
  stats: [
    { value: 1952, suffix: "", label: "Born in Texas" },
    { value: 25, suffix: "+", label: "Markets" },
    { value: 70, suffix: "+", label: "Years of legacy" },
    { value: 100, suffix: "%", label: "Hand-battered" },
  ],
};

export const ceoV2 = {
  titleLines: ["Message", "from [our CEO]"],
  body: [
    "Our standards are what make the difference.",
    "Every piece of our crispy fried chicken is cooked fresh in small batches to deliver the texture and crunch people know us for. It is never rushed, and it is never treated as routine.",
    "From the first bite to the last, the experience is built on care, attention, and doing things properly. That is the taste of Texas, done right, and why people keep coming back.",
  ],
  name: "Roland Gonzalez",
  role: "Chief Executive Officer",
  image: "/assets/v2/ceo-portrait.jpg",
};

export const whatsNewV2 = {
  eyebrow: "Our core menu",
  title: "Crunch classics.",
  items: [
    { title: "Golden Dragon", image: "/assets/v2/whats-new/golden-dragon-sq.webp", w: 500, h: 500 },
    { title: "Mexicana Loaded Fries", image: "/assets/v2/whats-new/mexicana-loaded-fries-sq.webp", w: 500, h: 500 },
    { title: "The Super Hero", image: "/assets/v2/whats-new/super-hero-sq.webp", w: 500, h: 500 },
  ],
  // closing tile: styled like the LTO photos (maroon wall, orange floor)
  fullMenu: {
    kicker: "Hungry for more?",
    lines: ["The full", "menu"],
    cta: "See the full menu",
    image: "/assets/v2/whats-new/full-menu-combo.webp",
  },
  note: "Availability varies by market.",
};

export const globeV2 = {
  eyebrow: "Our global footprint",
  titleLines: ["One recipe, served", "[across the world.]"],
  frames: [
    { src: "/assets/v2/globe/americas.png", region: "The Americas", markets: "USA · Canada · Mexico · Caribbean · Central America" },
    { src: "/assets/v2/globe/africa-europe.png", region: "Middle East, Africa & Europe", markets: "GCC · Egypt · Morocco · Iraq · Germany · Caucasus" },
    { src: "/assets/v2/globe/asia.png", region: "Asia Pacific", markets: "Malaysia · Singapore · Indonesia · Vietnam · New Zealand" },
  ],
  /** Region menu for the interactive globe: where each one turns the globe to. */
  regions: [
    { key: "europe", label: "Europe", lat: 50, lon: 15, markets: "Germany · Georgia · Azerbaijan" },
    { key: "africa", label: "Africa", lat: 6, lon: 18, markets: "Egypt · Morocco" },
    { key: "asia", label: "Asia", lat: 20, lon: 82, markets: "GCC · Iraq · Malaysia · Singapore · Indonesia · Vietnam · Cambodia · Laos" },
    { key: "north-america", label: "North America", lat: 36, lon: -92, markets: "USA · Canada · Mexico · Honduras · Caribbean" },
    { key: "south-america", label: "South America", lat: -14, lon: -60, markets: "Guyana" },
  ],
  stat: "25+ markets",
  body: "Crispy fried chicken, spicy sandwiches and honey-butter biscuits, cooked fresh across the Americas, the Middle East, Africa, Europe and Asia Pacific.",
  ctaPrimary: { label: "Find your market", href: "/find-your-market" },
  ctaSecondary: { label: "Bring the crunch to your market", href: "/franchising" },
};

export const partnersV2 = {
  eyebrow: "Recognised & trusted",
  heading: "Backed by the industry.",
  intro:
    "Our franchise system is recognised by the industry's leading bodies, from the International Franchise Association to Franchise Times' global rankings. It's the proof behind every new market we open.",
  regions: ["The Americas", "Middle East", "North Africa", "Asia Pacific", "Europe & Caucasus"],
};
