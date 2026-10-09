import type { ReactNode } from "react";
import { loadProfile } from "./rewards";
import { FullFigure } from "./Rig";
import { CALEB, NAOMI } from "./stories/alderRowWeek";
import type { HairStyle, Lead, Look, Manner, Stance, Story, TopStyle } from "./types";

// Who the player is. A character is chosen (or made) once, before any world,
// and then lives a week wherever the player takes them. Each one speaks with
// one of the two recorded player voices, which is what `base` records.

export interface CustomCharacter {
  name: string;
  /** Which recorded voice speaks their lines: the id of a story lead. */
  base: string;
  look: Look;
}

/** The two recorded player voices. Every story has a lead with each of these ids. */
export const VOICES: { id: string; label: string }[] = [
  { id: "naomi", label: "A woman’s voice" },
  { id: "caleb", label: "A man’s voice" },
];

/** Ready-made characters, for players who would rather get straight to the story. */
export const PRESETS: (CustomCharacter & { id: string; about: string })[] = [
  { id: "naomi", name: "Naomi", base: "naomi", about: "Thoughtful, steady, hard to hurry", look: NAOMI },
  { id: "caleb", name: "Caleb", base: "caleb", about: "Sure of himself, softer than he looks", look: CALEB },
  {
    id: "sofia",
    name: "Sofia",
    base: "naomi",
    about: "Quick to laugh, quicker to help",
    look: { skin: "#DDB092", shade: "#C59676", hair: "#4B2C20", hairStyle: "long", top: "#B8862F", topStyle: "cardigan", accent: "#F4EBDD", lip: "#8A3A32", earrings: true, slim: true, manner: "lively", stance: "wave", build: { height: 0.97, shoulders: 90, hips: 86, limbs: 18 }, skirt: "#3F3345", shoes: "#3A2420" },
  },
  {
    id: "jun",
    name: "Jun",
    base: "caleb",
    about: "Quiet, observant, dry sense of humour",
    look: { skin: "#E3BC98", shade: "#CBA17E", hair: "#17110F", hairStyle: "side", top: "#55704F", topStyle: "collar", accent: "#E8DCC8", glasses: true, manner: "calm", stance: "pockets", build: { height: 1.02, shoulders: 102, hips: 84, limbs: 19 }, legs: "#2A2F3A", shoes: "#3A2A20" },
  },
  {
    id: "amara",
    name: "Amara",
    base: "naomi",
    about: "Warm, direct, says the true thing",
    look: { skin: "#6F4631", shade: "#5B3827", hair: "#17110F", hairStyle: "bun", top: "#A8553A", topStyle: "plain", accent: "#F4EBDD", lip: "#4A1F1C", earrings: true, slim: true, manner: "warm", stance: "clasped", build: { height: 1, shoulders: 94, hips: 90, limbs: 19 }, legs: "#2B3A55", shoes: "#E8DCC8" },
  },
  {
    id: "mateo",
    name: "Mateo",
    base: "caleb",
    about: "Easy-going, loyal, always early",
    look: { skin: "#C99672", shade: "#B07E5A", hair: "#3A2A20", hairStyle: "curly", top: "#6B3F5A", topStyle: "hoodie", accent: "#E8DCC8", beard: true, manner: "easy", stance: "relaxed", build: { height: 1.03, shoulders: 112, hips: 90, limbs: 22 }, legs: "#2B3A55", shoes: "#D9D2C4" },
  },
];

const STORAGE_KEY = "church-mind:character";
const CHOICE_KEY = "church-mind:player";
const NAME_LIMIT = 14;

