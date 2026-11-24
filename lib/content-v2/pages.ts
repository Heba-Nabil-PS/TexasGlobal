/**
 * V2 copy for Franchising, Contact Us, FAQs and Careers (client feedback round 2).
 * Tone: a global leader with a 70-year legacy. Use "25+ markets" everywhere.
 */

export const franchiseV2 = {
  hero: {
    // Copy from the franchise.texaschicken.com homepage hero.
    eyebrow: "Bold, Texas flavor",
    title: ["Bring Texas", "to the [world]!"],
    body: "Open a Texas Chicken™ or Church's Texas Chicken™ restaurant near you.",
    primary: { label: "Get started", href: "#apply-form" },
    secondary: { label: "See the investment", href: "#investment" },
  },
  proof: [
    { value: 1500, suffix: "+", label: "Restaurants worldwide" },
    { value: 25, suffix: "+", label: "Markets on 4 continents" },
    { value: 20, suffix: "+", label: "New markets in the pipeline" },
    { value: 1952, suffix: "", label: "Recipe perfected since" },
  ],
  credentials: {
    eyebrow: "Trusted by the industry",
    title: ["A brand partners", "[bank on.]"],
    body: "Recognised by the people who know franchising best, and backed by a support system built over seven decades. Our proven restaurant franchise model creates exciting chicken franchise opportunities backed by global experience.",
    items: [
      { badge: "/assets/badge-ifa-member.svg", title: "IFA member", note: "International Franchise Association" },
      { badge: "/assets/badge-franchise-times.svg", title: "Top 400", note: "No. 64 · Franchise Times 2023" },
      { badge: "/assets/badge-ifa-foty.svg", title: "Franchisee of the Year", note: "IFA award, Malaysia" },
    ],
    reasons: [
      { k: "Craveable product", v: "A recipe guests cross town for: the engine behind every successful fried chicken franchise." },
      { k: "Proven model", v: "Playbooks refined across 1,500+ restaurants and 25+ markets, creating a strong foundation for international franchise opportunities." },
      { k: "Global buying power", v: "Local-first sourcing, backed by a worldwide supply chain, supporting our global food franchise network." },
    ],
  },
  apply: {
    eyebrow: "The path to opening",
    title: ["Four steps to", "[your first] restaurant."],
    intro: "From the first conversation to opening day, our development team works alongside you at every step: territory, site, build and launch.",
    formEyebrow: "Get started",
    formTitle: ["Ready to make", "a [bold move?]"],
    formBody: "Share a few details about your franchise opportunities interest, and our development team will be in touch within 5 business days.",
    next: [
      "A reply from our development team within 5 business days.",
      "A review of your territory and chicken franchise investment fit.",
      "A call to walk you through our Church's Texas Chicken franchise opportunities.",
    ],
    formHeading: "Franchise enquiry",
    formTime: "Takes about 2 minutes",
    investment: ["Under US$500K", "US$500K – 1M", "US$1M – 5M", "US$5M+"],
    disclaimer: "This website is not an offer of a franchise.",
  },
};

export const contactV2 = {
  hero: {
    eyebrow: "Get in touch",
    title: ["Let's talk", "[crunch]."],
    body: "Questions, feedback, press or partnerships: one global team, serving 25+ markets. Contact Church's Texas Chicken and pick a channel to reach the Church's Texas Chicken corporate office or Church's Chicken customer service team, fast.",
    bubbles: ["Franchise enquiry? 👋", "Press kit, please!", "Best biscuits ever."],
    stamp: "We're all ears",
  },
  body: {
    eyebrow: "Pick a channel",
    title: ["Straight to the", "[right team.]"],
  },
};

export const faqsV2 = {
  hero: {
    title: ["Questions?", "We've got [answers]."],
    search: "Search a question… e.g. halal, franchise, app",
  },
  empty: "No answers match that search. Try another word, or ask us directly.",
  side: {
    title: "Still hungry for answers?",
    body: "Our team replies within 2 business days.",
    cta: { label: "Contact us", href: "/contact-us" },
  },
  cta: {
    eyebrow: "Still curious?",
    title: ["Can't find", "[your answer]?"],
    body: "Talk to a real person on Team Texas, or find your local market for menus, hours and availability.",
    primary: { label: "Contact us", href: "/contact-us" },
    secondary: { label: "Find your market", href: "/find-your-market" },
  },
  /** overrides for figures that are out of date in the shared copy */
  fixes: [["across 23 markets", "across 25+ markets"]] as [string, string][],
};

export const careersV2 = {
  hero: {
    eyebrow: "Careers at Texas Chicken",
    title: ["Join the [crew]", "behind the crunch."],
    body: "40,000+ people in 25+ markets serve crispy fried chicken, cooked fresh and made by hand, every day. From the fryer to the boardroom, build your career at Texas Chicken and explore opportunities across our global team.",
    primary: { label: "See open roles", href: "#roles" },
    secondary: { label: "Our story", href: "/our-story" },
    stamp: "Join the crew",
  },
  stats: [
    { value: 40000, suffix: "+", label: "Team members", tone: "red" as const },
    { value: 25, suffix: "+", label: "Markets hiring", tone: "yellow" as const },
    { value: 1500, suffix: "+", label: "Restaurants", tone: "ink" as const },
    { value: 1952, suffix: "", label: "Crafting since", tone: "white" as const },
  ],
  culture: {
    eyebrow: "Why Team Texas",
    title: ["We hire for heart.", "We [train for craft]."],
    body: "Whether it's your first job or your next big move, you'll learn from people who care about doing things properly, and have fun doing it.",
    points: [
      { title: "Real career paths", desc: "Most of our restaurant leaders started behind the counter. We promote from within.", image: "/assets/v2/signatures/sig-01.png" },
      { title: "Learn the craft", desc: "Hands-on training through the Team Texas academy: hospitality skills that last.", image: "/assets/v2/signatures/sig-02.png" },
      { title: "Global opportunity", desc: "25+ markets and growing. Great people travel far with us.", image: "/assets/v2/signatures/sig-03.png" },
      { title: "Culture that delivers", desc: "Bold brand, big hearts, high standards, and good food on every shift.", image: "/assets/v2/signatures/sig-04.png" },
    ],
  },
  roles: {
    eyebrow: "Open roles",
    title: ["Find your [place]."],
    note: "Corporate & support-office roles are listed alongside restaurant vacancies. Use the filters to narrow down.",
  },
  cta: {
    eyebrow: "Team Texas",
    title: ["Your career,", "[hand-crafted]."],
    body: "Don't see the perfect role? Introduce yourself. We're always looking for bold people.",
    primary: { label: "Get in touch", href: "/contact-us" },
    secondary: { label: "Meet the leadership", href: "/our-story/leadership" },
  },
};
