/**
 * Faint football-field "hashmarks" overlay.
 *
 * Renders fixed to the viewport so the motif runs down both edges no
 * matter where the visitor scrolls. Two rails (sidelines) plus a row
 * of short tick marks (yard hashmarks) on each side. Neutral mid-gray
 * with low alpha so the pattern reads as a faint texture on both the
 * dark navy and light graphite/white section backgrounds.
 *
 * z-[5] keeps it above section content backgrounds but below the
 * sticky FloatingNav (z-50) and the install banner / dialogs above
 * that. `pointer-events: none` so it never blocks clicks.
 */
export function FieldHashMarks() {
  const marks = "rgba(150, 150, 150, 0.22)";
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 left-0 right-0 z-[5]"
    >
      {/* Sidelines — continuous thin vertical rails */}
      <span
        className="absolute left-4 top-0 h-full w-px md:left-8"
        style={{ backgroundColor: marks }}
      />
      <span
        className="absolute right-4 top-0 h-full w-px md:right-8"
        style={{ backgroundColor: marks }}
      />

      {/* Yard hashmarks — short horizontal ticks at 56px intervals,
          offset inboard from the sidelines like a real field. */}
      <span
        className="absolute left-1 top-0 h-full w-3 md:left-5 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 54px, ${marks} 54px 56px)`,
        }}
      />
      <span
        className="absolute right-1 top-0 h-full w-3 md:right-5 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 54px, ${marks} 54px 56px)`,
        }}
      />
    </div>
  );
}
