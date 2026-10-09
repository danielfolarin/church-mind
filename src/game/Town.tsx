import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Look, PlaceIcon, PlaceId, Story } from "./types";

// The town, seen from above, and the little people who walk around it.
// Streets and places come from the story (`roads` and `places`), so the
// artwork, the walking routes and the map buttons always agree.

export type Point = [x: number, y: number];

const W = 800;
const H = 600;
const px = (x: number) => (x / 100) * W;
const py = (y: number) => (y / 100) * H;

/** Distance on screen: the map is wider than it is tall. */
function distance(a: Point, b: Point) {
  return Math.hypot(a[0] - b[0], (a[1] - b[1]) * (H / W));
}

/** The shortest way between two junctions, along the streets. */
function junctionRoute(story: Story, from: string, to: string): string[] {
  const { junctions, streets } = story.roads;
  const best: Record<string, number> = { [from]: 0 };
  const came: Record<string, string> = {};
  const open = new Set([from]);
  while (open.size) {
    let here = "";
    for (const id of open) if (!here || best[id] < best[here]) here = id;
    if (here === to) break;
    open.delete(here);
    for (const [a, b] of streets) {
      const next = a === here ? b : b === here ? a : null;
      if (!next) continue;
      const cost = best[here] + distance(junctions[here], junctions[next]);
      if (best[next] === undefined || cost < best[next]) {
        best[next] = cost;
        came[next] = here;
        open.add(next);
      }
    }
  }
  const route = [to];
  while (route[0] !== from && came[route[0]]) route.unshift(came[route[0]]);
  return route;
}

/** Where someone stands when they are "at" a place: on its doorstep. */
export function doorstep(story: Story, place: PlaceId): Point {
  const { x, y } = story.places[place];
  return [x, y];
}

/** The walk from one place to another: down the path, along the streets, up the other path. */
export function walkBetween(story: Story, from: PlaceId, to: PlaceId): Point[] {
  if (from === to) return [doorstep(story, to)];
  const route = junctionRoute(story, story.places[from].at, story.places[to].at);
  return [doorstep(story, from), ...route.map((id) => story.roads.junctions[id]), doorstep(story, to)];
}

// ——— People ———

/** A small walking figure, drawn from the same looks as the scene characters. */
export function MiniPerson({ look, walking, facingLeft, className = "" }: { look: Look; walking: boolean; facingLeft?: boolean; className?: string }) {
  const leg = (x: number, reverse: boolean) => (
    <g
      className={walking ? "animate-cm-step" : undefined}
      style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animationDirection: reverse ? "alternate-reverse" : "alternate" }}
    >
      <rect x={x} y="24" width="3.4" height="13" rx="1.5" fill="#2A2523" />
    </g>
  );
  const longHair = look.hairStyle === "long" || look.hairStyle === "wavy";

  return (
    <svg viewBox="0 0 24 40" aria-hidden="true" className={`block overflow-visible ${className}`} style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}>
      <ellipse cx="12" cy="38.4" rx="7" ry="2" fill="#000" opacity="0.28" />
      <g className={walking ? "animate-cm-bob" : undefined}>
        {leg(8.2, false)}
        {leg(12.4, true)}
        {look.hairStyle === "puff" && <circle cx="12" cy="6.6" r="7.4" fill={look.hair} />}
        {longHair && <path d="M5.8 8 a6.2 6.2 0 0 1 12.4 0 v9 h-12.4z" fill={look.hair} />}
        {look.hairStyle === "bun" && <circle cx="12" cy="1.9" r="2.7" fill={look.hair} />}
        <rect x="6.4" y="13" width="11.2" height="13.5" rx="4.2" fill={look.top} />
        {look.topStyle === "apron" && <rect x="8.6" y="17" width="6.8" height="9.5" rx="1" fill={look.accent ?? "#2A2523"} />}
        <circle cx="12" cy="8.6" r="5.6" fill={look.skin} />
        <path d="M6.3 8.2 a5.7 5.7 0 0 1 11.4 0 q-5.7 -3.4 -11.4 0z" fill={look.hair} />
        {look.beard && <path d="M7.4 10.4 q4.6 6.4 9.2 0 q-1 5 -4.6 5 q-3.6 0 -4.6 -5z" fill={look.hair} opacity="0.9" />}
      </g>
    </svg>
  );
}

