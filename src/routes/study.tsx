import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Constellation } from "@/components/constellation";
import { LESSONS } from "@/content/lessons";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/study")({ component: Study });

function Study() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nested = pathname.replace(/\/$/, "").startsWith("/study/");
  if (nested) return <Outlet />;

  return <StudyList />;
}

function StudyList() {
  const { vault } = useVault();
  const done = new Set(vault?.progress.lessonsCompleted ?? []);

  return (
    <Shell>
      <h1 className="font-serif text-4xl">Study</h1>
      <Constellation
        cardsOpened={vault?.progress.cardsOpened ?? []}
        lessonsCompleted={vault?.progress.lessonsCompleted ?? []}
      />
      <ol className="toc">
        {LESSONS.map((lesson, index) => (
          <li key={lesson.id}>
            <Link to="/study/$lessonId" params={{ lessonId: lesson.id }}>
              <span className={done.has(lesson.id) ? "toc-num is-done" : "toc-num"}>{String(index + 1).padStart(2, "0")}</span>
              <span className="font-serif text-2xl">{lesson.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </Shell>
  );
}
