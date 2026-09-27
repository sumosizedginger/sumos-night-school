import { useEffect, useState } from "react";
import { CardBackArt, roman } from "@/components/card-face";

function useWidth() {
  const [width, setWidth] = useState(1280);
  useEffect(() => {
    const apply = () => setWidth(window.innerWidth);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);
  return width;
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
  const width = useWidth();
  const cardW = width < 420 ? 62 : width < 800 ? 88 : 128;
  const step = width < 420 ? 26 : width < 800 ? 34 : 48;
  const turn = width < 420 ? 5.4 : 6.6;
  const mid = (ids.length - 1) / 2;
  const hotId = hot === null ? null : ids[hot];
  const hotOrder = hotId ? picked.indexOf(hotId) : -1;
  const status =
    hot === null
      ? "The deck is in the hand. Take a card."
      : hotOrder >= 0
        ? `${roman(hotOrder)}. ${seatTitles[hotOrder] ?? "Chosen"}`
        : `Card ${hot + 1}, face down`;

  return (
    <div className="fan-block">
      <p className="fan-status" aria-live="polite">
        {status}
      </p>
      <div className="fan-hand" style={{ height: cardW * 1.55 }}>
        {ids.map((id, index) => {
          const order = picked.indexOf(id);
          const offset = index - mid;
          const rotate = offset * turn;
          const x = offset * step;
          const drop = Math.abs(offset) * (width < 420 ? 3 : 5);
          return (
            <div
              key={id}
              className={`fan-visual ${hot === index ? "is-hot" : ""} ${order >= 0 ? "is-chosen" : ""}`}
              style={{
                width: cardW,
                marginLeft: -cardW / 2,
                transform: `translateX(${x}px) translateY(${drop}px) rotate(${rotate}deg)`,
                zIndex: hot === index ? 20 : 8 + index,
              }}
              aria-hidden="true"
            >
              <span className="fan-lift">
                <span className="fan-plate">
                  <CardBackArt />
                  {order >= 0 ? <span className="fan-mark">{roman(order)}</span> : null}
                </span>
              </span>
            </div>
          );
        })}
        <div className="fan-hits" style={{ gap: 0 }}>
          {ids.map((id, index) => {
            const order = picked.indexOf(id);
            const label =
              order >= 0
                ? `${roman(order)}. ${seatTitles[order] ?? "Chosen"}, still face down`
                : `Card ${index + 1}, face down`;
            return (
              <button
                key={id}
                type="button"
                className="fan-hit"
                style={{ width: step }}
                aria-pressed={order >= 0}
                aria-label={label}
                onMouseEnter={() => setHot(index)}
                onFocus={() => setHot(index)}
                onBlur={() => setHot((current) => (current === index ? null : current))}
                onClick={() => onToggle(id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