/**
 * Someone on the map. Give them a `path` and they walk it, then call
 * `onArrive`. Without one they stand at `at`.
 */
export function Walker({
  look,
  at,
  path,
  speed = 26,
  onArrive,
  onTap,
  sprite,
  className = "",
  children,
}: {
  /** Tapping them calls this; without it they can't be tapped. */
  onTap?: () => void;
  /** Draws something other than a person, e.g. the dog. */
  sprite?: (walking: boolean, facingLeft: boolean) => ReactNode;
  look: Look;
  at: Point;
  /** Points to walk through, in order. */
  path?: Point[] | null;
  /** Map-widths per hundred seconds, roughly. */
  speed?: number;
  onArrive?: () => void;
  className?: string;
  children?: ReactNode;
}) {
  const el = useRef<HTMLDivElement>(null);
  const [walking, setWalking] = useState(false);
  const [left, setLeft] = useState(false);
  const arrive = useRef(onArrive);
  arrive.current = onArrive;

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const place = ([x, y]: Point) => {
      node.style.left = `${x}%`;
      node.style.top = `${y}%`;
    };
    if (!path || path.length < 2) {
      place(path?.[0] ?? at);
      setWalking(false);
      return;
    }

    const lengths = path.slice(1).map((point, index) => distance(path[index], point));
    const total = lengths.reduce((sum, length) => sum + length, 0);
    let travelled = 0;
    let last = performance.now();
    let frame = 0;
    let segment = -1;
    setWalking(true);

    const step = (now: number) => {
      travelled = Math.min(total, travelled + ((now - last) / 1000) * speed);
      last = now;
      let along = travelled;
      let index = 0;
      while (index < lengths.length - 1 && along > lengths[index]) along -= lengths[index++];
      if (index !== segment) {
        segment = index;
        const dx = path[index + 1][0] - path[index][0];
        if (Math.abs(dx) > 0.5) setLeft(dx < 0);
      }
      const part = lengths[index] ? along / lengths[index] : 1;
      place([
        path[index][0] + (path[index + 1][0] - path[index][0]) * part,
        path[index][1] + (path[index + 1][1] - path[index][1]) * part,
      ]);
      if (travelled >= total) {
        setWalking(false);
        arrive.current?.();
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
    // `at` only matters when standing still; a new path restarts the walk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, speed]);

  return (
    <div
      ref={el}
      onClick={onTap}
      className={`absolute -translate-x-1/2 -translate-y-[92%] ${onTap ? "cursor-pointer" : "pointer-events-none"} ${className}`}
      style={{ left: `${at[0]}%`, top: `${at[1]}%` }}
    >
      {children}
      {sprite ? sprite(walking, left) : <MiniPerson look={look} walking={walking} facingLeft={left} className="h-full w-full" />}
    </div>
  );
}

const STROLLER_LOOKS: Look[] = [
  { skin: "#C99672", shade: "", hair: "#3A2A20", hairStyle: "short", top: "#C2553F" },
  { skin: "#7E4E33", shade: "", hair: "#17110F", hairStyle: "puff", top: "#E0B84C" },
  { skin: "#E0B596", shade: "", hair: "#8A5A32", hairStyle: "long", top: "#4F86A8" },
  { skin: "#A8744C", shade: "", hair: "#1B1412", hairStyle: "bun", top: "#7A5AA6" },
  { skin: "#8E5B3C", shade: "", hair: "#201512", hairStyle: "short", top: "#4E9A78" },
];

function Bubble({ children }: { children: ReactNode }) {
  return (
    <span className="pointer-events-none absolute bottom-[104%] left-1/2 z-20 w-max max-w-[11rem] -translate-x-1/2 animate-cm-pop rounded-2xl bg-cm-cream px-2.5 py-1 text-center text-[10px] font-semibold leading-tight text-cm-night shadow-lg sm:text-[11px]">
      {children}
    </span>
  );
}

/** The dog who wanders the streets and likes being fussed over. */
function Dog({ story, onPet }: { story: Story; onPet: () => boolean }) {
  const ids = useMemo(() => Object.keys(story.roads.junctions), [story]);
  const [leg, setLeg] = useState<{ from: string; path: Point[] | null }>(() => ({ from: ids[3 % ids.length], path: null }));
  const [fuss, setFuss] = useState<string | null>(null);

  const trot = (from: string) => {
    let to = from;
    while (to === from) to = ids[Math.floor(Math.random() * ids.length)];
    setLeg({ from: to, path: junctionRoute(story, from, to).map((id) => story.roads.junctions[id]) });
  };
  useEffect(() => {
    const timer = window.setTimeout(() => trot(leg.from), 900);
    return () => window.clearTimeout(timer);
    // Start once; each arrival schedules the next trot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pet = () => {
    setFuss(onPet() ? "Woof! (+1 coin)" : "Woof!");
    window.setTimeout(() => setFuss(null), 1700);
  };

  return (
    <Walker
      look={STROLLER_LOOKS[0]}
      at={story.roads.junctions[leg.from]}
      path={leg.path}
      speed={17}
      onArrive={() => window.setTimeout(() => trot(leg.from), 500 + Math.random() * 1800)}
      onTap={pet}
      className="z-[5] h-[5%] w-[5.4%]"
      sprite={(walking, facingLeft) => (
        <svg viewBox="0 0 40 28" role="img" aria-label={`${story.dog} the dog`} className="block h-full w-full overflow-visible" style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}>
          <ellipse cx="20" cy="26.4" rx="13" ry="1.8" fill="#000" opacity="0.25" />
          <g className="animate-cm-wag" style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}>
            <path d="M8 13 Q3 9 4 4" fill="none" stroke="#B5763C" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          {[10, 14, 24, 28].map((x, index) => (
            <g key={x} className={walking ? "animate-cm-step" : undefined} style={{ transformBox: "fill-box", transformOrigin: "50% 0%", animationDirection: index % 2 ? "alternate-reverse" : "alternate" }}>
              <rect x={x} y="17" width="2.8" height="8.5" rx="1.2" fill="#9A5F2E" />
            </g>
          ))}
          <rect x="7" y="10" width="24" height="10" rx="5" fill="#C68B4E" />
          <circle cx="32" cy="10" r="6" fill="#C68B4E" />
          <path d="M29 5 L27 0 L33 4Z" fill="#8A5326" />
          <rect x="35" y="9.5" width="5" height="4" rx="2" fill="#D9A26A" />
          <circle cx="39.4" cy="10.6" r="1.1" fill="#1E1512" />
          <circle cx="33" cy="8.6" r="1" fill="#1E1512" />
        </svg>
      )}
    >
      {fuss && (
        <>
          <Bubble>{fuss}</Bubble>
          <span className="pointer-events-none absolute -top-2 left-1/2 animate-cm-heart text-sm">❤️</span>
        </>
      )}
    </Walker>
  );
}

/** A neighbour out for a walk: wanders from junction to junction for ever. */
function Stroller({ story, index }: { story: Story; index: number }) {
  const ids = useMemo(() => Object.keys(story.roads.junctions), [story]);
  const [leg, setLeg] = useState<{ from: string; path: Point[] | null }>(() => ({ from: ids[(index * 5 + 2) % ids.length], path: null }));
  const [says, setSays] = useState<string | null>(null);
  const chat = () => {
    setSays(story.banter[Math.floor(Math.random() * story.banter.length)]);
    window.setTimeout(() => setSays(null), 2600);
  };

  const wander = (from: string) => {
    let to = from;
    while (to === from) to = ids[Math.floor(Math.random() * ids.length)];
    const route = junctionRoute(story, from, to);
    setLeg({ from: to, path: route.map((id) => story.roads.junctions[id]) });
  };

  useEffect(() => {
    const timer = window.setTimeout(() => wander(leg.from), 400 + index * 900);
    return () => window.clearTimeout(timer);
    // Start once; each arrival schedules the next walk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Walker
      look={STROLLER_LOOKS[index % STROLLER_LOOKS.length]}
      at={story.roads.junctions[leg.from]}
      path={leg.path}
      speed={9 + (index % 3) * 2}
      onArrive={() => window.setTimeout(() => wander(leg.from), 600 + Math.random() * 2600)}
      onTap={chat}
      className={`h-[7.5%] w-[3.4%] ${says ? "z-20" : "opacity-90"}`}
    >
      {says && <Bubble>{says}</Bubble>}
    </Walker>
  );
}

export function Strollers({ story, count = 5, onPet }: { story: Story; count?: number; /** Called when the dog is petted; returns true if it earned a coin. */ onPet: () => boolean }) {
  return (
    <>
      <Dog story={story} onPet={onPet} />
      {Array.from({ length: count }, (_, index) => (
        <Stroller key={index} story={story} index={index} />
      ))}
    </>
  );
}

// ——— The town itself ———

interface Ink {
  grass: string;
  meadow: string;
  road: string;
  kerb: string;
  dash: string;
  path: string;
  river: string;
  shine: string;
  leaf: string;
  leafDark: string;
  glass: string;
  shade: number;
}

const DAY: Ink = { grass: "#7FA05E", meadow: "#6F9152", road: "#E6D7B5", kerb: "#C9B58B", dash: "#FBF4DE", path: "#D8C8A2", river: "#5FA8CC", shine: "#C6E8F5", leaf: "#4E8447", leafDark: "#3C6C3A", glass: "#BFD9E8", shade: 0 };
const DUSK: Ink = { grass: "#2B3D38", meadow: "#243430", road: "#5C5770", kerb: "#48445C", dash: "#9690AD", path: "#4E4A62", river: "#253D68", shine: "#6C8FC8", leaf: "#1F4034", leafDark: "#18332A", glass: "#F6C67E", shade: 0.38 };

// A city centre: paving and planters instead of grass and meadow.
const PAVED_DAY: Ink = { ...DAY, grass: "#CFC8BA", meadow: "#BDB5A6", road: "#8F8C96", kerb: "#77747F", dash: "#E9E4D8", path: "#B3AB9C" };
const PAVED_DUSK: Ink = { ...DUSK, grass: "#2C2B38", meadow: "#252430", road: "#4A475C", kerb: "#3B394B", dash: "#8A85A3", path: "#3E3C4E" };

const EASE = { transition: "fill 1.2s ease, stroke 1.2s ease" };

function Tree({ x, y, r = 15, ink, sway }: { x: number; y: number; r?: number; ink: Ink; sway: number }) {
  return (
    <g>
      <ellipse cx={x + 3} cy={y + r * 0.9} rx={r * 0.9} ry={r * 0.32} fill="#000" opacity="0.18" />
      <g className="animate-cm-sway" style={{ transformBox: "fill-box", transformOrigin: "50% 100%", animationDelay: `${sway}s`, animationDuration: "5s" }}>
        <circle cx={x} cy={y} r={r} fill={ink.leafDark} style={EASE} />
        <circle cx={x - r * 0.25} cy={y - r * 0.28} r={r * 0.68} fill={ink.leaf} style={EASE} />
      </g>
    </g>
  );
}

interface Build {
  wall: string;
  roof: string;
  w: number;
  h: number;
  rise: number;
}

/** A simple house: door at (x, y), walls above it, pitched roof on top. */
function House({ x, y, build, ink, children }: { x: number; y: number; build: Build; ink: Ink; children?: ReactNode }) {
  const { w, h, rise, wall, roof } = build;
  const left = x - w / 2;
  const top = y - h;
  return (
    <g>
      <ellipse cx={x + 6} cy={y + 2} rx={w * 0.62} ry={7} fill="#000" opacity="0.2" />
      <rect x={left} y={top} width={w} height={h} rx="2" fill={wall} />
      <rect x={left} y={top} width={w} height={h} rx="2" fill="#141126" opacity={ink.shade} style={{ transition: "opacity 1.2s ease" }} />
      <path d={`M${left - 5} ${top + 1} L${x} ${top - rise} L${left + w + 5} ${top + 1}Z`} fill={roof} />
      <path d={`M${left - 5} ${top + 1} L${x} ${top - rise} L${left + w + 5} ${top + 1}Z`} fill="#141126" opacity={ink.shade * 0.8} />
      <rect x={x - 5} y={y - 15} width="10" height="15" rx="1.5" fill="#3A2A22" />
      {[left + 6, left + w - 16].map((wx) => (
        <rect key={wx} x={wx} y={top + h * 0.28} width="10" height="10" rx="1.5" fill={ink.glass} style={EASE} />
      ))}
      {children}
    </g>
  );
}

/** An office block in the background of a city. */
function Tower({ x, y, w, h, wall, ink, evening, seed }: { x: number; y: number; w: number; h: number; wall: string; ink: Ink; evening: boolean; seed: number }) {
  const cols = Math.max(2, Math.floor(w / 13));
  const rows = Math.max(3, Math.floor(h / 15));
  return (
    <g>
      <ellipse cx={x + 6} cy={y + 2} rx={w * 0.66} ry={6} fill="#000" opacity="0.2" />
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="2" fill={wall} />
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="2" fill="#141126" opacity={ink.shade} style={{ transition: "opacity 1.2s ease" }} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => (
          <rect
            key={`${row}-${col}`}
            x={x - w / 2 + 5 + col * ((w - 10) / cols)}
            y={y - h + 6 + row * ((h - 14) / rows)}
            width={(w - 10) / cols - 3}
            height={(h - 14) / rows - 4}
            rx="1"
            fill={evening && (row * 3 + col + seed) % 3 === 0 ? "#FFD58E" : ink.glass}
            style={EASE}
          />
        ))
      )}
    </g>
  );
}

