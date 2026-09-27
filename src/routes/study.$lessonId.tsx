import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { btn, btnQuiet, Shell } from "@/components/shell";
import { CardCompare } from "@/components/compare";
import { getCard, CORPUS_VERSION } from "@/content/cards";
import { getLesson, LESSONS } from "@/content/lessons";
import { getSpread } from "@/content/spreads";
import { compose } from "@/lib/reading/compose";
import { useVault } from "@/lib/use-vault";

export const Route = createFileRoute("/study/$lessonId")({ component: LessonPage });

function LessonPage() {
  const { lessonId } = Route.useParams();
  const lesson = getLesson(lessonId);
  const { vault, commit } = useVault();
  const [showAnswer, setShowAnswer] = useState(false);
  if (!lesson) {
    return (
      <Shell>
        <p>That lesson is not on the path.</p>
      </Shell>
    );
  }
  const index = LESSONS.findIndex((item) => item.id === lesson.id);
  const picturesReady =
    lesson.id !== "pictures" ||
    (getCard("major-00").picture === "done" &&
      getCard("major-08").picture === "done" &&
      getCard("major-00").imageCues.length > 0 &&
      getCard("major-08").imageCues.length > 0);
  const finished = vault?.progress.lessonsCompleted.includes(lesson.id) ?? false;

  return (
    <Shell>
      <p className="text-sm text-gold">Lesson {index + 1} of {LESSONS.length}</p>
      <h1 className="mt-2 font-serif text-4xl">{lesson.title}</h1>
      <div className="mt-6 max-w-2xl space-y-4">
        {lesson.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {lesson.id === "positions" ? <PositionExample /> : null}
      {!picturesReady ? (
        <p className="mt-6 max-w-2xl text-rose">
          Picture unfinished. This lesson stays closed until the Fool and Strength pictures, and the lines about them, are both real.
        </p>
      ) : null}
      <div className="mt-8 max-w-2xl space-y-6">
        {lesson.checks.map((check) => (
          <fieldset key={check.prompt} className="border border-line p-4">
            <legend className="px-2 font-serif text-lg">{check.prompt}</legend>
            <ul className="mt-3 space-y-2">
              {check.options.map((option) => (
                <li key={option} className="text-paper">{option}</li>
              ))}
            </ul>
            {showAnswer ? (
              <p className="mt-4 text-gold-2">
                {check.options[check.answer]} {check.explanation}
              </p>
            ) : null}
          </fieldset>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" className={btnQuiet} onClick={() => setShowAnswer(true)}>
          Show the answer
        </button>
        <button
          type="button"
          className={btn}
          disabled={!showAnswer || !picturesReady || finished}
          onClick={() =>
            commit((current) => ({
              ...current,
              progress: {
                ...current.progress,
                lessonsCompleted: current.progress.lessonsCompleted.includes(lesson.id)
                  ? current.progress.lessonsCompleted
                  : [...current.progress.lessonsCompleted, lesson.id],
              },
            }))
          }
        >
          {finished ? "Marked complete" : "Mark lesson complete"}
        </button>
        {LESSONS[index + 1] ? (
          <Link to="/study/$lessonId" params={{ lessonId: LESSONS[index + 1]!.id }} className={btnQuiet}>
            Next lesson
          </Link>
        ) : null}
      </div>
      {lesson.id === "pictures" ? (
        <CardCompare
          left={getCard("major-00")}
          right={getCard("major-08")}
          note="The Fool stands at a cliff with a bundle and a dog. Strength keeps a hand on the lion. Only what is painted is named."
        />
      ) : null}
    </Shell>
  );
}

function PositionExample() {
  const spread = getSpread("three");
  const result = compose({
    question: "How do I handle the tension with my collaborator?",
    spread,
    corpusVersion: CORPUS_VERSION,
    seats: [
      { card: getCard("swords-05"), orientation: "upright" },
      { card: getCard("cups-02"), orientation: "reversed" },
      { card: getCard("major-14"), orientation: "upright" },
    ],
  });
  return (
    <div className="mt-6 max-w-2xl space-y-6">
      <div className="border border-line bg-panel p-5">
        <p className="text-sm text-gold">The reading</p>
        <div className="mt-3 space-y-3">
          {result.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <div className="border border-line bg-panel p-5">
        <p className="text-sm text-gold">Teach this draw</p>
        <div className="mt-3 space-y-3">
          {result.teaching.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
