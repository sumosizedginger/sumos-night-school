import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Altar } from "@/components/altar";
import { btn, btnQuiet, Shell } from "@/components/shell";
import { VoiceCopy, VoiceSwitch, type ReadingView } from "@/components/voice";
import { CARD_BY_ID } from "@/content/cards";
import { deepenReading } from "@/lib/reading/deepen.functions";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/history/$readingId")({ component: HistoryDetail });

function HistoryDetail() {
  const { readingId } = Route.useParams();
  const navigate = useNavigate();
  const { vault, commit } = useVault();
  const reading = vault?.history.find((item) => item.id === readingId);
  const [deepError, setDeepError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [hoverIds, setHoverIds] = useState<string[]>([]);
  const [pickedCard, setPickedCard] = useState<string | null>(null);

  if (!vault) {
    return (
      <Shell>
        <p className="text-muted">Opening this browser’s history.</p>
      </Shell>
    );
  }
  if (!reading) {
    return (
      <Shell>
        <p>That reading is not stored here.</p>
        <Link to="/history" className="mt-4 inline-block text-moon">Back to history</Link>
      </Shell>
    );
  }

  async function goDeeper() {
    if (!reading || reading.deeper) return;
    setPending(true);
    setDeepError(null);
    try {
      const result = await deepenReading({
        data: {
          question: reading.question,
          lens: reading.trace.lens,
          spreadName: reading.spreadId,
          rulesFired: reading.trace.rulesFired,
          reading: reading.paragraphs.join("\n\n"),
          seats: reading.seats.map((seat) => ({
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
      commit((current) => ({
        ...current,
        history: current.history.map((item) =>
          item.id === reading.id ? { ...item, deeper: { text: result.text, createdAt: new Date().toISOString() } } : item,
        ),
      }));
    } catch {
      setDeepError("Grok did not answer. You can try again.");
    } finally {
      setPending(false);
    }
  }

  function setVoice(view: ReadingView) {
    if (!reading) return;
    commit((current) => ({
      ...current,
      history: current.history.map((item) => (item.id === reading.id ? { ...item, view } : item)),
    }));
  }

  const view = reading.view ?? "reading";

  return (
    <Shell>
      <p className="text-sm text-gold">{reading.spreadId}</p>
      <h1 className="mt-2 font-serif text-4xl">{reading.question || "Unfocused reading"}</h1>
      <Altar
        spreadId={reading.spreadId}
        highlightIds={hoverIds.length ? hoverIds : pickedCard ? [pickedCard] : []}
        selectedId={pickedCard}
        onSelect={(id) => setPickedCard((current) => (current === id ? null : id))}
        seats={reading.seats.map((seat) => ({
          positionId: seat.positionId,
          title: seat.positionTitle,
          card: CARD_BY_ID[seat.cardId],
          orientation: seat.orientation,
        }))}
      />
      <VoiceSwitch view={view} onChange={setVoice} />
      <VoiceCopy
        view={view}
        paragraphs={reading.paragraphs}
        teaching={reading.teaching}
        blocks={reading.blocks}
        activeCardId={pickedCard}
        onHoverCardIds={setHoverIds}
      />
      <p className="mt-6 max-w-2xl text-sm text-muted">A mirror for reflection, not a prediction or professional advice.</p>
      {view === "reading" ? (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={btn} disabled={Boolean(reading.deeper) || pending} onClick={() => void goDeeper()}>
              {reading.deeper ? "Already saved with this reading" : pending ? "Asking Grok" : "Go deeper"}
            </button>
            <button
              type="button"
              className={btnQuiet}
              onClick={() => {
                commit((current) => ({ ...current, history: current.history.filter((item) => item.id !== reading.id) }));
                void navigate({ to: "/history" });
              }}
            >
              Delete this reading
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
        <div className="mt-6">
          <button
            type="button"
            className={btnQuiet}
            onClick={() => {
              commit((current) => ({ ...current, history: current.history.filter((item) => item.id !== reading.id) }));
              void navigate({ to: "/history" });
            }}
          >
            Delete this reading
          </button>
        </div>
      )}
    </Shell>
  );
}
