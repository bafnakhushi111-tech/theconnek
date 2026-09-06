// Practice library. Questions live one file per track and shape so a 100-question
// track stays editable on its own. Content ships with the deploy rather than
// sitting in the database, so it stays in version control and renders for search.
import type { Track, Shape } from "./types";
import { STRATEGY_GUESSTIMATES } from "./strategy-guesstimates";
import { STRATEGY_CASES } from "./strategy-cases";
import { PRODUCT_GUESSTIMATES } from "./product-guesstimates";
import { PRODUCT_CASES } from "./product-cases";
import { FINANCE_GUESSTIMATES } from "./finance-guesstimates";
import { FINANCE_CASES } from "./finance-cases";
import { MARKETING_GUESSTIMATES } from "./marketing-guesstimates";
import { MARKETING_CASES } from "./marketing-cases";
import { OPERATIONS_GUESSTIMATES } from "./operations-guesstimates";
import { OPERATIONS_CASES } from "./operations-cases";
import { HR_GUESSTIMATES } from "./hr-guesstimates";
import { HR_CASES } from "./hr-cases";

export type { Question, Track, Shape, Difficulty } from "./types";
export { DIFFICULTY_LABEL } from "./types";

export const TRACKS: Track[] = [
  {
    slug: "strategy",
    name: "Strategy & Consulting",
    short: "Strategy",
    blurb: "Market sizing and resource estimation. Profitability, entry, growth, M&A and pricing cases.",
    lede: "Where a consulting interview actually goes: size something nobody has data on, then take a business apart under time pressure.",
    hue: "#4B6FA5",
    hueSoft: "rgba(75,111,165,0.10)",
    hueBorder: "rgba(75,111,165,0.28)",
    questions: [...STRATEGY_GUESSTIMATES, ...STRATEGY_CASES],
  },
  {
    slug: "product",
    name: "Product",
    short: "Product",
    blurb: "Scale and usage estimation. Root cause, product design, metrics and prioritisation cases.",
    lede: "Estimation at system scale, then the four question shapes every product loop runs on: diagnose, design, measure, prioritise.",
    hue: "#A897E8",
    hueSoft: "rgba(168,151,232,0.10)",
    hueBorder: "rgba(168,151,232,0.28)",
    questions: [...PRODUCT_GUESSTIMATES, ...PRODUCT_CASES],
  },
  {
    slug: "finance",
    name: "Finance",
    short: "Finance",
    blurb: "Revenue and book sizing. Valuation, invest-or-not, capital structure and unit economics.",
    lede: "Numbers with a defensible source. Size a pool, then argue for a valuation, a structure, or a cheque.",
    hue: "#7ECFB8",
    hueSoft: "rgba(126,207,184,0.10)",
    hueBorder: "rgba(126,207,184,0.28)",
    questions: [...FINANCE_GUESSTIMATES, ...FINANCE_CASES],
  },
  {
    slug: "marketing",
    name: "Marketing & Brand",
    short: "Marketing",
    blurb: "Category sizing, reach and spend. Go-to-market, positioning, share loss and channel mix.",
    lede: "Sizing a category you cannot look up, then defending a launch, a price, or a position with a real budget attached.",
    hue: "#D9A87C",
    hueSoft: "rgba(217,168,124,0.10)",
    hueBorder: "rgba(217,168,124,0.28)",
    questions: [...MARKETING_GUESSTIMATES, ...MARKETING_CASES],
  },
  {
    slug: "operations",
    name: "Operations & Supply Chain",
    short: "Operations",
    blurb: "Throughput, fleets and capacity estimation. Bottleneck, network, quality and cost cases.",
    lede: "Where the physical world meets a spreadsheet: size a system's flow, then find the one constraint the whole operation hangs on.",
    hue: "#D9908C",
    hueSoft: "rgba(217,144,140,0.10)",
    hueBorder: "rgba(217,144,140,0.28)",
    questions: [...OPERATIONS_GUESSTIMATES, ...OPERATIONS_CASES],
  },
  {
    slug: "hr",
    name: "HR & People",
    short: "HR",
    blurb: "Workforce, hiring and attrition estimation. Talent, culture, comp and labour cases.",
    lede: "People decisions with numbers behind them: size a workforce or a funnel, then handle the situations HR careers are actually made of.",
    hue: "#9CCF8F",
    hueSoft: "rgba(156,207,143,0.10)",
    hueBorder: "rgba(156,207,143,0.28)",
    questions: [...HR_GUESSTIMATES, ...HR_CASES],
  },
];

export function getTrack(slug: string): Track | undefined {
  return TRACKS.find((t) => t.slug === slug);
}

export function getQuestion(trackSlug: string, questionSlug: string) {
  const track = getTrack(trackSlug);
  if (!track) return undefined;
  const question = track.questions.find((q) => q.slug === questionSlug);
  if (!question) return undefined;
  return { track, question };
}

export function countByShape(track: Track, shape: Shape) {
  return track.questions.filter((q) => q.shape === shape).length;
}
