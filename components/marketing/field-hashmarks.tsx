/**
 * Faint football-field "hashmarks" overlay.
 *
 * Renders fixed to the viewport so the motif runs down both edges no
 * matter where the visitor scrolls. Two rails (sidelines) plus tick
 * marks that extend INWARD from each sideline toward the center of
 * the page:
 *   - Short ticks every 56px (yard hashmarks)
 *   - Long ticks every 5th interval, twice the length (yard lines)
 *
 * The short-tick column and the long-tick "extension" column do NOT
 * overlap, so every tick renders at the same alpha — no doubled-up
 * dark spot where the long ticks land. Neutral mid-gray with low
 * alpha so the pattern reads as a faint texture on both the dark
 * navy and the light graphite/white section backgrounds.
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

      {/* Short ticks — start at the sideline and extend INWARD toward
          the page center. */}
      <span
        className="absolute left-4 top-0 h-full w-3 md:left-8 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${tickPeriod - 2}px, ${marks} ${tickPeriod - 2}px ${tickPeriod}px)`,
        }}
      />
      <span
        className="absolute right-4 top-0 h-full w-3 md:right-8 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${tickPeriod - 2}px, ${marks} ${tickPeriod - 2}px ${tickPeriod}px)`,
        }}
      />

      {/* Long-tick extensions — sit directly inboard of the short-tick
          column (no overlap) so every 5th tick reads as one unbroken
          mark at twice the length but the same transparency. */}
      <span
        className="absolute left-7 top-0 h-full w-3 md:left-12 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${longPeriod - 2}px, ${marks} ${longPeriod - 2}px ${longPeriod}px)`,
        }}
      />
      <span
        className="absolute right-7 top-0 h-full w-3 md:right-12 md:w-4"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${longPeriod - 2}px, ${marks} ${longPeriod - 2}px ${longPeriod}px)`,
        }}
      />
    </div>
  );
}
