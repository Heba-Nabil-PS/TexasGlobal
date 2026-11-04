/**
 * V2 copy for Franchising, Contact Us, FAQs and Careers (client feedback round 2).
 * Tone: a global leader with a 70-year legacy. Use "25+ markets" everywhere.
 */

export const franchiseV2 = {
  hero: {
    eyebrow: "Franchise with a global leader",
    title: ["Own a piece of", "a [legend]."],
    body: "Since 1952, one hand-battered recipe has grown from a single stand in San Antonio into 1,500+ restaurants across 25+ markets. Now we're opening the door to the next generation of partners.",
    primary: { label: "Start your application", href: "#apply-form" },
    secondary: { label: "See the investment", href: "#investment" },
    stamp: "25+ markets",
  },
  proof: [
    { value: 1500, suffix: "+", label: "Restaurants worldwide" },
    { value: 25, suffix: "+", label: "Markets on 4 continents" },
    { value: 20, suffix: "+", label: "New markets in the pipeline" },
    { value: 1952, suffix: "", label: "Recipe perfected since" },
  ],
  credentials: {
    eyebrow: "Trusted by the industry",
    title: ["A brand partners [bank on]."],
    body: "Recognised by the people who know franchising best — and backed by a support system built over seven decades.",
    items: [
      { badge: "/assets/badge-ifa-member.svg", title: "IFA member", note: "International Franchise Association" },
      { badge: "/assets/badge-franchise-times.svg", title: "Top 400", note: "No. 64 · Franchise Times 2023" },
      { badge: "/assets/badge-ifa-foty.svg", title: "Franchisee of the Year", note: "IFA award — Malaysia" },
    ],
    reasons: [
      { k: "Craveable product", v: "A recipe guests cross town for — the engine behind every P&L." },
      { k: "Proven model", v: "Playbooks refined across 1,500+ restaurants and 25+ markets." },
      { k: "Global buying power", v: "Local-first sourcing, backed by a worldwide supply chain." },
    ],
  },
  apply: {
    eyebrow: "The path to opening",
    title: ["Four steps to", "[your first] restaurant."],
    formEyebrow: "Get started",
    formTitle: ["Ready to make", "a [bold move?]"],
    formBody: "Share a few details and our development team will be in touch within 5 business days.",
    next: [
      "A reply from our development team within 5 business days",
      "A review of your territory and investment fit",
      "A call to walk you through the full opportunity",
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
    body: "Questions, feedback, press or partnerships — one global team, serving 25+ markets. Pick a channel and we'll get you to the right people, fast.",
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
    eyebrow: "Help centre",
    title: ["Questions?", "We've got [answers]."],
    body: "Everything about the brand, the food, the app and joining the family — answered by the team behind 70+ years of crunch.",
    search: "Search a question… e.g. halal, franchise, app",
    stamp: "Ask away",
  },
  empty: "No answers match that search — try another word, or ask us directly.",
  side: {
    title: "Still hungry for answers?",
    body: "Our team replies within 2 business days.",
    cta: { label: "Contact us", href: "/contact-us" },
  },
  cta: {
    eyebrow: "Still curious?",
    title: ["Can't find", "[your answer]?"],
    body: "Talk to a real person on Team Texas — or find your local market for menus, hours and availability.",
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
    body: "40,000+ people in 25+ markets serve one recipe, made by hand, every day. From the fryer to the boardroom, this is where bold careers are built.",
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
    body: "Whether it's your first job or your next big move, you'll learn from people who care about doing things properly — and have fun doing it.",
    points: [
      { title: "Real career paths", desc: "Most of our restaurant leaders started behind the counter. We promote from within.", image: "/assets/v2/signatures/sig-01.png" },
      { title: "Learn the craft", desc: "Hands-on training through the Team Texas academy — hospitality skills that last.", image: "/assets/v2/signatures/sig-02.png" },
      { title: "Global opportunity", desc: "25+ markets and growing. Great people travel far with us.", image: "/assets/v2/signatures/sig-03.png" },
      { title: "Culture that delivers", desc: "Bold brand, big hearts, high standards — and good food on every shift.", image: "/assets/v2/signatures/sig-04.png" },
    ],
  },
  roles: {
    eyebrow: "Open roles",
    title: ["Find your [place]."],
    note: "Corporate & support-office roles are listed alongside restaurant vacancies — use the filters to narrow down.",
  },
  cta: {
    eyebrow: "Team Texas",
    title: ["Your career,", "[hand-crafted]."],
    body: "Don't see the perfect role? Introduce yourself — we're always looking for bold people.",
    primary: { label: "Get in touch", href: "/contact-us" },
    secondary: { label: "Meet the leadership", href: "/our-story/leadership" },
  },
};
