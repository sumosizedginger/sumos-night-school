import { CARDS } from "@/content/cards";
import { LESSONS } from "@/content/lessons";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

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
  const suits = ["wands", "cups", "swords", "pentacles"] as const;

  return (
    <figure className="folio mx-auto mt-8 max-w-xl p-4">
      <figcaption className="px-2 pb-2 text-center font-serif text-xl text-paper">The instrument</figcaption>
      <svg viewBox="0 0 360 360" role="img" aria-label="Study progress as a brass instrument">
        <circle cx="180" cy="180" r="168" fill="none" stroke="#3a342a" strokeWidth="1" />
        <circle cx="180" cy="180" r="132" fill="none" stroke="#b08948" strokeWidth="0.6" />
        <circle cx="180" cy="180" r="78" fill="none" stroke="#3a342a" strokeWidth="0.8" />
        {majors.map((card, index) => {
          const angle = (index / majors.length) * Math.PI * 2 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 150;
          const y = 180 + Math.sin(angle) * 150;
          const lit = opened.has(card.id);
          return <circle key={card.id} cx={x} cy={y} r={lit ? 4.2 : 2.1} fill={lit ? "#d7bc8a" : "#3a342a"} />;
        })}
        {suits.map((suit, index) => {
          const cards = CARDS.filter((card) => card.suit === suit);
          const start = -Math.PI / 2 + (index * Math.PI) / 2;
          return cards.map((card, cardIndex) => {
            const angle = start + ((cardIndex + 0.5) / cards.length) * (Math.PI / 2);
            const x = 180 + Math.cos(angle) * 104;
            const y = 180 + Math.sin(angle) * 104;
            const lit = opened.has(card.id);
            return <circle key={card.id} cx={x} cy={y} r={lit ? 3.3 : 1.6} fill={lit ? "#b08948" : "#3a342a"} />;
          });
        })}
        {LESSONS.map((lesson, index) => {
          const angle = (index / LESSONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = 180 + Math.cos(angle) * 58;
          const y = 180 + Math.sin(angle) * 58;
          const done = lessons.has(lesson.id);
          return (
            <g key={lesson.id}>
              <circle cx={x} cy={y} r="9" fill={done ? "#d7bc8a" : "none"} stroke="#b08948" strokeWidth="0.8" />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="7" fill={done ? "#12110e" : "#a89880"}>
                {ROMAN[index]}
              </text>
            </g>
          );
        })}
        <text x="180" y="184" textAnchor="middle" fontSize="11" fill="#e7dcc8">
          {lessons.size}/9
        </text>
      </svg>
      <p className="px-3 pb-2 text-center text-sm text-muted">
        Outer marks are the majors. The four arcs are the suits. Brass numerals are lessons. Marks light when you open a card or finish a lesson.
      </p>
    </figure>
  );
}
