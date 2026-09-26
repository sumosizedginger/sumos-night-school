import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { CardFace } from "@/components/card-face";
import { getCard } from "@/content/cards";
import { LESSONS } from "@/content/lessons";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { vault, ready } = useVault();
  const next = LESSONS.find((lesson) => !vault?.progress.lessonsCompleted.includes(lesson.id));
  const latest = vault?.history[0];

  return (
    <Shell>
      <p className="text-sm tracking-wide text-gold">A beginner tarot studio</p>
      <h1 className="mt-3 max-w-xl font-serif text-5xl text-paper">Night School</h1>
      <p className="mt-4 max-w-xl text-lg text-paper">
        Learn the deck as a language, then use it. One set of cards. A clear teacher. No fortune.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link to="/study" className="rounded-card border border-line bg-panel p-6">
          <p className="font-serif text-2xl text-gold-2">Study</p>
          <p className="mt-2 text-muted">Nine lessons, then the whole library.</p>
        </Link>
        <Link to="/read" className="rounded-card border border-line bg-panel p-6">
          <p className="font-serif text-2xl text-gold-2">Reading</p>
          <p className="mt-2 text-muted">Ask something. Draw. See how the reading was built.</p>
        </Link>
      </div>
      <div className="mt-10 grid items-center gap-8 lg:grid-cols-[14rem_1fr]">
        <Link to="/card/$cardId" params={{ cardId: "major-00" }} className="max-w-56">
          <CardFace card={getCard("major-00")} compact />
        </Link>
        <p className="max-w-md text-muted">
          The same woman walks every card. Study her pictures, then ask a question and see how a reading is built.
        </p>
      </div>
      {ready && vault?.saveError ? <p className="mt-6 text-sm text-rose">{vault.saveError}</p> : null}
      {ready && (next || latest) ? (
        <div className="mt-8 flex flex-col gap-3 text-sm">
          {next ? (
            <Link to="/study/$lessonId" params={{ lessonId: next.id }} className="text-moon">
              Continue study: {next.title}
            </Link>
          ) : (
            <p className="text-muted">The lesson path is finished. The library is still there.</p>
          )}
          {latest ? (
            <Link to="/history/$readingId" params={{ readingId: latest.id }} className="text-moon">
              Latest reading
            </Link>
          ) : null}
        </div>
      ) : null}
    </Shell>
  );
}
