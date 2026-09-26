import { COURT_MODE, NUMBER_PLOT, RANK_WORD, SUIT_CONCERN, TILT_PLAIN, suitLabel } from "../../content/house.ts";
import type { Spread } from "../../content/spreads.ts";
import type { Card, Orientation, Suit } from "../../content/types.ts";
import { classifyLens, pathLabels, type Lens } from "./lens.ts";

const COST_SEATS = new Set(["friction", "them", "unseen"]);

export const RULE_PLAIN: Record<string, string> = {
  "major-among-minors": "A major card is the louder voice beside the smaller cards.",
  "all-majors": "Every card is a major, so this is a chapter, not a mood.",
  "suit-reinforcement": "One suit shows up more than once, so its concern carries the spread.",
  "element-clash": "Two elements pull against each other.",
  "element-support": "Two elements lean the same way.",
  "repeated-rank": "A number or court rank is doubled.",
  "court-meets-pip": "A court card, a mode of a person, meets a situation.",
  "reversal-cluster": "More than one card is reversed: stalled or private, not a bad omen.",
};

export type TraceSeat = {
  positionId: string;
  cardId: string;
  orientation: Orientation;
  tilt: Card["reversed"]["tilt"] | null;
  facetsUsed: string[];
};

export type ReadingTrace = {
  corpusVersion: number;
  lens: Lens;
  lensMatch: string | null;
  seats: TraceSeat[];
  rulesFired: string[];
  rulesInProse: string[];
  themPerceptionNote: boolean;
};

export type ComposeResult = {
  paragraphs: string[];
  teaching: string[];
  trace: ReadingTrace;
  lens: Lens;
  displayTitles: string[];
};

type Rule = { id: string; reading: string; teaching: string };

