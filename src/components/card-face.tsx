import { useEffect, useState } from "react";
import type { Card, Orientation } from "@/content/types";

export type CardSize = "reading" | "library" | "compact";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

export function roman(index: number): string {
  return ROMAN[index] ?? String(index + 1);
}

export function CardBackArt() {
  const hatch = Array.from({ length: 42 }, (_, i) => {
    const y = 22 + i * 7.4;
    return <line key={`h-${i}`} x1="22" y1={y} x2="178" y2={y - 14} stroke="#7a5a32" strokeWidth="0.35" opacity="0.45" />;
  });
  const beads = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * Math.PI * 2;
    const x = 100 + Math.cos(angle) * 46;
    const y = 168 + Math.sin(angle) * 46;
    return <circle key={`b-${i}`} cx={x} cy={y} r={i % 4 === 0 ? 0.9 : 0.45} fill="#d7bc8a" opacity="0.8" />;
  });
  const rays = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const x1 = 100 + Math.cos(angle) * 18;
    const y1 = 168 + Math.sin(angle) * 18;
    const x2 = 100 + Math.cos(angle) * 34;
    const y2 = 168 + Math.sin(angle) * 34;
    return <line key={`r-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d7bc8a" strokeWidth="0.4" />;
  });

  return (
    <svg viewBox="0 0 200 340" className="h-full w-full" aria-hidden="true">
      <rect width="200" height="340" fill="#100e0c" />
      <rect x="8" y="8" width="184" height="324" fill="#16130f" stroke="#8c6a3a" strokeWidth="1.4" />
      <rect x="14" y="14" width="172" height="312" fill="none" stroke="#d7bc8a" strokeWidth="0.45" />
      <rect x="18" y="18" width="164" height="304" fill="none" stroke="#6d5430" strokeWidth="0.6" />
      {hatch}
      <rect x="22" y="22" width="156" height="296" fill="#120f0c" opacity="0.55" />
      <rect x="28" y="28" width="144" height="284" fill="none" stroke="#b08948" strokeWidth="0.5" />
      {beads}
      <circle cx="100" cy="168" r="52" fill="none" stroke="#d7bc8a" strokeWidth="0.7" />
      <circle cx="100" cy="168" r="38" fill="none" stroke="#8c6a3a" strokeWidth="0.5" />
      {rays}
      <path d="M100 134c22 8 30 22 30 34s-8 26-30 34c-22-8-30-22-30-34s8-26 30-34z" fill="none" stroke="#d7bc8a" strokeWidth="0.7" />
      <path d="M82 168c0-14 8-22 18-22" fill="none" stroke="#e7dcc8" strokeWidth="0.7" />
      <circle cx="100" cy="168" r="2.2" fill="#d7bc8a" />
      <path d="M70 70h18M70 70v18M130 70h-18M130 70v18M70 266h18M70 284v-18M130 284h-18M130 284v-18" stroke="#b08948" strokeWidth="0.7" fill="none" />
      {[
        [36, 44],
        [164, 44],
        [36, 292],
        [164, 292],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke="#d7bc8a" fill="none" strokeWidth="0.55">
          <path d={`M${x} ${y}c6 10 6 16 0 24M${x} ${y}c-6 10-6 16 0 24`} />
          <circle cx={x} cy={y + 12} r="1.1" fill="#d7bc8a" stroke="none" />
        </g>
      ))}
      <path d="M40 168h8M152 168h8M100 48v8M100 280v8" stroke="#d7bc8a" strokeWidth="0.6" />
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
  const [phase, setPhase] = useState<"down" | "turn" | "up">(face === "front" && !reveal ? "up" : "down");
  const turned = orientation === "reversed";
  const showArt = Boolean(card && card.picture === "done" && card.imageCues.length > 0 && !broken);

  useEffect(() => {
    if (face === "back") {
      setPhase("down");
      return;
    }
    if (!reveal) {
      setPhase("up");
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase("up");
      return;
    }
    setPhase("down");
    const start = window.setTimeout(() => setPhase("turn"), 80);
    const done = window.setTimeout(() => setPhase("up"), 1100);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(done);
    };
  }, [face, reveal, card?.id]);

  const width = size === "library" || size === "compact" ? "w-full" : "mx-auto w-full max-w-[13rem]";
  const showHalo = Boolean(halo && card?.arcana === "major" && phase === "up");

  return (
    <figure className={`${width} ${highlighted ? "card-lit" : ""} ${showHalo ? "card-halo" : ""}`}>
      <div className="card-scene">
        <div className={`card-turn is-${phase}`}>
          <div className="card-side card-side-back">
            <CardBackArt />
          </div>
          <div className="card-side card-side-front">
            {card && showArt ? (
              <img
                src={`/cards/${card.id}.jpg`}
                alt={phase === "up" ? `${card.name}, ${orientation}` : ""}
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
      {caption && card && face === "front" && phase === "up" ? (
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
  caption = true,
}: {
  card: Card;
  orientation?: Orientation;
  reveal?: boolean;
  compact?: boolean;
  highlighted?: boolean;
  halo?: boolean;
  caption?: boolean;
}) {
  return (
    <TarotCard
      card={card}
      orientation={orientation}
      face="front"
      reveal={reveal}
      highlighted={highlighted}
      halo={halo}
      caption={caption}
      size={compact ? "compact" : "reading"}
    />
  );
}
