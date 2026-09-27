import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CardFace } from "@/components/card-face";
import { ArtLoupe } from "@/components/loupe";
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
      <Link to="/library" className="back-leaf">Library</Link>
      <article className="bifolio">
        <div className="bifolio-plate">
          {card.picture === "done" ? (
            <ArtLoupe src={`/cards/${card.id}.jpg`} alt={`${card.name}, upright`} />
          ) : (
            <CardFace card={card} caption={false} />
          )}
          <p className="seat-label">{card.name}</p>
          <p className="seat-orient">Upright on the plate. Reversed turns the same picture.</p>
        </div>
        <div className="bifolio-leaf">
          <p className="leaf-kicker">{card.arcana === "major" ? "Major Arcana" : card.suit}</p>
          <h1 className="font-serif text-4xl">{card.name}</h1>
          <p className="leaf-keys">{card.keywords.join(" · ")}</p>
          <p className="drop-cap">{card.teachingLine}</p>
          <div className="leaf-columns">
            <section>
              <h2 className="font-serif text-2xl">Upright</h2>
              <span className="gilt-rule mt-3 w-24" />
              <p className="mt-4">{card.upright.core}</p>
              <p className="mt-3">{card.upright.gift}</p>
              <p className="mt-3">{card.upright.cost}</p>
            </section>
            <section>
              <h2 className="font-serif text-2xl">Reversed</h2>
              <span className="gilt-rule mt-3 w-24" />
              <p className="mt-4 text-sm text-muted">Tilt: {TILT_PLAIN[card.reversed.tilt]}</p>
              <p className="mt-3">{card.reversed.note}</p>
            </section>
          </div>
          <h2 className="mt-8 font-serif text-2xl">In the picture</h2>
          {card.picture === "done" && card.imageCues.length ? (
            <ul className="margin-notes">
              {card.imageCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">Picture unfinished. Nothing is described until the picture exists.</p>
          )}
        </div>
      </article>
    </Shell>
  );
}
