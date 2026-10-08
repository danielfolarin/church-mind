import { Figure } from "./Figure";
import { SceneArt } from "./SceneArt";
import type { Look, Mood, SettingId, Tempt } from "./types";

export interface StagePerson {
  id: string;
  look: Look;
  mood: Mood;
  speaking: boolean;
}

// The light each place throws on the people standing in it.
const LIGHTING: Record<SettingId, string> = {
  garden: "brightness(0.9) saturate(0.95)",
  cafe: "brightness(0.94)",
  kitchen: "brightness(0.88) saturate(0.95)",
  room: "brightness(0.76) saturate(0.85)",
  river: "brightness(0.72) saturate(0.8)",
  hall: "brightness(0.96)",
};

const BLINK_DELAYS = ["0s", "1.9s", "3.4s", "0.8s"];

/**
 * The scene and the people in it. The first person is the player, who stands
 * on the left; everyone else lines up to the right.
 */
/** Money left lying where nobody is looking: it glows, breathes and glitters. */
function CashLure() {
  const note = (turn: number, fill: string) => (
    <g transform={`rotate(${turn} 60 78)`}>
      <rect x="26" y="26" width="68" height="36" rx="4" fill={fill} stroke="#2F6B45" strokeWidth="2" />
      <circle cx="60" cy="44" r="10" fill="none" stroke="#2F6B45" strokeWidth="2" />
      <text x="60" y="49" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2F6B45">
        $
      </text>
    </g>
  );
  const sparkles: [number, number, string][] = [[14, 20, "0s"], [104, 14, "0.5s"], [96, 58, "1s"], [22, 60, "1.4s"], [60, 6, "0.8s"]];
  return (
    <div className="pointer-events-none absolute bottom-[4%] left-1/2 z-[3] w-[24%] min-w-[84px] -translate-x-1/2">
      <svg viewBox="0 0 120 84" aria-hidden="true" className="block w-full overflow-visible">
        <defs>
          <radialGradient id="lure-glow">
            <stop offset="0" stopColor="#FFE08A" stopOpacity="0.9" />
            <stop offset="1" stopColor="#FFE08A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="46" rx="70" ry="48" fill="url(#lure-glow)" className="animate-cm-twinkle" style={{ animationDuration: "2.2s" }} />
        <g className="animate-cm-coin" style={{ transformBox: "fill-box", transformOrigin: "50% 80%" }}>
          {note(-16, "#8FC49A")}
          {note(12, "#A5D6AD")}
          {note(-2, "#BCE5C2")}
          <circle cx="98" cy="70" r="8" fill="#F2C14E" stroke="#B98B1E" strokeWidth="2" />
          <circle cx="84" cy="74" r="6" fill="#F7D36B" stroke="#B98B1E" strokeWidth="2" />
        </g>
        {sparkles.map(([x, y, delay]) => (
          <path
            key={delay}
            d={`M${x} ${y - 7} L${x + 2} ${y - 2} L${x + 7} ${y} L${x + 2} ${y + 2} L${x} ${y + 7} L${x - 2} ${y + 2} L${x - 7} ${y} L${x - 2} ${y - 2}Z`}
            fill="#FFF6C9"
            className="animate-cm-sparkle"
            style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: delay }}
          />
        ))}
      </svg>
    </div>
  );
}

export function Stage({
  setting,
  caption,
  people,
  lure = null,
  onClick,
}: {
  setting: SettingId;
  caption: string;
  people: StagePerson[];
  /** Shows the thing that is tempting the player in this scene. */
  lure?: Tempt | null;
  onClick?: () => void;
}) {
  const count = people.length;
  const width = count <= 1 ? 58 : count === 2 ? 56 : 46;
  const someoneSpeaking = people.some((person) => person.speaking);

  return (
    <div
      onClick={onClick}
      className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-cm-dusk shadow-2xl shadow-black/40 ring-1 ring-white/10 sm:aspect-[2/1] lg:aspect-[4/5]"
    >
      <div key={setting} className="h-full w-full animate-cm-fade">
        <div className="h-full w-full animate-cm-drift">
          <SceneArt setting={setting} />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 top-[12%] lg:top-[38%]" style={{ filter: LIGHTING[setting], transition: "filter 1s ease" }}>
        {people.map((person, index) => {
          const left = count <= 1 ? (100 - width) / 2 : (index * (100 - width)) / (count - 1);
          const quiet = someoneSpeaking && !person.speaking;
          return (
            <div
              key={person.id}
              className="absolute bottom-0 h-full transition-[left,width] duration-700 ease-out"
              style={{ left: `${left}%`, width: `${width}%`, zIndex: person.speaking ? 2 : 1 }}
            >
              <div className={`h-full w-full ${index === 0 ? "animate-cm-enter-left" : "animate-cm-enter-right"}`}>
                <div
                  className="h-full w-full origin-bottom transition duration-500"
                  style={{
                    transform: person.speaking ? "scale(1.04)" : "scale(1)",
                    filter: quiet ? "brightness(0.7)" : "none",
                  }}
                >
                  <Figure
                    look={person.look}
                    mood={person.mood}
                    speaking={person.speaking}
                    facing={count <= 1 ? 0 : index === 0 ? 1 : -1}
                    blinkDelay={BLINK_DELAYS[index % BLINK_DELAYS.length]}
                    className="h-full w-full drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent" />
      {lure === "money" && <CashLure />}
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-4 pb-10 pt-3 sm:px-5 sm:pt-4">
        <p className="text-[11px] font-medium tracking-wide text-cm-cream/90 sm:text-xs">{caption}</p>
      </div>
    </div>
  );
}
