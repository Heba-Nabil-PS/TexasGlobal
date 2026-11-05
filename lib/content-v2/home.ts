/** Homepage copy. */

export const MARKETS_LABEL = "25+";

/** One line, brand keywords (packaging + brand line), no menu items. */
export const stripV2 = {
  words: ["Hand-battered", "Bold Texas flavor", "Since 1952", "25+ markets", "Blazing new trails in flavor", "Small-batch crunch"],
};

export const aboutV2 = {
  eyebrow: "Our story",
  titleLines: ["From one Texas stand", "to [25+ markets] worldwide."],
  body: "In 1952 one San Antonio stand served one hand-battered recipe, fried fresh to order. Seven decades on, that same recipe leads the category across the Americas, the Middle East, Africa and Asia — still made by hand, still made in small batches, in every single restaurant.",
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
    "Every piece of chicken is prepared in small batches to deliver the texture and crunch people know us for. It is not rushed, and it is never treated as routine.",
    "From the first bite to the last, the experience is built on care, attention, and doing things properly. That is how we protect the flavor, and why people keep coming back.",
  ],
  name: "Roland Gonzalez",
  role: "Chief Executive Officer",
  image: "/assets/v2/ceo.png",
};

export const whatsNewV2 = {
  eyebrow: "Limited-time offers",
  title: "What's new.",
  items: [
    { title: "Golden Dragon", desc: "Glazed with our sweet & fiery golden habanero sauce.", image: "/assets/v2/whats-new/new-01.png", w: 985, h: 1397 },
    { title: "Mexicana Loaded Fries", desc: "Crispy fries piled with popcorn chicken and bold sauces.", image: "/assets/v2/whats-new/new-02.png", w: 985, h: 1397 },
    { title: "The Super Hero", desc: "A massively flavorful hero — stacked, saucy and loaded.", image: "/assets/v2/whats-new/new-03.png", w: 1600, h: 1397 },
  ],
  badge: "/assets/v2/whats-new/new-04.png",
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
  stat: "25+ markets",
  body: "One hand-battered recipe, served across the Americas, the Middle East, Africa, Europe and Asia Pacific.",
  ctaPrimary: { label: "Find your market", href: "/find-your-market" },
  ctaSecondary: { label: "Bring the crunch to your market", href: "/franchising" },
};

export const partnersV2 = {
  eyebrow: "Recognised & trusted",
  heading: "Backed by the industry.",
  intro:
    "Our franchise system is recognised by the industry's leading bodies — from the International Franchise Association to Franchise Times' global rankings. It's the proof behind every new market we open.",
  regions: ["The Americas", "Middle East", "North Africa", "Asia Pacific", "Europe & Caucasus"],
};
