import { useEffect, useState } from "react";
import { CardBackArt, roman } from "@/components/card-face";

function useNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const apply = () => setNarrow(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);
  return narrow;
}

export function CardFan({
  ids,
  picked,
  seatTitles,
  onToggle,
}: {
  ids: string[];
  picked: string[];
  seatTitles: string[];
  onToggle: (id: string) => void;
}) {
  const [hot, setHot] = useState<number | null>(null);
  const narrow = useNarrow();
  const mid = (ids.length - 1) / 2;
  const hotId = hot === null ? null : ids[hot];
  const hotOrder = hotId ? picked.indexOf(hotId) : -1;
  const status =
    hot === null
      ? "Choose a card. A brass numeral marks each one you take. Faces stay hidden."
      : hotOrder >= 0
        ? `${roman(hotOrder)}. ${seatTitles[hotOrder] ?? "Chosen"}`
        : `Card ${hot + 1}, face down`;

  return (
    <div>
      <p className="mt-4 min-h-6 text-center text-sm text-gold-2" aria-live="polite">
        {status}
      </p>
      <div className={narrow ? "fan-grid" : "fan-row"} onMouseLeave={() => setHot(null)}>
        {ids.map((id, index) => {
          const order = picked.indexOf(id);
          const offset = index - mid;
          const rotate = narrow ? 0 : offset * 3.1;
          const label =
            order >= 0
              ? `${roman(order)}. ${seatTitles[order] ?? "Chosen"}, still face down`
              : `Card ${index + 1}, face down`;
          return (
            <button
              key={id}
              type="button"
              className="fan-card"
              style={
                narrow
                  ? undefined
                  : {
                      transform: `rotate(${rotate}deg)`,
                      zIndex: hot === index ? 40 : 8 + index,
                    }
              }
              aria-pressed={order >= 0}
              aria-label={label}
              onMouseEnter={() => setHot(index)}
              onFocus={() => setHot(index)}
              onBlur={() => setHot((current) => (current === index ? null : current))}
              onClick={() => onToggle(id)}
            >
              <span className="fan-lift">
                <span className="fan-plate">
                  <CardBackArt />
                  {order >= 0 ? <span className="fan-mark">{roman(order)}</span> : null}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
