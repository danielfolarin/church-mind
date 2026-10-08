import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MAX_ENERGY, MAX_QUALITY } from "./engine";
import {
  QUALITY_IDS,
  type Beat,
  type Effects,
  type PlaceIcon,
  type Qualities,
  type QualityId,
  type Scripture,
  type Slot,
  type Story,
} from "./types";

export const QUALITY_LABELS: Record<QualityId, string> = {
  wisdom: "Wisdom",
  integrity: "Integrity",
  compassion: "Compassion",
  courage: "Courage",
  trust: "Trust",
};

const CAST_COLORS = ["#E2B36B", "#A9C3A0", "#D9A7B5", "#9DB8D9", "#D8B4A0"];
const PARTNER_COLOR = "#F0A078";
const YOU_COLOR = "#F4EBDD";

/** Delays an element's entrance so a scene reads in order. */
export function stagger(index: number, className = ""): { className: string; style: CSSProperties } {
  return {
    className: `cm-stagger animate-cm-rise ${className}`,
    style: { animationDelay: `${Math.min(index * 0.12, 1.8)}s` },
  };
}

export interface Voices {
  nameOf: (speaker: string) => string;
  colorOf: (speaker: string) => string;
}

export function voicesFor(story: Story, partnerName: string): Voices {
  return {
    nameOf: (speaker) => {
      if (speaker === "you") return "You";
      if (speaker === "partner") return partnerName;
      return story.cast.find((character) => character.id === speaker)?.name ?? speaker;
    },
    colorOf: (speaker) => {
      if (speaker === "you") return YOU_COLOR;
      if (speaker === "partner") return PARTNER_COLOR;
      const index = story.cast.findIndex((character) => character.id === speaker);
      return CAST_COLORS[Math.max(index, 0) % CAST_COLORS.length];
    },
  };
}

export interface Typing {
  /** Show the whole line at once instead of writing it out. */
  instant: boolean;
  onDone: () => void;
}

const TYPING_TICK_MS = 28;
const LETTERS_PER_TICK = 2;

/**
 * Writes a line out letter by letter, the way it would be spoken. The rest of
 * the line is already in place but invisible, so the page never jumps and
 * screen readers get the whole sentence.
 */
function Typed({ text, typing }: { text: string; typing: Typing }) {
  const [count, setCount] = useState(typing.instant ? text.length : 0);
  const onDone = useRef(typing.onDone);
  onDone.current = typing.onDone;

  useEffect(() => {
    if (typing.instant) {
      setCount(text.length);
      return;
    }
    const timer = window.setInterval(() => {
      setCount((current) => Math.min(text.length, current + LETTERS_PER_TICK));
    }, TYPING_TICK_MS);
    return () => window.clearInterval(timer);
  }, [text, typing.instant]);

  useEffect(() => {
    if (count >= text.length) onDone.current();
  }, [count, text.length]);

  return (
    <>
      {text.slice(0, count)}
      <span className="opacity-0">{text.slice(count)}</span>
    </>
  );
}

export function ScripturePanel({ scripture }: { scripture: Scripture }) {
  return (
    <figure className="rounded-2xl border border-cm-gold/25 bg-gradient-to-b from-cm-gold/[0.09] to-cm-gold/[0.02] p-5 sm:p-7">
      <figcaption className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-cm-gold">
        <span className="h-px w-6 bg-cm-gold/60" aria-hidden="true" />
        Scripture · {scripture.reference}
      </figcaption>
      <blockquote className="mt-4 font-story text-xl leading-relaxed text-cm-cream sm:text-[1.375rem]">
        “{scripture.text}”
      </blockquote>
      <p className="mt-2 text-xs text-cm-sand">{scripture.translation}</p>
      <div className="mt-5 border-t border-cm-gold/15 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-cm-sand">
          {scripture.contextTitle}
        </p>
        {scripture.context.map((paragraph) => (
          <p key={paragraph} className="mt-2.5 text-[0.9375rem] leading-relaxed text-cm-cream/80">
            {paragraph}
          </p>
        ))}
      </div>
    </figure>
  );
}

