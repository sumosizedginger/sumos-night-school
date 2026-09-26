export type Lens = "unfocused" | "choice" | "work" | "love" | "inner" | "open";

const LISTS: { lens: Exclude<Lens, "unfocused" | "open">; terms: string[] }[] = [
  {
    lens: "choice",
    terms: ["decide", "decision", "choose", "choice", "or", "versus", "option", "path", "offer", "stay or leave"],
  },
  {
    lens: "work",
    terms: ["work", "job", "boss", "coworker", "collaborator", "client", "career", "office", "project", "money", "rent", "business"],
  },
  {
    lens: "love",
    terms: ["love", "partner", "relationship", "friend", "family", "mother", "father", "spouse", "dating", "marriage"],
  },
  {
    lens: "inner",
    terms: ["feel", "feeling", "anxiety", "sad", "angry", "grief", "want", "identity", "stuck", "myself"],
  },
];

function hasTerm(haystack: string, term: string): boolean {
  if (term.includes(" ")) return haystack.includes(term);
  return new RegExp(`\\b${term}\\b`, "i").test(haystack);
}

export function classifyLens(question: string): { lens: Lens; match: string | null; question: string } {
  const trimmed = question.trim().slice(0, 500);
  if (!trimmed) return { lens: "unfocused", match: null, question: "" };
  const lower = trimmed.toLowerCase();
  for (const group of LISTS) {
    for (const term of group.terms) {
      if (hasTerm(lower, term)) return { lens: group.lens, match: term, question: trimmed };
    }
  }
  return { lens: "open", match: null, question: trimmed };
}

export function pathLabels(question: string, lens: Lens): { a: string; b: string } {
  const fallback = { a: "Path A", b: "Path B" };
  if (lens !== "choice") return fallback;
  const parts = question.split(/\s+or\s+/i);
  if (parts.length !== 2) return fallback;
  const clean = (value: string) => value.replace(/[?.!]+$/g, "").trim();
  let left = clean(parts[0] ?? "");
  const right = clean(parts[1] ?? "");
  left = left.replace(/^.*\b(?:between|choose|choice|decide|decision)\b[:\s]*/i, "").trim();
  if (left.length < 2 || left.length > 42 || right.length < 2 || right.length > 42) return fallback;
  return { a: left, b: right };
}