const BACKDROP: [number, number, string, string][] = [
  [7, 13, "#D9C4A1", "#B5574A"], [31, 12, "#CBD3D9", "#52708F"], [67, 11, "#E1CFAE", "#8A5A44"], [93, 50, "#D7BFA6", "#4F7F78"],
  [9, 50, "#D9CBB8", "#A65F3E"], [53, 49, "#C9D4C3", "#6B5A8A"], [88, 80, "#DCC8A8", "#B5574A"], [30, 86, "#CBD3D9", "#52708F"],
  [50, 88, "#E1CFAE", "#8A5A44"], [92, 12, "#D9C4A1", "#4F7F78"],
];
const TREES: [number, number, number][] = [
  [26, 24, 15], [47, 9, 13], [70, 22, 14], [96, 22, 12], [6, 28, 13], [48, 44, 12], [58, 57, 13], [84, 54, 15], [96, 60, 12],
  [5, 72, 14], [31, 72, 13], [46, 74, 12], [80, 72, 13], [22, 92, 14], [44, 95, 12],
];

function PlaceArt({ icon, x, y, ink, evening }: { icon: PlaceIcon; x: number; y: number; ink: Ink; evening: boolean }) {
  switch (icon) {
    case "chapel":
      return (
        <g>
          <House x={x} y={y} ink={ink} build={{ w: 74, h: 50, rise: 30, wall: "#EDE3CF", roof: "#7A4A3A" }}>
            <circle cx={x} cy={y - 40} r="7" fill={evening ? "#FFD58E" : "#9DB8D9"} style={EASE} />
          </House>
          <rect x={x - 11} y={y - 104} width="22" height="34" fill="#EDE3CF" />
          <rect x={x - 11} y={y - 104} width="22" height="34" fill="#141126" opacity={ink.shade} />
          <path d={`M${x - 15} ${y - 103} L${x} ${y - 132} L${x + 15} ${y - 103}Z`} fill="#7A4A3A" />
          <path d={`M${x} ${y - 146} V${y - 130} M${x - 5} ${y - 141} H${x + 5}`} stroke="#F4EBDD" strokeWidth="2.5" strokeLinecap="round" />
          <rect x={x - 4} y={y - 96} width="8" height="12" rx="4" fill={ink.glass} style={EASE} />
        </g>
      );
    case "table":
      return (
        <g>
          <rect x={x + 14} y={y - 78} width="10" height="22" fill="#8A5A44" />
          {[0, 1.6, 3.2].map((delay) => (
            <circle key={delay} cx={x + 19} cy={y - 84} r="5" fill="#F4EBDD" opacity="0.5" className="animate-cm-steam" style={{ animationDelay: `${delay}s` }} />
          ))}
          <House x={x} y={y} ink={ink} build={{ w: 62, h: 40, rise: 26, wall: "#E9D6B4", roof: "#B5574A" }} />
        </g>
      );
    case "door":
      return (
        <g>
          <ellipse cx={x + 6} cy={y + 2} rx="38" ry="7" fill="#000" opacity="0.2" />
          <rect x={x - 28} y={y - 92} width="56" height="92" rx="3" fill="#B9C4CC" />
          <rect x={x - 28} y={y - 92} width="56" height="92" rx="3" fill="#141126" opacity={ink.shade} />
          <rect x={x - 31} y={y - 97} width="62" height="8" rx="2" fill="#5E6E7C" />
          {[0, 1, 2].flatMap((row) =>
            [0, 1, 2].map((col) => (
              <rect key={`${row}-${col}`} x={x - 21 + col * 16} y={y - 82 + row * 22} width="10" height="12" rx="1.5" fill={evening && (row + col) % 2 ? "#FFD58E" : ink.glass} style={EASE} />
            ))
          )}
          <rect x={x - 5} y={y - 15} width="10" height="15" rx="1.5" fill="#3A2A22" />
        </g>
      );
    case "cup":
      return (
        <g>
          <ellipse cx={x + 6} cy={y + 2} rx="46" ry="7" fill="#000" opacity="0.2" />
          <rect x={x - 36} y={y - 48} width="72" height="48" rx="3" fill="#9A5A40" />
          <rect x={x - 36} y={y - 48} width="72" height="48" rx="3" fill="#141126" opacity={ink.shade} />
          <rect x={x - 39} y={y - 54} width="78" height="9" rx="2" fill="#5B3324" />
          <rect x={x - 30} y={y - 26} width="34" height="18" rx="2" fill={evening ? "#FFD58E" : ink.glass} style={EASE} />
          <rect x={x + 12} y={y - 22} width="12" height="22" rx="1.5" fill="#3A2A22" />
          <g>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <path key={i} d={`M${x - 36 + i * 12} ${y - 34} h12 l-2 9 h-12z`} fill={i % 2 ? "#F4EBDD" : "#E8622C"} />
            ))}
          </g>
          <circle cx={x - 50} cy={y - 4} r="7" fill="#F4EBDD" />
          <rect x={x - 51.5} y={y - 4} width="3" height="9" fill="#5B3324" />
        </g>
      );
    case "home":
      return <House x={x} y={y} ink={ink} build={{ w: 54, h: 36, rise: 24, wall: "#DCE4E1", roof: "#3F6F78" }} />;
    case "tower":
      return (
        <g>
          <ellipse cx={x + 8} cy={y + 2} rx="44" ry="8" fill="#000" opacity="0.22" />
          <rect x={x - 30} y={y - 128} width="60" height="128" rx="3" fill="#7F9DB5" />
          <rect x={x - 30} y={y - 128} width="60" height="128" rx="3" fill="#141126" opacity={ink.shade} />
          <rect x={x - 34} y={y - 134} width="68" height="9" rx="2" fill="#3F566B" />
          {[0, 1, 2, 3, 4].flatMap((row) =>
            [0, 1, 2].map((col) => (
              <rect key={`${row}-${col}`} x={x - 23 + col * 17} y={y - 118 + row * 20} width="12" height="14" rx="1.5" fill={evening && (row * 2 + col) % 3 !== 1 ? "#FFD58E" : ink.glass} style={EASE} />
            ))
          )}
          <rect x={x - 12} y={y - 18} width="24" height="18" rx="2" fill="#22303C" />
          <rect x={x - 1} y={y - 18} width="2" height="18" fill="#7F9DB5" />
          <rect x={x - 40} y={y - 4} width="80" height="4" rx="1" fill="#3F566B" />
        </g>
      );
    case "hall":
      return (
        <g>
          <ellipse cx={x + 6} cy={y + 2} rx="52" ry="7" fill="#000" opacity="0.2" />
          <rect x={x - 42} y={y - 52} width="84" height="52" fill="#E4D8BE" />
          <rect x={x - 42} y={y - 52} width="84" height="52" fill="#141126" opacity={ink.shade} />
          <path d={`M${x - 48} ${y - 51} L${x} ${y - 82} L${x + 48} ${y - 51}Z`} fill="#CFC0A0" />
          <path d={`M${x - 48} ${y - 51} L${x} ${y - 82} L${x + 48} ${y - 51}Z`} fill="#141126" opacity={ink.shade * 0.8} />
          <circle cx={x} cy={y - 62} r="6" fill={evening ? "#FFD58E" : ink.glass} style={EASE} />
          {[-33, -17, 17, 33].map((dx) => (
            <rect key={dx} x={x + dx - 3.5} y={y - 50} width="7" height="46" rx="2" fill="#F4EBDD" />
          ))}
          <rect x={x - 8} y={y - 26} width="16" height="26" rx="1.5" fill="#3A2A22" />
          <rect x={x - 46} y={y - 5} width="92" height="5" rx="1" fill="#BCAE90" />
          {[-25, 25].map((dx) => (
            <rect key={dx} x={x + dx - 5} y={y - 40} width="10" height="14" rx="1.5" fill={evening ? "#FFD58E" : ink.glass} style={EASE} />
          ))}
        </g>
      );
    case "green":
      return (
        <g>
          <ellipse cx={x} cy={y - 8} rx="66" ry="36" fill={evening ? "#2F4A3A" : "#8DB868"} style={EASE} />
          <ellipse cx={x} cy={y - 8} rx="66" ry="36" fill="none" stroke={ink.path} strokeWidth="5" style={EASE} />
          <circle cx={x} cy={y - 10} r="9" fill={ink.river} style={EASE} />
          <circle cx={x} cy={y - 10} r="9" fill="none" stroke="#D9D2C4" strokeWidth="3" />
          <circle cx={x} cy={y - 10} r="2.5" fill="#D9D2C4" />
          {[-38, 34].map((dx) => (
            <g key={dx}>
              <rect x={x + dx - 11} y={y + 2} width="22" height="5" rx="2" fill="#8A6A48" />
              <path d={`M${x + dx - 9} ${y + 7} v6 M${x + dx + 9} ${y + 7} v6`} stroke="#6B4630" strokeWidth="2.5" />
            </g>
          ))}
        </g>
      );
    case "leaf":
      return (
        <g>
          <rect x={x - 62} y={y - 46} width="124" height="74" rx="12" fill={ink.meadow} style={EASE} />
          <rect x={x - 62} y={y - 46} width="124" height="74" rx="12" fill="none" stroke="#8A6A48" strokeWidth="3" strokeDasharray="5 6" />
          {[0, 1, 2].map((row) => (
            <path key={row} d={`M${x - 46} ${y - 28 + row * 20} H${x + 20}`} stroke={evening ? "#3E5A3C" : "#9BC46A"} strokeWidth="8" strokeLinecap="round" style={EASE} />
          ))}
          <rect x={x + 30} y={y - 34} width="22" height="20" rx="2" fill="#A6714A" />
          <path d={`M${x + 27} ${y - 33} L${x + 41} ${y - 45} L${x + 55} ${y - 33}Z`} fill="#6B4630" />
          <path d={`M${x + 34} ${y + 18} L${x + 41} ${y - 6} L${x + 48} ${y + 18}`} stroke="#6B4630" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "water":
      return (
        <g>
          <rect x={x - 34} y={y - 12} width="26" height="6" rx="2" fill="#8A6A48" />
          <path d={`M${x - 32} ${y - 6} v8 M${x - 10} ${y - 6} v8`} stroke="#6B4630" strokeWidth="3" />
          <path d={`M${x + 22} ${y + 4} V${y - 30}`} stroke="#3A3340" strokeWidth="3" strokeLinecap="round" />
          <circle cx={x + 22} cy={y - 32} r={evening ? 16 : 0} fill="#FFD58E" opacity="0.3" className="animate-cm-twinkle" />
          <circle cx={x + 22} cy={y - 32} r="4.5" fill={evening ? "#FFE6B8" : "#D9D2C4"} style={EASE} />
        </g>
      );
  }
}

