import { CARDS } from "@/content/cards";
import { LESSONS } from "@/content/lessons";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];
const SUITS = [
  { id: "wands", label: "Wands" },
  { id: "cups", label: "Cups" },
  { id: "swords", label: "Swords" },
  { id: "pentacles", label: "Pentacles" },
] as const;

export function Constellation({
  cardsOpened,
  lessonsCompleted,
}: {
  cardsOpened: string[];
  lessonsCompleted: string[];
}) {
  const opened = new Set(cardsOpened);
  const lessons = new Set(lessonsCompleted);
  const majors = CARDS.filter((card) => card.arcana === "major");
  const ticks = Array.from({ length: 72 }, (_, index) => {
    const angle = (index / 72) * Math.PI * 2;
    const long = index % 6 === 0;
    const inner = long ? 158 : 162;
    return {
      x1: 180 + Math.cos(angle) * inner,
      y1: 180 + Math.sin(angle) * inner,
      x2: 180 + Math.cos(angle) * 170,
      y2: 180 + Math.sin(angle) * 170,
      long,
    };
  });

  return (
    <figure className="instrument">
      <figcaption>The instrument</figcaption>
      <svg viewBox="0 0 360 360" role="img" aria-label="A brass instrument. Majors on the outer ring, suits on the four arcs, lessons at the center.">
        <circle cx="180" cy="180" r="172" fill="#14110e" stroke="#6d5430" strokeWidth="1.2" />
        <circle cx="180" cy="180" r="166" fill="none" stroke="#d7bc8a" strokeWidth="0.4" />
        <circle cx="180" cy="180" r="128" fill="none" stroke="#8c6a3a" strokeWidth="0.7" />
        <circle cx="180" cy="180" r="86" fill="none" stroke="#3a342a" strokeWidth="0.8" />
        <circle cx="180" cy="180" r="36" fill="none" stroke="#8c6a3a" strokeWidth="0.6" />
        {ticks.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.long ? "#d7bc8a" : "#6d5430"}
            strokeWidth={tick.long ? 0.8 : 0.4}
          />
        ))}
        {majors.map((card, index) => {
          const angle = (index / majors.length) * Math.PI * 2 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 148;
          const y = 180 + Math.sin(angle) * 148;
          const lit = opened.has(card.id);
          return <circle key={card.id} cx={x} cy={y} r={lit ? 3.4 : 1.7} fill={lit ? "#d7bc8a" : "#3a342a"} />;
        })}
        {SUITS.map((suit, index) => {
          const cards = CARDS.filter((card) => card.suit === suit.id);
          const start = -Math.PI / 2 + (index * Math.PI) / 2;
          const mid = start + Math.PI / 4;
          const labelX = 180 + Math.cos(mid) * 116;
          const labelY = 180 + Math.sin(mid) * 116;
          return (
            <g key={suit.id}>
              <text x={labelX} y={labelY} textAnchor="middle" fontSize="8" fill="#a89880" fontFamily="Palatino, serif">
                {suit.label}
              </text>
              {cards.map((card, cardIndex) => {
                const angle = start + ((cardIndex + 0.5) / cards.length) * (Math.PI / 2);
                const x = 180 + Math.cos(angle) * 100;
                const y = 180 + Math.sin(angle) * 100;
                const lit = opened.has(card.id);
                return <circle key={card.id} cx={x} cy={y} r={lit ? 2.6 : 1.3} fill={lit ? "#b08948" : "#3a342a"} />;
              })}
            </g>
          );
        })}
        {LESSONS.map((lesson, index) => {
          const angle = (index / LESSONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 58;
          const y = 180 + Math.sin(angle) * 58;
          const done = lessons.has(lesson.id);
          return (
            <g key={lesson.id}>
              <circle cx={x} cy={y} r="10" fill={done ? "#d7bc8a" : "#14110e"} stroke="#b08948" strokeWidth="0.7" />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill={done ? "#12110e" : "#e7dcc8"}>
                {ROMAN[index]}
              </text>
            </g>
          );
        })}
        <circle cx="180" cy="180" r="2.2" fill="#d7bc8a" />
      </svg>
    </figure>
  );
}
