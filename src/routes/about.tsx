import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <Shell>
      <h1 className="font-serif text-4xl">About this deck</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-paper">
        <p>
          Night School teaches the Rider–Waite–Smith tarot published in 1909. Pamela Colman Smith drew that deck.
          Arthur Edward Waite commissioned it and wrote the guide most readers know as The Pictorial Key to the Tarot.
        </p>
        <p>
          The pictures and sentences here are original. They are not Smith's artwork and they are not Waite's book.
          The same woman walks every card: copper hair, freckles, kintsugi seams, a night-library palette. She is the
          figure of the lesson, not a copy of a commercial deck.
        </p>
        <p>
          Reversals are taught as the same card blocked, turned inward, delayed, or overdone. Court cards are modes,
          not a rule about gender. Waite is often harsher on both. This app says so, and then teaches its own way.
        </p>
        <p>
          A reading is a mirror for the question you asked. It is not a prediction, and it is not medical, legal, or
          financial advice. History and lesson progress stay in this browser. A new browser starts empty.
        </p>
        <p>
          Study is the class. A reading says what the draw does to the question you asked, and it does not stop to teach the method.
          On the result, Teach this draw is that method for the cards in front of you. You can flip between them. The cards stay put.
        </p>
        <p>
          “Go deeper” is optional, and it stays on the reading. When it runs, Grok says more about the situation from the cards already drawn.
          It is not another lesson. If that feature is off, the button says why. A canned paragraph is never offered as a live reply.
        </p>
      </div>
    </Shell>
  );
}