export function TownArt({ story, evening, className = "" }: { story: Story; evening: boolean; className?: string }) {
  const { ground, backdrop, mirror } = story.map;
  const ink = ground === "paved" ? (evening ? PAVED_DUSK : PAVED_DAY) : evening ? DUSK : DAY;
  // Scenery is laid out once and flipped for worlds that ask for it.
  const fx = (x: number) => (mirror ? 100 - x : x);
  const flip = mirror ? `translate(${W} 0) scale(-1 1)` : undefined;
  const trees = ground === "paved" ? TREES.filter((_, index) => index % 2 === 0) : TREES;
  const { junctions, streets } = story.roads;
  const line = (a: Point, b: Point) => `M${px(a[0])} ${py(a[1])} L${px(b[0])} ${py(b[1])}`;
  const roadPath = streets.map(([a, b]) => line(junctions[a], junctions[b])).join(" ");
  const footpaths = Object.values(story.places)
    .map((place) => line([place.x, place.y], junctions[place.at]))
    .join(" ");
  // Draw from the back of the map to the front, so nearer things overlap farther ones.
  const places = Object.entries(story.places).sort(([, a], [, b]) => a.y - b.y);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" className={`block h-full w-full ${className}`}>
      <rect width={W} height={H} fill={ink.grass} style={EASE} />
      <g transform={flip}>
        <g fill={ink.meadow} style={EASE}>
          <ellipse cx="120" cy="150" rx="150" ry="70" />
          <ellipse cx="640" cy="330" rx="170" ry="60" />
          <ellipse cx="330" cy="520" rx="190" ry="60" />
        </g>

        <path d="M250 600 C380 536 520 566 800 440 V540 C600 600 460 596 400 600Z" fill={ink.river} style={EASE} />
        <g fill="none" stroke={ink.shine} strokeWidth="3" strokeLinecap="round" strokeDasharray="22 38" className="animate-cm-flow" opacity="0.7">
          <path d="M300 596 C420 548 540 568 790 468" />
          <path d="M360 600 C470 572 580 578 800 500" style={{ animationDelay: "-3s" }} />
        </g>
      </g>

      <path d={footpaths} fill="none" stroke={ink.path} strokeWidth="10" strokeLinecap="round" style={EASE} />
      <path d={roadPath} fill="none" stroke={ink.kerb} strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" style={EASE} />
      <path d={roadPath} fill="none" stroke={ink.road} strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" style={EASE} />
      <path d={roadPath} fill="none" stroke={ink.dash} strokeWidth="2" strokeDasharray="10 12" opacity="0.8" style={EASE} />

      {/* The footbridge where the east road crosses the river */}
      <g>
        <path d={`M${px(fx(65.2))} ${py(88)} L${px(fx(62.6))} ${py(98)}`} stroke="#8A6A48" strokeWidth="30" strokeLinecap="butt" />
        <path d={`M${px(fx(65.2))} ${py(88)} L${px(fx(62.6))} ${py(98)}`} stroke="#B58E62" strokeWidth="22" strokeDasharray="5 3" />
      </g>

      {trees.filter(([, y]) => y < 40).map(([x, y, r], i) => (
        <Tree key={`t${i}`} x={px(fx(x))} y={py(y)} r={r} ink={ink} sway={i * 0.7} />
      ))}
      {BACKDROP.map(([x, y, wall, roof], i) =>
        backdrop === "towers" ? (
          <Tower key={`${x}-${y}`} x={px(fx(x))} y={py(y)} w={36 + (i % 3) * 8} h={Math.min(py(y) - 6, 52 + ((i * 37) % 44))} wall={["#9AA7B5", "#B4AFA6", "#8C99A8", "#A9A3B5"][i % 4]} ink={ink} evening={evening} seed={i} />
        ) : backdrop === "halls" ? (
          <House key={`${x}-${y}`} x={px(fx(x))} y={py(y)} ink={ink} build={{ w: 56, h: 34, rise: 16, wall: i % 2 ? "#D9CDB2" : "#C9B99A", roof: i % 3 ? "#6E7480" : "#8A5A44" }} />
        ) : (
          <House key={`${x}-${y}`} x={px(fx(x))} y={py(y)} ink={ink} build={{ w: 44, h: 30, rise: 20, wall, roof }} />
        )
      )}
      {places.map(([id, place]) => (
        <PlaceArt key={id} icon={place.icon} x={px(place.x)} y={py(place.y)} ink={ink} evening={evening} />
      ))}
      {trees.filter(([, y]) => y >= 40).map(([x, y, r], i) => (
        <Tree key={`f${i}`} x={px(fx(x))} y={py(y)} r={r} ink={ink} sway={i * 0.9} />
      ))}

      {evening && (
        <g>
          {Object.values(junctions).map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={px(x) + 20} cy={py(y) - 14} r="22" fill="#FFD58E" opacity="0.16" className="animate-cm-twinkle" style={{ animationDelay: `${(x % 5) * 0.6}s` }} />
          ))}
        </g>
      )}
    </svg>
  );
}
