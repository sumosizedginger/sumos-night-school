export type Suit = "wands" | "cups" | "swords" | "pentacles";
export type Tilt = "blocked" | "inward" | "delayed" | "excess";
export type Arcana = "major" | "minor";
export type PictureState = "done" | "unfinished";
export type Orientation = "upright" | "reversed";

export type Card = {
  id: string;
  name: string;
  arcana: Arcana;
  suit: Suit | null;
  rank: number | "page" | "knight" | "queen" | "king";
  keywords: string[];
  upright: { core: string; gift: string; cost: string };
  reversed: { tilt: Tilt; note: string };
  motifs: string[];
  imageCues: string[];
  teachingLine: string;
  picture: PictureState;
};
