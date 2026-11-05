import type { SVGProps } from "react";

export const BRAND_STAR_VIEWBOX = "0 0 502.67 496.15";

/** The three pieces of the Texas star, for use inside an existing <svg>. */
export function BrandStarShape(props: SVGProps<SVGGElement>) {
  return (
    <g {...props}>
      <polygon points="357.92 0 221.35 134.78 136.72 217.39 0 351.75 192.16 323.96 281.75 496.15 351.78 40.27 357.92 0" />
      <polygon points="47.61 46.1 129.27 203.08 206.49 127.19 47.61 46.1" />
      <polygon points="502.67 279.04 343.26 197.2 326.78 304.48 502.67 279.04" />
    </g>
  );
}

/** The Texas star. Takes the text colour and font size, like a text glyph. */
export default function BrandStar({ className = "inline-block size-[1em] shrink-0 align-[-0.1em]" }: { className?: string }) {
  return (
    <svg viewBox={BRAND_STAR_VIEWBOX} className={className} fill="currentColor" aria-hidden>
      <BrandStarShape />
    </svg>
  );
}
