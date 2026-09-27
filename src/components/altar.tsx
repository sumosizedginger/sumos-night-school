import { roman, TarotCard } from "@/components/card-face";
import type { SpreadId } from "@/content/spreads";
import type { Card, Orientation } from "@/content/types";

export type AltarSeat = {
  positionId: string;
  title: string;
  card?: Card;
  orientation?: Orientation;
  reveal?: boolean;
};

export function Altar({
  spreadId,
  seats,
  highlightIds = [],
  selectedId,
  onSelect,
}: {
  spreadId: SpreadId;
  seats: AltarSeat[];
  highlightIds?: string[];
  selectedId?: string | null;
  onSelect?: (cardId: string) => void;
}) {
  return (
    <div className="table-plane">
      <div className={`altar altar-${spreadId}`} aria-label="Reading altar">
        {seats.map((seat, index) => {
          const lit = Boolean(seat.card && (highlightIds.includes(seat.card.id) || selectedId === seat.card.id));
          const body = seat.card ? (
            <TarotCard
              card={seat.card}
              orientation={seat.orientation}
              face="front"
              reveal={seat.reveal}
              highlighted={lit}
              halo={Boolean(seat.reveal)}
              size="reading"
              caption={false}
            />
          ) : (
            <div className="seat-plate">
              <span className="seat-mark">
                <svg className="seat-ring" viewBox="0 0 80 80" aria-hidden="true">
                  <circle cx="40" cy="40" r="31" fill="none" stroke="#b08948" strokeWidth="0.6" />
                  <circle cx="40" cy="40" r="26" fill="none" stroke="#d7bc8a" strokeWidth="0.35" />
                  <circle cx="40" cy="40" r="1.2" fill="#d7bc8a" />
                </svg>
                <span className="roman">{roman(index)}</span>
              </span>
            </div>
          );
          return (
            <div key={seat.positionId} className="altar-seat">
              {seat.card && onSelect ? (
                <button
                  type="button"
                  className="w-full text-left"
                  aria-pressed={selectedId === seat.card.id}
                  onClick={() => onSelect(seat.card!.id)}
                >
                  {body}
                </button>
              ) : (
                body
              )}
              <p className="seat-label">{seat.title}</p>
              {seat.card ? (
                <p className="seat-orient">
                  {seat.card.name}
                  <span>{seat.orientation === "reversed" ? "Reversed" : "Upright"}</span>
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
