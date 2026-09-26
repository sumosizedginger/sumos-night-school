export type Check = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Lesson = {
  id: string;
  title: string;
  paragraphs: string[];
  checks: Check[];
};

export const LESSONS: Lesson[] = [
  {
    id: "mirror",
    title: "A mirror, not a forecast",
    paragraphs: [
      "Night School teaches the Rider–Waite–Smith tarot, the deck published in 1909. Pamela Colman Smith drew it. Arthur Edward Waite commissioned it and wrote The Pictorial Key to the Tarot. The pictures and sentences in this app are original. They follow that teaching tradition. They are not Smith's plates and they are not Waite's book.",
      "A reading here can describe a pattern in the question you asked. It cannot know the future, a date, a hidden fact, or another person's mind.",
      "Death, in this deck, is change that clears ground. The Tower is a structure failing. The Devil is a bond you are participating in. None of these is a prediction of death, an accident, or possession. If a sentence tells you what medical, legal, or money decision to make, that sentence does not belong here.",
      "Night School has two voices, and they do not share a mouth. Study, this room, teaches the method at length: seats, suits, numbers, courts, majors, pictures, reversals. The reading voice uses that method and does not recite it. On a finished draw there is a switch. The reading is the interpretation. Teach this draw is the method for those cards only, including which meaning was used and what the picture actually shows. Go deeper is not a third lesson. It stays on the reading and says more about the situation.",
    ],
    checks: [
      {
        prompt: "Which claim will Night School refuse?",
        options: [
          "A card can show a pattern in the question you asked.",
          "The Tower means a named accident will happen on a certain date.",
        ],
        answer: 1,
        explanation: "The app will talk about a pattern. It will not schedule a disaster.",
      },
    ],
  },
  {
    id: "asking",
    title: "Asking",
    paragraphs: [
      "A usable question is one you own. It asks about your situation, your choice, or your part in a bond. It leaves room for a pattern, not a yes or no about tomorrow.",
      "Poor questions demand a date, a secret from someone else's head, or a verdict the cards are not allowed to give. “Will they text me on Friday?” is a poor question. “What am I refusing to see in this silence?” is a usable one.",
      "Three poor shapes: Will I get the job? Does my partner still love me, secretly? Should I move my savings? Three usable shapes: What is the real friction in this project? What is my part in this distance? What am I not looking at in this choice?",
      "Rewrite a forecast into a situation you own. “When will they text?” becomes “What am I doing with this silence?” “Will I be promoted?” becomes “What is the real friction in this project?” The second versions can be read. The first ones ask for a date or a mind the cards are not allowed to report.",
      "A blank question is allowed. The reading stays general and says so. It will not invent a topic so the cards have something to talk about. A hostile or nonsense question is still just a question. The cards are not instructions to the app.",
    ],
    checks: [
      {
        prompt: "Which question can this app actually read?",
        options: [
          "What is my part in the tension with my collaborator?",
          "On what date will they change their mind?",
        ],
        answer: 0,
        explanation: "The first question is yours. The second asks for a forecast.",
      },
    ],
  },
  {
    id: "positions",
    title: "Positions",
    paragraphs: [
      "A position is a job. The same card does different work in Attention, in Friction, and in A way through. The reading names the seat, then does the job. It does not stop to define the job. That definition lives here, and in Teach this draw.",
      "Daily card has one seat, Attention: what is asking to be noticed. It is not a forecast of the day.",
      "Three cards: Situation is what is already going on. Friction is what is caught. A way through is a next step, not a total fix. The step does not erase the situation.",
      "Between two: You is your side. Them is the picture you have of the other person, not their mind. The space between is the relationship, not a verdict on either of you.",
      "Decision: the two paths are the options as they stand. Neither is crowned. What you are not looking at is a cost, a fear, or a fact being skipped. It is not a secret right answer.",
      "Below, the same three cards are shown twice. First the reading voice. Then Teach this draw. The question is about a collaborator. Five of Swords is upright in Situation, Two of Cups is reversed in Friction, and Temperance is upright in A way through.",
    ],
    checks: [
      {
        prompt: "The Fool in Friction is mainly about which job?",
        options: ["What is caught.", "What is asking to be noticed, with no obstacle named."],
        answer: 0,
        explanation: "Friction asks what is caught. Attention asks what wants noticing. The card can be the same. The job is not.",
      },
    ],
  },
  {
    id: "suits",
    title: "Four suits",
    paragraphs: [
      "This deck uses the Golden Dawn map that Rider–Waite–Smith used. It is a teaching choice, not a law of nature. Wands are fire: will, work, and the urge to move. Cups are water: feeling, trust, and bonds. Swords are air: thought, conflict, and the words that cut. Pentacles are earth: the body, money, and the material facts of a life.",
      "In a three-card spread, two or three cards of one suit mean that concern is carrying the reading. A spread of swords is not “bad.” It is a thinking-and-conflict problem. A spread of pentacles is not financial advice. It is about material facts.",
      "Some pairs pull apart, and some lean together. Cups and Wands pull apart: feeling against will. Pentacles and Swords pull apart: material fact against thought. Swords and Wands lean together: thought and will. Cups and Pentacles lean together: feeling and the material life. The reading will say that two cards pull two ways, or lean the same way. It will not stop to name fire, water, air, and earth. That naming is the class.",
    ],
    checks: [
      {
        prompt: "A question about rent, tools, and the state of a workplace belongs mostly to which suit?",
        options: ["Swords", "Pentacles", "Cups"],
        answer: 1,
        explanation: "Pentacles carry the body, money, and the material facts of a life. A fight about those facts may also involve Swords, but the suit of the facts is Pentacles.",
      },
    ],
  },
  {
    id: "numbers",
    title: "Numbers",
    paragraphs: [
      "Ace through Ten is one plot, in every suit. Ace is spark. Two is tension. Three is growth. Four is stability. Five is trouble. Six is passage. Seven is test. Eight is movement. Nine is strain. Ten is completion.",
      "The Ace of Wands is a spark of will. The Five of Swords is trouble in a conflict. The Ten of Pentacles is completion in the material world. You do not need all forty cards memorized to use the plot. Learn the beat, then let the suit say what the beat is about.",
      "When the same number shows up twice, the beat is doubled. Two Fives are trouble twice, in whatever suits they wear. The reading says the same pressure showed up twice. Teach this draw names the beat. A doubled rank is not a louder prediction. It is the same kind of pressure, said again.",
    ],
    checks: [
      {
        prompt: "Where does a Five sit on the plot?",
        options: ["Stability", "Trouble", "Completion"],
        answer: 1,
        explanation: "Five is trouble. Four is stability. Ten is completion.",
      },
    ],
  },
  {
    id: "courts",
    title: "Court cards",
    paragraphs: [
      "Page, Knight, Queen, and King are modes, not a census of men and women. Page is learning. Knight is pursuing. Queen is inhabiting. King is directing. Any of them can be you.",
      "Waite's book sometimes ties courts to gender and to harsh character sketches. Night School does not. A Queen of Swords is not “a sharp woman is coming.” She is the mode of inhabiting a clean boundary. That mode might be yours.",
      "A court next to a numbered card is a mode meeting a situation. The Page of Cups beside the Five of Pentacles is someone learning how to be with a material hardship. It is not a child arriving, and it is not a stranger with a name. If the same court rank appears twice, that mode is simply doubled.",
    ],
    checks: [
      {
        prompt: "Which reading fits this app?",
        options: [
          "The Queen of Swords means a woman will enter your life.",
          "The Queen of Swords is the mode of inhabiting a clear boundary, and it may be you.",
        ],
        answer: 1,
        explanation: "Courts are modes. Gender is not the meaning.",
      },
    ],
  },
  {
    id: "majors",
    title: "Major Arcana",
    paragraphs: [
      "The twenty-two majors are the loud cards. Night School teaches them as the Fool's journey, in four movements. 0 through 5 is setting out. 6 through 11 is through the world. 12 through 16 is the undoing. 17 through 21 is the return.",
      "A major beside smaller cards is the louder voice. The reading says that card carries more of this than the smaller ones. It does not pause to define a major. If every card is a major, do not call it a mood. Call it a chapter. Death sits in the undoing. It is change, not a death notice. The Devil, also in the undoing, is a bond you are participating in, not a possession. The Tower is a structure failing, not a scheduled accident. The World sits in the return. It is a cycle completed.",
    ],
    checks: [
      {
        prompt: "Which movement holds the Hanged Man, Death, and the Tower?",
        options: ["Setting out", "The undoing", "The return"],
        answer: 1,
        explanation: "Cards 12 through 16 are the undoing. The return begins at the Star.",
      },
    ],
  },
  {
    id: "pictures",
    title: "Pictures",
    paragraphs: [
      "Look before you reach for the gloss. Night School's pictures are original. A sentence about the picture may only name what is actually there.",
      "On the Fool, look for the cliff, the bundle on the staff, and the small white dog at her heel. The dog is not a prophecy. It is the living thing that came along for a beginning. On Strength, look for her hand on the lion's muzzle, the gold loop in her hair, and the flowers at her feet. The lion is not being killed. Nerve, here, is contact without a blow.",
      "The reading will not tour the picture. Teach this draw will, and only with what is actually painted. If a traditional symbol is not in Night School's picture, neither voice is allowed to pretend it is. Smith's plates are the tradition. They are not these pictures.",
    ],
    checks: [
      {
        prompt: "What is the small white dog doing in the Fool picture?",
        options: [
          "Standing at her heel while she stands at a cliff edge.",
          "Predicting that a pet will change your year.",
        ],
        answer: 0,
        explanation: "The cue is visible company at a beginning. It is not a forecast.",
      },
    ],
  },
  {
    id: "reversals",
    title: "Reversals",
    paragraphs: [
      "A reversal is the same card, not an evil twin. Night School uses four tilts: blocked, turned inward, delayed, or overdone. Waite often wrote reversals as moral failure or malice. This app says so, and then does not follow him there.",
      "The setting in a reading turns reversals on or off. On is the default. Off means every card in the next draw stays upright. Turning the setting after a draw does not reroll the cards you already have.",
      "Blocked means the energy is present and not getting through. Inward means it has turned private and stopped informing anyone, including you. Delayed means it is late, not ruined. Excess means too much of the same thing, or the feast with none of the feeding. One card gets one tilt. Two reversed cards are stalled or private together. They are not a pile of omens. The reading says stalled or private. This lesson is where the four tilts are named.",
    ],
    checks: [
      {
        prompt: "A reversed card in Night School is…",
        options: [
          "The evil opposite of the upright card.",
          "The same card, blocked, inward, delayed, or overdone.",
        ],
        answer: 1,
        explanation: "One tilt. Same card. Not a curse.",
      },
    ],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}
