/**
 * Parse + aggregate free-text ingredient strings for the grocery list.
 *
 * Inputs look like:
 *   "1 cup chicken gravy"
 *   "1/2 cup milk of choice"
 *   "1 1/2 tbsp peanut butter"
 *   "1 can coconut milk (13.5 oz)"
 *   "1 large tortilla"
 *   "salt to taste"            (no leading qty — treated as 1 unitless item)
 *
 * Strategy:
 *  1. Try to peel off a quantity (integer / decimal / fraction / mixed).
 *  2. If a known unit follows, peel that too. Anything left is the name.
 *  3. Group entries by lowercased name. Within each group, sub-bucket by
 *     unit (case-insensitive) and sum quantities. Different units stay
 *     separate ("1 cup milk + 2 oz milk").
 *  4. Render with the friendliest fraction shape we can.
 *
 * Strings that don't parse pass through verbatim — better to show
 * something the user can buy than to discard their data.
 */

const KNOWN_UNITS = new Set([
  "cup",
  "cups",
  "tbsp",
  "tablespoon",
  "tablespoons",
  "tsp",
  "teaspoon",
  "teaspoons",
  "oz",
  "ounce",
  "ounces",
  "lb",
  "lbs",
  "pound",
  "pounds",
  "g",
  "gram",
  "grams",
  "kg",
  "ml",
  "l",
  "liter",
  "liters",
  "can",
  "cans",
  "clove",
  "cloves",
  "stick",
  "sticks",
  "package",
  "packages",
  "pkg",
  "slice",
  "slices",
  "scoop",
  "scoops",
  "piece",
  "pieces",
  "head",
  "heads",
  "bunch",
  "bunches",
  "large",
  "small",
  "medium",
]);

interface ParsedIngredient {
  qty: number; // unitless count if `unit` is empty
  unit: string; // lowercased, "" if none
  name: string; // free-text remainder
  raw: string; // original line
}

function parseFraction(s: string): number | null {
  const m = s.match(/^(\d+)\/(\d+)$/);
  if (!m) return null;
  const num = Number(m[1]);
  const den = Number(m[2]);
  if (!den) return null;
  return num / den;
}

function parseQty(s: string): number | null {
  const trimmed = s.trim();
  if (!trimmed) return null;
  // mixed: "1 1/2"
  const mixed = trimmed.match(/^(\d+)\s+(\d+\/\d+)$/);
  if (mixed) {
    const frac = parseFraction(mixed[2]);
    if (frac == null) return null;
    return Number(mixed[1]) + frac;
  }
  const frac = parseFraction(trimmed);
  if (frac != null) return frac;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : null;
}

function parseIngredient(raw: string): ParsedIngredient {
  const cleaned = raw.trim();
  if (!cleaned) return { qty: 0, unit: "", name: "", raw };

  // Pull leading quantity (mixed / fraction / decimal / integer).
  const qtyRegex = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)\s+/;
  const qtyMatch = cleaned.match(qtyRegex);
  if (!qtyMatch) {
    return { qty: 1, unit: "", name: cleaned, raw };
  }
  const qty = parseQty(qtyMatch[1]);
  if (qty == null) return { qty: 1, unit: "", name: cleaned, raw };

  const rest = cleaned.slice(qtyMatch[0].length).trim();
  const unitMatch = rest.match(/^([A-Za-z]+)\b\.?\s*/);
  if (unitMatch && KNOWN_UNITS.has(unitMatch[1].toLowerCase())) {
    const unit = unitMatch[1].toLowerCase();
    const name = rest.slice(unitMatch[0].length).trim();
    return { qty, unit, name: name || rest, raw };
  }
  return { qty, unit: "", name: rest, raw };
}

function formatQty(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const whole = Math.floor(n);
  const frac = n - whole;
  const fractionLabels: Array<[number, string]> = [
    [1 / 8, "1/8"],
    [1 / 6, "1/6"],
    [1 / 4, "1/4"],
    [1 / 3, "1/3"],
    [3 / 8, "3/8"],
    [1 / 2, "1/2"],
    [5 / 8, "5/8"],
    [2 / 3, "2/3"],
    [3 / 4, "3/4"],
    [5 / 6, "5/6"],
    [7 / 8, "7/8"],
  ];
  for (const [v, label] of fractionLabels) {
    if (Math.abs(frac - v) < 0.04) {
      return whole > 0 ? `${whole} ${label}` : label;
    }
  }
  // Fall back to a short decimal, trim trailing zeros.
  return n.toFixed(2).replace(/\.?0+$/, "");
}

