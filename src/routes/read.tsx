import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { CardBack, CardFace } from "@/components/card-face";
import { btn, btnQuiet, Shell } from "@/components/shell";
import { VoiceCopy, VoiceSwitch, type ReadingView } from "@/components/voice";
import { CARDS, CARD_BY_ID, CORPUS_VERSION, getCard } from "@/content/cards";
import { getSpread, SPREADS, type SpreadId } from "@/content/spreads";
import type { Card, Orientation } from "@/content/types";
import { deepenReading } from "@/lib/reading/deepen.functions";
import { compose } from "@/lib/reading/compose";
import { dealIds, fanIds, orientationsFor } from "@/lib/reading/draw";
import type { SeatSnapshot, StoredReading } from "@/lib/storage";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/read")({ component: Read });

type Phase = "setup" | "confirm-deal" | "fan" | "reveal" | "result";
type Drawn = { card: Card; orientation: Orientation };

function facetText(card: Card, fields: string[]): string {
  return fields
    .map((field) => {
      if (field === "upright.core") return card.upright.core;
      if (field === "upright.gift") return card.upright.gift;
      if (field === "upright.cost") return card.upright.cost;
      if (field === "reversed.note") return card.reversed.note;
      return "";
    })
    .join(" ");
}

function Read() {
  const { vault, commit } = useVault();
  const [question, setQuestion] = useState("");
  const [spreadId, setSpreadId] = useState<SpreadId>("three");
  const [method, setMethod] = useState<"deal" | "fan">("deal");
  const [reversals, setReversals] = useState(true);
  const [phase, setPhase] = useState<Phase>("setup");
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [fan, setFan] = useState<string[]>([]);
  const [picked, setPicked] = useState<string[]>([]);
  const [drawn, setDrawn] = useState<Drawn[]>([]);
  const [shown, setShown] = useState(0);
  const [reading, setReading] = useState<StoredReading | null>(null);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const saved = useRef<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    if (!vault || hydrated.current) return;
    hydrated.current = true;
    setReversals(vault.settings.reversals);
  }, [vault]);

  useEffect(() => {
    if (!reading || saved.current === reading.id) return;
    saved.current = reading.id;
    commit((current) => ({
      ...current,
      history: [reading, ...current.history.filter((item) => item.id !== reading.id)].slice(0, 40),
    }));
  }, [reading, commit]);

  const spread = getSpread(spreadId);

  function reset() {
    setPhase("setup");
    setPendingIds([]);
    setFan([]);
    setPicked([]);
    setDrawn([]);
    setShown(0);
    setReading(null);
    setDeepError(null);
    setPending(false);
  }

  function begin() {
    const ids = CARDS.map((card) => card.id);
    const rng = Math.random;
    if (method === "deal") {
      setPendingIds(dealIds(ids, spread.positions.length, rng));
      setPhase("confirm-deal");
      return;
    }
    setFan(fanIds(ids, rng));
    setPicked([]);
    setPhase("fan");
  }

  function commitDraw(ids: string[]) {
    const orientations = orientationsFor(ids.length, reversals, Math.random);
    const next = ids.map((id, index) => ({ card: getCard(id), orientation: orientations[index] ?? "upright" }));
    setDrawn(next);
    setShown(0);
    setPhase("reveal");
  }

  function finish(cards = drawn) {
    const result = compose({
      question,
      spread,
      seats: cards.map((item) => ({ card: item.card, orientation: item.orientation })),
      corpusVersion: CORPUS_VERSION,
    });
    const seats: SeatSnapshot[] = cards.map((item, index) => {
      const traceSeat = result.trace.seats[index];
      return {
        positionId: spread.positions[index]?.id ?? `seat-${index}`,
        positionTitle: result.displayTitles[index] ?? spread.positions[index]?.title ?? "Seat",
        cardId: item.card.id,
        cardName: item.card.name,
        orientation: item.orientation,
        tilt: traceSeat?.tilt ?? null,
        facetText: facetText(item.card, traceSeat?.facetsUsed ?? []),
        imageCues: item.card.picture === "done" ? item.card.imageCues : [],
      };
    });
    setReading({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      question: question.trim().slice(0, 500),
      spreadId,
      seats,
      paragraphs: result.paragraphs,
      teaching: result.teaching,
      view: "reading",
      trace: result.trace,
      corpusVersion: CORPUS_VERSION,
      deeper: null,
    });
    setShown(cards.length);
    setPhase("result");
  }

  function setVoice(view: ReadingView) {
    if (!reading) return;
    const next = { ...reading, view };
    setReading(next);
    commit((current) => ({
      ...current,
      history: current.history.map((item) => (item.id === reading.id ? next : item)),
    }));
  }

  async function goDeeper(current: StoredReading) {
    if (current.deeper) return;
    setPending(true);
    setDeepError(null);
    try {
      const result = await deepenReading({
        data: {
          question: current.question,
          lens: current.trace.lens,
          spreadName: current.spreadId,
          rulesFired: current.trace.rulesFired,
          reading: current.paragraphs.join("\n\n"),
          seats: current.seats.map((seat) => ({
            positionTitle: seat.positionTitle,
            cardName: seat.cardName,
            orientation: seat.orientation,
            tilt: seat.tilt,
            facetText: seat.facetText,
            imageCues: seat.imageCues,
          })),
        },
      });
      if (!result.ok) {
        setDeepError(
          result.error === "unavailable"
            ? "AI is not available in this environment."
            : result.error === "withheld"
              ? "This reply was withheld because it added cards that were not drawn."
              : "Grok did not answer. You can try again.",
        );
        return;
      }
      const deeper = { text: result.text, createdAt: new Date().toISOString() };
      const next = { ...current, deeper };
      setReading(next);
      commit((vault) => ({
        ...vault,
        history: vault.history.map((item) => (item.id === current.id ? next : item)),
      }));
    } catch {
      setDeepError("Grok did not answer. You can try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <h1 className="font-serif text-4xl">Reading</h1>
      {vault?.saveError ? <p className="mt-4 text-sm text-rose">{vault.saveError}</p> : null}

      {phase === "setup" ? (
        <form
          className="mt-8 max-w-2xl space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            begin();
          }}
        >
          <label className="block">
            <span className="text-sm text-muted">Question, if you have one</span>
            <textarea
              value={question}
              maxLength={500}
              onChange={(event) => setQuestion(event.target.value.slice(0, 500))}
              className="mt-2 min-h-28 w-full border border-line bg-panel p-3 text-paper"
            />
            <span className="mt-1 block text-xs text-muted">{question.trim().length}/500</span>
          </label>
          <fieldset>
            <legend className="text-sm text-muted">Spread</legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SPREADS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSpreadId(item.id)}
                  className={`min-h-11 border p-4 text-left ${spreadId === item.id ? "border-gold" : "border-line"}`}
                >
                  <span className="block font-serif text-xl">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted">{item.blurb}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm text-muted">How to draw</legend>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" className={method === "deal" ? btn : btnQuiet} onClick={() => setMethod("deal")}>
                The deck deals
              </button>
              <button type="button" className={method === "fan" ? btn : btnQuiet} onClick={() => setMethod("fan")}>
                Pick face down
              </button>
            </div>
          </fieldset>
          <button
            type="button"
            role="switch"
            aria-checked={reversals}
            className={btnQuiet}
            onClick={() => {
              const next = !reversals;
              setReversals(next);
              commit((current) => ({ ...current, settings: { reversals: next } }));
            }}
          >
            Reversals {reversals ? "on" : "off"}
          </button>
          <div>
            <button type="submit" className={btn}>Continue</button>
          </div>
        </form>
      ) : null}

      {phase === "confirm-deal" ? (
        <div className="mt-8 max-w-xl">
          <p>The deck is shuffled. Confirm to fix the cards and, if reversals are on, their orientations. Leaving now discards this draw.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={btn} onClick={() => commitDraw(pendingIds)}>Reveal {spread.positions.length}</button>
            <button type="button" className={btnQuiet} onClick={begin}>Shuffle again</button>
            <button type="button" className={btnQuiet} onClick={reset}>Leave without drawing</button>
          </div>
        </div>
      ) : null}

      {phase === "fan" ? (
        <div className="mt-8">
          <p className="max-w-xl">Choose {spread.positions.length} cards, in seat order. The rest stay out.</p>
          <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {fan.map((id, index) => {
              const order = picked.indexOf(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    className="w-full text-left"
                    aria-pressed={order >= 0}
                    onClick={() => {
                      if (order >= 0) setPicked(picked.filter((item) => item !== id));
                      else if (picked.length < spread.positions.length) setPicked([...picked, id]);
                    }}
                  >
                    <CardBack label={order >= 0 ? `${order + 1}. ${spread.positions[order]?.title ?? ""}` : `Card ${index + 1}`} />
                    <span className="sr-only">Face-down card {index + 1}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={btn} disabled={picked.length !== spread.positions.length} onClick={() => commitDraw(picked)}>
              Confirm {picked.length} of {spread.positions.length}
            </button>
            <button type="button" className={btnQuiet} onClick={begin}>Shuffle again</button>
            <button type="button" className={btnQuiet} onClick={reset}>Leave without drawing</button>
          </div>
        </div>
      ) : null}

      {phase === "reveal" ? (
        <div className="mt-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {drawn.slice(0, shown + 1).map((item, index) => (
              <div key={item.card.id}>
                <p className="mb-3 text-center text-sm text-gold">{spread.positions[index]?.title}</p>
                <CardFace card={item.card} orientation={item.orientation} reveal />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {shown + 1 < drawn.length ? (
              <button type="button" className={btn} onClick={() => setShown((count) => count + 1)}>Next card</button>
            ) : (
              <button type="button" className={btn} onClick={() => finish()}>Show the reading</button>
            )}
            <button type="button" className={btnQuiet} onClick={() => finish()}>Skip to the reading</button>
          </div>
        </div>
      ) : null}

      {phase === "result" && reading ? (
        <div className="mt-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {reading.seats.map((seat) => {
              const card = CARD_BY_ID[seat.cardId];
              return card ? (
                <div key={seat.positionId}>
                  <p className="mb-3 text-center text-sm text-gold">{seat.positionTitle}</p>
                  <CardFace card={card} orientation={seat.orientation} />
                </div>
              ) : null;
            })}
          </div>
          <VoiceSwitch view={reading.view ?? "reading"} onChange={setVoice} />
          <VoiceCopy view={reading.view ?? "reading"} paragraphs={reading.paragraphs} teaching={reading.teaching} />
          <p className="mt-6 max-w-2xl text-sm text-muted">A mirror for reflection, not a prediction or professional advice.</p>
          {(reading.view ?? "reading") === "reading" ? (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className={btn}
                  disabled={Boolean(reading.deeper) || pending}
                  onClick={() => void goDeeper(reading)}
                >
                  {reading.deeper ? "Already saved with this reading" : pending ? "Asking Grok" : "Go deeper"}
                </button>
                <Link to="/history/$readingId" params={{ readingId: reading.id }} className={btnQuiet}>
                  Open in history
                </Link>
                <button type="button" className={btnQuiet} onClick={reset}>
                  New reading
                </button>
              </div>
              {!reading.deeper ? (
                <p className="mt-3 max-w-xl text-sm text-muted">
                  Go deeper stays with this reading and says more about the situation. It is not the class. Optional.
                </p>
              ) : null}
              {deepError ? <p className="mt-3 text-sm text-rose">{deepError}</p> : null}
              {reading.deeper ? (
                <aside className="mt-6 max-w-2xl border border-line bg-panel p-5">
                  <p className="text-sm text-gold">Written by Grok, from this reading</p>
                  <p className="mt-3 whitespace-pre-wrap">{reading.deeper.text}</p>
                </aside>
              ) : null}
            </>
          ) : (
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/history/$readingId" params={{ readingId: reading.id }} className={btnQuiet}>
                Open in history
              </Link>
              <button type="button" className={btnQuiet} onClick={reset}>
                New reading
              </button>
            </div>
          )}
        </div>
      ) : null}
    </Shell>
  );
}
