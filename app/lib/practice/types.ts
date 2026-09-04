// Shared types for the practice library. Questions live one file per track,
// so a 100-question track stays editable on its own.

export type Difficulty = 1 | 2 | 3;
export type Shape = "guesstimate" | "case";

export type Question = {
  slug: string;
  shape: Shape;
  title: string;
  /** The question type an interviewer would recognise, e.g. "Market sizing". */
  type: string;
  difficulty: Difficulty;
  /** The time box the question is normally asked in. */
  minutes: number;
  /** Where it has been reported from. Empty when we have no reliable source. */
  askedAt?: string;
  /** Where a strong answer lands. A band or a recommendation, never a false-precision figure. */
  answer: string;
  /** Only the first is shown. Later entries are kept for future use. */
  hints: string[];
  /** The approach. Deliberately a structure and a range, never one exact number. */
  moves: { label: string; text: string }[];
  pitfalls: string[];
};

export type Track = {
  slug: string;
  name: string;
  short: string;
  blurb: string;
  lede: string;
  /** Drives the accent on every page inside the track. */
  hue: string;
  hueSoft: string;
  hueBorder: string;
  questions: Question[];
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { 1: "Easy", 2: "Medium", 3: "Hard" };

