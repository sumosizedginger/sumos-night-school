import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CardFace } from "@/components/card-face";
import { Shell } from "@/components/shell";
import { CARDS } from "@/content/cards";
import type { Card, Suit } from "@/content/types";

export const Route = createFileRoute("/library")({ component: Library });

const FILTERS = ["all", "majors", "wands", "cups", "swords", "pentacles", "courts"] as const;
const SUITS: { id: Suit; title: string }[] = [
  { id: "wands", title: "Wands" },
  { id: "cups", title: "Cups" },
  { id: "swords", title: "Swords" },
  { id: "pentacles", title: "Pentacles" },
];

function shelvesFor(cards: Card[], filter: (typeof FILTERS)[number]) {
  if (filter === "courts") return [{ id: "courts", title: "Courts", cards }];
  if (filter === "majors") return [{ id: "majors", title: "Majors", cards }];
  if (filter !== "all") {
    const suit = SUITS.find((item) => item.id === filter);
    return [{ id: filter, title: suit?.title ?? filter, cards }];
  }
  const groups = [
    { id: "majors", title: "Majors", cards: cards.filter((card) => card.arcana === "major") },
    ...SUITS.map((suit) => ({
      id: suit.id,
      title: suit.title,
      cards: cards.filter((card) => card.suit === suit.id),
    })),
  ];
  return groups.filter((group) => group.cards.length > 0);
}

function Library() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [query, setQuery] = useState("");
  const cards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CARDS.filter((card) => {
      if (filter === "majors" && card.arcana !== "major") return false;
      if (filter === "courts" && typeof card.rank !== "string") return false;
      if (filter !== "all" && filter !== "majors" && filter !== "courts" && card.suit !== (filter as Suit)) return false;
      if (q && !card.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [filter, query]);
  const shelves = shelvesFor(cards, filter);

  return (
    <Shell>
      <h1 className="font-serif text-4xl">Library</h1>
      <p className="mt-3 max-w-xl text-muted">Filed by suit. Courts stay in their suit.</p>
      <label className="slip">
        <span>Find a name</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="drawer-tabs" role="tablist" aria-label="Filter the cabinet">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={filter === item}
            onClick={() => setFilter(item)}
            className={filter === item ? "is-on" : ""}
          >
            {item}
          </button>
        ))}
      </div>
      {shelves.map((shelf) => (
        <section key={shelf.id} className="shelf" aria-label={shelf.title}>
          <h2 className="shelf-spine">{shelf.title}</h2>
          <ul className="shelf-row">
            {shelf.cards.map((card) => (
              <li key={card.id}>
                <Link to="/card/$cardId" params={{ cardId: card.id }} className="shelf-card">
                  <CardFace card={card} compact caption={false} />
                  <span className="shelf-name">{card.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </Shell>
  );
}
