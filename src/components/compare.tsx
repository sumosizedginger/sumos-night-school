import { TarotCard } from "@/components/card-face";
import type { Card } from "@/content/types";

export function CardCompare({ left, right, note }: { left: Card; right: Card; note: string }) {
  return (
    <section className="folio mt-8 p-5">
      <h2 className="font-serif text-2xl">Set them beside each other</h2>
      <p className="mt-2 max-w-2xl text-muted">{note}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {[left, right].map((card) => (
          <div key={card.id}>
            <TarotCard card={card} size="reading" />
            <ul className="mt-3 space-y-2 text-sm text-paper">
              {card.imageCues.map((cue) => (
                <li key={cue}>{cue}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
