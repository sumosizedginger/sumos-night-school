import type { Card } from "../types.ts";
import { CUPS } from "./cups.ts";
import { MAJORS } from "./majors.ts";
import { PENTACLES } from "./pentacles.ts";
import { SWORDS } from "./swords.ts";
import { WANDS } from "./wands.ts";

export const CORPUS_VERSION = 1;

export const CARDS: Card[] = [...MAJORS, ...WANDS, ...CUPS, ...SWORDS, ...PENTACLES];

export const CARD_BY_ID: Record<string, Card> = Object.fromEntries(CARDS.map((card) => [card.id, card]));

export function getCard(id: string): Card {
  const card = CARD_BY_ID[id];
  if (!card) throw new Error(`Unknown card ${id}`);
  return card;
}
