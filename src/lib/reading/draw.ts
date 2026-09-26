import type { Orientation } from "../../content/types.ts";

export function shuffle<T>(items: readonly T[], rng: () => number): T[] {
  const next = items.slice();
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1));
    const current = next[index] as T;
    next[index] = next[swap] as T;
    next[swap] = current;
  }
  return next;
}

export function orientationsFor(count: number, reversals: boolean, rng: () => number): Orientation[] {
  return Array.from({ length: count }, () => {
    if (!reversals) return "upright";
    return rng() < 0.5 ? "upright" : "reversed";
  });
}

export function dealIds(cardIds: readonly string[], count: number, rng: () => number): string[] {
  return shuffle(cardIds, rng).slice(0, count);
}

export function fanIds(cardIds: readonly string[], rng: () => number): string[] {
  return shuffle(cardIds, rng).slice(0, 12);
}
