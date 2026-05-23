"use client";

import { Printer, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export interface GroceryItem {
  ingredient: string;
  usedFor: string[];
}

export interface UnmatchedMeal {
  meal: string;
  days: string[];
}

/**
 * Printable grocery list. Items are local-state checked (no DB writes),
 * checked items get a strikethrough so the user can shop through the
 * list in person. Print uses window.print() with print-only CSS so the
 * header buttons + nav chrome don't appear on paper.
 */
export function GroceryListClient({
  weekLabel,
  items,
  unmatched,
}: {
  weekLabel: string;
  items: GroceryItem[];
  unmatched: UnmatchedMeal[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const totalChecked = useMemo(
    () => Object.values(checked).filter(Boolean).length,
    [checked]
  );

  function toggle(key: string) {
    setChecked((p) => ({ ...p, [key]: !p[key] }));
  }

  function clearChecks() {
    setChecked({});
  }

  function copyToClipboard() {
    const lines = [
      `QB Elite Grocery List — ${weekLabel}`,
      "",
      ...items.map((i) => `• ${i.ingredient}`),
      ...(unmatched.length > 0
        ? ["", "Meals without ingredient data:"]
        : []),
      ...unmatched.map((u) => `• ${u.meal} (${u.days.join(", ")})`),
    ];
    navigator.clipboard?.writeText(lines.join("\n"));
  }

  function downloadTxt() {
    const lines = [
      `QB Elite Grocery List — ${weekLabel}`,
      "",
      ...items.map((i) => `[ ] ${i.ingredient}`),
      ...(unmatched.length > 0
        ? ["", "Meals without ingredient data:"]
        : []),
      ...unmatched.map((u) => `[ ] ${u.meal} (${u.days.join(", ")})`),
      "",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qb-elite-grocery-list-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-[820px] space-y-5 px-5 pb-8 md:px-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary/12 to-primary/0 p-5 ring-1 ring-primary/15 print:bg-none print:ring-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4 text-primary" strokeWidth={2.25} />
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            Grocery List
          </p>
        </div>
        <h2 className="mt-1 text-[20px] font-bold leading-tight">
          {weekLabel}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} item{items.length === 1 ? "" : "s"} across your week
          {totalChecked > 0 && ` · ${totalChecked} checked off`}
        </p>
      </section>

      <div className="flex flex-wrap gap-2 print:hidden">
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.print()}
          className="rounded-full"
        >
          <Printer className="h-4 w-4" strokeWidth={2} />
          Print
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={downloadTxt}
          className="rounded-full"
        >
          Download .txt
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={copyToClipboard}
          className="rounded-full"
        >
          Copy
        </Button>
        {totalChecked > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearChecks}
            className="rounded-full"
          >
            Reset checks
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-muted p-8 text-center text-sm text-muted-foreground">
          No ingredients could be matched from this week&apos;s meals. Check the
          unmatched section below.
        </div>
      ) : (
        <section className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-black/5 print:shadow-none print:ring-0">
          <ul className="divide-y divide-border/40 px-5">
            {items.map((it) => {
              const key = it.ingredient.toLowerCase();
              const isOn = !!checked[key];
              return (
                <li key={key} className="py-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => toggle(key)}
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-primary"
                    />
                    <div className="min-w-0 flex-1">
                      <p
                        className={
                          isOn
                            ? "text-[15px] text-muted-foreground line-through"
                            : "text-[15px] font-medium text-foreground"
                        }
                      >
                        {it.ingredient}
                      </p>
                      {it.usedFor.length > 0 && (
                        <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                          For: {it.usedFor.join(", ")}
                        </p>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {unmatched.length > 0 && (
        <section>
          <h3 className="mb-2 text-[14px] font-bold tracking-tight">
            Couldn&apos;t match these meals
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            These appear in the plan but don&apos;t have ingredients on file.
            Add them by hand at the store.
          </p>
          <ul className="space-y-2 rounded-3xl bg-muted/50 p-4">
            {unmatched.map((u) => (
              <li key={u.meal} className="text-sm">
                <span className="font-semibold text-foreground">{u.meal}</span>
                <span className="text-muted-foreground"> · {u.days.join(", ")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Print-only header so the printed page has context. */}
      <div className="hidden text-center print:block">
        <p className="text-xs uppercase tracking-widest text-primary">QB Elite</p>
        <h1 className="text-2xl font-bold">Grocery List — {weekLabel}</h1>
      </div>
    </div>
  );
}