function degloss(note: string): string {
  const text = note.replace(/^Reversed,\s*/i, "").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function seatBody(positionId: string, card: Card, orientation: Orientation): { text: string; facets: string[] } {
  if (orientation === "reversed") {
    return { text: degloss(card.reversed.note), facets: ["reversed.note"] };
  }
  if (COST_SEATS.has(positionId)) {
    return { text: `${card.upright.core} ${card.upright.cost}`, facets: ["upright.core", "upright.cost"] };
  }
  return { text: `${card.upright.core} ${card.upright.gift}`, facets: ["upright.core", "upright.gift"] };
}

function readingSeat(title: string, positionId: string, card: Card, orientation: Orientation): string {
  const body = seatBody(positionId, card, orientation).text;
  let fence = "";
  if (positionId === "them") fence = " This is the picture you have of them, not a report of their mind.";
  else if (positionId === "path-a" || positionId === "path-b") fence = " It does not pick a winner.";
  else if (positionId === "unseen") fence = " It is not a hidden right answer.";
  return `${title}. ${card.name}. ${body}${fence}`;
}

function opening(question: string, lens: Lens): string {
  if (lens === "unfocused") return "You did not name a question. Nothing below invents one.";
  return `You asked, “${question}”`;
}

function closing(spreadId: Spread["id"]): string {
  switch (spreadId) {
    case "daily":
      return "That is what is asking to be noticed. It is not a forecast.";
    case "three":
      return "What is already going on, what is caught, and a next step are all on the table. The step does not erase the rest.";
    case "between":
      return "That is your side, the picture you have of them, and the space between. It does not report their mind.";
    case "decision":
      return "Both options are described as they stand. The third card is what the choice is leaving out, not a winner.";
  }
}

function listNames(cards: Card[]): string {
  if (cards.length === 1) return cards[0]?.name ?? "";
  if (cards.length === 2) return `${cards[0]?.name} and ${cards[1]?.name}`;
  return `${cards.slice(0, -1).map((card) => card.name).join(", ")}, and ${cards.at(-1)?.name}`;
}

function suitKey(left: Card, right: Card): string | null {
  if (!left.suit || !right.suit) return null;
  return [left.suit, right.suit].sort().join("+");
}

function lensTeaching(question: string, lens: Lens, match: string | null): string {
  if (lens === "unfocused") {
    return "No question was given, so the lens is unfocused. The reading is not allowed to invent a topic, a date, or another person's mind. Teach this draw can still say what each card is doing. It cannot pretend you asked something.";
  }
  const heard =
    lens === "choice"
      ? "a choice: pressures compared, no winner named"
      : lens === "work"
        ? "work: effort, craft, money, or people trying to make something. Not financial advice"
        : lens === "love"
          ? "a bond: how you are meeting someone. Not their private thoughts"
          : lens === "inner"
            ? "an inner question, about your state, not a forecast of events"
            : "an open question. No listed keyword matched, so it was not forced into a narrower box";
  const from = match ? ` The word that set this was “${match}”.` : "";
  return `You asked, “${question}” This draw was heard as ${heard}.${from} The reading voice does not explain that classification. It answers the question.`;
}

function teachSeat(
  title: string,
  positionId: string,
  job: string,
  card: Card,
  orientation: Orientation,
): string[] {
  const used = seatBody(positionId, card, orientation);
  const usedPlain =
    orientation === "reversed"
      ? `the reversed tilt (${TILT_PLAIN[card.reversed.tilt]}), not a different card`
      : used.facets.includes("upright.cost")
        ? "the main meaning and the price of that energy. The usable side stayed in the glossary. The price is not a reversal"
        : "the main meaning and the usable side. The price stayed in the glossary";
  const picture = card.imageCues.length
    ? `In this picture, and only this picture: ${card.imageCues.join(" ")}`
    : "No picture lines are stored, so this lesson does not describe a picture.";
  return [
    `${title}. The job of this seat is ${job}. The reading names the seat and then does the job. It does not define the job.`,
    `${card.name}, ${orientation}. ${card.teachingLine}`,
    `Main meaning: ${card.upright.core} Usable side: ${card.upright.gift} Price of the same energy: ${card.upright.cost}`,
    orientation === "reversed"
      ? `Reversed, the tilt is ${TILT_PLAIN[card.reversed.tilt]}. ${card.reversed.note} The reading used ${usedPlain}.`
      : `Upright, so no tilt is applied. If it were reversed, the tilt would be ${TILT_PLAIN[card.reversed.tilt]}: ${card.reversed.note} The reading used ${usedPlain}.`,
    picture,
  ];
}

export function compose(input: {
  question: string;
  spread: Spread;
  seats: { card: Card; orientation: Orientation }[];
  corpusVersion: number;
}): ComposeResult {
  const classified = classifyLens(input.question);
  const labels = pathLabels(classified.question, classified.lens);
  const titles = input.spread.positions.map((position) => {
    if (position.id === "path-a") return labels.a;
    if (position.id === "path-b") return labels.b;
    return position.title;
  });

  const paragraphs: string[] = [opening(classified.question, classified.lens)];
  const teaching: string[] = [lensTeaching(classified.question, classified.lens, classified.match)];
  const traceSeats: TraceSeat[] = [];

  input.seats.forEach((seat, index) => {
    const position = input.spread.positions[index];
    const title = titles[index] ?? position?.title ?? "Seat";
    const positionId = position?.id ?? `seat-${index}`;
    const job = position?.job ?? "the seat it was given";
    const used = seatBody(positionId, seat.card, seat.orientation);
    paragraphs.push(readingSeat(title, positionId, seat.card, seat.orientation));
    teaching.push(...teachSeat(title, positionId, job, seat.card, seat.orientation));
    traceSeats.push({
      positionId,
      cardId: seat.card.id,
      orientation: seat.orientation,
      tilt: seat.orientation === "reversed" ? seat.card.reversed.tilt : null,
      facetsUsed: used.facets,
    });
  });

  const rules: Rule[] = [];
  if (input.seats.length > 1) {
    const cards = input.seats.map((seat) => seat.card);
    const majors = cards.filter((card) => card.arcana === "major");
    const minors = cards.filter((card) => card.arcana === "minor");
    if (majors.length === cards.length) {
      rules.push({
        id: "all-majors",
        reading: `${listNames(majors)} are large turns sitting together, not a passing mood.`,
        teaching:
          "Every card is a major. In the method, that is a chapter in a life, not a mood. The reading says they are large turns together. It does not stop to define a major.",
      });
    } else if (majors.length > 0 && minors.length > 0) {
      rules.push({
        id: "major-among-minors",
        reading: `${listNames(majors)} carries more of this than the smaller cards around it.`,
        teaching: `A major beside smaller cards is the louder voice. Here that is ${listNames(majors)}. The reading says it carries more of this. It does not give the rule a lecture.`,
      });
    }

    if (input.seats.length === 3) {
      const counts = new Map<Suit, number>();
      for (const card of cards) {
        if (!card.suit) continue;
        counts.set(card.suit, (counts.get(card.suit) ?? 0) + 1);
      }
      for (const [suit, count] of counts) {
        if (count < 2) continue;
        const lead = count === 3 ? "All three cards" : `${count} cards`;
        rules.push({
          id: "suit-reinforcement",
          reading: `${lead} keep coming back to ${SUIT_CONCERN[suit]}.`,
          teaching: `${lead} are ${suitLabel(suit)}. On a three-card spread, a repeated suit means that concern is carrying the reading: ${SUIT_CONCERN[suit]}. This is the Golden Dawn map this deck teaches, not a law of nature. The reading names the concern. It does not teach the map.`,
        });
      }
    }

    const clashes: string[] = [];
    const supports: string[] = [];
    const clashTeach: string[] = [];
    const supportTeach: string[] = [];
    for (let left = 0; left < cards.length; left += 1) {
      for (let right = left + 1; right < cards.length; right += 1) {
        const a = cards[left];
        const b = cards[right];
        if (!a || !b) continue;
        const key = suitKey(a, b);
        if (key === "cups+wands") {
          clashes.push(`${a.name} and ${b.name} are pulling this two ways at once.`);
          clashTeach.push(`${a.name} (Cups, water, feeling) and ${b.name} (Wands, fire, will) are the clash this deck teaches.`);
        }
        if (key === "pentacles+swords") {
          clashes.push(`${a.name} and ${b.name} are pulling this two ways at once.`);
          clashTeach.push(`${a.name} and ${b.name} clash as earth and air: material fact against thought.`);
        }
        if (key === "swords+wands") {
          supports.push(`${a.name} and ${b.name} are leaning the same way.`);
          supportTeach.push(`${a.name} and ${b.name} support each other as air and fire: thought and will.`);
        }
        if (key === "cups+pentacles") {
          supports.push(`${a.name} and ${b.name} are leaning the same way.`);
          supportTeach.push(`${a.name} and ${b.name} support each other as water and earth: feeling and material life.`);
        }
      }
    }
    if (clashes.length) {
      rules.push({
        id: "element-clash",
        reading: clashes.join(" "),
        teaching: `Element clash. ${clashTeach.join(" ")} The reading says they pull two ways. It does not name the elements.`,
      });
    }
    if (supports.length) {
      rules.push({
        id: "element-support",
        reading: supports.join(" "),
        teaching: `Element support. ${supportTeach.join(" ")} The reading says they lean the same way. It does not name the elements.`,
      });
    }

    const byRank = new Map<string, Card[]>();
    for (const card of minors) {
      const key = String(card.rank);
      byRank.set(key, [...(byRank.get(key) ?? []), card]);
    }
    const rankReading: string[] = [];
    const rankTeaching: string[] = [];
    for (const [key, group] of byRank) {
      if (group.length < 2) continue;
      const numeric = Number(key);
      if (Number.isInteger(numeric) && NUMBER_PLOT[numeric]) {
        rankReading.push(`The same pressure shows up twice, in ${listNames(group)}.`);
        rankTeaching.push(
          `${listNames(group)} share the ${RANK_WORD[numeric] ?? key}. On the number plot that beat is ${NUMBER_PLOT[numeric]}. The suit says what the beat is about.`,
        );
      } else if (key === "page" || key === "knight" || key === "queen" || key === "king") {
        rankReading.push(`The same way of meeting this shows up twice, in ${listNames(group)}.`);
        rankTeaching.push(`${listNames(group)} are both ${key}s. That mode is ${COURT_MODE[key]}. A doubled court is a doubled mode, not two people of a gender.`);
      }
    }
    if (rankReading.length) {
      rules.push({
        id: "repeated-rank",
        reading: rankReading.join(" "),
        teaching: rankTeaching.join(" "),
      });
    }

    const courts = minors.filter((card) => typeof card.rank === "string");
    const pips = minors.filter((card) => typeof card.rank === "number");
    if (courts.length && pips.length) {
      rules.push({
        id: "court-meets-pip",
        reading: `${listNames(courts)} is how a person is meeting what ${listNames(pips)} describes. Not a named stranger.`,
        teaching: `${listNames(courts)} is a court, a mode of a person: learning, pursuing, inhabiting, or directing. ${listNames(pips)} is a numbered card, a situation. A court meeting a pip is a mode meeting a situation. It is not “a woman is coming” and it is not a named individual. The reading says how a person is meeting the situation.`,
      });
    }

    const reversed = input.seats.filter((seat) => seat.orientation === "reversed").length;
    if (reversed >= 2) {
      rules.push({
        id: "reversal-cluster",
        reading: "More than one part of this is stalled or kept private. That is not a pile of bad omens.",
        teaching:
          "More than one card is reversed. Each reversal is one tilt: blocked, inward, delayed, or excess. Together they are stalled or private energy, not a curse and not Waite's harsher reversed meanings. The reading says stalled or private. It does not teach the four tilts.",
      });
    }
  } else {
    teaching.push("One card has no neighbor, so no relationship rule is applied. A daily card is attention, not a plot.");
  }

  const inReading = rules.slice(0, 2);
  if (inReading.length) paragraphs.push(inReading.map((rule) => rule.reading).join(" "));
  paragraphs.push(closing(input.spread.id));

  if (rules.length) {
    teaching.push(rules.map((rule) => rule.teaching).join(" "));
    const leftOut = rules.slice(2);
    if (leftOut.length) {
      teaching.push(
        `The reading keeps at most two of those patterns, so it does not become a list of rules. Left in this class and out of the reading: ${leftOut.map((rule) => RULE_PLAIN[rule.id] ?? rule.id).join(" ")}`,
      );
    }
  } else if (input.seats.length > 1) {
    teaching.push("No relationship rule fired. The reading does not invent a pattern to fill the gap.");
  }

  if (input.spread.id === "between") {
    teaching.push(
      "Them is your picture of the other person. The reading is required to say so. It is not allowed to narrate their private thoughts. That sentence is a fence, not a lesson inside every line.",
    );
  }

  teaching.push(
    "Study teaches this method across the deck. Teach this draw applies it to the cards in front of you. The reading does neither. It only says what those cards do to the question.",
  );

  return {
    paragraphs,
    teaching,
    lens: classified.lens,
    displayTitles: titles,
    trace: {
      corpusVersion: input.corpusVersion,
      lens: classified.lens,
      lensMatch: classified.match,
      seats: traceSeats,
      rulesFired: rules.map((rule) => rule.id),
      rulesInProse: inReading.map((rule) => rule.id),
      themPerceptionNote: input.spread.id === "between",
    },
  };
}
