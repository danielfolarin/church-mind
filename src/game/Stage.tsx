import { Figure } from "./Figure";
import { SceneArt } from "./SceneArt";
import type { Look, Mood, SettingId } from "./types";

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
export function Stage({
  setting,
  caption,
  people,
  onClick,
}: {
  setting: SettingId;
  caption: string;
  people: StagePerson[];
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
      <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-4 pb-10 pt-3 sm:px-5 sm:pt-4">
        <p className="text-[11px] font-medium tracking-wide text-cm-cream/90 sm:text-xs">{caption}</p>
      </div>
    </div>
  );
}