export function BeatView({
  beat,
  voices,
  text,
  typing,
}: {
  beat: Beat;
  voices: Voices;
  /** Fills the story's {tokens}. */
  text: (raw: string) => string;
  /** Set on the line being delivered right now, so it is written out as it is said. */
  typing?: Typing;
}) {
  const line = (raw: string) => (typing ? <Typed text={text(raw)} typing={typing} /> : text(raw));

  switch (beat.type) {
    case "narration":
      return <p className="font-story text-[1.0625rem] leading-[1.75] text-cm-cream/85 sm:text-lg sm:leading-[1.75]">{line(beat.text)}</p>;

    case "thought":
      return (
        <p className="border-l border-white/15 pl-4 font-story text-[1.0625rem] italic leading-[1.7] text-cm-sand sm:text-lg">
          {line(beat.text)}
        </p>
      );

    case "dialogue": {
      const color = voices.colorOf(beat.speaker);
      return (
        <div className="border-l-2 pl-4" style={{ borderColor: `${color}80` }}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color }}>
            {voices.nameOf(beat.speaker)}
          </p>
          <p className="mt-1 font-story text-[1.0625rem] leading-[1.7] text-cm-cream sm:text-lg">
            “{line(beat.text)}”
          </p>
        </div>
      );
    }

    case "message": {
      const mine = beat.speaker === "you";
      return (
        <div className={`flex flex-col ${mine ? "items-end" : "items-start"}`}>
          <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cm-sand">
            {voices.nameOf(beat.speaker)} · message
          </p>
          <p
            className={`max-w-[88%] rounded-2xl px-4 py-3 text-[0.9375rem] leading-relaxed text-cm-cream ${
              mine ? "rounded-br-md bg-cm-ember/25" : "rounded-bl-md bg-white/10"
            }`}
          >
            {line(beat.text)}
          </p>
        </div>
      );
    }

    case "scripture":
      return <ScripturePanel scripture={beat.scripture} />;
  }
}

function Pips({ value, highlight }: { value: number; highlight: boolean }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: MAX_QUALITY }, (_, index) => (
        <span
          key={index}
          className={`h-1 flex-1 rounded-full transition-colors duration-700 ${
            index < value ? (highlight ? "bg-cm-gold" : "bg-cm-cream/70") : "bg-white/10"
          }`}
        />
      ))}
    </span>
  );
}

/** The small, always-visible view of what the story is growing in the player. */
export function GrowthStrip({
  qualities,
  grew,
  note = false,
}: {
  qualities: Qualities;
  /** Qualities to highlight. */
  grew: QualityId[];
  /** Shows the "not a score" reminder beneath, on wide screens. */
  note?: boolean;
}) {
  return (
    <section aria-label="Growth so far">
      <ul className="flex justify-between gap-2">
        {QUALITY_IDS.map((id) => {
          const highlight = grew.includes(id);
          return (
            <li key={id}>
              <span
                className={`mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.06em] transition-colors duration-700 sm:text-[10px] sm:tracking-[0.1em] ${
                  highlight ? "text-cm-gold" : "text-cm-sand/80"
                }`}
              >
                {QUALITY_LABELS[id]}
              </span>
              <Pips value={qualities[id]} highlight={highlight} />
              <span className="sr-only">
                {qualities[id]} of {MAX_QUALITY}
              </span>
            </li>
          );
        })}
      </ul>
      {note && (
        <p className="mt-3 hidden text-xs leading-relaxed text-cm-sand/70 lg:block">
          Not a score. Just a mirror of what this story is growing in you.
        </p>
      )}
    </section>
  );
}

/** Where the week has got to: a pip for every morning and evening. */
export function WeekProgress({ slots, current }: { slots: Slot[]; current: number }) {
  const now = slots[Math.min(current, slots.length - 1)];
  return (
    <div
      role="progressbar"
      aria-label="The week so far"
      aria-valuemin={1}
      aria-valuemax={slots.length}
      aria-valuenow={Math.min(current + 1, slots.length)}
      aria-valuetext={`${now.day} ${now.time.toLowerCase()}`}
      className="flex items-center gap-1"
    >
      {slots.map((slot, index) => (
        <span
          key={slot.id}
          className={`h-1.5 rounded-full transition-colors duration-700 ${slot.time === "Morning" ? "ml-1.5 w-3 first:ml-0" : "w-3"} ${
            index < current ? "bg-cm-cream/60" : index === current ? "bg-cm-ember" : "bg-white/15"
          }`}
        />
      ))}
    </div>
  );
}

/** Money and energy: the two things the week runs on. */
export function Purse({ money, energy }: { money: number; energy: number }) {
  return (
    <div className="flex items-center gap-3 text-xs font-semibold text-cm-cream">
      <span aria-label={`${money} dollars`} className="tabular-nums">
        ${money}
      </span>
      <span aria-label={`Energy ${energy} of ${MAX_ENERGY}`} className="flex items-center gap-0.5">
        {Array.from({ length: MAX_ENERGY }, (_, index) => (
          <svg key={index} viewBox="0 0 12 16" aria-hidden="true" className={`h-3.5 w-2.5 transition-colors duration-500 ${index < energy ? "text-cm-gold" : "text-white/15"}`}>
            <path d="M7 0 1 9h4l-1 7 7-10H7z" fill="currentColor" />
          </svg>
        ))}
      </span>
    </div>
  );
}

