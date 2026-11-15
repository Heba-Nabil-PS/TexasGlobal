/**
 * PICK YOUR CRUNCH — the scroll-built trays.
 *
 * Every category is rebuilt, piece by piece, from its individual PNG cut-outs
 * (source folders: "Chicken and Tender Combos/", "Burger and Wrap Combos/",
 * "Sides/", "Desserts/"; exported trimmed + alpha-preserving WebP to
 * /public/assets/v2/crunch/build/<category>/).
 *
 * Coordinates are in the supplied composite artwork's space (800 wide), so the
 * built tray matches "pick your crunch _<Category>.png". The stage shows the
 * band y = STAGE.y0 … STAGE.y0 + STAGE.h of that artwork.
 *
 *  x, y, w  final top-left + display width (artwork px); height follows the
 *           image's own aspect ratio (iw × ih), never stretched
 *  from     where the piece flies in from: dx/dy in stage widths/heights,
 *           r = start rotation (deg), s = start scale
 *  to       where it flies off to when the tray is taken apart
 *  depth    parallax factor while the tray is on screen (bigger = closer)
 */

export type Pose = { dx: number; dy: number; r: number; s: number };

export type BuildPiece = {
  key: string;
  src: string;
  /** intrinsic size of the trimmed image */
  iw: number;
  ih: number;
  x: number;
  y: number;
  w: number;
  from: Pose;
  to: Pose;
  depth: number;
};

export type BuildCategory = {
  id: string;
  title: string[];
  /** label on the category rail */
  short: string;
  blurb: string;
  href: string;
  /** the finished artwork — used for the category rail + reduced-motion view */
  combo: { src: string; iw: number; ih: number };
  /** stage background (circle-wiped in) and the text colours on it */
  /** stage background: [centre (behind the food), edge] — painted as a soft radial gradient */
  bg: [string, string];
  glow: string;
  ink: "dark" | "light";
  /** back-to-front */
  pieces: BuildPiece[];
};

export const STAGE = { w: 800, y0: 70, h: 530 };

const dir = "/assets/v2/crunch/build";
const tray = (cat: string, from: Pose, to: Pose): BuildPiece => ({
  key: "tray",
  src: `${dir}/${cat}/tray.webp`,
  iw: 747,
  ih: 262,
  x: 44,
  y: 318,
  w: 736,
  from,
  to,
  depth: 0.2,
});

