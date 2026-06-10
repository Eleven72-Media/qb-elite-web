/**
 * Faint football-field "hashmarks" overlay.
 *
 * Renders fixed to the viewport so the motif runs down both edges no
 * matter where the visitor scrolls. Two rails (sidelines) plus two
 * rows of short tick marks on each side:
 *   - Short ticks every 56px (yard hashmarks)
 *   - Long ticks every 5th interval, twice the length (yard lines)
 * Neutral mid-gray with low alpha so the pattern reads as a faint
 * texture on both the dark navy and the light graphite/white section
 * backgrounds.
 *
 * z-[5] keeps it above section content backgrounds but below the
 * sticky FloatingNav (z-50) and the install banner / dialogs above
 * that. `pointer-events: none` so it never blocks clicks.
 */
export function FieldHashMarks() {
  const marks = "rgba(150, 150, 150, 0.22)";
  // Vertical rhythm — 56px per "yard". Every 5th tick is a yard line.
  const tickPeriod = 56;
  const longPeriod = tickPeriod * 5; // 280px between yard lines
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

      {/* Short ticks (every yard) — narrow column right next to the
          sideline. */}
      <span
        className="absolute left-1 top-0 h-full w-3 md:left-5 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${tickPeriod - 2}px, ${marks} ${tickPeriod - 2}px ${tickPeriod}px)`,
        }}
      />
      <span
        className="absolute right-1 top-0 h-full w-3 md:right-5 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${tickPeriod - 2}px, ${marks} ${tickPeriod - 2}px ${tickPeriod}px)`,
        }}
      />

      {/* Long ticks (every 5th yard) — twice as wide, drawn over the
          short ticks so the longer mark reads as one unbroken tick. */}
      <span
        className="absolute -left-2 top-0 h-full w-6 md:left-1 md:w-8"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${longPeriod - 2}px, ${marks} ${longPeriod - 2}px ${longPeriod}px)`,
        }}
      />
      <span
        className="absolute -right-2 top-0 h-full w-6 md:right-1 md:w-8"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${longPeriod - 2}px, ${marks} ${longPeriod - 2}px ${longPeriod}px)`,
        }}
      />
    </div>
  );
}
