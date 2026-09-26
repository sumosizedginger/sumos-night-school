export type SpreadId = "daily" | "three" | "between" | "decision";

export type Position = {
  id: string;
  title: string;
  job: string;
};

export type Spread = {
  id: SpreadId;
  name: string;
  blurb: string;
  positions: Position[];
};

export const SPREADS: Spread[] = [
  {
    id: "daily",
    name: "Daily card",
    blurb: "What is asking to be noticed.",
    positions: [
      { id: "attention", title: "Attention", job: "what is asking to be noticed" },
    ],
  },
  {
    id: "three",
    name: "Three cards",
    blurb: "What is going on, what is caught, and a next step.",
    positions: [
      { id: "situation", title: "Situation", job: "what is already going on" },
      { id: "friction", title: "Friction", job: "what is caught" },
      { id: "way", title: "A way through", job: "a next step, not a total fix" },
    ],
  },
  {
    id: "between",
    name: "Between two",
    blurb: "Your side, your picture of them, and the space between.",
    positions: [
      { id: "you", title: "You", job: "your side of this" },
      { id: "them", title: "Them", job: "your picture of the other person, not their mind" },
      { id: "between", title: "The space between", job: "the relationship, not a verdict" },
    ],
  },
  {
    id: "decision",
    name: "Decision",
    blurb: "Two paths, and the thing you are not looking at.",
    positions: [
      { id: "path-a", title: "Path A", job: "the first option as it stands" },
      { id: "path-b", title: "Path B", job: "the second option as it stands" },
      { id: "unseen", title: "What you are not looking at", job: "a cost, fear, or fact being skipped" },
    ],
  },
];

export function getSpread(id: SpreadId): Spread {
  const spread = SPREADS.find((item) => item.id === id);
  if (!spread) throw new Error(`Unknown spread ${id}`);
  return spread;
}