/** Small tags showing what something costs or gives. */
export function EffectChips({ effects }: { effects: Effects }) {
  const chips: { text: string; good: boolean }[] = [];
  if (effects.money) chips.push({ text: `${effects.money > 0 ? "+" : "−"}$${Math.abs(effects.money)}`, good: effects.money > 0 });
  if (effects.energy) chips.push({ text: `${effects.energy > 0 ? "+" : "−"}${Math.abs(effects.energy)} energy`, good: effects.energy > 0 });
  if (!chips.length) return null;
  return (
    <span className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.text}
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
            chip.good ? "border-cm-gold/40 text-cm-gold" : "border-white/15 text-cm-sand"
          }`}
        >
          {chip.text}
        </span>
      ))}
    </span>
  );
}

const PLACE_ICONS: Record<PlaceIcon, string> = {
  home: "M4 11 12 4l8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z",
  cup: "M5 8h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 9h2a2 2 0 0 1 0 5h-2M8 3v2M12 3v2",
  leaf: "M5 19C5 9 11 5 20 4c0 9-4 15-13 15zM5 19l8-8",
  table: "M3 9h18M5 9v10M19 9v10M8 9V6a4 4 0 0 1 8 0v3",
  water: "M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0",
  chapel: "M12 2v5M10 4h4M5 21V12l7-5 7 5v9zM10 21v-5a2 2 0 0 1 4 0v5",
  door: "M7 21V4h10v17M4 21h16M14 12h.01",
};

export function PlaceGlyph({ icon, className = "h-5 w-5" }: { icon: PlaceIcon; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={PLACE_ICONS[icon]} />
    </svg>
  );
}

export interface SoundSettings {
  soundOn: boolean;
  voiceOn: boolean;
  /** False where the device cannot make sound, or has no voices to read with. */
  soundAvailable: boolean;
  voiceAvailable: boolean;
  onToggleSound: () => void;
  onToggleVoice: () => void;
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9.5h3l4.5-4v13l-4.5-4H4z" />
      {on ? <path d="M15 9a4 4 0 0 1 0 6M17.6 6.4a8 8 0 0 1 0 11.2" /> : <path d="m15.5 9.5 5 5M20.5 9.5l-5 5" />}
    </svg>
  );
}

function VoiceIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11.5a7.6 7.6 0 0 1-8 7.3 8.6 8.6 0 0 1-3.1-.6L4 19.8l1.4-4A7 7 0 0 1 4 11.5 7.6 7.6 0 0 1 12 4.2a7.6 7.6 0 0 1 8 7.3Z" />
      {on ? <path d="M9 10.5v2M12 9v5M15 10.5v2" /> : <path d="m9 15 6-7" />}
    </svg>
  );
}

/**
 * The switches for atmosphere and spoken lines. Both start off, so nothing
 * plays until the player asks for it. `compact` shows icons only.
 */
export function SoundControls({ settings, compact = false }: { settings: SoundSettings; compact?: boolean }) {
  const { soundOn, voiceOn, soundAvailable, voiceAvailable, onToggleSound, onToggleVoice } = settings;
  if (!soundAvailable && !voiceAvailable) return null;

  const base = compact
    ? "grid h-9 w-9 place-items-center rounded-full border transition"
    : "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition";
  const tone = (on: boolean) =>
    on
      ? "border-cm-gold/60 bg-cm-gold/10 text-cm-gold"
      : "border-white/15 text-cm-cream/60 hover:border-white/40 hover:text-cm-cream";

  return (
    <div className="flex items-center gap-2">
      {soundAvailable && (
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label="Sound"
          title={soundOn ? "Turn sound off" : "Turn sound on"}
          className={`${base} ${tone(soundOn)}`}
        >
          <SoundIcon on={soundOn} />
          {!compact && <span aria-hidden="true">Sound {soundOn ? "on" : "off"}</span>}
        </button>
      )}
      {voiceAvailable && (
        <button
          type="button"
          onClick={onToggleVoice}
          aria-pressed={voiceOn}
          aria-label="Voices"
          title={voiceOn ? "Stop reading lines aloud" : "Read lines aloud"}
          className={`${base} ${tone(voiceOn)}`}
        >
          <VoiceIcon on={voiceOn} />
          {!compact && <span aria-hidden="true">Voices {voiceOn ? "on" : "off"}</span>}
        </button>
      )}
    </div>
  );
}
