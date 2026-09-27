import { useEffect, useState } from "react";
import type { Card, Orientation } from "@/content/types";

export type CardSize = "reading" | "library" | "compact";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function roman(index: number): string {
  return ROMAN[index] ?? String(index + 1);
}

export function CardBackArt() {
  return (
    <svg viewBox="0 0 200 340" className="h-full w-full" aria-hidden="true">
      <rect width="200" height="340" fill="#120f0c" />
      <rect x="10" y="10" width="180" height="320" fill="none" stroke="#8c6a3a" strokeWidth="1.2" />
      <rect x="16" y="16" width="168" height="308" fill="none" stroke="#d7bc8a" strokeWidth="0.4" opacity="0.7" />
      <circle cx="100" cy="168" r="58" fill="none" stroke="#b08948" strokeWidth="0.7" />
      <circle cx="100" cy="168" r="40" fill="none" stroke="#d7bc8a" strokeWidth="0.45" />
      <path d="M100 118c18 10 28 26 28 50s-10 40-28 50c-18-10-28-26-28-50s10-40 28-50z" fill="none" stroke="#d7bc8a" strokeWidth="0.6" />
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const x1 = 100 + Math.cos(angle) * 64;
        const y1 = 168 + Math.sin(angle) * 64;
        const x2 = 100 + Math.cos(angle) * 78;
        const y2 = 168 + Math.sin(angle) * 78;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#b08948" strokeWidth="0.5" />;
      })}
      <path d="M78 168a22 22 0 1 1 22-22" fill="none" stroke="#d7bc8a" strokeWidth="0.7" />
      <circle cx="100" cy="168" r="3" fill="#d7bc8a" />
      {[
        [28, 36],
        [172, 36],
        [28, 304],
        [172, 304],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="#b08948" fill="none" strokeWidth="0.6">
          <path d={`M${x} ${y}c8 6 8 14 0 20M${x} ${y}c-8 6-8 14 0 20`} />
          <circle cx={x} cy={y + 10} r="1.2" fill="#d7bc8a" stroke="none" />
        </g>
      ))}
      {[
        [46, 70],
        [154, 70],
        [46, 266],
        [154, 266],
        [100, 48],
        [100, 292],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#d7bc8a" opacity="0.8" />
      ))}
    </svg>
  );
}

export function TarotCard({
  card,
  orientation = "upright",
  face = "front",
  reveal = false,
  highlighted = false,
  halo = false,
  size = "reading",
  caption = true,
}: {
  card?: Card;
  orientation?: Orientation;
  face?: "front" | "back";
  reveal?: boolean;
  highlighted?: boolean;
  halo?: boolean;
  size?: CardSize;
  caption?: boolean;
}) {
  const [broken, setBroken] = useState(false);
  const [settled, setSettled] = useState(face === "front" && !reveal);
  const turned = orientation === "reversed";
  const showArt = Boolean(card && card.picture === "done" && card.imageCues.length > 0 && !broken);

  useEffect(() => {
    if (face === "back") {
      setSettled(false);
      return;
    }
    if (!reveal) {
      setSettled(true);
      return;
    }
    setSettled(false);
    const id = requestAnimationFrame(() => setSettled(true));
    return () => cancelAnimationFrame(id);
  }, [face, reveal, card?.id]);

  const width = size === "library" || size === "compact" ? "w-full" : "mx-auto w-full max-w-[13rem]";
  const showHalo = Boolean(halo && card?.arcana === "major" && settled);

  return (
    <figure className={`${width} ${highlighted ? "card-lit" : ""} ${showHalo ? "card-halo" : ""}`}>
      <div className="card-scene">
        <div className={`card-turn ${settled ? "is-face" : ""}`}>
          <div className="card-side card-side-back">
            <CardBackArt />
          </div>
          <div className="card-side card-side-front">
            {card && showArt ? (
              <img
                src={`/cards/${card.id}.jpg`}
                alt={settled ? `${card.name}, ${orientation}` : ""}
                className={`h-full w-full object-cover ${turned ? "rotate-180" : ""}`}
                onError={() => setBroken(true)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                <p className="font-serif text-lg text-gold-2">{card?.name ?? "Card"}</p>
                <p className="text-sm text-muted">{card ? "Picture unfinished" : ""}</p>
              </div>
            )}
            <span className="card-sheen" />
          </div>
        </div>
      </div>
      {caption && card && face === "front" ? (
        <figcaption className="mt-3 text-center">
          <p className="font-serif text-lg text-paper">{card.name}</p>
          <p className="text-sm text-muted">{turned ? "Reversed" : "Upright"}</p>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function CardFace({
  card,
  orientation = "upright",
  reveal = false,
  compact = false,
  highlighted = false,
  halo = false,
}: {
  card: Card;
  orientation?: Orientation;
  reveal?: boolean;
  compact?: boolean;
  highlighted?: boolean;
  halo?: boolean;
}) {
  return (
    <TarotCard
      card={card}
      orientation={orientation}
      face="front"
      reveal={reveal}
      highlighted={highlighted}
      halo={halo}
      size={compact ? "compact" : "reading"}
    />
  );
}

export function CardBack({ label }: { label: string }) {
  return (
    <span className="relative block w-full">
      <span className="tarot-face block overflow-hidden rounded-card shadow-[var(--shadow-card)]">
        <CardBackArt />
      </span>
      <span className="mt-2 block text-center text-xs tracking-wide text-muted">{label}</span>
    </span>
  );
}
