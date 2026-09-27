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
            halo={seat.reveal || lit}
            size="reading"
          />
        ) : (
          <div className="seat-plate">
            <span className="seat-mark">
              <svg className="seat-ring" viewBox="0 0 80 80" aria-hidden="true">
                <circle cx="40" cy="40" r="31" fill="none" stroke="#b08948" strokeWidth="0.7" />
                <circle cx="40" cy="40" r="24" fill="none" stroke="#d7bc8a" strokeWidth="0.4" />
                <circle cx="40" cy="40" r="1.4" fill="#d7bc8a" />
              </svg>
              <span className="roman">{roman(index)}</span>
            </span>
            <span className="seat-title">{seat.title}</span>
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
          </div>
        );
      })}
    </div>
  );
}
