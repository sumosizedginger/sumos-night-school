import { TarotCard } from "@/components/card-face";
import type { Card } from "@/content/types";

const MARKS: Record<string, { x: string; y: string; label: string }[]> = {
  "major-00": [
    { x: "22%", y: "70%", label: "The cliff, both boots still on the rock" },
    { x: "58%", y: "28%", label: "The bundle on the staff" },
    { x: "73%", y: "76%", label: "The white dog at her heel" },
  ],
  "major-08": [
    { x: "48%", y: "38%", label: "The hand on the lion's muzzle" },
    { x: "55%", y: "16%", label: "The gold loop in her hair" },
    { x: "42%", y: "84%", label: "Flowers at her feet" },
  ],
};

export function CardCompare({ left, right, note }: { left: Card; right: Card; note: string }) {
  return (
    <section className="compare-sheet">
      <h2 className="font-serif text-2xl">Set them beside each other</h2>
      <p className="mt-2 max-w-2xl text-muted">{note}</p>
      <div className="compare-pair">
        {[left, right].map((card) => (
          <figure key={card.id} className="compare-plate">
            <div className="compare-frame">
              <TarotCard card={card} size="library" caption={false} />
              {(MARKS[card.id] ?? []).map((mark) => (
                <span key={mark.label} className="brass-mark" style={{ left: mark.x, top: mark.y }}>
                  <span className="brass-corners" aria-hidden="true" />
                  <span className="brass-note">{mark.label}</span>
                </span>
              ))}
            </div>
            <figcaption className="seat-label">{card.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
