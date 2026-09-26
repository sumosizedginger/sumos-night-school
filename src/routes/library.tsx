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
      <label className="mt-6 block text-sm text-muted">
        Search by name
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-2 w-full max-w-md border border-line bg-panel px-3 py-3 text-paper"
        />
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`min-h-11 px-3 text-sm capitalize ${filter === item ? "text-gold-2" : "text-muted"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">{cards.length} cards</p>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.id}>
            <Link to="/card/$cardId" params={{ cardId: card.id }} className="block">
              <CardFace card={card} compact />
            </Link>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