export const crunchBuild: BuildCategory[] = [
  {
    id: "chicken-tender",
    title: ["Chicken &", "Tender", "Combos"],
    short: "Chicken & Tenders",
    blurb: "Bone-in pieces and hand-battered tenders, with sides and a drink.",
    href: "/find-your-market",
    combo: { src: `${dir}/chicken/combo.webp`, iw: 735, ih: 480 },
    bg: ["#fffaf1", "#ffe6b8"],
    glow: "#ffd27a",
    ink: "dark",
    pieces: [
      tray("chicken", { dx: 0.9, dy: 0.25, r: 18, s: 0.9 }, { dx: -1.1, dy: 0.15, r: -12, s: 0.9 }),
      { key: "cup", src: `${dir}/chicken/cup.webp`, iw: 203, ih: 365, x: 463, y: 92, w: 187, from: { dx: 0.35, dy: -1.05, r: 28, s: 0.7 }, to: { dx: 0.55, dy: -1.1, r: 35, s: 1.2 }, depth: 0.35 },
      { key: "breast", src: `${dir}/chicken/breast.webp`, iw: 398, ih: 248, x: 396, y: 290, w: 353, from: { dx: 0.85, dy: -0.35, r: 70, s: 0.5 }, to: { dx: 0.9, dy: -0.5, r: 110, s: 1.3 }, depth: 0.55 },
      { key: "tender-long", src: `${dir}/chicken/tender-long.webp`, iw: 345, ih: 154, x: 60, y: 286, w: 300, from: { dx: -1.05, dy: -0.45, r: -55, s: 0.6 }, to: { dx: -1, dy: -0.6, r: -90, s: 1.3 }, depth: 0.6 },
      { key: "tender", src: `${dir}/chicken/tender.webp`, iw: 306, ih: 180, x: 168, y: 328, w: 252, from: { dx: -0.65, dy: 0.95, r: 40, s: 0.55 }, to: { dx: -0.6, dy: 1.05, r: 60, s: 1.25 }, depth: 0.75 },
      { key: "thigh", src: `${dir}/chicken/thigh.webp`, iw: 339, ih: 257, x: 267, y: 316, w: 277, from: { dx: 0.1, dy: 1.15, r: -35, s: 0.6 }, to: { dx: 0.15, dy: 1.15, r: -70, s: 1.35 }, depth: 0.9 },
      { key: "slaw", src: `${dir}/chicken/slaw.webp`, iw: 214, ih: 197, x: 462, y: 378, w: 209, from: { dx: 0.75, dy: 0.9, r: -25, s: 0.6 }, to: { dx: 0.8, dy: 1, r: -40, s: 1.3 }, depth: 1 },
    ],
  },
  {
    id: "burger-wrap",
    title: ["Burger &", "Wrap", "Combos"],
    short: "Burgers & Wraps",
    blurb: "Crispy chicken sandwiches and wraps, built bold and stacked high.",
    href: "/find-your-market",
    combo: { src: `${dir}/burger/combo.webp`, iw: 732, ih: 479 },
    bg: ["#fff7f1", "#ffd6c2"],
    glow: "#ffb48a",
    ink: "dark",
    pieces: [
      tray("burger", { dx: 1.1, dy: 0.1, r: 14, s: 0.95 }, { dx: -1.1, dy: 0.15, r: -12, s: 0.9 }),
      { key: "cup", src: `${dir}/burger/cup.webp`, iw: 203, ih: 357, x: 463, y: 92, w: 187, from: { dx: 0.6, dy: -0.95, r: -30, s: 0.7 }, to: { dx: 0.45, dy: -1.15, r: -40, s: 1.2 }, depth: 0.35 },
      { key: "fries", src: `${dir}/burger/fries.webp`, iw: 205, ih: 268, x: 545, y: 214, w: 193, from: { dx: 0.95, dy: 0.2, r: 50, s: 0.6 }, to: { dx: 1, dy: -0.3, r: 80, s: 1.25 }, depth: 0.5 },
      { key: "wrap", src: `${dir}/burger/wrap.webp`, iw: 416, ih: 261, x: 62, y: 282, w: 329, from: { dx: -1.1, dy: 0.05, r: -50, s: 0.6 }, to: { dx: -1.1, dy: -0.35, r: -80, s: 1.3 }, depth: 0.7 },
      { key: "burger", src: `${dir}/burger/burger.webp`, iw: 368, ih: 327, x: 256, y: 218, w: 364, from: { dx: -0.05, dy: -1.2, r: -20, s: 1.35 }, to: { dx: 0, dy: -1.25, r: 25, s: 1.45 }, depth: 0.85 },
      { key: "slaw", src: `${dir}/burger/slaw.webp`, iw: 214, ih: 225, x: 462, y: 380, w: 209, from: { dx: 0.5, dy: 1.05, r: 30, s: 0.6 }, to: { dx: 0.6, dy: 1.1, r: 45, s: 1.3 }, depth: 1 },
    ],
  },
  {
    id: "sides",
    title: ["Sides"],
    short: "Sides",
    blurb: "Fries, coleslaw, honey-butter biscuits and the rest of the crew.",
    href: "/find-your-market",
    combo: { src: `${dir}/sides/combo.webp`, iw: 800, ih: 421 },
    bg: ["#fffcef", "#fbe7a6"],
    glow: "#f8d06a",
    ink: "dark",
    pieces: [
      tray("sides", { dx: 1.05, dy: 0.3, r: 20, s: 0.9 }, { dx: -1.1, dy: 0.2, r: -14, s: 0.9 }),
      { key: "bold-bag", src: `${dir}/sides/bold-bag.webp`, iw: 217, ih: 233, x: 322, y: 140, w: 222, from: { dx: 0.05, dy: -1.15, r: 25, s: 0.7 }, to: { dx: 0.1, dy: -1.2, r: -35, s: 1.25 }, depth: 0.35 },
      { key: "mash", src: `${dir}/sides/mash.webp`, iw: 186, ih: 237, x: 529, y: 254, w: 206, from: { dx: 0.9, dy: -0.55, r: 40, s: 0.6 }, to: { dx: 0.95, dy: -0.4, r: 70, s: 1.25 }, depth: 0.55 },
      { key: "biscuit-a", src: `${dir}/sides/biscuit-a.webp`, iw: 176, ih: 138, x: 134, y: 254, w: 200, from: { dx: -0.95, dy: -0.7, r: -120, s: 0.5 }, to: { dx: -1, dy: -0.75, r: -200, s: 1.3 }, depth: 0.7 },
      { key: "biscuit-b", src: `${dir}/sides/biscuit-b.webp`, iw: 179, ih: 139, x: 226, y: 346, w: 192, from: { dx: -0.8, dy: 0.95, r: 140, s: 0.5 }, to: { dx: -0.85, dy: 1.05, r: 220, s: 1.3 }, depth: 0.85 },
      { key: "slaw", src: `${dir}/sides/slaw.webp`, iw: 214, ih: 236, x: 375, y: 340, w: 238, from: { dx: 0.55, dy: 1.05, r: -30, s: 0.6 }, to: { dx: 0.6, dy: 1.1, r: -50, s: 1.3 }, depth: 1 },
    ],
  },
  {
    id: "desserts",
    title: ["Desserts"],
    short: "Desserts",
    blurb: "Something sweet to finish the crunch.",
    href: "/find-your-market",
    combo: { src: `${dir}/desserts/combo.webp`, iw: 744, ih: 420 },
    bg: ["#fff8f4", "#f0d6c8"],
    glow: "#e9b9a0",
    ink: "dark",
    pieces: [
      tray("desserts", { dx: -1.05, dy: 0.25, r: -22, s: 0.9 }, { dx: 1.1, dy: 0.2, r: 14, s: 0.9 }),
      { key: "dessert", src: `${dir}/desserts/dessert.webp`, iw: 424, ih: 382, x: 222, y: 164, w: 408, from: { dx: 0, dy: -1.25, r: -360, s: 0.35 }, to: { dx: 0, dy: -1.2, r: 360, s: 1.4 }, depth: 0.8 },
    ],
  },
];
