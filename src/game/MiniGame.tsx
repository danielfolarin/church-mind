import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { sound } from "./audio";
import { Confetti } from "./Collection";
import { fill, tokensFor } from "./engine";
import { Portrait } from "./Figure";
import { recordBest } from "./rewards";
import type { Lead, Look } from "./types";

// Quick games tucked inside the week: a coffee rush on a shift, sorting seeds
// in the potting shed, stacking boxes on moving day. They are here for fun.
// They pay a few coins and never change how the story goes, and every one can
// be skipped.

export type MiniGameId = "coffee" | "seeds" | "boxes";

interface Result {
  score: number;
  coins: number;
}

interface Option {
  id: string;
  label: string;
  icon: ReactNode;
}

const cup = (liquid: string, extra?: ReactNode) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
    <path d="M10 16h24v12a12 12 0 0 1-24 0z" fill="#F4EBDD" />
    <path d="M34 19h4a5 5 0 0 1 0 10h-4" fill="none" stroke="#F4EBDD" strokeWidth="3.5" />
    <ellipse cx="22" cy="17" rx="11" ry="3.5" fill={liquid} />
    {extra}
  </svg>
);

const QUICK: Record<"coffee" | "seeds", { title: string; who: string; intro: string; ask: (label: string) => string; options: Option[]; quips: [string, string, string]; tiers: [number, number] }> = {
  coffee: {
    title: "The 9:15 rush",
    who: "Priya",
    intro: "The queue is out the door. Tap the drink each customer asks for before they start sighing.",
    ask: (label) => `“${label}, please!”`,
    options: [
      { id: "flat", label: "Flat white", icon: cup("#B98A5E", <path d="M18 17q4 -3 8 0" stroke="#F4EBDD" strokeWidth="1.6" fill="none" />) },
      { id: "tea", label: "Tea", icon: cup("#C4692F", <path d="M30 14v-7h5" stroke="#E2B36B" strokeWidth="2" fill="none" />) },
      { id: "choc", label: "Hot chocolate", icon: cup("#5A3324", <circle cx="20" cy="16.5" r="2.4" fill="#F4EBDD" />) },
      { id: "black", label: "Black coffee", icon: cup("#1E1512") },
    ],
    quips: ["“We’ll call that a learning shift.”", "“Not bad. The queue only growled twice.”", "“Any faster and I’ll have to pay you more. Don’t.”"],
    tiers: [6, 12],
  },
  seeds: {
    title: "Beans from peas",
    who: "{partner}",
    intro: "Forty envelopes, one mixed-up tray. Send each seed to the right jar. {partner} is watching, and judging.",
    ask: () => "Which jar?",
    options: [
      {
        id: "bean",
        label: "Beans",
        icon: (
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
            <path d="M14 30c-6-10 2-22 12-20 9 2 12 13 4 18-4 3-6 0-9 2-3 3-5 3-7 0z" fill="#8A4B32" />
            <path d="M22 20q3 3 1 8" stroke="#5E2F1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        id: "pea",
        label: "Peas",
        icon: (
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12">
            <circle cx="24" cy="24" r="12" fill="#7FB04F" />
            <circle cx="20" cy="20" r="3.5" fill="#A9D17C" />
          </svg>
        ),
      },
    ],
    quips: ["“Borlotti. Those were borlotti. I’m revoking your sorting privileges.”", "“Acceptable. The peas forgive you.”", "“All right, show-off. You can label the envelopes too.”"],
    tiers: [8, 16],
  },
};

// The regulars in the Kindling queue.
const CUSTOMERS: Look[] = [
  { skin: "#C99672", shade: "#B07F5C", hair: "#3A2A20", hairStyle: "short", top: "#C2553F", beard: true },
  { skin: "#7E4E33", shade: "#683D26", hair: "#17110F", hairStyle: "puff", top: "#E0B84C", earrings: true, lip: "#5A2420" },
  { skin: "#E0B596", shade: "#C89B7B", hair: "#8A5A32", hairStyle: "long", top: "#4F86A8", glasses: true, lip: "#8A3A32" },
  { skin: "#A8744C", shade: "#915F3B", hair: "#BDB7B0", hairStyle: "bun", top: "#7A5AA6", topStyle: "cardigan", accent: "#E8DCC8", glasses: true },
  { skin: "#8E5B3C", shade: "#774A30", hair: "#201512", hairStyle: "curly", top: "#4E9A78", topStyle: "hoodie", accent: "#E8DCC8" },
  { skin: "#D8AC8A", shade: "#C09270", hair: "#5A3A26", hairStyle: "wavy", top: "#B5673A", lip: "#8A3A32", earrings: true },
  { skin: "#6F4631", shade: "#5B3827", hair: "#19120F", hairStyle: "short", top: "#2C3E57", topStyle: "collar", accent: "#E8DCC8", glasses: true },
];

const ROUND_SECONDS = 20;
const patienceFor = (score: number) => Math.max(950, 2400 - score * 80);

/** Something appears; tap what matches before the time runs out. */
function QuickPick({ kind, lead, onEnd }: { kind: "coffee" | "seeds"; lead: Lead; onEnd: (score: number, run: number) => void }) {
  const game = QUICK[kind];
  const [target, setTarget] = useState(() => game.options[Math.floor(Math.random() * game.options.length)]);
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [flash, setFlash] = useState<"good" | "bad" | null>(null);
  const [served, setServed] = useState(0);
  const [streak, setStreak] = useState(0);
  const [patience, setPatience] = useState(2400);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const bestRun = useRef(0);
  const deadline = useRef(performance.now() + 2400);
  const ended = useRef(false);

  const next = useCallback(() => {
    setTarget((current) => {
      const others = game.options.filter((option) => option.id !== current.id);
      // A fresh face most of the time, with the odd repeat to keep players honest.
      return Math.random() < 0.2 ? current : others[Math.floor(Math.random() * others.length)];
    });
    const wait = patienceFor(scoreRef.current);
    deadline.current = performance.now() + wait;
    setPatience(wait);
    setServed((count) => count + 1);
  }, [game.options]);

  const answer = useCallback(
    (id: string | null) => {
      if (ended.current) return;
      const right = id === target.id;
      if (right) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
      }
      streakRef.current = right ? streakRef.current + 1 : 0;
      bestRun.current = Math.max(bestRun.current, streakRef.current);
      setStreak(streakRef.current);
      sound.play(right ? "good" : "bad");
      setFlash(right ? "good" : "bad");
      window.setTimeout(() => setFlash(null), 220);
      next();
    },
    [target, next]
  );

  const answerRef = useRef(answer);
  answerRef.current = answer;

  useEffect(() => {
    const started = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const remaining = ROUND_SECONDS - (now - started) / 1000;
      setLeft(Math.max(0, remaining));
      if (remaining <= 0 && !ended.current) {
        ended.current = true;
        window.clearInterval(timer);
        onEnd(scoreRef.current, bestRun.current);
      } else if (now > deadline.current) {
        deadline.current = now + 99999; // one miss per customer
        answerRef.current(null);
      }
    }, 100);
    return () => window.clearInterval(timer);
    // The round runs once from start to finish.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const index = Number(event.key) - 1;
      if (game.options[index]) answerRef.current(game.options[index].id);
      if (game.options.length === 2 && event.key === "ArrowLeft") answerRef.current(game.options[0].id);
      if (game.options.length === 2 && event.key === "ArrowRight") answerRef.current(game.options[1].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [game.options]);

  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-cm-cream">
        <span>Score {score}</span>
        {streak >= 3 && (
          <span key={streak} className="animate-cm-pop rounded-full bg-cm-ember/20 px-3 py-0.5 text-xs text-cm-gold">
            {streak} in a row!
          </span>
        )}
        <span className="tabular-nums text-cm-sand">{Math.ceil(left)}s</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cm-gold" style={{ width: `${(left / ROUND_SECONDS) * 100}%`, transition: "width 0.1s linear" }} />
      </div>

      <div
        key={served}
        className={`mt-6 flex animate-cm-pop flex-col items-center rounded-3xl border-2 px-6 py-8 transition-colors ${
          flash === "good" ? "border-cm-gold bg-cm-gold/15" : flash === "bad" ? "animate-cm-shake border-red-400/70 bg-red-400/10" : "border-white/10 bg-white/[0.04]"
        }`}
      >
        {kind === "coffee" ? (
          <div className="flex items-center gap-5">
            <Portrait look={CUSTOMERS[served % CUSTOMERS.length]} mood={flash === "bad" ? "hurt" : "warm"} className="h-24 w-24" />
            <span className="scale-[1.5]">{target.icon}</span>
          </div>
        ) : (
          <span className="scale-[1.7]" data-seed={target.id}>
            {target.icon}
          </span>
        )}
        <p className="mt-6 font-story text-2xl text-cm-cream">{fill(game.ask(target.label), tokensFor(lead))}</p>
        <span className="mt-5 block h-1.5 w-40 overflow-hidden rounded-full bg-white/10 motion-reduce:hidden" aria-hidden="true">
          <span className="block h-full origin-left animate-cm-drain rounded-full bg-cm-ember" style={{ animationDuration: `${patience}ms` }} />
        </span>
      </div>

      <div className={`mt-5 grid gap-3 ${game.options.length === 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {game.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => answer(option.id)}
            className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/[0.05] px-3 py-3 text-sm font-semibold text-cm-cream transition active:scale-95 hover:border-cm-ember/70 hover:bg-white/[0.09]"
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const BOXES = 8;
const TOWER_WIDTH = 46;

/** A box slides back and forth; drop it squarely on the stack. */
function StackBoxes({ onEnd }: { onEnd: (score: number) => void }) {
  const [stack, setStack] = useState<{ x: number; width: number }[]>([{ x: 27, width: TOWER_WIDTH }]);
  const [dropped, setDropped] = useState(0);
  const [missed, setMissed] = useState(false);
  const moving = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const top = stack[stack.length - 1];
  const done = dropped >= BOXES;

  useEffect(() => {
    if (done) return;
    let frame = 0;
    const started = performance.now();
    const speed = 0.9 + dropped * 0.16;
    const span = 100 - top.width;
    const step = (now: number) => {
      const swing = (Math.sin(((now - started) / 1000) * speed * 2) + 1) / 2;
      position.current = swing * span;
      if (moving.current) moving.current.style.left = `${position.current}%`;
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [dropped, top.width, done]);

  const drop = useCallback(() => {
    if (done) return;
    const x = position.current;
    const start = Math.max(x, top.x);
    const end = Math.min(x + top.width, top.x + top.width);
    const overlap = end - start;
    if (overlap > 3) {
      sound.play("good");
      setStack((current) => [...current, { x: start, width: overlap }]);
      setMissed(false);
    } else {
      sound.play("bad");
      setMissed(true);
    }
    setDropped((count) => count + 1);
  }, [done, top]);

  useEffect(() => {
    if (!done) return;
    const timer = window.setTimeout(() => onEnd(stack.length - 1), 900);
    return () => window.clearTimeout(timer);
  }, [done, stack.length, onEnd]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        drop();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drop]);

  const row = 30;
  return (
    <div>
      <div className="flex items-center justify-between text-sm font-semibold text-cm-cream">
        <span>Stacked {stack.length - 1}</span>
        <span className="text-cm-sand">
          {Math.min(dropped + 1, BOXES)} of {BOXES}
        </span>
      </div>
      <button
        type="button"
        onClick={drop}
        aria-label="Drop the box"
        className={`relative mt-4 block h-[340px] w-full overflow-hidden rounded-3xl border-2 border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.07] ${missed ? "animate-cm-shake" : ""}`}
      >
        {stack.map((box, index) => (
          <span
            key={index}
            className="absolute rounded-md border border-[#7A5A2E] bg-[#C39A5B]"
            style={{ left: `${box.x}%`, width: `${box.width}%`, bottom: 12 + index * row, height: row - 3 }}
          >
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#E8D5A8]/70" />
          </span>
        ))}
        {!done && (
          <div ref={moving} className="absolute rounded-md border border-[#7A5A2E] bg-[#D4AC6B] shadow-lg" style={{ width: `${top.width}%`, bottom: 12 + stack.length * row + 26, height: row - 3 }}>
            <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-[#E8D5A8]/70" />
          </div>
        )}
        {done && <span className="absolute left-1/2 -translate-x-1/2 animate-cm-pop text-4xl" style={{ bottom: 12 + stack.length * row }}>🪴</span>}
        <span className="absolute inset-x-0 bottom-0 h-3 bg-[#3A2A22]" />
      </button>
      <p className="mt-3 text-center text-sm text-cm-sand">Tap the stairwell, or press Space, to drop each box.</p>
    </div>
  );
}

const BOX_GAME = {
  title: "Third floor, no lift",
  who: "Dev",
  intro: "Dev is passing boxes down the stairwell. Stack them straight. The fern goes on top.",
  quips: ["“That one was my plates, by the way.”", "“It leans. It has character. Like me.”", "“You’re hired. The pay is chips.”"] as [string, string, string],
  tiers: [3, 6] as [number, number],
};

/** One mini-game from start to finish: how to play, the game, then the result. */
export function MiniGame({ id, lead, onDone }: { id: MiniGameId; lead: Lead; onDone: (result: Result) => void }) {
  const [phase, setPhase] = useState<"intro" | "play" | "result">("intro");
  const [score, setScore] = useState(0);
  const [run, setRun] = useState(0);
  const [best, setBest] = useState({ best: 0, fresh: false });
  const game = id === "boxes" ? BOX_GAME : QUICK[id];
  const tokens = tokensFor(lead);
  const coins = id === "boxes" ? score * 2 : Math.min(score, 16);
  const tier = score < game.tiers[0] ? 0 : score < game.tiers[1] ? 1 : 2;

  const finish = useCallback(
    (final: number, bestRun = 0) => {
      setScore(final);
      setRun(bestRun);
      setBest(recordBest(id, final));
      setPhase("result");
      sound.play("win");
    },
    [id]
  );

  return (
    <div className="min-h-screen bg-cm-night text-cm-cream">
      {phase === "result" && (tier === 2 || best.fresh) && <Confetti />}
      <main className="mx-auto max-w-xl px-5 pb-16 pt-10 sm:pt-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cm-gold">A quick game</p>
        <h1 className="mt-2 font-story text-4xl sm:text-5xl">{game.title}</h1>

        {phase === "intro" && (
          <div className="animate-cm-rise">
            <p className="mt-5 font-story text-lg leading-relaxed text-cm-cream/85">{fill(game.intro, tokens)}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={() => setPhase("play")} className="inline-flex min-h-12 items-center rounded-full bg-cm-ember px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-cm-ember/20 transition hover:bg-cm-ember-dark">
                Play
              </button>
              <button type="button" onClick={() => onDone({ score: 0, coins: 0 })} className="text-sm font-medium text-cm-sand underline-offset-4 hover:text-cm-cream hover:underline">
                Skip the game
              </button>
            </div>
            <p className="mt-5 text-xs text-cm-sand/80">Just for fun. It earns a few coins and doesn’t change your story.</p>
          </div>
        )}

        {phase === "play" && <div className="mt-6">{id === "boxes" ? <StackBoxes onEnd={finish} /> : <QuickPick kind={id} lead={lead} onEnd={finish} />}</div>}

        {phase === "result" && (
          <div className="animate-cm-rise">
            <p className="mt-6 font-story text-6xl text-cm-gold">{score}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.18em] text-cm-sand">{id === "boxes" ? "boxes stacked" : id === "coffee" ? "drinks served" : "seeds sorted"}</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-cm-sand">
              {best.fresh ? <span className="animate-cm-pop rounded-full bg-cm-gold px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-cm-night">New best!</span> : <span>Your best: {best.best}</span>}
              {run >= 3 && <span>· Longest run: {run} in a row</span>}
            </p>
            <div className="mt-6 border-l-2 border-cm-gold/50 pl-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cm-gold">{fill(game.who, tokens)}</p>
              <p className="mt-1 font-story text-xl leading-relaxed text-cm-cream">{game.quips[tier]}</p>
            </div>
            {coins > 0 && <p className="mt-6 inline-block animate-cm-coin rounded-full bg-cm-gold/15 px-4 py-1.5 text-sm font-semibold text-cm-gold">+{coins} coins</p>}
            <div className="mt-8">
              <button type="button" onClick={() => onDone({ score, coins })} className="inline-flex min-h-12 items-center rounded-full bg-cm-ember px-8 py-3 text-sm font-semibold text-white transition hover:bg-cm-ember-dark">
                Carry on <span aria-hidden="true" className="ml-2">→</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
