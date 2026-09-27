import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CardFace } from "@/components/card-face";
import { Shell } from "@/components/shell";
import { CARDS } from "@/content/cards";
import type { Suit } from "@/content/types";

export const Route = createFileRoute("/library")({ component: Library });

const FILTERS = ["all", "majors", "wands", "cups", "swords", "pentacles", "courts"] as const;

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

  return (
    <Shell>
      <h1 className="font-serif text-4xl">Library</h1>
      <p className="mt-3 max-w-xl text-muted">The cabinet. Every card in the deck, filed by suit.</p>
      <label className="mt-6 block text-sm text-muted">
        Search by name
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-2 block w-full max-w-md border border-line bg-panel px-3 py-3 text-paper"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Filter the cabinet">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={filter === item}
            onClick={() => setFilter(item)}
            className={`min-h-11 border-b px-3 text-sm capitalize ${filter === item ? "border-gold-2 text-gold-2" : "border-transparent text-muted"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{cards.length} cards</p>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.id}>
            <Link to="/card/$cardId" params={{ cardId: card.id }} className="lift-quiet block">
              <CardFace card={card} compact />
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