const SKINS: { skin: string; shade: string }[] = [
  { skin: "#F1CBB0", shade: "#DDB093" },
  { skin: "#DDB092", shade: "#C59676" },
  { skin: "#C99672", shade: "#B07E5A" },
  { skin: "#AA7750", shade: "#93633F" },
  { skin: "#8E5B3C", shade: "#774A30" },
  { skin: "#6F4631", shade: "#5B3827" },
];
const HAIR_COLOURS = ["#17110F", "#3A2A20", "#6B4630", "#8A3B2A", "#C9A46A", "#BDB7B0"];
// Bought with coins in the Collection.
const BOLD_HAIR = ["#6B1F2E", "#D9A441", "#1B2440"];
const JEWEL_TOPS = ["#1F7A5A", "#5B3FA6", "#E0705A"];
const TOP_COLOURS = ["#2F6F73", "#3F5A7A", "#A8553A", "#55704F", "#6B3F5A", "#B8862F", "#B5673A", "#E8DCC8"];
const HAIR_STYLES: [HairStyle, string][] = [["short", "Short"], ["side", "Side part"], ["curly", "Curly"], ["puff", "Natural"], ["bun", "Bun"], ["wavy", "Wavy"], ["long", "Long"]];
const TOP_STYLES: [TopStyle, string][] = [["plain", "Plain"], ["collar", "Collar"], ["hoodie", "Hoodie"], ["cardigan", "Cardigan"]];
const STANCES: [Stance, string][] = [["relaxed", "Relaxed"], ["hip", "Hand on hip"], ["akimbo", "Akimbo"], ["pockets", "Pockets"], ["clasped", "Clasped"], ["wave", "Waving"]];
const MANNERS: [Manner, string][] = [["calm", "Calm"], ["easy", "Easy-going"], ["warm", "Warm"], ["confident", "Confident"], ["graceful", "Graceful"], ["lively", "Lively"]];
const FRAMES: [string, string, Look["build"]][] = [
  ["slight", "Slight", { height: 0.96, shoulders: 88, hips: 82, limbs: 17 }],
  ["average", "Average", { height: 1, shoulders: 100, hips: 88, limbs: 20 }],
  ["tall", "Tall", { height: 1.06, shoulders: 106, hips: 86, limbs: 20 }],
  ["sturdy", "Sturdy", { height: 1.02, shoulders: 116, hips: 96, limbs: 24 }],
];
const BOTTOMS: [string, string, Partial<Look>][] = [
  ["trousers", "Trousers", { skirt: undefined, longSkirt: false, legs: "#2A2F3A" }],
  ["jeans", "Jeans", { skirt: undefined, longSkirt: false, legs: "#2B3A55" }],
  ["skirt", "Skirt", { skirt: "#5A3A4A", longSkirt: false }],
  ["long", "Long skirt", { skirt: "#3F3345", longSkirt: true }],
];

export function defaultCharacter(): CustomCharacter {
  return {
    name: "",
    base: VOICES[0].id,
    look: { ...SKINS[3], hair: HAIR_COLOURS[0], hairStyle: "curly", top: TOP_COLOURS[5], topStyle: "plain", accent: "#F4EBDD", stance: "relaxed", manner: "easy", build: FRAMES[1][2], legs: "#2B3A55", shoes: "#E8DCC8" },
  };
}

export function loadCharacter(): CustomCharacter {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as CustomCharacter | null;
    if (saved && typeof saved.name === "string" && saved.look?.skin && VOICES.some((voice) => voice.id === saved.base)) return saved;
  } catch {
    // Nothing saved, or storage is unavailable: start fresh.
  }
  return defaultCharacter();
}

/** Which character the player last chose: a ready-made one's id, or "custom". */
export function loadChoice(): string {
  try {
    const saved = localStorage.getItem(CHOICE_KEY);
    if (saved === "custom" || PRESETS.some((preset) => preset.id === saved)) return saved as string;
  } catch {
    // Storage is unavailable.
  }
  return PRESETS[0].id;
}

export function saveChoice(choice: string) {
  try {
    localStorage.setItem(CHOICE_KEY, choice);
  } catch {
    // Private browsing: the choice lasts for this visit only.
  }
}

export function saveCharacter(character: CustomCharacter) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  } catch {
    // Private browsing: the character lasts for this visit only.
  }
}

