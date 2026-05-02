type FakeCursorProps = {
  label: string;
};

/**
 * FakeCursor renders a recolorable cursor glyph.
 *
 * The SVG uses currentColor so the overlay can assign collaborator colors with
 * design tokens instead of hardcoded SVG fill values.
 */
export function FakeCursor({ label }: FakeCursorProps) {
  return (
    <svg
      aria-label={label}
      className="block h-full w-full"
      fill="none"
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.8,9.4,4.87,2.18A2,2,0,0,0,2.18,4.87h0L9.4,20.8A2,2,0,0,0,11.27,22h.25a2.26,2.26,0,0,0,2-1.8l1.13-5.58,5.58-1.13a2.26,2.26,0,0,0,1.8-2A2,2,0,0,0,20.8,9.4Z"
        fill="currentColor"
      />
    </svg>
  );
}
