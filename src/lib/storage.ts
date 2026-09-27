import type { Orientation } from "@/content/types";
import type { ReadingBlock, ReadingTrace } from "@/lib/reading/compose";
import type { SpreadId } from "@/content/spreads";

export type SeatSnapshot = {
  positionId: string;
  positionTitle: string;
  cardId: string;
  cardName: string;
  orientation: Orientation;
  tilt: string | null;
  facetText: string;
  imageCues: string[];
};

export type StoredReading = {
  id: string;
  createdAt: string;
  question: string;
  spreadId: SpreadId;
  seats: SeatSnapshot[];
  paragraphs: string[];
  blocks?: ReadingBlock[];
  teaching?: string[];
  view?: "reading" | "teaching";
  trace: ReadingTrace;
  corpusVersion: number;
  deeper: null | { text: string; createdAt: string };
};

export type Vault = {
  settings: { reversals: boolean; sound: boolean };
  progress: { lessonsCompleted: string[]; cardsOpened: string[] };
  history: StoredReading[];
  saveError: string | null;
};

const KEY = "nightSchool.v1";

export function emptyVault(): Vault {
  return {
    settings: { reversals: true, sound: false },
    progress: { lessonsCompleted: [], cardsOpened: [] },
    history: [],
    saveError: null,
  };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

export function loadVault(): Vault {
  if (typeof window === "undefined") return emptyVault();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyVault();
    const parsed = JSON.parse(raw) as Partial<Vault>;
    const history = Array.isArray(parsed.history) ? (parsed.history as StoredReading[]).slice(0, 40) : [];
    return {
      settings: {
        reversals: parsed.settings?.reversals !== false,
        sound: parsed.settings?.sound === true,
      },
      progress: {
        lessonsCompleted: asStringArray(parsed.progress?.lessonsCompleted),
        cardsOpened: asStringArray(parsed.progress?.cardsOpened),
      },
      history,
      saveError: null,
    };
  } catch {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    return { ...emptyVault(), saveError: "Saved progress could not be read, so this browser started clean." };
  }
}

export function saveVault(vault: Vault): Vault {
  const next: Vault = { ...vault, history: vault.history.slice(0, 40) };
  if (typeof window === "undefined") return next;
  try {
    const payload = { settings: next.settings, progress: next.progress, history: next.history };
    window.localStorage.setItem(KEY, JSON.stringify(payload));
    return { ...next, saveError: null };
  } catch {
    return { ...next, saveError: "This stays on screen, but this browser could not store it." };
  }
}
