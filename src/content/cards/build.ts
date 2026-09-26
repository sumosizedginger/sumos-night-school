import type { Arcana, Card, PictureState, Suit, Tilt } from "../types.ts";

export function makeCard(input: {
  id: string;
  name: string;
  arcana: Arcana;
  suit: Suit | null;
  rank: Card["rank"];
  keywords: string[];
  core: string;
  gift: string;
  cost: string;
  tilt: Tilt;
  note: string;
  motifs: string[];
  teachingLine: string;
  imageCues?: string[];
  picture?: PictureState;
}): Card {
  const imageCues = input.imageCues ?? [];
  const picture = input.picture ?? (imageCues.length ? "done" : "unfinished");
  return {
    id: input.id,
    name: input.name,
    arcana: input.arcana,
    suit: input.suit,
    rank: input.rank,
    keywords: input.keywords,
    upright: { core: input.core, gift: input.gift, cost: input.cost },
    reversed: { tilt: input.tilt, note: input.note },
    motifs: input.motifs,
    imageCues,
    teachingLine: input.teachingLine,
    picture,
  };
}