function pluralizeUnit(unit: string, qty: number): string {
  if (!unit) return "";
  if (qty <= 1) return unit;
  // simple pluralization for the most common collisions
  const map: Record<string, string> = {
    cup: "cups",
    tbsp: "tbsp",
    tsp: "tsp",
    oz: "oz",
    lb: "lbs",
    can: "cans",
    clove: "cloves",
    stick: "sticks",
    package: "packages",
    slice: "slices",
    scoop: "scoops",
    piece: "pieces",
    head: "heads",
    bunch: "bunches",
    gram: "grams",
    liter: "liters",
  };
  return map[unit] ?? unit;
}

export interface GroceryItem {
  display: string; // "2 cups chicken gravy"
  baseName: string; // lowercase normalized key
  rawSources: string[]; // every original ingredient line that fed into this
  usedFor: string[]; // "Easy Curry (Sun)", "Lemon Salmon (Mon)" etc.
}

/**
 * Aggregates raw ingredient strings into a deduplicated, summed grocery
 * list. `sources` lets the caller pass attribution per raw line so we
 * can render "For: Recipe X (Day)" under each grocery row.
 */
export function aggregateGroceryItems(
  sources: Array<{ ingredient: string; usedFor: string }>
): GroceryItem[] {
  // Bucket by normalized name. Within each name, bucket by unit.
  const byName = new Map<
    string,
    {
      displayName: string;
      byUnit: Map<string, { qty: number; raws: string[]; usedFor: Set<string> }>;
    }
  >();

  for (const src of sources) {
    const ing = src.ingredient.trim();
    if (!ing) continue;
    const parsed = parseIngredient(ing);
    const key = parsed.name.toLowerCase().trim();
    if (!key) continue;

    if (!byName.has(key)) {
      byName.set(key, { displayName: parsed.name, byUnit: new Map() });
    }
    const group = byName.get(key)!;
    const unitKey = parsed.unit;
    if (!group.byUnit.has(unitKey)) {
      group.byUnit.set(unitKey, {
        qty: 0,
        raws: [],
        usedFor: new Set(),
      });
    }
    const bucket = group.byUnit.get(unitKey)!;
    bucket.qty += parsed.qty;
    bucket.raws.push(parsed.raw);
    if (src.usedFor) bucket.usedFor.add(src.usedFor);
  }

  const out: GroceryItem[] = [];
  for (const group of Array.from(byName.values())) {
    // If exactly one unit-bucket, emit one consolidated row.
    const entries = Array.from(group.byUnit.entries());
    if (entries.length === 1) {
      const [unit, bucket] = entries[0];
      const qtyLabel = formatQty(bucket.qty);
      const unitLabel = pluralizeUnit(unit, bucket.qty);
      const parts = [qtyLabel, unitLabel, group.displayName].filter(
        (p) => p && p.length > 0
      );
      out.push({
        display: parts.join(" "),
        baseName: group.displayName.toLowerCase(),
        rawSources: bucket.raws,
        usedFor: Array.from(bucket.usedFor).sort(),
      });
      continue;
    }
    // Multiple units for the same ingredient → emit one row but show
    // a combined quantity expression.
    const qtyExpr = entries
      .map(([unit, bucket]) => {
        const qtyLabel = formatQty(bucket.qty);
        const unitLabel = pluralizeUnit(unit, bucket.qty);
        return [qtyLabel, unitLabel].filter(Boolean).join(" ");
      })
      .join(" + ");
    const allRaws = entries.flatMap((e) => e[1].raws);
    const allUsedFor = new Set<string>();
    for (const e of entries) {
      for (const u of Array.from(e[1].usedFor)) allUsedFor.add(u);
    }
    out.push({
      display: `${qtyExpr} ${group.displayName}`.trim(),
      baseName: group.displayName.toLowerCase(),
      rawSources: allRaws,
      usedFor: Array.from(allUsedFor).sort(),
    });
  }
  return out.sort((a, b) => a.baseName.localeCompare(b.baseName));
}
