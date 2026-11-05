const ROTATION = { down: 0, left: 90, up: 180, right: -90, "up-right": -135 };

/**
 * The brand chevron. Takes the text colour and font size, like a text glyph.
 * It turns inside the SVG, so the className stays free for hover transforms.
 */
export default function BrandArrow({
  dir = "right",
  className = "inline-block size-[1em] shrink-0 align-[-0.125em]",
}: {
  dir?: keyof typeof ROTATION;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path
        transform={`rotate(${ROTATION[dir]} 16 16)`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.94 10.94a1.5 1.5 0 0 1 2.12 0L16 19.878l8.94-8.94a1.5 1.5 0 0 1 2.12 2.122l-10 10a1.5 1.5 0 0 1-2.12 0l-10-10a1.5 1.5 0 0 1 0-2.122"
      />
    </svg>
  );
}
