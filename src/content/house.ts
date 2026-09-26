import type { Suit, Tilt } from "./types.ts";

export const SUIT_CONCERN: Record<Suit, string> = {
  wands: "will, work, and the urge to move",
  cups: "feeling, trust, and bonds",
  swords: "thought, conflict, and the words that cut",
  pentacles: "the body, money, and the material facts of a life",
};

export const SUIT_ELEMENT: Record<Suit, string> = {
  wands: "fire",
  cups: "water",
  swords: "air",
  pentacles: "earth",
};

export const NUMBER_PLOT: Record<number, string> = {
  1: "spark",
  2: "tension",
  3: "growth",
  4: "stability",
  5: "trouble",
  6: "passage",
  7: "test",
  8: "movement",
  9: "strain",
  10: "completion",
};

export const RANK_WORD: Record<number, string> = {
  1: "Ace",
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
};

export const COURT_MODE = {
  page: "learning",
  knight: "pursuing",
  queen: "inhabiting",
  king: "directing",
} as const;

export const TILT_PLAIN: Record<Tilt, string> = {
  blocked: "blocked",
  inward: "turned inward",
  delayed: "delayed",
  excess: "overdone",
};

export function suitLabel(suit: Suit): string {
  return suit.charAt(0).toUpperCase() + suit.slice(1);
}
