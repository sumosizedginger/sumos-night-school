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
      <Link to="/library" className="text-sm text-moon">Library</Link>
      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[18rem_1fr]">
        <div>
          {card.picture === "done" ? (
            <ArtLoupe src={`/cards/${card.id}.jpg`} alt={`${card.name}, upright`} />
          ) : (
            <CardFace card={card} />
          )}
          <p className="mt-3 text-center font-serif text-lg">{card.name}</p>
          <p className="text-center text-sm text-muted">Upright in the cabinet. Reversed turns the same picture.</p>
        </div>
        <article className="folio max-w-3xl p-6 sm:p-8">
          <p className="text-sm tracking-[0.18em] text-muted">{card.arcana === "major" ? "Major Arcana" : card.suit}</p>
          <h1 className="mt-2 font-serif text-4xl text-gold-2">{card.name}</h1>
          <p className="mt-3 text-muted">{card.keywords.join(" · ")}</p>
          <p className="drop-cap mt-6">{card.teachingLine}</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
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
