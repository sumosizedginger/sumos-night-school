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
      <div className="entrance">
        <div className="table-plane entrance-table">
          <Link to="/card/$cardId" params={{ cardId: "major-00" }} className="entrance-card">
            <CardFace card={getCard("major-00")} />
          </Link>
        </div>
        <div className="entrance-copy">
          <p className="colophon">Night School</p>
          <h1 className="font-serif text-5xl text-paper">The deck is on the table.</h1>
          <p className="mt-4 max-w-md text-lg">
            Learn it as a language, then use it. One woman, seventy-eight pictures. No fortune.
          </p>
          <p className="entrance-ways">
            <Link to="/study">Study</Link>
            <Link to="/read">Reading</Link>
          </p>
          {ready && vault?.saveError ? <p className="mt-6 text-sm text-rose">{vault.saveError}</p> : null}
          {ready && next ? (
            <Link to="/study/$lessonId" params={{ lessonId: next.id }} className="continue-line">
              {next.title}
            </Link>
          ) : null}
          {ready && latest ? (
            <Link to="/history/$readingId" params={{ readingId: latest.id }} className="continue-line">
              Latest reading
            </Link>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}