/** The player's character, placed in a world: their name and looks, in that story's leading role. */
export function leadFor(story: Story, character: CustomCharacter): Lead {
  const base = story.leads.find((lead) => lead.id === character.base) ?? story.leads[0];
  return { ...base, name: character.name.trim() || "You", look: character.look };
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-9 rounded-full border px-3.5 py-1.5 text-sm transition ${
        on ? "border-cm-ember bg-cm-ember/15 text-cm-cream" : "border-white/15 text-cm-cream/75 hover:border-white/40"
      }`}
    >
      {children}
    </button>
  );
}

function Swatch({ colour, label, on, onClick }: { colour: string; label: string; on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`h-9 w-9 rounded-full border-2 transition ${on ? "scale-110 border-cm-cream" : "border-white/15 hover:border-white/50"}`}
      style={{ backgroundColor: colour }}
    />
  );
}

export function CharacterCreator({ value, onChange }: { value: CustomCharacter; onChange: (next: CustomCharacter) => void }) {
  const look = value.look;
  const set = (change: Partial<Look>) => onChange({ ...value, look: { ...look, ...change } });
  const bottom = look.skirt ? (look.longSkirt ? "long" : "skirt") : look.legs === "#2B3A55" ? "jeans" : "trousers";
  const owned = loadProfile().owned;
  const hairColours = owned.includes("hair") ? [...HAIR_COLOURS, ...BOLD_HAIR] : HAIR_COLOURS;
  const topColours = owned.includes("jewel") ? [...TOP_COLOURS, ...JEWEL_TOPS] : TOP_COLOURS;

  return (
    <div className="animate-cm-rise rounded-2xl border border-cm-ember/40 bg-cm-ember/[0.06] p-4 sm:p-6 md:flex md:gap-8">
      <div className="mx-auto w-40 shrink-0 md:mx-0 md:w-48">
        <FullFigure look={look} className="h-72 w-full md:h-96" />
        <p className="mt-2 text-center font-story text-2xl text-cm-cream">{value.name.trim() || "You"}</p>
      </div>

      <div className="mt-5 min-w-0 flex-1 space-y-5 md:mt-0">
        <div>
          <label htmlFor="character-name" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">
            Name
          </label>
          <input
            id="character-name"
            type="text"
            autoComplete="off"
            maxLength={NAME_LIMIT}
            value={value.name}
            onChange={(event) => onChange({ ...value, name: event.target.value })}
            placeholder="What are you called?"
            className="mt-2 block w-full max-w-xs rounded-lg border border-white/15 bg-cm-night/60 px-3.5 py-2.5 text-base text-cm-cream placeholder:text-cm-cream/35 focus:border-cm-ember"
          />
        </div>

        <Group label="Your voice, when lines are read aloud">
          {VOICES.map((voice) => (
            <Pill key={voice.id} on={value.base === voice.id} onClick={() => onChange({ ...value, base: voice.id })}>
              {voice.label}
            </Pill>
          ))}
        </Group>

        <Group label="Skin">
          {SKINS.map((tone, index) => (
            <Swatch key={tone.skin} colour={tone.skin} label={`Skin tone ${index + 1}`} on={look.skin === tone.skin} onClick={() => set(tone)} />
          ))}
        </Group>

        <Group label="Hair">
          {HAIR_STYLES.map(([style, label]) => (
            <Pill key={style} on={look.hairStyle === style} onClick={() => set({ hairStyle: style })}>
              {label}
            </Pill>
          ))}
        </Group>
        <Group label="Hair colour">
          {hairColours.map((colour, index) => (
            <Swatch key={colour} colour={colour} label={`Hair colour ${index + 1}`} on={look.hair === colour} onClick={() => set({ hair: colour })} />
          ))}
        </Group>

        <Group label="Top">
          {TOP_STYLES.map(([style, label]) => (
            <Pill key={style} on={(look.topStyle ?? "plain") === style} onClick={() => set({ topStyle: style })}>
              {label}
            </Pill>
          ))}
        </Group>
        <Group label="Top colour">
          {topColours.map((colour, index) => (
            <Swatch key={colour} colour={colour} label={`Top colour ${index + 1}`} on={look.top === colour} onClick={() => set({ top: colour, accent: colour === "#E8DCC8" ? "#3A2A22" : "#F4EBDD" })} />
          ))}
        </Group>

        <Group label="Wearing">
          {BOTTOMS.map(([id, label, change]) => (
            <Pill key={id} on={bottom === id} onClick={() => set(change)}>
              {label}
            </Pill>
          ))}
        </Group>

        <Group label="Extras">
          <Pill on={Boolean(look.glasses)} onClick={() => set({ glasses: !look.glasses })}>
            Glasses
          </Pill>
          <Pill on={Boolean(look.beard)} onClick={() => set({ beard: !look.beard })}>
            Beard
          </Pill>
          <Pill on={Boolean(look.earrings)} onClick={() => set({ earrings: !look.earrings })}>
            Earrings
          </Pill>
          {owned.includes("pendant") && (
            <Pill on={Boolean(look.pendant)} onClick={() => set({ pendant: !look.pendant })}>
              Cross pendant
            </Pill>
          )}
          {owned.includes("scarf") && (
            <Pill on={Boolean(look.scarf)} onClick={() => set({ scarf: look.scarf ? undefined : "#B5673A" })}>
              Scarf
            </Pill>
          )}
          {owned.includes("beanie") && (
            <Pill on={Boolean(look.beanie)} onClick={() => set({ beanie: look.beanie ? undefined : "#3F5A7A" })}>
              Beanie
            </Pill>
          )}
        </Group>
        {owned.length < 5 && <p className="text-xs text-cm-sand/80">More looks can be unlocked with coins in your Collection.</p>}

        <Group label="Frame">
          {FRAMES.map(([id, label, build]) => (
            <Pill key={id} on={look.build?.shoulders === build?.shoulders && look.build?.height === build?.height} onClick={() => set({ build })}>
              {label}
            </Pill>
          ))}
        </Group>

        <Group label="How you carry yourself">
          {MANNERS.map(([manner, label]) => (
            <Pill key={manner} on={(look.manner ?? "easy") === manner} onClick={() => set({ manner })}>
              {label}
            </Pill>
          ))}
        </Group>

        <Group label="How you stand">
          {STANCES.map(([stance, label]) => (
            <Pill key={stance} on={(look.stance ?? "relaxed") === stance} onClick={() => set({ stance })}>
              {label}
            </Pill>
          ))}
        </Group>
      </div>
    </div>
  );
}
