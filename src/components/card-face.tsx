import { useState } from "react";
import type { Card, Orientation } from "@/content/types";

export function CardFace({
  card,
  orientation = "upright",
  reveal = false,
  compact = false,
}: {
  card: Card;
  orientation?: Orientation;
  reveal?: boolean;
  compact?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const showArt = card.picture === "done" && card.imageCues.length > 0 && !broken;
  const turned = orientation === "reversed";

  return (
    <figure className={compact ? "w-full" : "mx-auto w-full max-w-xs"}>
      <div className={`tarot-face overflow-hidden rounded-card border border-line bg-panel ${reveal ? "reveal-card" : ""}`}>
        {showArt ? (
          <img
            src={`/cards/${card.id}.jpg`}
            alt={`${card.name}, ${orientation}`}
            className={`h-full w-full object-cover ${turned ? "rotate-180" : ""}`}
            onError={() => setBroken(true)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="font-serif text-lg text-gold-2">{card.name}</p>
            <p className="text-sm text-muted">Picture unfinished</p>
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-center">
        <p className="font-serif text-lg text-paper">{card.name}</p>
        <p className="text-sm text-gold">{turned ? "Reversed" : "Upright"}</p>
      </figcaption>
    </figure>
  );
}

export function CardBack({ label }: { label: string }) {
  return (
    <span className="tarot-face block w-full rounded-card border border-gold/50 bg-panel p-3">
      <span className="flex h-full items-end border border-gold/30 p-3">
        <span className="text-xs tracking-wide text-gold">{label}</span>
      </span>
    </span>
  );
}
