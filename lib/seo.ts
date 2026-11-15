import type { Metadata } from "next";

/**
 * SEO meta for every route. Keywords follow the meta description of
 * canada.churchstexaschicken.com ("crispy fried chicken, spicy sandwiches, wraps
 * and honey-butter biscuits, cooked fresh. The taste of Texas, done right.").
 */
export const SITE_NAME = "Church's Texas Chicken™";

export const KEYWORDS = [
  "Church's Texas Chicken",
  "Texas Chicken",
  "crispy fried chicken",
  "spicy sandwiches",
  "wraps",
  "honey-butter biscuits",
  "cooked fresh",
  "the taste of Texas, done right",
  "hand-battered chicken",
  "fried chicken franchise",
];

export const DEFAULT_DESCRIPTION =
  "Discover Church's Texas Chicken: crispy fried chicken, spicy sandwiches, wraps and honey-butter biscuits, cooked fresh in 25+ markets. The taste of Texas, done right.";

const pages = {
  home: {
    title: "Crispy Fried Chicken, Cooked Fresh | Church's Texas Chicken™",
    description: DEFAULT_DESCRIPTION,
  },
  story: {
    title: "Our Story: The Taste of Texas, Done Right Since 1952",
    description:
      "From one San Antonio stand in 1952 to 25+ markets: how Church's Texas Chicken has served crispy fried chicken, hand-battered and cooked fresh, for seven decades.",
  },
  leadership: {
    title: "Leadership Team",
    description:
      "Meet the leaders steering Church's Texas Chicken across 25+ markets, protecting the recipe and keeping every piece of crispy fried chicken cooked fresh.",
  },
  menu: {
    title: "Menu: Crispy Fried Chicken, Spicy Sandwiches & Wraps",
    description:
      "Explore the Texas Chicken menu: crispy fried chicken, spicy sandwiches, wraps, tenders and honey-butter biscuits, all cooked fresh. Full menus vary by market.",
  },
  franchising: {
    title: "Franchise Opportunities: Own a Fried Chicken Franchise",
    description:
      "Franchise with Church's Texas Chicken, a global leader in crispy fried chicken with 1,500+ restaurants in 25+ markets. Explore open territories, investment and support.",
  },
  market: {
    title: "Find Your Market: Texas Chicken Near You",
    description:
      "Pick your region and find the Church's Texas Chicken market near you for crispy fried chicken, spicy sandwiches, wraps and honey-butter biscuits, cooked fresh.",
  },
  careers: {
    title: "Careers: Join the Crew Behind the Crunch",
    description:
      "Build a bold career at Church's Texas Chicken. 40,000+ people in 25+ markets serve crispy fried chicken, cooked fresh and made by hand, every day.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with Church's Texas Chicken for general enquiries, franchising, press and careers. One global team serving crispy fried chicken in 25+ markets.",
  },
  faqs: {
    title: "FAQs",
    description:
      "Answers about Church's Texas Chicken: our crispy fried chicken, spicy sandwiches, wraps and honey-butter biscuits, the app and rewards, and franchising.",
  },
  news: {
    title: "News & Press",
    description:
      "The latest from Church's Texas Chicken: new spicy sandwiches and wraps, limited-time flavors, restaurant openings and global milestones.",
  },
  community: {
    title: "Community",
    description:
      "How Church's Texas Chicken shows up beyond the counter: serving our communities with the same care we put into crispy fried chicken, cooked fresh.",
  },
  app: {
    title: "App & Rewards",
    description:
      "Order crispy fried chicken, spicy sandwiches and honey-butter biscuits ahead in the Texas Chicken app, collect points and unlock members-only deals.",
  },
  privacy: {
    title: "Privacy & Cookies Policy",
    description: "How Church's Texas Chicken collects, uses, discloses and protects your personal information, and how we use cookies.",
  },
  terms: {
    title: "Terms & Conditions",
    description: "The terms that govern your use of Church's Texas Chicken websites, app and services.",
  },
} as const;

export type PageKey = keyof typeof pages;

/** Metadata for one route — title is combined with the site-wide template. */
export function pageMeta(key: PageKey): Metadata {
  const p = pages[key];
  const isHome = key === "home";
  return {
    title: isHome ? { absolute: p.title } : p.title,
    description: p.description,
    keywords: KEYWORDS,
    openGraph: { title: isHome ? p.title : `${p.title} | ${SITE_NAME}`, description: p.description, type: "website", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title: isHome ? p.title : `${p.title} | ${SITE_NAME}`, description: p.description },
  };
}
