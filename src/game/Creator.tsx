import type { ReactNode } from "react";
import { FullFigure } from "./Figure";
import type { HairStyle, Lead, Look, Stance, Story, TopStyle } from "./types";

// Lets a player make their own character instead of choosing a ready-made one.
// A custom character borrows the story role of one of the leads (the same
// partner and the same recorded voice) and brings their own name and looks.

export interface CustomCharacter {
  name: string;
  /** The lead whose place in the story they take. */
  base: string;
  look: Look;
}

const STORAGE_KEY = "church-mind:character";
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
const TOP_COLOURS = ["#2F6F73", "#3F5A7A", "#A8553A", "#55704F", "#6B3F5A", "#B8862F", "#B5673A", "#E8DCC8"];
const HAIR_STYLES: [HairStyle, string][] = [["short", "Short"], ["side", "Side part"], ["curly", "Curly"], ["puff", "Natural"], ["bun", "Bun"], ["wavy", "Wavy"], ["long", "Long"]];
const TOP_STYLES: [TopStyle, string][] = [["plain", "Plain"], ["collar", "Collar"], ["hoodie", "Hoodie"], ["cardigan", "Cardigan"]];
const STANCES: [Stance, string][] = [["relaxed", "Relaxed"], ["hip", "Hand on hip"], ["akimbo", "Akimbo"], ["pockets", "Pockets"], ["clasped", "Clasped"], ["wave", "Waving"]];
const BOTTOMS: [string, string, Partial<Look>][] = [
  ["trousers", "Trousers", { skirt: undefined, longSkirt: false, legs: "#2A2F3A" }],
  ["jeans", "Jeans", { skirt: undefined, longSkirt: false, legs: "#2B3A55" }],
  ["skirt", "Skirt", { skirt: "#5A3A4A", longSkirt: false }],
  ["long", "Long skirt", { skirt: "#3F3345", longSkirt: true }],
];

export function defaultCharacter(story: Story): CustomCharacter {
  const base = story.leads[0];
  return {
    name: "",
    base: base.id,
    look: { ...SKINS[3], hair: HAIR_COLOURS[0], hairStyle: "curly", top: TOP_COLOURS[5], topStyle: "plain", accent: "#F4EBDD", stance: "relaxed", legs: "#2B3A55", shoes: "#E8DCC8", slim: base.look.slim },
  };
}

export function loadCharacter(story: Story): CustomCharacter {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as CustomCharacter | null;
    if (saved && typeof saved.name === "string" && saved.look?.skin && story.leads.some((lead) => lead.id === saved.base)) return saved;
  } catch {
    // Nothing saved, or storage is unavailable: start fresh.
  }
  return defaultCharacter(story);
}

export function saveCharacter(character: CustomCharacter) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  } catch {
    // Private browsing: the character lasts for this visit only.
  }
}

/** The lead a custom character plays as: their own name and looks in a ready-made role. */
export function customLead(story: Story, character: CustomCharacter): Lead {
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

export function CharacterCreator({ story, value, onChange }: { story: Story; value: CustomCharacter; onChange: (next: CustomCharacter) => void }) {
  const look = value.look;
  const set = (change: Partial<Look>) => onChange({ ...value, look: { ...look, ...change } });
  const bottom = look.skirt ? (look.longSkirt ? "long" : "skirt") : look.legs === "#2B3A55" ? "jeans" : "trousers";

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

        <Group label="You are dating">
          {story.leads.map((lead) => (
            <Pill key={lead.id} on={value.base === lead.id} onClick={() => onChange({ ...value, base: lead.id, look: { ...look, slim: lead.look.slim } })}>
              {lead.partner}
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
          {HAIR_COLOURS.map((colour, index) => (
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
          {TOP_COLOURS.map((colour, index) => (
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
