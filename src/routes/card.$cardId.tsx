import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CardFace } from "@/components/card-face";
import { Shell } from "@/components/shell";
import { CARD_BY_ID } from "@/content/cards";
import { TILT_PLAIN } from "@/content/house";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/card/$cardId")({ component: CardPage });

function CardPage() {
  const { cardId } = Route.useParams();
  const card = CARD_BY_ID[cardId];
  const { commit } = useVault();

  useEffect(() => {
    if (!card) return;
    commit((current) => ({
      ...current,
      progress: {
        ...current.progress,
        cardsOpened: current.progress.cardsOpened.includes(card.id)
          ? current.progress.cardsOpened
          : [...current.progress.cardsOpened, card.id],
      },
    }));
  }, [card, commit]);

  if (!card) {
    return (
      <Shell>
        <p>That card is not in this deck.</p>
      </Shell>
    );
  }

  return (
    <Shell>
      <Link to="/library" className="text-sm text-moon">Library</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <CardFace card={card} />
        <article className="max-w-2xl">
          <h1 className="font-serif text-4xl">{card.name}</h1>
          <p className="mt-3 text-gold">{card.keywords.join(" · ")}</p>
          <p className="mt-6">{card.teachingLine}</p>
          <h2 className="mt-8 font-serif text-2xl">Upright</h2>
          <p className="mt-3">{card.upright.core}</p>
          <p className="mt-3">{card.upright.gift}</p>
          <p className="mt-3">{card.upright.cost}</p>
          <h2 className="mt-8 font-serif text-2xl">Reversed</h2>
          <p className="mt-3 text-sm text-gold">Tilt: {TILT_PLAIN[card.reversed.tilt]}</p>
          <p className="mt-3">{card.reversed.note}</p>
          <h2 className="mt-8 font-serif text-2xl">In the picture</h2>
          {card.picture === "done" && card.imageCues.length ? (
            <ul className="mt-3 space-y-2">
              {card.imageCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">Picture unfinished. Nothing is described until the picture exists.</p>
          )}
        </article>
      </div>
    </Shell>
  );
}
