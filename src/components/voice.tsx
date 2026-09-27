import type { ReadingBlock } from "@/lib/reading/compose";
import { btn, btnQuiet } from "@/components/shell";

export type ReadingView = "reading" | "teaching";

export function VoiceSwitch({ view, onChange }: { view: ReadingView; onChange: (view: ReadingView) => void }) {
  return (
    <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="How to hear this draw">
      <button
        type="button"
        role="tab"
        aria-selected={view === "reading"}
        className={view === "reading" ? btn : btnQuiet}
        onClick={() => onChange("reading")}
      >
        The reading
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={view === "teaching"}
        className={view === "teaching" ? btn : btnQuiet}
        onClick={() => onChange("teaching")}
      >
        Teach this draw
      </button>
    </div>
  );
}

export function VoiceCopy({
  view,
  paragraphs,
  teaching,
  blocks,
  activeCardId,
  onHoverCardIds,
}: {
  view: ReadingView;
  paragraphs: string[];
  teaching?: string[];
  blocks?: ReadingBlock[];
  activeCardId?: string | null;
  onHoverCardIds?: (ids: string[]) => void;
}) {
  if (view === "teaching") {
    if (!teaching?.length) {
      return (
        <p className="mt-6 max-w-2xl text-muted">
          This save is from before the two voices were split. There is no separate class text for it. New readings keep both.
        </p>
      );
    }
    return (
      <div className="mt-6 max-w-2xl space-y-4">
        <p className="text-sm text-muted">The class, for these cards only. The reading does not say this.</p>
        {teaching.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    );
  }

  const lines = blocks?.length ? blocks : paragraphs.map((text, index) => ({ id: `p-${index}`, text, cardIds: [] as string[] }));

  return (
    <div className="mt-6 max-w-2xl space-y-4" onMouseLeave={() => onHoverCardIds?.([])}>
      {!teaching?.length ? (
        <p className="text-sm text-muted">Saved before the two voices were split. The text below is the original.</p>
      ) : null}
      {lines.map((line) => {
        const lit = Boolean(activeCardId && line.cardIds.includes(activeCardId));
        return (
          <p
            key={line.id}
            className={`reading-block ${lit ? "is-lit" : ""}`}
            onMouseEnter={() => onHoverCardIds?.(line.cardIds)}
            onFocus={() => onHoverCardIds?.(line.cardIds)}
            onBlur={(event) => {
              const next = event.relatedTarget;
              if (!(next instanceof Node) || !event.currentTarget.parentElement?.contains(next)) onHoverCardIds?.([]);
            }}
            tabIndex={line.cardIds.length ? 0 : undefined}
          >
            {line.text}
          </p>
        );
      })}
    </div>
  );
}
